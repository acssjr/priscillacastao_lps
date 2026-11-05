/* eslint-disable @next/next/no-img-element */
'use client'
import Link from 'next/link'
import { Entrance } from '@/app/links/Entrance'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { profileLinks } from '@/content/profile-links'
import {
  DEFAULT_BOOKING_SETTINGS,
  buildBookingWhatsAppUrl,
  formatBookingMessage,
  sanitizeBookingSettings,
  type BookingSettings,
} from '@/lib/booking-settings'
import styles from './booking.module.css'
import beam from '@/components/ui/WhatsAppLink.module.css'
type Receipt = {slot:string;booking_id:string;status:string}
const pendingKey='priscilla-booking-attempt'
type Slot = { slot: string; reserved: boolean }
const initialDate = '2026-11-08'
function timeRange(slot: string) {
  const start = slot.slice(11, 16), [hours, minutes] = start.split(':').map(Number)
  return `${start} – ${String((hours + 1) % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
function formatPhone(value: string) {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('55') && digits.length > 11) digits = digits.slice(2)
  digits = digits.slice(0, 11)
  if (digits.length <= 2) return digits ? `(${digits}` : ''
  const area = digits.slice(0, 2), number = digits.slice(2)
  const split = number.length > 8 ? 5 : 4
  return `(${area}) ${number.slice(0, split)}${number.length > split ? `-${number.slice(split)}` : ''}`
}
function Icon({ name }: { name: 'pin' | 'clock' | 'arrow' | 'back' | 'check' }) {
  const path = { pin: <><path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/></>, clock: <><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></>, arrow: <path d="M4 12h15m-6-6 6 6-6 6"/>, back: <path d="M20 12H5m6-6-6 6 6 6"/>, check: <path d="m5 12 4.5 4.5L19 7"/> }
  return <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path[name]}</svg>
}
export default function Booking() {
  const [slots, setSlots] = useState<Slot[]>([]), [date, setDate] = useState(initialDate), [selected, setSelected] = useState(''), [step, setStep] = useState<'date'|'time'|'form'|'done'>('date'), [error, setError] = useState(''), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [month, setMonth] = useState('2026-11'), [name, setName] = useState(''), [phone, setPhone] = useState(''), [direction, setDirection] = useState<'forward'|'back'>('forward')
  const [settings, setSettings] = useState<BookingSettings>(DEFAULT_BOOKING_SETTINGS)
  const stepRef = useRef<HTMLDivElement>(null)
  const transitioning = useRef(false)
  const focusNext = useRef(false)
  const initialized = useRef(false)
  const queryVersion=useRef(0), submitting=useRef(false)
  const attempt=useRef<{requestId:string;slot:string}|null>(null)
  const [pending,setPending]=useState(false),[syncError,setSyncError]=useState('')
  const locked=busy||pending
  const navigationLocked=locked||Boolean(attempt.current)
  function saveAttempt(value:{requestId:string;slot:string}|null){attempt.current=value;try{if(value)sessionStorage.setItem(pendingKey,JSON.stringify(value));else sessionStorage.removeItem(pendingKey)}catch{}}
  async function showReceipt(value:Receipt){if(value.status!=='confirmed'){saveAttempt(null);setPending(false);setError('Esta reserva foi cancelada. Escolha um novo horário.');return}setSelected(value.slot);setDate(value.slot.slice(0,10));saveAttempt(null);setPending(false);await goTo('done','forward')}
  async function recover(){if(!attempt.current||submitting.current)return;setBusy(true);try{const res=await fetch('/api/agendamento',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'recover',requestId:attempt.current.requestId}),signal:AbortSignal.timeout(15000)});const data=await res.json();if(!res.ok){setPending(true);setError(data.error||'Não foi possível verificar sua reserva agora. Tente novamente em instantes.');return}if(data.receipt)await showReceipt(data.receipt);else {setPending(false);setSelected(attempt.current.slot);setDate(attempt.current.slot.slice(0,10));setMonth(attempt.current.slot.slice(0,7));setError('Ainda não há confirmação. Confira os dados e confirme novamente este mesmo horário. Sua tentativa será reutilizada para evitar duplicidade.');await goTo('form','forward')}}catch{setPending(true);setError('Ainda não conseguimos verificar sua reserva. Verifique a conexão e toque em Verificar confirmação antes de escolher outro horário.')}finally{setBusy(false)}}
  useEffect(()=>{const timer=window.setTimeout(()=>{try{const saved=JSON.parse(sessionStorage.getItem(pendingKey)||'null');if(saved?.requestId&&saved?.slot){attempt.current=saved;setPending(true);void recover()}}catch{}},0);return()=>clearTimeout(timer)},[]) // eslint-disable-line react-hooks/exhaustive-deps
  async function goTo(next: 'date'|'time'|'form'|'done', way: 'forward'|'back') {
    if ((attempt.current && next !== 'form' && next !== 'done') || transitioning.current || next === step) return
    transitioning.current = true
    const element = stepRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (element && !reduced) {
      try { await element.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${way === 'forward' ? '-14px' : '14px'})` }], { duration: 120, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'forwards' }).finished } catch { /* A cancelled transition should still navigate. */ }
    }
    focusNext.current = true; setDirection(way); setStep(next); transitioning.current = false
  }
  function restart() {
    if (locked||attempt.current) return
    setSelected(''); setError(''); setMonth(date.slice(0, 7)); void goTo('date', 'back')
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  const refresh = useCallback(async () => {
    const version=++queryVersion.current
    try {
      const res = await fetch('/api/agendamento', { cache: 'no-store', signal:AbortSignal.timeout(15000) })
      if (!res.ok) throw new Error()
      const data: { slots: Slot[]; settings?: unknown } = await res.json()
      if(version!==queryVersion.current)return
      setSlots(data.slots)
      if (data.settings) setSettings(sanitizeBookingSettings(data.settings))
      if (!initialized.current) {
        const first = data.slots.filter(slot => !slot.reserved).sort((a, b) => a.slot.localeCompare(b.slot))[0]
        const initial = first?.slot.slice(0, 10) || new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
        setDate(initial); setMonth(initial.slice(0, 7)); initialized.current = true
      }
      setSyncError('')
    } catch { if(version===queryVersion.current)setSyncError('Não foi possível atualizar os horários. Verifique sua conexão e tente novamente.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { const initial = window.setTimeout(refresh, 0); const timer = window.setInterval(refresh, 10000); const onFocus = () => { void refresh() }; window.addEventListener('focus', onFocus); const onVisible=()=>{if(!document.hidden)onFocus()};document.addEventListener('visibilitychange',onVisible); return () => { clearTimeout(initial); clearInterval(timer); window.removeEventListener('focus', onFocus);document.removeEventListener('visibilitychange',onVisible) } }, [refresh])
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();if(submitting.current)return
    submitting.current=true;setBusy(true);setError('');queryVersion.current++
    const snapshot={slot:selected,name:name.trim(),phone:phone.trim()}
    const requestId=attempt.current?.slot===selected?attempt.current.requestId:crypto.randomUUID()
    saveAttempt({requestId,slot:selected})
    try{
      const res=await fetch('/api/agendamento',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...snapshot,requestId}),signal:AbortSignal.timeout(15000)})
      const data=await res.json()
      if(!res.ok){if(res.status<500){saveAttempt(null);setPending(false);setError(data.error||'Confira seus dados e tente novamente.');void refresh();return}throw new Error()}
      if(!data.receipt)throw new Error()
      await showReceipt(data.receipt);void refresh()
    }catch{setPending(true);setError('A conexão foi interrompida durante a confirmação. Sua reserva pode ter sido registrada. Toque em Verificar confirmação para consultar o resultado com segurança.')}
    finally{submitting.current=false;setBusy(false)}
  }

  const [year, monthNumber] = month.split('-').map(Number)
  const firstWeekday = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()
  const monthLabel = new Intl.DateTimeFormat('pt-BR', { month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(Date.UTC(year, monthNumber - 1, 1)))
  function changeMonth(offset: number) { const next = new Date(Date.UTC(year, monthNumber - 1 + offset, 1)); setMonth(`${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}`); setSelected('') }
  const selectedDay = selected.slice(8,10), selectedTime = selected.slice(11,16)
  const selectedDateBr = `${selectedDay}/${selected.slice(5,7)}/${selected.slice(0,4)}`
  const currentDateBr = `${date.slice(8,10)}/${date.slice(5,7)}/${date.slice(0,4)}`
  const whatsappUrl = buildBookingWhatsAppUrl(
    settings.whatsappPhone,
    formatBookingMessage(settings.confirmationMessage, {
      name: name.trim(),
      date: selectedDateBr,
      time: selectedTime,
      timeRange: selected ? timeRange(selected) : '',
      city: settings.city,
      locationNote: settings.locationNote,
    }),
  )
  const inquiryWhatsappUrl = buildBookingWhatsAppUrl(
    settings.whatsappPhone,
    formatBookingMessage(settings.inquiryMessage, {
      name: name.trim(),
      date: currentDateBr,
      city: settings.city,
      locationNote: settings.locationNote,
    }),
  )

  const formattedDate = new Intl.DateTimeFormat('pt-BR', { weekday:'long', day:'numeric', month:'long', timeZone:'UTC' }).format(new Date(date + 'T12:00:00Z'))
  const daySlots = slots.filter(s => s.slot.startsWith(date))
  const dateAvailable = date.startsWith(month) && daySlots.some(slot => !slot.reserved)
  const morning = daySlots.filter(s => Number(s.slot.slice(11,13)) < 12)
  const afternoon = daySlots.filter(s => Number(s.slot.slice(11,13)) >= 12 && Number(s.slot.slice(11,13)) < 18)
  const periodMessage = (label: string, period: Slot[]) => period.some(s => !s.reserved) ? '' : period.length ? `Os horários ${label} já estão indisponíveis.` : `Nesta data, não foram abertos horários ${label}.`
  const periodMessages = [periodMessage('pela manhã', morning), periodMessage('à tarde', afternoon)].filter(Boolean)
  const anyAvailable = slots.some(s => !s.reserved)
  const dayHasAvailability = daySlots.some(s => !s.reserved)
  const availableCount = daySlots.filter(slot => !slot.reserved).length
  return <main id="conteudo" className={styles.page}><Entrance booking /><div className={styles.shell}>
    <header className={styles.header}><button type="button" className={styles.brandButton} onClick={restart} disabled={navigationLocked} aria-label="Priscilla Castão — início do agendamento"><img src="/brand/priscilla-castao-logo.svg" alt="" /></button><span>AGENDA DE AULAS</span></header>
    <div className={styles.layout}>
      <section className={styles.intro}><div><h1>{settings.welcomeTitle}</h1><p>{settings.welcomeSubtitle}</p>{settings.publicNotice && <p className={styles.publicNotice}>{settings.publicNotice}</p>}</div></section>
      <section className={styles.panel} aria-label="Agendamento">
        {syncError&&<div role="alert" className={styles.error}>{syncError}<button type="button" className={styles.back} onClick={()=>void refresh()}>Atualizar horários</button></div>}
        {pending&&<div role="alert" className={styles.availabilityNote}><p>{error||'Estamos verificando sua última tentativa de reserva.'}</p><button type="button" disabled={busy} onClick={()=>void recover()}>{busy?'Verificando…':'Verificar confirmação'}</button></div>}
        {!settings.bookingEnabled && step !== 'done' ? (
          <div className={styles.availabilityNote} role="status">
            <div className={styles.heading}><h2 tabIndex={-1}>Agendamento pelo WhatsApp</h2><p>{settings.publicNotice || 'No momento, os horários estão sendo combinados diretamente com a Priscilla pelo WhatsApp.'}</p></div>
            <a className={`${styles.primary} ${styles.whatsappButton}`} href={inquiryWhatsappUrl} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp <Icon name="arrow" /></a>
          </div>
        ) : (
        <>
        {step !== 'done' && <nav className={styles.stepper} aria-label="Etapas do agendamento">
          <ol>
            {([{ id: 'date', label: 'Data' }, { id: 'time', label: 'Horário' }, { id: 'form', label: 'Seus dados' }] as const).map((item, index) => {
              const activeIndex = step === 'date' ? 0 : step === 'time' ? 1 : 2
              const current = index === activeIndex, complete = index < activeIndex
              const content = <><span className={styles.stepNumber} aria-hidden="true">{complete ? <svg className={styles.stepBadge} viewBox="0 0 24 24"><path fill="currentColor" d="M12 1.5l2.23 1.38 2.6-.08 1.32 2.25 2.31 1.21-.08 2.61L21.75 11l-1.37 2.23.08 2.61-2.31 1.21-1.32 2.25-2.6-.08L12 20.6l-2.23-1.38-2.6.08-1.32-2.25-2.31-1.21.08-2.61L2.25 11l1.37-2.13-.08-2.61 2.31-1.21L7.17 2.8l2.6.08z"/><path d="m8 11.1 2.5 2.5 5.5-5.3" fill="none" stroke="#fffaf3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> : index + 1}</span><span className={styles.stepLabel}>{item.label}<span className={styles.srOnly}>{complete ? ', concluída' : current ? ', etapa atual' : ', próxima etapa'}</span></span></>
              return <li key={item.id} className={`${styles.stepItem} ${current ? styles.stepCurrent : ''} ${complete ? styles.stepComplete : ''}`} aria-current={current ? 'step' : undefined}>
                {complete ? <button type="button" className={styles.stepControl} disabled={navigationLocked} aria-label={`Voltar para ${item.label}`} onClick={() => { setError(''); void goTo(item.id, 'back') }}>{content}</button> : <span className={styles.stepControl}>{content}</span>}
              </li>
            })}
          </ol>
        </nav>}
        <div inert={pending} key={step} ref={node => { stepRef.current = node; if (node && focusNext.current) { focusNext.current = false; node.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true }) } }} className={`${styles.stepContent} ${direction === 'back' ? styles.stepBack : styles.stepForward}`}>
        {step === 'done' ? <div className={styles.success}><div className={styles.celebration} aria-hidden="true"><span className={styles.confetti}>{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</span><span className={styles.check}><Icon name="check" /></span></div><h2 tabIndex={-1}>Agendamento confirmado!</h2><p>Sua aula está reservada para <strong>{selectedDay}/{selected.slice(5,7)}/{selected.slice(0,4)}, às {selectedTime}</strong>.</p><p>{settings.confirmationNote}</p><p className={styles.whatsappPrompt}>Sua reserva já está confirmada. Se quiser, continue a conversa com a Priscilla pelo WhatsApp com uma mensagem pronta.</p><a className={`${styles.primary} ${styles.whatsappButton}`} href={whatsappUrl} target="_blank" rel="noopener noreferrer">Enviar mensagem no WhatsApp <Icon name="arrow" /></a><button type="button" className={styles.back} disabled={navigationLocked} onClick={restart}>Voltar ao início <Icon name="arrow" /></button></div> : step === 'date' ? <>
          <div className={styles.heading}><h2 tabIndex={-1}>Escolha uma data</h2><p>Selecione um dia disponível para ver os horários.</p></div>
          <div className={styles.month}><button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button><strong>{monthLabel}</strong><button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></button></div>
          <div className={styles.calendar} role="group" aria-label="Escolha uma data">{['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'].map((day, index) => <span className={styles.weekday} key={day} aria-label={day}>{['D','S','T','Q','Q','S','S'][index]}</span>)}{Array.from({ length:firstWeekday }, (_, index) => <span key={`empty-${index}`} />)}{Array.from({ length:daysInMonth }, (_, index) => { const day = index + 1, key = `${month}-${String(day).padStart(2,'0')}`, dayItems = slots.filter(s => s.slot.startsWith(key)), hasSlots = dayItems.length > 0, available = dayItems.some(s => !s.reserved); return <button type="button" key={key} disabled={!available} aria-label={`${day} de ${monthLabel}${available ? ', horários disponíveis' : hasSlots ? ', horários indisponíveis' : ', sem horários cadastrados'}`} aria-pressed={available && date === key} className={available ? `${styles.availableDay} ${date === key ? styles.activeDay : ''}` : ''} onClick={() => { setDate(key); setSelected('') }}>{day}</button> })}</div>
          <div className={styles.calendarLegend} aria-label="Legenda do calendário"><span><i className={styles.legendAvailable} aria-hidden="true" />Disponível</span><span><i className={styles.legendSelected} aria-hidden="true" />Selecionada</span></div>
          {dateAvailable && !loading && <div className={styles.selectedDate} aria-live="polite"><span>Data escolhida</span><strong className={styles.scoreWindow}><span key={date} className={styles.scoreValue}>{formattedDate}</span></strong><small>{availableCount} {availableCount === 1 ? 'horário disponível' : 'horários disponíveis'}</small></div>}
          {loading && <p className={styles.message} role="status">Carregando horários...</p>}{!loading && !error && slots.length > 0 && !slots.some(s => s.slot.startsWith(month) && !s.reserved) && <p className={styles.message} role="status">Não há horários disponíveis neste mês. Consulte outro mês.</p>}{!loading && !error && !anyAvailable && <div className={styles.availabilityNote} role="status"><p>{slots.length ? 'Por enquanto, todos os horários cadastrados estão indisponíveis.' : 'Ainda não há horários cadastrados na agenda.'} Você pode falar com a Priscilla para saber sobre novas datas.</p><a href={inquiryWhatsappUrl} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp <Icon name="arrow" /></a></div>}{error && <p className={styles.error} role="alert">{error}</p>}
          <button type="button" className={styles.primary} disabled={!dateAvailable || loading} onClick={() => { void goTo('time', 'forward') }}>Ver horários <Icon name="arrow" /></button>
        </> : step === 'time' ? <>
          <button type="button" className={styles.back} disabled={navigationLocked} onClick={() => { void goTo('date', 'back') }}><Icon name="back" /> Voltar para datas</button>
          <div className={styles.heading}><h2 tabIndex={-1}>Escolha um horário</h2><p>Confira os horários desta data e escolha o que for melhor para você.</p></div>
          <div className={styles.dateSummary}><strong>{formattedDate}</strong><span>Horário de Brasília</span></div>
          <div className={styles.times} role="group" aria-label="Horários disponíveis">{daySlots.map(s => <button key={s.slot} type="button" disabled={s.reserved} aria-pressed={selected === s.slot} className={selected === s.slot ? styles.activeTime : ''} onClick={() => setSelected(s.slot)}>{s.slot.slice(11)}{s.reserved && <small>Reservado</small>}</button>)}</div>
          {dayHasAvailability && periodMessages.length > 0 && <div className={styles.availabilityNote} role="status"><p>{periodMessages.join(' ')}</p><button type="button" onClick={() => { void goTo('date', 'back') }}>Consultar outra data <Icon name="arrow" /></button></div>}
          {!dayHasAvailability && <div className={styles.availabilityNote} role="status"><p>Os horários desta data estão indisponíveis. Que tal consultar outro dia ou conversar com a Priscilla?</p><button type="button" onClick={() => { void goTo('date', 'back') }}>Consultar outra data <Icon name="arrow" /></button><a href={inquiryWhatsappUrl} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp <Icon name="arrow" /></a></div>}
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button type="button" className={styles.primary} disabled={!selected || !daySlots.some(s => s.slot === selected && !s.reserved)} onClick={() => { void goTo('form', 'forward') }}>Continuar <Icon name="arrow" /></button>
        </> : <>
          <button type="button" className={styles.back} disabled={navigationLocked} onClick={() => { setError(''); void goTo('time', 'back') }}><Icon name="back" /> Voltar para horários</button>
          <div className={styles.heading}><h2 tabIndex={-1}>Confirme sua aula</h2><p>Confira a data e o horário escolhidos e preencha seus dados para reservar.</p></div>
          <div className={styles.summary}><span className={styles.summaryMark} aria-hidden="true" /><span className={`${beam.rim} ${styles.summaryBeam}`} aria-hidden="true" /><span>Sua aula em {settings.city}</span><strong>{selectedDay}/{selected.slice(5,7)}/{selected.slice(0,4)} · {timeRange(selected)}</strong><small>{settings.locationNote}</small></div>
          {!daySlots.some(s => s.slot === selected && !s.reserved) && !error && <div className={styles.availabilityNote} role="status"><p>Esse horário não está mais disponível. Escolha outro para continuar.</p><button type="button" onClick={() => { void goTo('time', 'back') }}>Escolher outro horário <Icon name="arrow" /></button></div>}
          <form className={styles.form} onSubmit={submit}><label>Nome completo<input disabled={locked} name="name" value={name} onChange={event => setName(event.target.value)} required minLength={2} maxLength={100} autoComplete="name" placeholder="Seu nome" /></label><label>WhatsApp<input disabled={locked} name="phone" value={phone} onChange={event => setPhone(formatPhone(event.target.value))} type="tel" inputMode="tel" required minLength={14} autoComplete="tel" placeholder="(00) 00000-0000" /></label>{error && <><p className={styles.error} role="alert">{error}</p><button type="button" className={styles.back} disabled={navigationLocked} onClick={() => { setError(''); void goTo('time', 'back') }}>Escolher outro horário</button></>}<button className={styles.primary} disabled={locked || (!attempt.current && !daySlots.some(s => s.slot === selected && !s.reserved))}>{busy ? 'Confirmando...' : 'Confirmar agendamento'} <Icon name="arrow" /></button><p className={styles.footnote}>Todos os campos são obrigatórios. Ao confirmar, você concorda com nossa <a href="/politica-de-privacidade">política de privacidade</a>.</p></form>
        </>}
        </div>
        </>
        )}
      </section>
    </div><footer className={styles.footer} aria-label="Rodapé"><button type="button" className={`${styles.footerBrand} ${styles.brandButton}`} onClick={restart} disabled={navigationLocked} aria-label="Priscilla Castão — início do agendamento"><img src="/brand/priscilla-castao-logo.svg" alt="" /></button><nav aria-label="Links do rodapé"><a className={styles.instagramLink} href={profileLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Priscilla Castão"><img src="/brand/instagram.svg" alt="" /></a><Link href="/politica-de-privacidade">Política de privacidade</Link></nav></footer></div></main>
}
