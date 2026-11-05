import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { initial } from './scheduling'

let connection: DatabaseSync | undefined
export function localDatabase() {
  if (process.env.NODE_ENV === 'production') throw new Error('Configure DATABASE_URL em produção.')
  if (connection) {
    connection.exec('CREATE TABLE IF NOT EXISTS booking_settings(id TEXT PRIMARY KEY, config TEXT NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP)')
    return connection
  }
  const directory = process.env.CMS_DATA_DIRECTORY || path.join(process.cwd(), '.cms')
  mkdirSync(directory, { recursive: true })
  const db = new DatabaseSync(path.join(directory, 'appointments.sqlite'))
  db.exec('PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS appointments (slot TEXT PRIMARY KEY, name TEXT, phone TEXT, email TEXT, created_at TEXT, enabled INTEGER NOT NULL DEFAULT 1)')
  const columns = db.prepare('PRAGMA table_info(appointments)').all().map(row=>row.name)
  for (const [name,type] of [['version','INTEGER NOT NULL DEFAULT 0'],['booking_id','TEXT'],['request_id','TEXT']]) if (!columns.includes(name)) db.exec(`ALTER TABLE appointments ADD COLUMN ${name} ${type}`)
  db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS appointments_request_key ON appointments(request_id) WHERE request_id IS NOT NULL;
    CREATE TRIGGER IF NOT EXISTS audit_insert AFTER INSERT ON appointments BEGIN INSERT INTO booking_events(slot,booking_id,version,event) VALUES(NEW.slot,NEW.booking_id,NEW.version,CASE WHEN NEW.name IS NULL THEN 'opened' ELSE 'reserved' END); END;
    CREATE TABLE IF NOT EXISTS receipts(request_id TEXT PRIMARY KEY, booking_id TEXT NOT NULL, slot TEXT NOT NULL, status TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS booking_events(id INTEGER PRIMARY KEY, slot TEXT, booking_id TEXT, version INTEGER, event TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS booking_limits(key TEXT PRIMARY KEY, count INTEGER, expires_at INTEGER);
    CREATE TABLE IF NOT EXISTS booking_settings(id TEXT PRIMARY KEY, config TEXT NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TRIGGER IF NOT EXISTS prevent_overlap_insert BEFORE INSERT ON appointments WHEN NEW.enabled=1 BEGIN
      SELECT RAISE(ABORT,'overlap') WHERE EXISTS(SELECT 1 FROM appointments WHERE enabled=1 AND slot<>NEW.slot AND abs((julianday(slot)-julianday(NEW.slot))*24*60)<59.999); END;
    CREATE TRIGGER IF NOT EXISTS prevent_overlap_update BEFORE UPDATE ON appointments WHEN NEW.enabled=1 BEGIN
      SELECT RAISE(ABORT,'overlap') WHERE EXISTS(SELECT 1 FROM appointments WHERE enabled=1 AND slot<>NEW.slot AND abs((julianday(slot)-julianday(NEW.slot))*24*60)<59.999); END;
    CREATE TRIGGER IF NOT EXISTS booking_audit AFTER UPDATE ON appointments BEGIN
      INSERT INTO booking_events(slot,booking_id,version,event) VALUES(NEW.slot,COALESCE(NEW.booking_id,OLD.booking_id),NEW.version,CASE WHEN NEW.name IS NOT NULL THEN 'reserved' WHEN OLD.name IS NOT NULL THEN 'cancelled' WHEN NEW.enabled=1 THEN 'opened' ELSE 'removed' END);
      UPDATE receipts SET status='cancelled' WHERE booking_id=OLD.booking_id AND NEW.name IS NULL;
      INSERT OR IGNORE INTO receipts(request_id,booking_id,slot,status) SELECT NEW.request_id,NEW.booking_id,NEW.slot,'confirmed' WHERE NEW.name IS NOT NULL AND NEW.request_id IS NOT NULL;
    END;`)
  db.exec("UPDATE appointments SET booking_id=lower(hex(randomblob(16))) WHERE name IS NOT NULL AND booking_id IS NULL")
  const seed = db.prepare('INSERT OR IGNORE INTO appointments(slot) VALUES (?)')
  for (const slot of initial) seed.run(slot)
  connection = db
  return db
}
export function nowInBrazil() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone:'America/Sao_Paulo', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23' }).format(new Date()).replace(' ', 'T')
}
