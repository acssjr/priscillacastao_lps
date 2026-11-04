import { afterAll, beforeAll, expect, it, vi } from 'vitest'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
vi.mock('@/lib/cms/auth',()=>({authenticated:async()=>true,sameOrigin:()=>{}}))
let admin:typeof import('@/app/api/admin/agendamentos/route').POST
let book:typeof import('@/app/api/agendamento/route').POST
const request=(body:object)=>new Request('http://localhost/api/agendamento',{method:'POST',body:JSON.stringify({...body,requestId:randomUUID()})})
beforeAll(async()=>{vi.stubEnv('CMS_DATA_DIRECTORY',mkdtempSync(join(tmpdir(),'agenda-audit-')));vi.stubEnv('DATABASE_URL','');vi.stubEnv('NODE_ENV','development');admin=(await import('@/app/api/admin/agendamentos/route')).POST;book=(await import('@/app/api/agendamento/route')).POST})
afterAll(()=>vi.unstubAllEnvs())
it('rejeita intervalos de 1h sobrepostos',async()=>{
 for(const slot of ['2035-01-01T14:00','2035-01-01T14:30']){
 expect((await admin(request({action:'add',slot}))).status).toBe(slot.endsWith('14:30')?409:200)
 if(slot.endsWith('14:00')) expect((await book(request({slot,name:'Pessoa teste',phone:'71999999999'}))).status).toBe(200)
 }
})
it('rejeita data e hora impossíveis',async()=>{expect((await admin(request({action:'add',slot:'2035-99-99T25:99'}))).status).toBe(400)})
it('cancelamento exige versão e identidade da reserva',async()=>{
 const slot='2035-01-02T10:00'
 await admin(request({action:'add',slot,name:'Pessoa teste',phone:'71999999999'}))
 expect((await admin(request({action:'cancel',slot,expectedName:'Pessoa teste',expectedPhone:'71999999999'}))).status).toBe(409)
})
it('controle: apenas uma reserva vence no mesmo horário exato',async()=>{
 const slot='2035-01-03T10:00';await admin(request({action:'add',slot}))
 const responses=await Promise.all(Array.from({length:10},(_,i)=>book(request({slot,name:'Pessoa '+i,phone:'719999999'+String(i).padStart(2,'0')}))))
 expect(responses.filter(r=>r.status===200)).toHaveLength(1)
 expect(responses.filter(r=>r.status===409)).toHaveLength(9)
})

it('mesma chave recupera confirmação, cancelamento deixa recibo e versão antiga não cancela nova reserva',async()=>{
 const {reserve,receipt,listSlots,manage}=await import('@/lib/scheduling-service')
 const slot='2035-03-01T10:00',key=randomUUID();await manage('add',[slot],{name:null,phone:null},{})
 const saved=await reserve(slot,'Pessoa teste','71999999999',key)
 expect(await reserve(slot,'Pessoa teste','71999999999',key)).toEqual(saved)
 const row=(await listSlots(true)).find(r=>r.slot===slot)!
 await manage('cancel',[slot],{name:null,phone:null},{version:Number(row.version),bookingId:String(row.booking_id)})
 expect((await receipt(key))?.status).toBe('cancelled')
 await reserve(slot,'Pessoa teste','71999999999',randomUUID())
 await expect(manage('cancel',[slot],{name:null,phone:null},{version:Number(row.version),bookingId:String(row.booking_id)})).rejects.toMatchObject({status:409})
})
it('grupo conflitante é revertido por inteiro',async()=>{
 const {listSlots,manage}=await import('@/lib/scheduling-service')
 await manage('add',['2035-04-01T10:00'],{name:null,phone:null},{})
 await expect(manage('add',['2035-04-02T10:00','2035-04-01T10:30'],{name:null,phone:null},{})).rejects.toMatchObject({status:409})
 expect((await listSlots(true)).some(r=>r.slot==='2035-04-02T10:00')).toBe(false)
})
it('limita tentativas persistentemente',async()=>{
 const {limitAttempt}=await import('@/lib/scheduling-service')
 await limitAttempt('test-limit',1)
 await expect(limitAttempt('test-limit',1)).rejects.toMatchObject({status:429})
})
