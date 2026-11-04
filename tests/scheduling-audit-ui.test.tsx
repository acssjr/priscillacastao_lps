import {act,fireEvent,render,screen,cleanup,waitFor} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import Agenda from '@/app/admin/agendamentos/view'
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals()})
it('AUDIT: confirmação antiga é bloqueada quando o polling troca a reserva',async()=>{
Object.defineProperty(window,'matchMedia',{configurable:true,value:()=>({matches:false,addEventListener(){},removeEventListener(){}})})
const nativeInterval=globalThis.setInterval;let poll:()=>void=()=>{};vi.spyOn(globalThis,'setInterval').mockImplementation(((callback:()=>void,ms:number)=>{if(ms===10000){poll=callback;return 123}return nativeInterval(callback,ms)}) as typeof setInterval)
let person='Ana teste',posted:Record<string,unknown>|undefined
vi.stubGlobal('fetch',vi.fn(async(_url,options)=>{if(options?.method==='POST'){posted=JSON.parse(options.body);return new Response(JSON.stringify({ok:true}))}return new Response(JSON.stringify({slots:[{slot:new Date().toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'})+'T14:00',version:person==='Ana teste'?1:2,booking_id:person,name:person,phone:'71999999999',email:null,enabled:true}]}))}))
render(<Agenda/>);await screen.findByRole('button',{name:'14:00 · Reservado para Ana teste'})
fireEvent.click(screen.getByRole('button',{name:'14:00 · Reservado para Ana teste'}));fireEvent.click(screen.getByRole('button',{name:'Cancelar reserva'}));
person='Bea teste';await act(async()=>{poll()});await screen.findByText(/Este horário mudou desde/);
expect(screen.getByRole('button',{name:'Confirmar'})).toBeDisabled();expect(posted).toBeUndefined();vi.unstubAllGlobals()
})

it('gestora abre uma sequência de aulas de 1h na data escolhida',async()=>{
 Object.defineProperty(window,'matchMedia',{configurable:true,value:()=>({matches:false,addEventListener(){},removeEventListener(){}})})
 let posted:Record<string,unknown>|undefined
 vi.stubGlobal('fetch',vi.fn(async(_url,options)=>{if(options?.method==='POST')posted=JSON.parse(options.body);return new Response(JSON.stringify({slots:[],ok:true}))}))
 render(<Agenda/>);fireEvent.click(screen.getAllByRole('button',{name:'Novo horário'})[0]);
 fireEvent.change(screen.getByLabelText('Data'),{target:{value:'2035-05-01'}})
 fireEvent.change(screen.getByLabelText('O que deseja abrir?'),{target:{value:'range'}})
 fireEvent.change(screen.getByLabelText('Hora, de 00 a 23'),{target:{value:'14'}})
 fireEvent.change(screen.getByLabelText('Fim da última aula'),{target:{value:'17:00'}})
 fireEvent.click(screen.getByRole('button',{name:'Abrir horários'}))
 await waitFor(()=>expect(posted?.slots).toEqual(['2035-05-01T14:00','2035-05-01T15:00','2035-05-01T16:00']))
})
