'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_BOOKING_SETTINGS,
  buildBookingWhatsAppUrl,
  formatBookingMessage,
  formatBookingPhoneInput,
  sanitizeBookingSettings,
  type BookingSettings,
} from '@/lib/booking-settings'
import styles from './view.module.css'

type Slot = { slot:string; name:string|null; phone:string|null; email:string|null; enabled:boolean;version:number;booking_id:string|null }
type MessageFieldKey = 'confirmationMessage' | 'inquiryMessage' | 'adminReplyMessage'
const pad=(n:number)=>String(n).padStart(2,'0')
const dateKey=(d:Date)=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
const parseDate=(s:string)=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d,12)}
const shift=(d:Date,n:number)=>{const v=new Date(d);v.setDate(v.getDate()+n);return v}
const weekStart=(d:Date)=>shift(d,-d.getDay())
const monthLabel=(d:Date)=>new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(d)
const fullDate=(d:Date)=>new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long'}).format(d)
const todayInBrazil=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'})
const weekdays=['dom.','seg.','ter.','qua.','qui.','sex.','sáb.']
const MESSAGE_TOKENS: Array<{ token: string; label: string }> = [
  { token: '{nome}', label: '+ Nome do aluno' },
  { token: '{data}', label: '+ Data' },
  { token: '{hora}', label: '+ Horário' },
  { token: '{intervalo}', label: '+ Intervalo (1h)' },
  { token: '{cidade}', label: '+ Cidade' },
  { token: '{local}', label: '+ Local' },
]

function formatSlotDateBr(slot: string) {
  return `${slot.slice(8, 10)}/${slot.slice(5, 7)}/${slot.slice(0, 4)}`
}

function Icon({name}:{name:'left'|'right'|'plus'|'calendar'|'close'|'settings'}) {
  const paths={
    left:<path d="m15 18-6-6 6-6"/>,
    right:<path d="m9 18 6-6-6-6"/>,
    plus:<path d="M12 5v14M5 12h14"/>,
    calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/></>,
    close:<path d="m6 6 12 12M18 6 6 18"/>,
    settings:<><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></>
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

export default function Agenda(){
 const [slots,setSlots]=useState<Slot[]>([]),[error,setError]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true)
 const [selected,setSelected]=useState(todayInBrazil),[rangeStart,setRangeStart]=useState(todayInBrazil),[month,setMonth]=useState(()=>parseDate(todayInBrazil())),[detail,setDetail]=useState<string|null>(null),[adding,setAdding]=useState(false),[hour,setHour]=useState('09'),[minute,setMinute]=useState('00'),[confirming,setConfirming]=useState(false),[closing,setClosing]=useState(false),[mobile,setMobile]=useState(false),[expanded,setExpanded]=useState<string[]>([]),[instantGap,setInstantGap]=useState<string|null>(null),[instantDialog,setInstantDialog]=useState(false),[clientName,setClientName]=useState(''),[clientPhone,setClientPhone]=useState('')
 const [snapshot,setSnapshot]=useState<Slot|null>(null),[syncError,setSyncError]=useState(''),[sessionExpired,setSessionExpired]=useState(false),[notice,setNotice]=useState(''),[lastSync,setLastSync]=useState(''),[addDate,setAddDate]=useState(todayInBrazil),[batch,setBatch]=useState(false),[endTime,setEndTime]=useState('17:00'),[repeatDays,setRepeatDays]=useState(1)
 const [settings,setSettings]=useState<BookingSettings>(DEFAULT_BOOKING_SETTINGS),[settingsOpen,setSettingsOpen]=useState(false),[draftSettings,setDraftSettings]=useState<BookingSettings>(DEFAULT_BOOKING_SETTINGS),[phoneInput,setPhoneInput]=useState(()=>formatBookingPhoneInput(DEFAULT_BOOKING_SETTINGS.whatsappPhone)),[activeField,setActiveField]=useState<MessageFieldKey>('confirmationMessage')
 const queryVersion=useRef(0),actionPending=useRef(false),initialDateChosen=useRef(false)
 const invalidateQueries=useCallback(()=>{queryVersion.current++},[])
 const touch=useRef<{x:number;y:number}|null>(null),dialogRef=useRef<HTMLElement|null>(null)
 useEffect(()=>{const mq=window.matchMedia('(max-width: 850px)');const update=()=>setMobile(mq.matches);update();mq.addEventListener('change',update);return()=>mq.removeEventListener('change',update)},[])
 useEffect(()=>{if(!adding&&!detail&&!settingsOpen)return;const previous=document.body.style.overflow,trigger=document.activeElement as HTMLElement | null;document.body.style.overflow='hidden';dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();return()=>{document.body.style.overflow=previous;trigger?.focus()}},[adding,detail,settingsOpen])
 const refresh=useCallback(async()=>{const version=++queryVersion.current;try{const res=await fetch('/api/admin/agendamentos',{cache:'no-store',signal:AbortSignal.timeout(15000)});if(res.status===401){setSessionExpired(true);throw new Error('Sua sessão expirou. Entre novamente para atualizar a agenda.')}if(!res.ok)throw new Error('Não foi possível atualizar a agenda. Verifique sua conexão e tente novamente.');const data=await res.json();if(version!==queryVersion.current)return;setSlots(data.slots);if(data.settings){const clean=sanitizeBookingSettings(data.settings);setSettings(clean)}if(!initialDateChosen.current){initialDateChosen.current=true;const now=new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date()).replace(' ','T');const first=(data.slots as Slot[]).filter(slot=>slot.enabled&&slot.slot>=now).sort((a,b)=>a.slot.localeCompare(b.slot))[0];if(first){const day=first.slot.slice(0,10);setSelected(day);setRangeStart(day);setMonth(parseDate(day))}}setSyncError('');setLastSync(new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}))}catch(e){if(version===queryVersion.current)setSyncError(e instanceof Error?e.message:'Não foi possível atualizar a agenda.')}finally{setLoading(false)}},[])
 useEffect(()=>{const initial=setTimeout(refresh,0);const t=setInterval(refresh,10000);const focus=()=>void refresh();window.addEventListener('focus',focus);const visible=()=>{if(!document.hidden)focus()};document.addEventListener('visibilitychange',visible);return()=>{clearTimeout(initial);clearInterval(t);invalidateQueries();window.removeEventListener('focus',focus);document.removeEventListener('visibilitychange',visible)}},[refresh,invalidateQueries])
 const current=parseDate(selected),start=parseDate(rangeStart),days=Array.from({length:3},(_,i)=>shift(start,i))
 const monthStart=new Date(month.getFullYear(),month.getMonth(),1,12), miniStart=weekStart(monthStart), miniDays=Array.from({length:42},(_,i)=>shift(miniStart,i))
 const visible=slots.filter(s=>s.enabled), chosen=detail?snapshot:null
 const times=useMemo(()=>Array.from(new Set([...Array.from({length:13},(_,i)=>`${pad(i+8)}:00`),...visible.filter(s=>days.some(d=>s.slot.startsWith(dateKey(d)))).map(s=>s.slot.slice(11,16))])).sort(),[slots,rangeStart]) // eslint-disable-line react-hooks/exhaustive-deps
 const rows:{kind:'time'|'gap';key:string;times:string[]}[]=[]
 for(const time of times){
  const hasSlot=visible.some(s=>s.slot.slice(11,16)===time && (mobile?s.slot.startsWith(selected):days.some(d=>s.slot.startsWith(dateKey(d)))))
  if(!hasSlot && !loading){const last=rows[rows.length-1];if(last?.kind==='gap'){last.times.push(time);last.key=`${last.times[0]}-${time}`}else rows.push({kind:'gap',key:time,times:[time]})}
  else rows.push({kind:'time',key:time,times:[time]})
 }
 const go=(d:Date)=>{initialDateChosen.current=true;const key=dateKey(d);setSelected(key);if(!days.some(day=>dateKey(day)===key))setRangeStart(key);setMonth(new Date(d.getFullYear(),d.getMonth(),1));setDetail(null)}
 const closeDialog=()=>{if(closing||actionPending.current)return;setClosing(true);window.setTimeout(()=>{setAdding(false);setDetail(null);setSettingsOpen(false);setSnapshot(null);setConfirming(false);setClosing(false);setError('');setClientName('');setClientPhone('');setRepeatDays(1)},180)}
 const openSettings=(instant:boolean)=>{setInstantDialog(instant);setAdding(false);setDetail(null);setConfirming(false);setError('');setDraftSettings(settings);setPhoneInput(formatBookingPhoneInput(settings.whatsappPhone));setSettingsOpen(true)}

 async function action(kind:string,slot:string,batchSlots?:string[]){if(actionPending.current)return;actionPending.current=true;setBusy(true);setError('');queryVersion.current++;try{const res=await fetch('/api/admin/agendamentos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:kind,slot,slots:batchSlots,expectedVersion:chosen?.version,expectedBookingId:chosen?.booking_id,name:kind==='add'?clientName.trim():undefined,phone:kind==='add'?clientPhone.trim():undefined}),signal:AbortSignal.timeout(15000)});const data=await res.json();if(res.status===401)setSessionExpired(true);if(!res.ok){if(res.status===409)void refresh();throw new Error(data.error||'Não foi possível concluir a alteração.')}queryVersion.current++;if(data.slots)setSlots(data.slots);if(data.settings)setSettings(sanitizeBookingSettings(data.settings));setNotice(kind==='add'?`${batchSlots?.length||1} ${(batchSlots?.length||1)===1?'horário adicionado':'horários adicionados'} à agenda.`:kind==='cancel'?'Reserva cancelada. O horário foi liberado.':'Horário removido.');if(kind==='add'){setSelected(slot.slice(0,10));setRangeStart(slot.slice(0,10));setMonth(parseDate(slot.slice(0,10)))}actionPending.current=false;closeDialog();void refresh()}catch(e){setError(e instanceof TypeError||e instanceof DOMException?'A conexão foi interrompida. Atualize a agenda e confira se a alteração foi concluída antes de tentar novamente.':e instanceof Error?e.message:'Não foi possível atualizar a agenda.')}finally{actionPending.current=false;setBusy(false)}}

 async function saveSettings(){
  if(actionPending.current)return
  actionPending.current=true;setBusy(true);setError('');queryVersion.current++
  try{
   const payload={...draftSettings,whatsappPhone:phoneInput}
   const res=await fetch('/api/admin/agendamentos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'settings',settings:payload}),signal:AbortSignal.timeout(15000)})
   const data=await res.json()
   if(res.status===401)setSessionExpired(true)
   if(!res.ok)throw new Error(data.error||'Não foi possível salvar as configurações.')
   queryVersion.current++
   const saved=sanitizeBookingSettings(data.settings||payload)
   setSettings(saved)
   if(data.slots)setSlots(data.slots)
   setNotice('Configurações e mensagens da agenda atualizadas com sucesso.')
   actionPending.current=false
   closeDialog()
   void refresh()
  }catch(e){
   setError(e instanceof Error?e.message:'Não foi possível salvar as configurações.')
  }finally{
   actionPending.current=false;setBusy(false)
  }
 }

 function insertToken(token:string){
  setDraftSettings(prev=>({
   ...prev,
   [activeField]:`${prev[activeField]}${prev[activeField].endsWith(' ')||!prev[activeField]?'':' '}${token}`,
  }))
 }

 function resetDefaults(){
  setDraftSettings({...DEFAULT_BOOKING_SETTINGS})
  setPhoneInput(formatBookingPhoneInput(DEFAULT_BOOKING_SETTINGS.whatsappPhone))
  setError('')
 }

 const newSlots=useMemo(()=>{if(!/^\d{1,2}$/.test(hour)||!/^\d{1,2}$/.test(minute)||Number(hour)>23||Number(minute)>59)return [];const first=Number(hour)*60+Number(minute),end=Number(endTime.slice(0,2))*60+Number(endTime.slice(3));if(!/^\d{4}-\d{2}-\d{2}$/.test(addDate)||!Number.isInteger(first)||first<0||first>=1440)return [];if(!batch)return [`${addDate}T${pad(Math.floor(first/60))}:${pad(first%60)}`];if(end<=first||(end-first)%60!==0||end>1440)return [];const baseDay=parseDate(addDate);const count=Math.max(1,Math.min(7,repeatDays));const result:string[]=[];for(let d=0;d<count;d++){const dayStr=dateKey(shift(baseDay,d));for(let i=0;i<(end-first)/60;i++){const mins=first+i*60;result.push(`${dayStr}T${pad(Math.floor(mins/60))}:${pad(mins%60)}`)}}return result},[hour,minute,endTime,addDate,batch,repeatDays])
 function add(){if(!newSlots.length){setError('Confira a data e o intervalo. A sequência deve conter aulas completas de 1h.');return}if(batch&&clientName.trim()){setError('Para reservar para uma pessoa, escolha um horário por vez.');return}setError('');void action('add',newSlots[0],newSlots)}

 const confirmationPreview=useMemo(()=>formatBookingMessage(draftSettings.confirmationMessage,{name:'Maria Silva',date:'08/11/2026',time:'14:00',timeRange:'14:00 – 15:00',city:draftSettings.city,locationNote:draftSettings.locationNote}),[draftSettings])
 const chosenReplyUrl=useMemo(()=>{
  if(!chosen?.phone)return ''
  const msg=formatBookingMessage(settings.adminReplyMessage,{
   name:chosen.name||'',
   date:formatSlotDateBr(chosen.slot),
   time:chosen.slot.slice(11,16),
   city:settings.city,
   locationNote:settings.locationNote,
  })
  return buildBookingWhatsAppUrl(chosen.phone,msg)
 },[chosen,settings])

 const range=`${days[0].getDate()} ${days[0].toLocaleDateString('pt-BR',{month:'short'}).replace('.','')} – ${days[2].getDate()} ${days[2].toLocaleDateString('pt-BR',{month:'short',year:'numeric'}).replace('.','')}`
 return <main id="conteudo" className={styles.page}><header className={styles.topbar}><div className={styles.brand}><span role="img" aria-label="Priscilla Castão" className={styles.brandLogo}/></div></header>
 <div className={styles.layout}><aside className={styles.sidebar}><button className={styles.create} onClick={e=>{setInstantDialog(e.detail===0);setDetail(null);setSettingsOpen(false);setAddDate(selected);setBatch(false);setRepeatDays(1);setError('');setAdding(true)}}><Icon name="plus"/> Novo horário</button><button type="button" className={styles.settingsButton} onClick={e=>openSettings(e.detail===0)}><Icon name="settings"/> Mensagens e página</button><div className={styles.miniHead}><strong>{monthLabel(month)}</strong><div><button aria-label="Mês anterior" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}><Icon name="left"/></button><button aria-label="Próximo mês" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}><Icon name="right"/></button></div></div><div className={styles.miniGrid}>{weekdays.map(w=><span key={w}>{w.slice(0,1).toUpperCase()}</span>)}{miniDays.map(d=>{const key=dateKey(d);return <button key={key} className={`${d.getMonth()!==month.getMonth()?styles.outside:''} ${key===selected?styles.miniSelected:''}`} aria-label={fullDate(d)} aria-pressed={key===selected} onClick={()=>go(d)}>{d.getDate()}{visible.some(s=>s.slot.startsWith(key))&&<i/>}</button>})}</div><div className={styles.legend}><p>LEGENDA</p><span><i className={styles.dotFree}/> Disponível</span><span><i className={styles.dotReserved}/> Reservado</span></div><div className={styles.sidebarNote}>WhatsApp ativo: <strong>{formatBookingPhoneInput(settings.whatsappPhone)}</strong><br/>Cidade: <strong>{settings.city}</strong><br/>Status: <strong>{settings.bookingEnabled?'Agenda aberta':'Agenda pausada'}</strong></div></aside>
 <section className={styles.main}>
 {syncError&&<div role="alert" className={styles.error}>{syncError}{sessionExpired?<a href="/admin/agendamentos">Entrar novamente</a>:<button onClick={()=>void refresh()}>Atualizar agenda</button>}</div>}
 {sessionExpired&&!syncError&&<p role="alert" className={styles.error}>Sua sessão expirou. <a href="/admin/agendamentos">Entrar novamente</a></p>}
 {notice&&<p role="status" className={styles.successNotice}>{notice}</p>}
 <p className={styles.syncStatus}>{lastSync?`Última atualização às ${lastSync}`:'Conectando à agenda…'}</p><div className={styles.heading}><div><h1>Agenda de aulas</h1><p>Organize seus horários, acompanhe reservas e personalize as mensagens do WhatsApp.</p></div><div className={styles.headingActions}><button type="button" className={styles.configTrigger} onClick={e=>openSettings(e.detail===0)}><Icon name="settings"/> <span>Configurar mensagens e página</span></button><button className={styles.mobileCreate} onClick={e=>{setInstantDialog(e.detail===0);setSettingsOpen(false);setAddDate(selected);setBatch(false);setRepeatDays(1);setError('');setAdding(true)}}><Icon name="plus"/> Novo horário</button></div></div><div className={styles.toolbar}><div className={styles.weekControl}><button className={styles.today} onClick={()=>go(new Date())}>Hoje</button><button aria-label="Dia anterior" onClick={()=>go(shift(current,-1))}><Icon name="left"/></button><button aria-label="Próximo dia" onClick={()=>go(shift(current,1))}><Icon name="right"/></button><h2>{range}</h2></div><span className={styles.weekLabel}><Icon name="calendar"/> 3 dias</span></div>{error&&!adding&&!chosen&&!settingsOpen&&<div role="alert" className={styles.error}>{error}<button onClick={()=>setError('')} aria-label="Fechar aviso"><Icon name="close"/></button></div>}
 <div className={styles.calendarWrap} tabIndex={0} aria-label="Calendário de três dias. Selecione um dia ou arraste para mudar de dia." onTouchStart={e=>{const t=e.touches[0];touch.current={x:t.clientX,y:t.clientY}}} onTouchEnd={e=>{if(!touch.current)return;const t=e.changedTouches[0],dx=t.clientX-touch.current.x,dy=t.clientY-touch.current.y;touch.current=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)go(shift(current,dx<0?1:-1))}}><div className={styles.calendar}><div className={styles.corner}>GMT−3</div>{days.map(d=>{const key=dateKey(d);return <button key={key} className={`${styles.dayHead} ${key===selected?styles.daySelected:''}`} onClick={()=>go(d)} aria-label={fullDate(d)}><span>{weekdays[d.getDay()]}</span><strong>{d.getDate()}</strong></button>})}{rows.flatMap(row=>{const renderTime=(time:string)=><div className={styles.row} key={time}><div className={styles.time}>{time}</div>{days.map(d=>{const key=`${dateKey(d)}T${time}`,s=visible.find(v=>v.slot===key);return <div className={`${styles.cell} ${dateKey(d)===selected?styles.selectedCell:''}`} key={key}>{s&&<button aria-label={`${time} · ${s.name?`Reservado para ${s.name}`:'Disponível'}`} className={`${styles.event} ${s.name?styles[`color${Array.from(s.slot).reduce((a,c)=>a+c.charCodeAt(0),0)%5}`]:styles.eventFree}`} onClick={e=>{setInstantDialog(e.detail===0);setDetail(key);setSnapshot({...s});setAdding(false);setSettingsOpen(false);setConfirming(false)}}><strong>{s.name||'Disponível'}</strong>{s.name&&<span>Reservado</span>}</button>}</div>})}</div>;if(row.kind==='time')return [renderTime(row.times[0])];const isExpanded=expanded.includes(row.key);return [<button key={`gap-${row.key}`} className={styles.gap} aria-expanded={isExpanded} onClick={e=>{setInstantGap(e.detail===0?row.key:null);setExpanded(isExpanded?expanded.filter(k=>k!==row.key):[...expanded,row.key])}}><span>{row.times[0]}{row.times.length>1?` – ${row.times[row.times.length-1]}`:''} · {row.times.length===1?'1 horário sem disponibilidade':`${row.times.length} horários sem disponibilidade`}</span><strong>{isExpanded?'Ocultar':'Mostrar'}</strong></button>,<div key={`content-${row.key}`} className={`${styles.gapPanel} ${isExpanded?styles.gapOpen:''} ${instantGap===row.key?styles.gapInstant:''}`} aria-hidden={!isExpanded} inert={!isExpanded}><div className={styles.gapInner}><div className={styles.gapGrid}>{row.times.map(renderTime)}</div></div></div>]})}</div>{loading&&<div className={styles.loading}>Carregando horários…</div>}</div><p className={styles.mobileHint}>Toque em um dia ou arraste para os lados para navegar.</p></section></div>
 {(adding||chosen||settingsOpen)&&<div className={`${styles.scrim} ${closing?styles.closing:''} ${instantDialog?styles.instantDialog:''}`} onMouseDown={e=>{if(e.target===e.currentTarget)closeDialog()}} onKeyDown={e=>{if(e.key==='Escape')closeDialog()}}><section ref={dialogRef} className={`${styles.dialog} ${settingsOpen?styles.settingsDialog:''}`} role="dialog" aria-modal="true" aria-labelledby="dialog-title" onKeyDown={e=>{if(e.key!=='Tab')return;const controls=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]'));if(!controls.length)return;const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}><button className={styles.close} aria-label="Fechar" onClick={closeDialog}><Icon name="close"/></button>{settingsOpen?<>
  <span className={styles.dialogLabel}>PERSONALIZAÇÃO SEGURA</span>
  <h2 id="dialog-title">Mensagens e configurações</h2>
  <p>Altere os textos, o WhatsApp e as informações exibidas na página de agendamento sem risco de afetar o funcionamento do sistema.</p>
  {error&&<p role="alert" className={styles.dialogError}>{error}</p>}
  <div className={styles.settingsSection}>
   <h3>1. Contato, local e funcionamento</h3>
   <div className={styles.openFields}>
    <label>Status dos agendamentos online
     <select disabled={busy} value={draftSettings.bookingEnabled?'open':'paused'} onChange={e=>setDraftSettings(prev=>({...prev,bookingEnabled:e.target.value==='open'}))}>
      <option value="open">Agenda aberta (clientes escolhem data e horário)</option>
      <option value="paused">Agenda pausada (direciona direto para o WhatsApp)</option>
     </select>
    </label>
    <label>WhatsApp que recebe os agendamentos
     <input disabled={busy} type="tel" inputMode="tel" value={phoneInput} onChange={e=>setPhoneInput(formatBookingPhoneInput(e.target.value))} placeholder="(77) 99842-2026"/>
    </label>
    <label>Link do Instagram
     <input disabled={busy} type="url" maxLength={200} value={draftSettings.instagramUrl} onChange={e=>setDraftSettings(prev=>({...prev,instagramUrl:e.target.value}))} placeholder="https://www.instagram.com/priscillacastao_danca/"/>
    </label>
    <label>Cidade ou região das aulas
     <input disabled={busy} maxLength={80} value={draftSettings.city} onChange={e=>setDraftSettings(prev=>({...prev,city:e.target.value}))} placeholder="Ex.: Feira de Santana"/>
    </label>
    <label>Observação curta sobre o local (etapa de revisão)
     <input disabled={busy} maxLength={120} value={draftSettings.locationNote} onChange={e=>setDraftSettings(prev=>({...prev,locationNote:e.target.value}))} placeholder="Ex.: Local a combinar"/>
    </label>
    <label>Frase sobre o local (tela de agendamento confirmado)
     <input disabled={busy} maxLength={200} value={draftSettings.confirmationNote} onChange={e=>setDraftSettings(prev=>({...prev,confirmationNote:e.target.value}))} placeholder="Ex.: O local será combinado."/>
    </label>
   </div>
  </div>
  <div className={styles.settingsSection}>
   <h3>2. Mensagens automáticas do WhatsApp</h3>
   <p className={styles.settingsHint}>Toque em uma variável abaixo para inserir automaticamente no campo de mensagem selecionado:</p>
   <div className={styles.tokenBar} role="group" aria-label="Variáveis dinâmicas para mensagens">
    {MESSAGE_TOKENS.map(item=>(
     <button key={item.token} type="button" disabled={busy} className={styles.tokenChip} onClick={()=>insertToken(item.token)}>{item.label}</button>
    ))}
   </div>
   <div className={styles.openFields}>
    <label>Mensagem que o cliente envia após confirmar o agendamento
     <textarea disabled={busy} rows={3} maxLength={1000} value={draftSettings.confirmationMessage} onFocus={()=>setActiveField('confirmationMessage')} onChange={e=>setDraftSettings(prev=>({...prev,confirmationMessage:e.target.value}))}/>
    </label>
    <div className={styles.messagePreview}>
     <span>Prévia de como a mensagem chegará para você:</span>
     <p>“{confirmationPreview}”</p>
    </div>
    <label>Mensagem quando o cliente clica em conversar sem horários disponíveis
     <textarea disabled={busy} rows={3} maxLength={1000} value={draftSettings.inquiryMessage} onFocus={()=>setActiveField('inquiryMessage')} onChange={e=>setDraftSettings(prev=>({...prev,inquiryMessage:e.target.value}))}/>
    </label>
    <label>Mensagem que você envia ao aluno ao clicar na reserva aqui no painel
     <textarea disabled={busy} rows={3} maxLength={1000} value={draftSettings.adminReplyMessage} onFocus={()=>setActiveField('adminReplyMessage')} onChange={e=>setDraftSettings(prev=>({...prev,adminReplyMessage:e.target.value}))}/>
    </label>
   </div>
  </div>
  <div className={styles.settingsSection}>
   <h3>3. Textos de apresentação da página de agendamento</h3>
   <div className={styles.openFields}>
    <label>Título principal da página
     <input disabled={busy} maxLength={120} value={draftSettings.welcomeTitle} onChange={e=>setDraftSettings(prev=>({...prev,welcomeTitle:e.target.value}))}/>
    </label>
    <label>Subtítulo de orientação
     <input disabled={busy} maxLength={240} value={draftSettings.welcomeSubtitle} onChange={e=>setDraftSettings(prev=>({...prev,welcomeSubtitle:e.target.value}))}/>
    </label>
    <label>Aviso opcional no topo da página (deixe em branco se não quiser exibir)
     <input disabled={busy} maxLength={300} value={draftSettings.publicNotice} onChange={e=>setDraftSettings(prev=>({...prev,publicNotice:e.target.value}))} placeholder="Ex.: Agenda especial aberta para esta semana!"/>
    </label>
   </div>
  </div>
  <div className={styles.settingsSection}>
   <h3>4. Valores exibidos no Catálogo de Aulas (/catalogo)</h3>
   <div className={styles.openFields}>
    <label>Aula individual (avulsa)
     <input disabled={busy} maxLength={60} value={draftSettings.catalogPrices.individualSingle} onChange={e=>setDraftSettings(prev=>({...prev,catalogPrices:{...prev.catalogPrices,individualSingle:e.target.value}}))}/>
    </label>
    <label>Pacote individual (4 aulas)
     <input disabled={busy} maxLength={60} value={draftSettings.catalogPrices.individualPackage} onChange={e=>setDraftSettings(prev=>({...prev,catalogPrices:{...prev.catalogPrices,individualPackage:e.target.value}}))}/>
    </label>
    <label>Texto de economia do pacote individual
     <input disabled={busy} maxLength={140} value={draftSettings.catalogPrices.individualPackageSaving} onChange={e=>setDraftSettings(prev=>({...prev,catalogPrices:{...prev.catalogPrices,individualPackageSaving:e.target.value}}))}/>
    </label>
    <label>Aula em dupla
     <input disabled={busy} maxLength={60} value={draftSettings.catalogPrices.dupla} onChange={e=>setDraftSettings(prev=>({...prev,catalogPrices:{...prev.catalogPrices,dupla:e.target.value}}))}/>
    </label>
    <label>Aula em grupo (4 pessoas)
     <input disabled={busy} maxLength={60} value={draftSettings.catalogPrices.grupo} onChange={e=>setDraftSettings(prev=>({...prev,catalogPrices:{...prev.catalogPrices,grupo:e.target.value}}))}/>
    </label>
    <label>Curso livre (valor individual)
     <input disabled={busy} maxLength={60} value={draftSettings.catalogPrices.courseSingle} onChange={e=>setDraftSettings(prev=>({...prev,catalogPrices:{...prev.catalogPrices,courseSingle:e.target.value}}))}/>
    </label>
    <label>Combo dos 3 cursos livres
     <input disabled={busy} maxLength={60} value={draftSettings.catalogPrices.courseCombo} onChange={e=>setDraftSettings(prev=>({...prev,catalogPrices:{...prev.catalogPrices,courseCombo:e.target.value}}))}/>
    </label>
    <label>Texto de desconto do combo
     <input disabled={busy} maxLength={140} value={draftSettings.catalogPrices.courseComboSaving} onChange={e=>setDraftSettings(prev=>({...prev,catalogPrices:{...prev.catalogPrices,courseComboSaving:e.target.value}}))}/>
    </label>
   </div>
  </div>
  <div className={styles.settingsFooter}>
   <button type="button" disabled={busy} className={styles.today} onClick={resetDefaults}>Restaurar padrão</button>
   <button type="button" disabled={busy||sessionExpired} className={styles.primary} onClick={()=>void saveSettings()}>{busy?'Salvando…':'Salvar configurações'}</button>
  </div>
 </>:adding?<><span className={styles.dialogLabel}>DISPONIBILIDADE</span><h2 id="dialog-title">Adicionar horário</h2><p>Abra um horário ou uma sequência de aulas de 1h. Todos ficam disponíveis para agendamento assim que você confirmar.</p><div className={styles.openFields}><label>Data<input type="date" value={addDate} min={todayInBrazil()} disabled={busy} onChange={e=>setAddDate(e.target.value)}/></label><label>O que deseja abrir?<select value={batch?'range':'single'} disabled={busy} onChange={e=>{setBatch(e.target.value==='range');setClientName('');setClientPhone('')}}><option value="single">Um horário</option><option value="range">Uma sequência de horários</option></select></label></div>{error&&<p role="alert" className={styles.dialogError}>{error}</p>}{batch&&<div className={styles.presetRow}><span>Atalhos de turno:</span><div><button type="button" disabled={busy} className={styles.tokenChip} onClick={()=>{setHour('09');setMinute('00');setEndTime('12:00')}}>Manhã (09h–12h)</button><button type="button" disabled={busy} className={styles.tokenChip} onClick={()=>{setHour('14');setMinute('00');setEndTime('18:00')}}>Tarde (14h–18h)</button><button type="button" disabled={busy} className={styles.tokenChip} onClick={()=>{setHour('09');setMinute('00');setEndTime('17:00')}}>Dia todo (09h–17h)</button></div></div>}<span className={styles.timeLabel}>{batch?'Início da primeira aula':'Horário de início'}</span><div className={styles.timeInputs}><input disabled={busy} aria-label="Hora, de 00 a 23" inputMode="numeric" maxLength={2} value={hour} onChange={e=>setHour(e.target.value.replace(/\D/g,''))}/><span>:</span><input disabled={busy} aria-label="Minutos, de 00 a 59" inputMode="numeric" maxLength={2} value={minute} onChange={e=>setMinute(e.target.value.replace(/\D/g,''))}/><small>Horário de Brasília</small></div>{batch&&<div className={styles.openFields}><label>Fim da última aula<input type="time" disabled={busy} value={endTime} onChange={e=>setEndTime(e.target.value)}/></label><p>Aulas de 1h, sem sobreposição. Para incluir 16h–17h, escolha 17h como fim.</p><label>Repetir sequência em dias seguidos<select disabled={busy} value={String(repeatDays)} onChange={e=>setRepeatDays(Number(e.target.value))}><option value="1">Apenas nesta data</option><option value="2">Por 2 dias seguidos</option><option value="3">Por 3 dias seguidos</option><option value="5">Por 5 dias seguidos</option><option value="7">Por 7 dias seguidos</option></select></label></div>}
 <p className={styles.openPreview}>{newSlots.length?`${newSlots.length} ${newSlots.length===1?'aula':'aulas'} de 1h${repeatDays>1?` em ${repeatDays} dias`:''} · ${newSlots.slice(0,8).map(slot=>repeatDays>1?`${slot.slice(8,10)}/${slot.slice(5,7)} ${slot.slice(11)}`:slot.slice(11)).join(', ')}${newSlots.length>8?'…':''}`:'Informe um intervalo válido.'}</p>
 {!batch&&<div className={styles.clientFields}><label>Nome da pessoa <span>Opcional</span><input disabled={busy} autoComplete="name" maxLength={100} value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Para reservar este horário"/></label><label>WhatsApp com DDD <span>Opcional</span><input disabled={busy} inputMode="tel" autoComplete="tel" maxLength={25} value={clientPhone} onChange={e=>setClientPhone(e.target.value)} placeholder="(71) 99999-9999"/></label><p>Com nome, o horário será reservado. Sem nome, ficará disponível.</p></div>}<button disabled={busy||sessionExpired||!newSlots.length} className={styles.primary} onClick={add}>{busy?'Adicionando…':batch?'Abrir horários':'Adicionar à agenda'}</button></>:<><span className={styles.dialogLabel}>{chosen?.name?'RESERVA':'HORÁRIO DISPONÍVEL'}</span><h2 id="dialog-title">{chosen?.name||'Horário disponível'}</h2><p className={styles.detailDate}>{chosen&&fullDate(parseDate(chosen.slot.slice(0,10)))} · {chosen?.slot.slice(11)}</p>{chosen?.name?<div className={styles.contact}><span>CONTATO</span><span>WhatsApp</span>{chosen.phone?<a className={styles.phone} href={`tel:${chosen.phone}`}>{chosen.phone}</a>:<span>WhatsApp não informado</span>}{chosen.phone&&<a className={styles.whatsapp} href={chosenReplyUrl} target="_blank" rel="noopener noreferrer">Abrir conversa no WhatsApp <span aria-hidden="true">↗</span></a>}{chosen.email&&<a href={`mailto:${chosen.email}`}>{chosen.email}</a>}</div>:<p>Este horário está disponível para reserva.</p>}{error&&<p role="alert" className={styles.dialogError}>{error}</p>}{chosen&&visible.find(s=>s.slot===chosen.slot)?.version!==chosen.version&&<p role="alert" className={styles.dialogError}>Este horário mudou desde que você abriu os detalhes. Feche e abra novamente para conferir a reserva atual.</p>}{confirming?<div className={styles.confirm}><p>{chosen?.name?'Cancelar esta reserva e liberar o horário? A pessoa não será avisada automaticamente.':'Remover este horário disponível?'}</p><div><button className={styles.today} onClick={()=>setConfirming(false)}>Voltar</button><button disabled={busy||sessionExpired||visible.find(s=>s.slot===chosen?.slot)?.version!==chosen?.version} className={styles.danger} onClick={()=>{if(chosen)void action(chosen.name?'cancel':'remove',chosen.slot)}}>Confirmar</button></div></div>:<button disabled={busy||sessionExpired||visible.find(s=>s.slot===chosen?.slot)?.version!==chosen?.version} className={styles.danger} onClick={()=>setConfirming(true)}>{chosen?.name?'Cancelar reserva':'Remover horário'}</button>}</>}</section></div>}
 <footer className={styles.footer}><span role="img" aria-label="Priscilla Castão" className={styles.footerLogo}/><p>Agenda de aulas · Gestão de horários</p><span>Horário de Brasília</span></footer></main>
}
