import { randomUUID, createHash } from 'node:crypto'
import { db, ready } from './scheduling'
import { DEFAULT_BOOKING_SETTINGS, sanitizeBookingSettings, validateBookingSettingsInput, type BookingSettings } from './booking-settings'
export class SchedulingError extends Error { constructor(public status:number, message:string, public code='INVALID_INPUT'){super(message)} }
export const localMode=()=>process.env.NODE_ENV==='development'&&!process.env.DATABASE_URL
export function validateSlot(value:unknown): asserts value is string {
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new SchedulingError(400,'Informe uma data e um horário válidos.')
 const parsed=new Date(value+':00Z')
 if(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,16)!==value||Number(value.slice(0,4))<2026) throw new SchedulingError(400,'Informe uma data e um horário válidos.')
}
export function validateFuture(slot:string){if(new Date(slot+':00-03:00').getTime()<=Date.now()) throw new SchedulingError(400,'Esse horário já passou. Escolha uma data futura.')}
export function validatePerson(name:unknown,phone:unknown,optional=false){
 if((name!==undefined&&typeof name!=='string')||(phone!==undefined&&typeof phone!=='string'))throw new SchedulingError(400,'Confira o nome e o WhatsApp informados.')
 const n=typeof name==='string'?name.trim():'',p=typeof phone==='string'?phone.replace(/\D/g,''):''
 if((!optional||n)&& (n.length<2||n.length>100))throw new SchedulingError(400,'Informe seu nome com pelo menos 2 caracteres.')
 if((!optional||p)&&(!n||!/^\d{10,11}$/.test(p)))throw new SchedulingError(400,'Informe um WhatsApp válido com DDD.')
 return {name:n||null,phone:p||null}
}
export function validateKey(key:unknown):asserts key is string {if(typeof key!=='string'||!/^[0-9a-f-]{36}$/i.test(key))throw new SchedulingError(400,'Atualize a página e tente novamente.','INVALID_REQUEST')}
export type AdminSlot={slot:string;name:string|null;phone:string|null;email:string|null;enabled:boolean;version:number;booking_id:string|null;created_at:string|null}
export function listSlots(admin:true):Promise<AdminSlot[]>
export function listSlots(admin?:false):Promise<{slot:string;reserved:boolean}[]>
export async function listSlots(admin=false):Promise<unknown[]>{
 if(localMode()){const {localDatabase,nowInBrazil}=await import('./scheduling-local');const rows=localDatabase().prepare('SELECT * FROM appointments ORDER BY slot').all();return admin?rows.map(r=>({...r,enabled:Boolean(r.enabled)})):rows.filter(r=>r.enabled).map(r=>({slot:r.slot,reserved:r.name!==null||String(r.slot)<=nowInBrazil()}))}
 await ready();const sql=db();return admin?await sql`SELECT slot,name,phone,email,created_at,enabled,version,booking_id FROM priscilla_appointments ORDER BY slot`:await sql`SELECT slot,(name IS NOT NULL OR (start_at AT TIME ZONE 'America/Sao_Paulo')<=now()) AS reserved FROM priscilla_appointments WHERE enabled=true ORDER BY slot`
}
export async function getBookingSettings():Promise<BookingSettings>{
 try{
  if(localMode()){
   const {localDatabase}=await import('./scheduling-local')
   const row=localDatabase().prepare('SELECT config FROM booking_settings WHERE id=?').get('default') as {config?:string}|undefined
   if(!row?.config)return {...DEFAULT_BOOKING_SETTINGS}
   return sanitizeBookingSettings(JSON.parse(row.config))
  }
  await ready();const sql=db()
  const rows=await sql`SELECT config FROM priscilla_booking_settings WHERE id='default'`
  if(!rows[0]?.config)return {...DEFAULT_BOOKING_SETTINGS}
  const parsed=typeof rows[0].config==='string'?JSON.parse(rows[0].config):rows[0].config
  return sanitizeBookingSettings(parsed)
 }catch{
  return {...DEFAULT_BOOKING_SETTINGS}
 }
}
export async function saveBookingSettings(raw:unknown):Promise<BookingSettings>{
 const checked=validateBookingSettingsInput(raw)
 if(!checked.ok)throw new SchedulingError(400,checked.error)
 const settings=checked.settings
 if(localMode()){
  const {localDatabase}=await import('./scheduling-local')
  localDatabase().prepare('INSERT INTO booking_settings(id,config,updated_at) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET config=excluded.config,updated_at=excluded.updated_at').run('default',JSON.stringify(settings),new Date().toISOString())
  return settings
 }
 await ready();const sql=db()
 await sql`INSERT INTO priscilla_booking_settings(id,config,updated_at) VALUES('default',${JSON.stringify(settings)}::jsonb,now()) ON CONFLICT(id) DO UPDATE SET config=EXCLUDED.config,updated_at=now()`
 return settings
}
export async function receipt(requestId:string){
 validateKey(requestId)
 if(localMode()){const {localDatabase}=await import('./scheduling-local');return localDatabase().prepare('SELECT booking_id,slot,status FROM receipts WHERE request_id=?').get(requestId)||null}
 await ready();const sql=db();return (await sql`SELECT booking_id,slot,status FROM priscilla_booking_receipts WHERE request_id=${requestId}`)[0]||null
}
export async function limitAttempt(identity:string,max=20){
 const key=createHash('sha256').update(identity).digest('hex')+':'+Math.floor(Date.now()/600000)
 if(localMode()){const {localDatabase}=await import('./scheduling-local');const d=localDatabase();d.prepare('DELETE FROM booking_limits WHERE expires_at<?').run(Date.now());const row=d.prepare('INSERT INTO booking_limits(key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').get(key,Date.now()+600000);if(Number(row?.count)>max)throw new SchedulingError(429,'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.','RATE_LIMIT');return}
 await ready();const sql=db();await sql`DELETE FROM priscilla_booking_limits WHERE expires_at<now()`;const rows=await sql`INSERT INTO priscilla_booking_limits(key,count,expires_at) VALUES(${key},1,now()+interval '10 minutes') ON CONFLICT(key) DO UPDATE SET count=priscilla_booking_limits.count+1 RETURNING count`;if(rows[0].count>max)throw new SchedulingError(429,'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.','RATE_LIMIT')
}
export async function reserve(slot:string,name:string,phone:string,requestId:string){
 const existing=await receipt(requestId);if(existing){if(existing.slot!==slot)throw new SchedulingError(409,'Esta tentativa pertence a outro horário. Atualize a página.');return existing}
 const settings=await getBookingSettings()
 if(!settings.bookingEnabled)throw new SchedulingError(409,'Os agendamentos online estão pausados no momento. Fale com a Priscilla pelo WhatsApp.','BOOKING_PAUSED')
 validateFuture(slot);const bookingId=randomUUID();let changed=false
 if(localMode()){const {localDatabase,nowInBrazil}=await import('./scheduling-local');changed=Number(localDatabase().prepare('UPDATE appointments SET name=?,phone=?,created_at=?,booking_id=?,request_id=?,version=version+1 WHERE slot=? AND enabled=1 AND name IS NULL AND slot>?').run(name,phone,new Date().toISOString(),bookingId,requestId,slot,nowInBrazil()).changes)>0}
 else{await ready();const sql=db();changed=(await sql`UPDATE priscilla_appointments SET name=${name},phone=${phone},email=NULL,created_at=now(),booking_id=${bookingId},request_id=${requestId} WHERE slot=${slot} AND enabled=true AND name IS NULL AND (start_at AT TIME ZONE 'America/Sao_Paulo')>now() RETURNING slot`).length>0}
 const saved=await receipt(requestId);if(saved)return saved
 if(!changed)throw new SchedulingError(409,'Este horário não está mais disponível. Escolha outro.','SLOT_UNAVAILABLE')
 throw new Error('receipt missing')
}
export async function manage(action:string,slots:string[],person:{name:string|null;phone:string|null},expected:{version?:number;bookingId?:string|null}){
 if(!['add','cancel','remove'].includes(action))throw new SchedulingError(400,'Escolha uma ação válida.')
 if(action!=='add'&&(!Number.isInteger(expected.version)||(action==='cancel'&&!expected.bookingId)))throw new SchedulingError(409,'A reserva mudou. Atualize a agenda e abra os detalhes novamente.','STALE_RESERVATION')
 for(const slot of slots){validateSlot(slot);if(action==='add')validateFuture(slot)}
 if(slots.length<1||slots.length>60||new Set(slots).size!==slots.length)throw new SchedulingError(400,'Selecione de 1 a 60 horários diferentes.')
 if(action!=='add'&&slots.length!==1)throw new SchedulingError(400,'Altere uma reserva de cada vez.')
 try{
 if(localMode()){
 const {localDatabase}=await import('./scheduling-local');const d=localDatabase();d.exec('BEGIN IMMEDIATE');try{
 for(const slot of slots){let changes=0
 if(action==='add')changes=Number(d.prepare('INSERT INTO appointments(slot,name,phone,created_at,booking_id) VALUES(?,?,?,?,?) ON CONFLICT(slot) DO UPDATE SET enabled=1,name=excluded.name,phone=excluded.phone,created_at=excluded.created_at,booking_id=excluded.booking_id,request_id=NULL,version=version+1 WHERE enabled=0 AND name IS NULL').run(slot,person.name,person.phone,person.name?new Date().toISOString():null,person.name?randomUUID():null).changes)
 if(action==='cancel')changes=Number(d.prepare('UPDATE appointments SET name=NULL,phone=NULL,email=NULL,created_at=NULL,booking_id=NULL,request_id=NULL,version=version+1 WHERE slot=? AND enabled=1 AND name IS NOT NULL AND version=? AND booking_id=?').run(slot,expected.version!,expected.bookingId!).changes)
 if(action==='remove')changes=Number(d.prepare('UPDATE appointments SET enabled=0,version=version+1 WHERE slot=? AND enabled=1 AND name IS NULL AND version=?').run(slot,expected.version!).changes)
 if(!changes)throw new SchedulingError(409,'Este horário mudou ou já existe. Atualize a agenda antes de continuar.','STALE_RESERVATION')
 }d.exec('COMMIT')}catch(e){d.exec('ROLLBACK');throw e}
 }else{
 await ready();const sql=db()
 // A failed condition aborts the whole batch, so opening a range is all-or-nothing.
 const queries=slots.map(slot=>action==='add'?sql`WITH changed AS (INSERT INTO priscilla_appointments(slot,name,phone,created_at,booking_id) VALUES(${slot},${person.name},${person.phone},${person.name?new Date().toISOString():null},${person.name?randomUUID():null}) ON CONFLICT(slot) DO UPDATE SET enabled=true,name=EXCLUDED.name,phone=EXCLUDED.phone,created_at=EXCLUDED.created_at,booking_id=EXCLUDED.booking_id,request_id=NULL WHERE priscilla_appointments.enabled=false AND priscilla_appointments.name IS NULL RETURNING slot) SELECT 1/(SELECT count(*)::int FROM changed) AS changed`:action==='cancel'?sql`WITH changed AS (UPDATE priscilla_appointments SET name=NULL,phone=NULL,email=NULL,created_at=NULL,booking_id=NULL,request_id=NULL WHERE slot=${slot} AND enabled=true AND name IS NOT NULL AND version=${expected.version!} AND booking_id=${expected.bookingId!} RETURNING slot) SELECT 1/(SELECT count(*)::int FROM changed) AS changed`:sql`WITH changed AS (UPDATE priscilla_appointments SET enabled=false WHERE slot=${slot} AND enabled=true AND name IS NULL AND version=${expected.version!} RETURNING slot) SELECT 1/(SELECT count(*)::int FROM changed) AS changed`)
 await sql.transaction(queries)
 }
 }catch(e){const code=(e as {code?:string}).code;if(code==='23P01'||(e instanceof Error&&e.message.includes('overlap')))throw new SchedulingError(409,'Há outro horário dentro desse intervalo de 1h. Escolha um período livre.','OVERLAP');if(code==='22012')throw new SchedulingError(409,'Um dos horários já existe ou mudou. Nenhum horário do grupo foi aberto. Atualize a agenda.','STALE_RESERVATION');throw e}
}
