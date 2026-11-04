import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { SchedulingError } from './scheduling-service'
export async function readBody(request:Request){
 const reader=request.body?.getReader();if(!reader)throw new SchedulingError(400,'Envie os dados para continuar.')
 const decoder=new TextDecoder();let raw='',bytes=0
 while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>8000){await reader.cancel();throw new SchedulingError(413,'Os dados enviados são muito grandes.')}raw+=decoder.decode(value,{stream:true})}raw+=decoder.decode()
 try{const data=JSON.parse(raw);if(!data||typeof data!=='object'||Array.isArray(data))throw new Error();return data}catch{throw new SchedulingError(400,'Não foi possível ler os dados. Atualize a página e tente novamente.')}
}

export function failure(error:unknown){if(error instanceof SchedulingError)return NextResponse.json({error:error.message,code:error.code},{status:error.status,headers:{'Cache-Control':'no-store',...(error.status===429?{'Retry-After':'600'}:{})}});const reference=randomUUID();console.error('scheduling_failure',{reference,code:(error as {code?:string})?.code||'UNEXPECTED'});return NextResponse.json({error:'Não foi possível conectar à agenda agora. Tente novamente em instantes.',code:'SERVICE_UNAVAILABLE',reference},{status:503,headers:{'Cache-Control':'no-store'}})}
