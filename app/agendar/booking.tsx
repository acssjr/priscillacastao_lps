/* eslint-disable @next/next/no-img-element */
'use client'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { profileLinks } from '@/content/profile-links'
import styles from './booking.module.css'
type Slot = { slot: string; reserved: boolean }
const initialDate = '2026-11-08'
function Icon({ name }: { name: 'pin' | 'clock' | 'arrow' | 'back' | 'check' }) {
  const path = { pin: <><path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/></>, clock: <><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></>, arrow: <path d="M4 12h15m-6-6 6 6-6 6"/>, back: <path d="M20 12H5m6-6-6 6 6 6"/>, check: <path d="m5 12 4.5 4.5L19 7"/> }
  return <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path[name]}</svg>
}
export default function Booking() {
  const [slots, setSlots] = useState<Slot[]>([]), [date, setDate] = useState(initialDate), [selected, setSelected] = useState(''), [step, setStep] = useState<'date'|'time'|'form'|'done'>('date'), [error, setError] = useState(''), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [month, setMonth] = useState('2026-11'), [name, setName] = useState(''), [phone, setPhone] = useState(''), [email, setEmail] = useState(''), [direction, setDirection] = useState<'forward'|'back'>('forward')
  const stepRef = useRef<HTMLDivElement>(null)
  const transitioning = useRef(false)
  const focusNext = useRef(false)
  async function goTo(next: 'date'|'time'|'form'|'done', way: 'forward'|'back') {
    if (transitioning.current || next === step) return
    transitioning.current = true
    const element = stepRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (element && !reduced) {
      try { await element.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${way === 'forward' ? '-14px' : '14px'})` }], { duration: 120, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'forwards' }).finished } catch { /* A cancelled transition should still navigate. */ }
    }
    focusNext.current = true; setDirection(way); setStep(next); transitioning.current = false
  }
  function restart() {
    if (busy) return
    setSelected(''); setError(''); setMonth(date.slice(0, 7)); void goTo('date', 'back')
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  const refresh = useCallback(async () => { try { const res = await fetch('/api/agendamento', { cache: 'no-store' }); if (!res.ok) throw new Error(); const data = await res.json(); setSlots(data.slots); setDate(current => data.slots.some((s: Slot) => s.slot.startsWith(current) && s.slot.slice(0,10) >= new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })) ? current : data.slots.find((s: Slot) => s.slot.slice(0,10) >= new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }))?.slot.slice(0,10) || current); setError(previous => previous === 'Não foi possível carregar os horários. Confira sua conexão e tente novamente.' ? '' : previous) } catch { setError('Não foi possível carregar os horários. Confira sua conexão e tente novamente.') } finally { setLoading(false) } }, [])
  useEffect(() => { const initial = window.setTimeout(refresh, 0); const timer = window.setInterval(refresh, 10000); const onFocus = () => { void refresh() }; window.addEventListener('focus', onFocus); return () => { clearTimeout(initial); clearInterval(timer); window.removeEventListener('focus', onFocus) } }, [refresh])
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(''); const form = new FormData(event.currentTarget); try { const res = await fetch('/api/agendamento', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ slot:selected, name:form.get('name'), phone:form.get('phone'), email:form.get('email') }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); await goTo('done', 'forward'); void refresh() } catch (e) { await refresh(); setError(e instanceof Error ? e.message : 'Não foi possível agendar.') } finally { setBusy(false) } }
  const [year, monthNumber] = month.split('-').map(Number)
  const firstWeekday = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()
  const monthLabel = new Intl.DateTimeFormat('pt-BR', { month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(Date.UTC(year, monthNumber - 1, 1)))
  function changeMonth(offset: number) { const next = new Date(Date.UTC(year, monthNumber - 1 + offset, 1)); setMonth(`${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}`); setSelected('') }
  const selectedDay = selected.slice(8,10), selectedTime = selected.slice(11,16)
  const formattedDate = new Intl.DateTimeFormat('pt-BR', { weekday:'long', day:'numeric', month:'long', timeZone:'UTC' }).format(new Date(date + 'T12:00:00Z'))
  const daySlots = slots.filter(s => s.slot.startsWith(date))
  const dateAvailable = date.startsWith(month) && daySlots.length > 0
  const morning = daySlots.filter(s => Number(s.slot.slice(11,13)) < 12)
  const afternoon = daySlots.filter(s => Number(s.slot.slice(11,13)) >= 12 && Number(s.slot.slice(11,13)) < 18)
  const periodMessage = (label: string, period: Slot[]) => period.some(s => !s.reserved) ? '' : period.length ? `Os horários ${label} já estão indisponíveis.` : `Nesta data, não foram abertos horários ${label}.`
  const periodMessages = [periodMessage('pela manhã', morning), periodMessage('à tarde', afternoon)].filter(Boolean)
  const anyAvailable = slots.some(s => !s.reserved)
  const dayHasAvailability = daySlots.some(s => !s.reserved)
  return <main id="conteudo" className={styles.page}><div className={styles.shell}>
    <header className={styles.header}><button type="button" className={styles.brandButton} onClick={restart} disabled={busy} aria-label="Priscilla Castão — início do agendamento"><img src="/brand/priscilla-castao-logo.svg" alt="" /></button><span>AGENDA DE AULAS</span></header>
    <div className={styles.layout}>
      <section className={styles.intro}><div className={styles.portrait}><img src="/images/priscilla-catalogo-retrato.webp" alt="Priscilla Castão" /></div><div><h1>Agende sua aula com Priscilla Castão.</h1><p>Escolha uma data e um horário para sua aula de forró.</p><div className={styles.meta}><span><Icon name="pin" />Feira de Santana, BA</span><span><Icon name="clock" />Horário de Brasília</span></div></div></section>
      <section className={styles.panel} aria-label="Agendamento">
        {step !== 'done' && <div className={styles.progress} aria-label={`Etapa ${step === 'date' ? 1 : step === 'time' ? 2 : 3} de 3`}><span className={styles.currentStep}>{step === 'date' ? 'Data' : step === 'time' ? 'Horário' : 'Seus dados'}</span><div aria-hidden="true"><i className={styles.progressActive}/><i className={step !== 'date' ? styles.progressActive : ''}/><i className={step === 'form' ? styles.progressActive : ''}/></div><span>{step === 'date' ? '1' : step === 'time' ? '2' : '3'} / 3</span></div>}
        <div key={step} ref={node => { stepRef.current = node; if (node && focusNext.current) { focusNext.current = false; node.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true }) } }} className={`${styles.stepContent} ${direction === 'back' ? styles.stepBack : styles.stepForward}`}>
        {step === 'done' ? <div className={styles.success}><span className={styles.check}><Icon name="check" /></span><h2 tabIndex={-1}>Horário reservado!</h2><p>Sua aula foi agendada para <strong>{selectedDay}/{selected.slice(5,7)}/{selected.slice(0,4)}, às {selectedTime}</strong>.</p><button type="button" className={styles.back} onClick={restart}>Voltar ao início ↗</button></div> : step === 'date' ? <>
          <div className={styles.heading}><h2 tabIndex={-1}>Escolha uma data</h2><p>Escolha uma data para conhecer os horários. Se preferir, você pode consultar outros dias.</p></div>
          <div className={styles.month}><button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button><strong>{monthLabel}</strong><button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></button></div>
          <div className={styles.calendar} role="group" aria-label="Escolha uma data">{['D','S','T','Q','Q','S','S'].map((day, index) => <span className={styles.weekday} key={index}>{day}</span>)}{Array.from({ length:firstWeekday }, (_, index) => <span key={`empty-${index}`} />)}{Array.from({ length:daysInMonth }, (_, index) => { const day = index + 1, key = `${month}-${String(day).padStart(2,'0')}`, dayItems = slots.filter(s => s.slot.startsWith(key)), hasSlots = dayItems.length > 0, available = dayItems.some(s => !s.reserved); return <button type="button" key={key} disabled={!hasSlots} aria-label={`${day} de ${monthLabel}${available ? ', horários disponíveis' : hasSlots ? ', horários indisponíveis' : ', sem horários cadastrados'}`} aria-pressed={hasSlots && date === key} className={hasSlots ? `${styles.availableDay} ${date === key ? styles.activeDay : ''}` : ''} onClick={() => { setDate(key); setSelected('') }}>{day}</button> })}</div>
          {loading && <p className={styles.message} role="status">Carregando horários...</p>}{!loading && !error && slots.length > 0 && !slots.some(s => s.slot.startsWith(month)) && <p className={styles.message} role="status">Não há horários cadastrados neste mês. Consulte outro mês.</p>}{!loading && !error && !anyAvailable && <div className={styles.availabilityNote} role="status"><p>{slots.length ? 'Por enquanto, todos os horários cadastrados estão indisponíveis.' : 'Ainda não há horários cadastrados na agenda.'} Você pode falar com a Priscilla para saber sobre novas datas.</p><a href={profileLinks.whatsapp} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp <Icon name="arrow" /></a></div>}{error && <p className={styles.error} role="alert">{error}</p>}
          <button type="button" className={styles.primary} disabled={!dateAvailable || loading} onClick={() => { void goTo('time', 'forward') }}>Ver horários <Icon name="arrow" /></button>
        </> : step === 'time' ? <>
          <button type="button" className={styles.back} onClick={() => { void goTo('date', 'back') }}><Icon name="back" /> Voltar para datas</button>
          <div className={styles.heading}><h2 tabIndex={-1}>Escolha um horário</h2><p>Confira os horários desta data e escolha o que for melhor para você.</p></div>
          <div className={styles.dateSummary}><strong>{formattedDate}</strong><span>Horário de Brasília</span></div>
          <div className={styles.times} role="group" aria-label="Horários disponíveis">{daySlots.map(s => <button key={s.slot} type="button" disabled={s.reserved} aria-pressed={selected === s.slot} className={selected === s.slot ? styles.activeTime : ''} onClick={() => setSelected(s.slot)}>{s.slot.slice(11)}{s.reserved && <small>Reservado</small>}</button>)}</div>
          {dayHasAvailability && periodMessages.length > 0 && <div className={styles.availabilityNote} role="status"><p>{periodMessages.join(' ')}</p><button type="button" onClick={() => { void goTo('date', 'back') }}>Consultar outra data <Icon name="arrow" /></button></div>}
          {!dayHasAvailability && <div className={styles.availabilityNote} role="status"><p>Os horários desta data estão indisponíveis. Que tal consultar outro dia ou conversar com a Priscilla?</p><button type="button" onClick={() => { void goTo('date', 'back') }}>Consultar outra data <Icon name="arrow" /></button><a href={profileLinks.whatsapp} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp <Icon name="arrow" /></a></div>}
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button type="button" className={styles.primary} disabled={!selected || !daySlots.some(s => s.slot === selected && !s.reserved)} onClick={() => { void goTo('form', 'forward') }}>Continuar <Icon name="arrow" /></button>
        </> : <>
          <button type="button" className={styles.back} onClick={() => { setError(''); void goTo('time', 'back') }}><Icon name="back" /> Voltar para horários</button>
          <div className={styles.heading}><h2 tabIndex={-1}>Confirme sua aula</h2><p>Confira a data e o horário escolhidos e preencha seus dados para reservar.</p></div>
          <div className={styles.summary}><span>Sua aula em Feira de Santana</span><strong>{selectedDay}/{selected.slice(5,7)}/{selected.slice(0,4)} · {selectedTime}</strong><small>Horário de Brasília</small></div>
          {!daySlots.some(s => s.slot === selected && !s.reserved) && !error && <div className={styles.availabilityNote} role="status"><p>Esse horário não está mais disponível. Escolha outro para continuar.</p><button type="button" onClick={() => { void goTo('time', 'back') }}>Escolher outro horário <Icon name="arrow" /></button></div>}
          <form className={styles.form} onSubmit={submit}><label>Nome completo<input name="name" value={name} onChange={event => setName(event.target.value)} required minLength={2} maxLength={100} autoComplete="name" placeholder="Seu nome" /></label><label>WhatsApp<input name="phone" value={phone} onChange={event => setPhone(event.target.value)} type="tel" required minLength={10} maxLength={25} autoComplete="tel" placeholder="(00) 00000-0000" /></label><label>E-mail<input name="email" value={email} onChange={event => setEmail(event.target.value)} type="email" required maxLength={254} autoComplete="email" placeholder="voce@email.com" /></label>{error && <><p className={styles.error} role="alert">{error}</p><button type="button" className={styles.back} onClick={() => { setError(''); void goTo('time', 'back') }}>Escolher outro horário</button></>}<button className={styles.primary} disabled={busy || !daySlots.some(s => s.slot === selected && !s.reserved)}>{busy ? 'Confirmando...' : 'Confirmar agendamento'} <Icon name="arrow" /></button><p className={styles.footnote}>Todos os campos são obrigatórios. Ao confirmar, você concorda com nossa <a href="/politica-de-privacidade">política de privacidade</a>.</p></form>
        </>}
        </div>
      </section>
    </div><footer className={styles.footer} aria-label="Rodapé"><button type="button" className={`${styles.footerBrand} ${styles.brandButton}`} onClick={restart} disabled={busy} aria-label="Priscilla Castão — início do agendamento"><img src="/brand/priscilla-castao-logo.svg" alt="" /></button><nav aria-label="Links do rodapé"><a className={styles.instagramLink} href={profileLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Priscilla Castão"><img src="/brand/instagram.svg" alt="" /></a><Link href="/politica-de-privacidade">Privacidade</Link></nav><p>Feira de Santana, BA</p></footer></div></main>
}
