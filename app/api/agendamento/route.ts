import { NextResponse } from 'next/server'
import { sameOrigin } from '@/lib/cms/auth'
import { listSlots,getBookingSettings,receipt,reserve,validateSlot,validatePerson,validateKey,limitAttempt,SchedulingError } from '@/lib/scheduling-service'
import { failure,readBody } from '@/lib/scheduling-http'
export const dynamic='force-dynamic'
export async function GET(){try{const [slots,settings]=await Promise.all([listSlots(),getBookingSettings()]);return NextResponse.json({slots,settings},{headers:{'Cache-Control':'no-store'}})}catch(e){return failure(e)}}
export async function POST(request:Request){try{
 try{sameOrigin(request)}catch{throw new SchedulingError(403,'Atualize a página para continuar.','INVALID_ORIGIN')}
 const body=await readBody(request);validateKey(body.requestId)
 // Recovery returns only receipt metadata to the holder of the random private key.
 if(body.action==='recover'){await limitAttempt('recovery:'+(request.headers.get('x-forwarded-for')?.split(',')[0]||'unknown'),60);return NextResponse.json({receipt:await receipt(body.requestId)},{headers:{'Cache-Control':'no-store'}})}
 validateSlot(body.slot);const person=validatePerson(body.name,body.phone)
 const saved=await receipt(body.requestId);if(saved){if(saved.slot!==body.slot)throw new SchedulingError(409,'Esta tentativa pertence a outro horário. Atualize a página.');return NextResponse.json({ok:true,receipt:saved})}
 await limitAttempt('phone:'+person.phone,8);await limitAttempt('ip:'+(request.headers.get('x-forwarded-for')?.split(',')[0]||'unknown'),100)
 return NextResponse.json({ok:true,receipt:await reserve(body.slot,person.name!,person.phone!,body.requestId)})
 }catch(e){return failure(e)}}
