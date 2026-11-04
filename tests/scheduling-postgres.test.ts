// @vitest-environment node
import {afterAll,beforeAll,expect,it,vi} from 'vitest'
import {readFileSync} from 'node:fs'
import {parseEnv} from 'node:util'
import {neon} from '@neondatabase/serverless'
import {randomUUID} from 'node:crypto'
const enabled=process.env.RUN_SCHEDULING_PG==='1'
const schema='scheduling_test_'+randomUUID().replaceAll('-','')
let admin:ReturnType<typeof neon>,service:typeof import('@/lib/scheduling-service')
beforeAll(async()=>{if(!enabled)return;const env=parseEnv(readFileSync('.impeccable/scheduling-test.env','utf8'));admin=neon(env.DATABASE_URL!);await admin.query(`CREATE SCHEMA ${schema}`);const url=new URL(env.DATABASE_URL!);url.searchParams.set('options',`-c search_path=${schema},public`);vi.stubEnv('DATABASE_URL',env.DATABASE_URL!);vi.stubEnv('SCHEDULING_TEST_SCHEMA',schema);service=await import('@/lib/scheduling-service');await service.listSlots(true)},60000)
afterAll(async()=>{if(enabled&&admin){await admin.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);vi.unstubAllEnvs()}},30000)
it.skipIf(!enabled)('PostgreSQL: migração, concorrência, sobreposição, cancelamento versionado e recuperação',async()=>{
 const slot='2035-01-03T10:00';await service.manage('add',[slot],{name:null,phone:null},{})
 const keys=Array.from({length:6},()=>randomUUID());const results=await Promise.allSettled(keys.map(key=>service.reserve(slot,'Teste PG','71999999999',key)))
 expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1)
 const winner=results.findIndex(r=>r.status==='fulfilled'),saved=await service.receipt(keys[winner]);expect(saved?.status).toBe('confirmed')
 expect(await service.reserve(slot,'Teste PG','71999999999',keys[winner])).toEqual(saved)
 await expect(service.manage('add',['2035-01-03T10:30'],{name:null,phone:null},{})).rejects.toMatchObject({status:409})
 const row=(await service.listSlots(true)).find(r=>r.slot===slot)!
 await expect(service.manage('cancel',[slot],{name:null,phone:null},{version:Number(row.version)-1,bookingId:String(row.booking_id)})).rejects.toMatchObject({status:409})
 await service.manage('cancel',[slot],{name:null,phone:null},{version:Number(row.version),bookingId:String(row.booking_id)})
 expect((await service.receipt(keys[winner]))?.status).toBe('cancelled')
 await service.reserve(slot,'Teste PG','71999999999',randomUUID())
 await expect(service.manage('cancel',[slot],{name:null,phone:null},{version:Number(row.version),bookingId:String(row.booking_id)})).rejects.toMatchObject({status:409})
 await expect(service.manage('add',['2035-02-01T10:00','2035-01-03T10:00'],{name:null,phone:null},{})).rejects.toMatchObject({status:409})
 expect((await service.listSlots(true)).some(r=>r.slot==='2035-02-01T10:00')).toBe(false)
 const concurrent=await Promise.allSettled(['2035-06-01T10:00','2035-06-01T10:30'].map(slot=>service.manage('add',[slot],{name:null,phone:null},{})))
 expect(concurrent.filter(r=>r.status==='fulfilled')).toHaveLength(1)
 await service.manage('add',['2035-07-01T10:00','2035-07-01T11:00'],{name:null,phone:null},{})
 const sameKey=randomUUID();await Promise.allSettled(['2035-07-01T10:00','2035-07-01T11:00'].map(slot=>service.reserve(slot,'Teste PG','71999999999',sameKey)))
 expect((await service.listSlots(true)).filter(r=>r.slot.startsWith('2035-07-01')&&r.name)).toHaveLength(1)
},60000)
