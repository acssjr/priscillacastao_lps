import { neon } from '@neondatabase/serverless'

export const initial = ['2026-11-08T14:00','2026-11-08T15:00','2026-11-08T16:00','2026-11-09T09:00','2026-11-09T10:00','2026-11-09T11:00','2026-11-09T14:00','2026-11-09T15:00','2026-11-09T16:00','2026-11-10T09:00','2026-11-10T10:00','2026-11-10T11:00']
export function db() {
  if (!process.env.DATABASE_URL) throw new Error('O agendamento ainda não foi configurado. Tente novamente mais tarde.')
  const sql=neon(process.env.DATABASE_URL)
  const schema=process.env.NODE_ENV==='test'?process.env.SCHEDULING_TEST_SCHEMA:undefined
  if(!schema)return sql
  if(!/^scheduling_test_[a-f0-9]+$/.test(schema))throw new Error('Invalid test schema')
  const qualify=(text:string)=>text.replace(/\bpriscilla_(appointments|booking_receipts|booking_events|booking_limits|booking_settings|booking_guard|booking_audit)\b/g,match=>`${schema}.${match}`)
  return new Proxy(sql,{
    apply(target,thisArg,args){const parts=(args[0] as TemplateStringsArray).map(qualify);return Reflect.apply(target,thisArg,[Object.assign(parts,{raw:parts}),...args.slice(1)])},
    get(target,property){if(property==='query')return (text:string,...args:unknown[])=>Reflect.apply(target.query,target,[qualify(text),...args]);return Reflect.get(target,property)}
  })
}
let initialization: Promise<void> | undefined
export async function ready() {
  initialization ??= (async () => {
    const sql = db()
    await sql`CREATE TABLE IF NOT EXISTS priscilla_appointments (slot text PRIMARY KEY, name text, phone text, email text, created_at timestamptz, enabled boolean NOT NULL DEFAULT true)`
    const migration = `
      ALTER TABLE priscilla_appointments ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 0;
      ALTER TABLE priscilla_appointments ADD COLUMN IF NOT EXISTS booking_id text;
      ALTER TABLE priscilla_appointments ADD COLUMN IF NOT EXISTS request_id text;
      ALTER TABLE priscilla_appointments ADD COLUMN IF NOT EXISTS start_at timestamp;
      UPDATE priscilla_appointments SET start_at=slot::timestamp WHERE start_at IS NULL;
      CREATE UNIQUE INDEX IF NOT EXISTS priscilla_appointments_request_key ON priscilla_appointments(request_id) WHERE request_id IS NOT NULL;
      CREATE TABLE IF NOT EXISTS priscilla_booking_receipts (
        request_id text PRIMARY KEY, booking_id text NOT NULL, slot text NOT NULL,
        status text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
      CREATE TABLE IF NOT EXISTS priscilla_booking_events (
        id bigserial PRIMARY KEY, slot text NOT NULL, booking_id text,
        version integer NOT NULL, event text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
      CREATE TABLE IF NOT EXISTS priscilla_booking_limits (key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL);
      CREATE TABLE IF NOT EXISTS priscilla_booking_settings (id text PRIMARY KEY, config jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
      CREATE OR REPLACE FUNCTION priscilla_booking_guard() RETURNS trigger LANGUAGE plpgsql AS $fn$
      BEGIN
        NEW.start_at := NEW.slot::timestamp;
        IF to_char(NEW.start_at,'YYYY-MM-DD"T"HH24:MI') <> NEW.slot THEN RAISE EXCEPTION 'invalid slot' USING ERRCODE='22007'; END IF;
        IF TG_OP='UPDATE' THEN NEW.version := OLD.version+1; END IF;
        IF NEW.name IS NOT NULL AND NEW.booking_id IS NULL THEN NEW.booking_id := md5(random()::text || clock_timestamp()::text); END IF;
        IF TG_OP='UPDATE' AND OLD.name IS NOT NULL AND (NEW.name IS NULL OR OLD.booking_id IS DISTINCT FROM NEW.booking_id) THEN
          UPDATE priscilla_booking_receipts SET status='cancelled' WHERE booking_id=OLD.booking_id;
        END IF;
        IF NEW.name IS NOT NULL AND NEW.request_id IS NOT NULL THEN
          INSERT INTO priscilla_booking_receipts(request_id,booking_id,slot,status) VALUES(NEW.request_id,NEW.booking_id,NEW.slot,'confirmed') ON CONFLICT DO NOTHING;
        END IF;
        RETURN NEW;
      END $fn$;
      CREATE OR REPLACE FUNCTION priscilla_booking_audit() RETURNS trigger LANGUAGE plpgsql AS $fn$
      BEGIN
        INSERT INTO priscilla_booking_events(slot,booking_id,version,event)
        VALUES(NEW.slot,COALESCE(NEW.booking_id,CASE WHEN TG_OP='UPDATE' THEN OLD.booking_id END),NEW.version,
          CASE WHEN NEW.name IS NOT NULL THEN 'reserved' WHEN TG_OP='UPDATE' AND OLD.name IS NOT NULL THEN 'cancelled' WHEN NEW.enabled THEN 'opened' ELSE 'removed' END);
        RETURN NEW;
      END $fn$;
      DO $block$ BEGIN
        IF NOT EXISTS(SELECT 1 FROM pg_trigger WHERE tgname='priscilla_booking_guard_trigger' AND tgrelid='priscilla_appointments'::regclass) THEN
          CREATE TRIGGER priscilla_booking_guard_trigger BEFORE INSERT OR UPDATE ON priscilla_appointments FOR EACH ROW EXECUTE FUNCTION priscilla_booking_guard();
          CREATE TRIGGER priscilla_booking_audit_trigger AFTER INSERT OR UPDATE ON priscilla_appointments FOR EACH ROW EXECUTE FUNCTION priscilla_booking_audit();
        END IF;
        IF NOT EXISTS(SELECT 1 FROM pg_constraint WHERE conname='priscilla_no_overlap' AND conrelid='priscilla_appointments'::regclass) THEN
          ALTER TABLE priscilla_appointments ADD CONSTRAINT priscilla_no_overlap EXCLUDE USING gist (tsrange(start_at,start_at+interval '1 hour','[)') WITH &&) WHERE (enabled);
        END IF;
      END $block$;
      UPDATE priscilla_appointments SET booking_id=md5(random()::text || clock_timestamp()::text) WHERE name IS NOT NULL AND booking_id IS NULL;
    `
    const statements: string[] = []; let current = '', quote = ''
    for (const token of migration.split(/(\$[a-z]*\$)/g)) {
      if (/^\$[a-z]*\$$/.test(token)) { quote = quote ? '' : token; current += token }
      else if (quote) current += token
      else { const parts = token.split(';'); current += parts.shift(); for (const part of parts) { if (current.trim()) statements.push(current); current = part } }
    }
    if (current.trim()) statements.push(current)
    await sql.transaction([sql`SELECT pg_advisory_xact_lock(785310241)`, ...statements.map(statement=>sql.query(statement))])
    for (const slot of initial) await sql`INSERT INTO priscilla_appointments(slot) VALUES (${slot}) ON CONFLICT DO NOTHING`
  })()
  try { await initialization } catch (error) { initialization = undefined; throw error }
}
