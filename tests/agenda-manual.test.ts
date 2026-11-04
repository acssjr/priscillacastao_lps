import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
vi.mock('@/lib/cms/auth',()=>({ authenticated:async()=>true, sameOrigin:()=>{} }))
let POST: typeof import('@/app/api/admin/agendamentos/route').POST
let folder: string
const send = async (body: Record<string,unknown>) => {if(body.action==='cancel'||body.action==='remove'){const {listSlots}=await import('@/lib/scheduling-service');const row=(await listSlots(true)).find(s=>s.slot===body.slot);if(body.expectedName&&body.expectedName!==row?.name)return new Response('{}',{status:409});body={...body,expectedVersion:row?.version,expectedBookingId:row?.booking_id}}return POST(new Request('http://localhost/api/admin/agendamentos',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}))}
beforeAll(async()=>{folder=mkdtempSync(join(tmpdir(),'priscilla-agenda-'));vi.stubEnv('CMS_DATA_DIRECTORY',folder);vi.stubEnv('DATABASE_URL','');vi.stubEnv('NODE_ENV','development');({POST}=await import('@/app/api/admin/agendamentos/route'))})
afterAll(()=>{vi.unstubAllEnvs();try{rmSync(folder,{recursive:true,force:true})}catch{}})
describe('gerenciamento manual de horários',()=>{
 it('reserva com nome, sem WhatsApp e permite cancelamento seguro',async()=>{
  const slot='2031-01-02T12:30'
  expect((await send({action:'add',slot,name:'Ana Teste',phone:''})).status).toBe(200)
  expect((await send({action:'add',slot,name:'Outra Pessoa',phone:''})).status).toBe(409)
  expect((await send({action:'cancel',slot,expectedName:'Outra Pessoa',expectedPhone:null})).status).toBe(409)
  expect((await send({action:'cancel',slot,expectedName:'Ana Teste',expectedPhone:null})).status).toBe(200)
  expect((await send({action:'remove',slot})).status).toBe(200)
 })
 it('cria reserva com telefone e valida dados incompletos',async()=>{
  const slot='2031-01-02T13:30'
  expect((await send({action:'add',slot,name:'',phone:'71999990000'})).status).toBe(400)
  expect((await send({action:'add',slot,name:'Ana Teste',phone:'123'})).status).toBe(400)
  expect((await send({action:'add',slot,name:'Ana Teste',phone:'(71) 99999-0000'})).status).toBe(200)
  expect((await send({action:'cancel',slot,expectedName:'Ana Teste',expectedPhone:'(71) 99999-0000'})).status).toBe(200)
 })
})
