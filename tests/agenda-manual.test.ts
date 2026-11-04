import {afterAll,beforeAll,describe,expect,it,vi} from 'vitest'
import {mkdtempSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
vi.mock('@/lib/cms/auth',()=>({authenticated:async()=>true,sameOrigin:()=>{}}))
let POST:typeof import('@/app/api/admin/agendamentos/route').POST
const send=(body:object)=>POST(new Request('http://localhost/api/admin/agendamentos',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}))
beforeAll(async()=>{vi.stubEnv('CMS_DATA_DIRECTORY',mkdtempSync(join(tmpdir(),'priscilla-manual-test-')));vi.stubEnv('DATABASE_URL','');vi.stubEnv('NODE_ENV','development');({POST}=await import('@/app/api/admin/agendamentos/route'))})
afterAll(()=>vi.unstubAllEnvs())
describe('reservas manuais pela API',()=>{
 it('permite reserva sem telefone e rejeita cancelamento desatualizado no servidor',async()=>{
  const slot='2035-08-01T10:00'
  const added=await send({action:'add',slot,name:'Pessoa teste',phone:''});expect(added.status).toBe(200)
  const row=(await added.json()).slots.find((s:{slot:string})=>s.slot===slot)
  expect(row.phone).toBeNull()
  expect((await send({action:'add',slot,name:'Outra pessoa'})).status).toBe(409)
  expect((await send({action:'cancel',slot,expectedVersion:row.version+1,expectedBookingId:row.booking_id})).status).toBe(409)
  const cancelled=await send({action:'cancel',slot,expectedVersion:row.version,expectedBookingId:row.booking_id});expect(cancelled.status).toBe(200)
  const free=(await cancelled.json()).slots.find((s:{slot:string})=>s.slot===slot)
  expect(free.name).toBeNull()
  expect((await send({action:'remove',slot,expectedVersion:free.version})).status).toBe(200)
 })
 it('valida telefone e não cria uma reserva a partir de dados incompletos',async()=>{
  const slot='2035-08-01T11:00'
  expect((await send({action:'add',slot,name:'',phone:'71999990000'})).status).toBe(400)
  expect((await send({action:'add',slot,name:'Pessoa teste',phone:'123'})).status).toBe(400)
  const result=await send({action:'add',slot,name:'Pessoa teste',phone:'(71) 99999-0000'});expect(result.status).toBe(200)
  const saved=(await result.json()).slots.find((s:{slot:string})=>s.slot===slot)
  expect(saved.phone).toBe('71999990000');expect(saved.booking_id).toBeTruthy()
 })
})
