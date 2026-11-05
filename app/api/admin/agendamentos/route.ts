import { NextResponse } from 'next/server'
import { authenticated,sameOrigin } from '@/lib/cms/auth'
import { listSlots,getBookingSettings,saveBookingSettings,manage,validatePerson,SchedulingError } from '@/lib/scheduling-service'
import { failure,readBody } from '@/lib/scheduling-http'
export const dynamic='force-dynamic'
export async function GET(){try{if(!await authenticated())throw new SchedulingError(401,'Sua sessão expirou. Entre novamente para acessar a agenda.','SESSION_EXPIRED');const [slots,settings]=await Promise.all([listSlots(true),getBookingSettings()]);return NextResponse.json({slots,settings},{headers:{'Cache-Control':'no-store'}})}catch(e){return failure(e)}}
export async function POST(request:Request){try{
 try{sameOrigin(request)}catch{throw new SchedulingError(403,'Atualize a página para continuar.')}
 if(!await authenticated())throw new SchedulingError(401,'Sua sessão expirou. Entre novamente para continuar.','SESSION_EXPIRED')
 const body=await readBody(request)
 if(body.action==='settings'){
  const settings=await saveBookingSettings(body.settings)
  return NextResponse.json({ok:true,settings,slots:await listSlots(true)},{headers:{'Cache-Control':'no-store'}})
 }
 const person=validatePerson(body.name,body.phone,true)
 const slots=Array.isArray(body.slots)?body.slots:[body.slot]
 await manage(body.action,slots,person,{version:body.expectedVersion,bookingId:body.expectedBookingId})
 return NextResponse.json({ok:true,slots:await listSlots(true),settings:await getBookingSettings()},{headers:{'Cache-Control':'no-store'}})
 }catch(e){return failure(e)}}
