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

it('abre no próximo dia com horários e respeita a navegação posterior',async()=>{
 Object.defineProperty(window,'matchMedia',{configurable:true,value:()=>({matches:false,addEventListener(){},removeEventListener(){}})})
 let refresh:()=>void=()=>{};const native=globalThis.setInterval;vi.spyOn(globalThis,'setInterval').mockImplementation(((cb:()=>void,ms:number)=>{if(ms===10000){refresh=cb;return 123}return native(cb,ms)}) as typeof setInterval)
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({slots:[{slot:'2099-11-10T14:00',name:null,enabled:true},{slot:'2099-11-08T14:00',name:'Reservado',enabled:true},{slot:'2099-11-07T14:00',name:null,enabled:false}]}))))
 render(<Agenda/>);await screen.findByRole('button',{name:'14:00 · Reservado para Reservado'})
 expect(screen.getByRole('heading',{level:2,name:/2099/})).toBeInTheDocument()
 fireEvent.click(screen.getByRole('button',{name:'Hoje'}));await act(async()=>refresh())
 expect(screen.queryByRole('heading',{level:2,name:/2099/})).not.toBeInTheDocument()
})

it('gestora personaliza mensagens, cidade e WhatsApp pelo painel com prévia em tempo real',async()=>{
 Object.defineProperty(window,'matchMedia',{configurable:true,value:()=>({matches:false,addEventListener(){},removeEventListener(){}})})
 let posted:Record<string,unknown>|undefined
 vi.stubGlobal('fetch',vi.fn(async(_url,options)=>{if(options?.method==='POST'){posted=JSON.parse(options.body);return new Response(JSON.stringify({ok:true,slots:[],settings:(posted as {settings?:unknown}).settings}))}return new Response(JSON.stringify({slots:[]}))}))
 render(<Agenda/>)
 fireEvent.click(screen.getByRole('button',{name:'Configurações'}))
 const cityInput=screen.getByLabelText('Cidade ou região das aulas')
 fireEvent.change(cityInput,{target:{value:'Salvador'}})
 const msgArea=screen.getByLabelText('Mensagem que o cliente envia após confirmar o agendamento')
 fireEvent.focus(msgArea)
 fireEvent.change(msgArea,{target:{value:'Oi Priscilla! Sou {nome} em {cidade} no dia {data}'}})
 fireEvent.click(screen.getByRole('button',{name:'+ Horário'}))
 expect((msgArea as HTMLTextAreaElement).value).toBe('Oi Priscilla! Sou {nome} em {cidade} no dia {data} {hora}')
 expect(screen.getByText(/Oi Priscilla! Sou Maria Silva em Salvador no dia 08\/11\/2026 14:00/)).toBeInTheDocument()
 fireEvent.click(screen.getByRole('button',{name:'Salvar configurações'}))
 await waitFor(()=>expect(posted?.action).toBe('settings'))
 expect((posted?.settings as {city?:string}).city).toBe('Salvador')
})

it('contato da reserva usa o telefone da pessoa e nunca o número configurado da professora',async()=>{
 Object.defineProperty(window,'matchMedia',{configurable:true,value:()=>({matches:false,addEventListener(){},removeEventListener(){}})})
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({slots:[{slot:'2099-11-08T14:00',version:1,booking_id:'booking',name:'Cliente teste',phone:'71999998888',email:null,enabled:true}],settings:{whatsappPhone:'5575999990000'}}))))
 render(<Agenda/>);fireEvent.click(await screen.findByRole('button',{name:'14:00 · Reservado para Cliente teste'}))
 expect(screen.getByRole('link',{name:/Abrir conversa no WhatsApp/})).toHaveAttribute('href',expect.stringContaining('wa.me/5571999998888'))
})
it('não abre conversa com a professora se o telefone da reserva for inválido',async()=>{
 Object.defineProperty(window,'matchMedia',{configurable:true,value:()=>({matches:false,addEventListener(){},removeEventListener(){}})})
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({slots:[{slot:'2099-11-08T14:00',version:1,booking_id:'booking',name:'Cliente teste',phone:'123',email:null,enabled:true}],settings:{whatsappPhone:'5575999990000'}}))))
 render(<Agenda/>);fireEvent.click(await screen.findByRole('button',{name:'14:00 · Reservado para Cliente teste'}))
 expect(screen.queryByRole('link',{name:/Abrir conversa no WhatsApp/})).not.toBeInTheDocument()
 expect(screen.getByText(/Número inválido/)).toBeInTheDocument()
})
