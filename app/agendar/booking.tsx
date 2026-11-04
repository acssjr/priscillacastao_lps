/* eslint-disable @next/next/no-img-element */
'use client'
import Link from 'next/link'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import styles from './booking.module.css'
type Slot = { slot: string; reserved: boolean }
const initialDate = '2026-11-08'
export default function Booking() {
  const [slots, setSlots] = useState<Slot[]>([]), [date, setDate] = useState(initialDate), [selected, setSelected] = useState(''), [step, setStep] = useState<'date'|'time'|'form'|'done'>('date'), [error, setError] = useState(''), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [month, setMonth] = useState('2026-11'), [name, setName] = useState(''), [phone, setPhone] = useState(''), [email, setEmail] = useState('')
  const refresh = useCallback(async () => { try { const res = await fetch('/api/agendamento', { cache: 'no-store' }); if (!res.ok) throw new Error(); const data = await res.json(); setSlots(data.slots); setDate(current => data.slots.some((s: Slot) => s.slot.startsWith(current) && s.slot.slice(0,10) >= new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })) ? current : data.slots.find((s: Slot) => s.slot.slice(0,10) >= new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }))?.slot.slice(0,10) || current); setError('') } catch { setError('Não foi possível carregar os horários. Confira sua conexão e tente novamente.') } finally { setLoading(false) } }, [])
  useEffect(() => { const initial = window.setTimeout(refresh, 0); const timer = window.setInterval(refresh, 10000); const onFocus = () => { void refresh() }; window.addEventListener('focus', onFocus); return () => { clearTimeout(initial); clearInterval(timer); window.removeEventListener('focus', onFocus) } }, [refresh])
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(''); const form = new FormData(event.currentTarget); try { const res = await fetch('/api/agendamento', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ slot:selected, name:form.get('name'), phone:form.get('phone'), email:form.get('email') }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setStep('done'); void refresh() } catch (e) { await refresh(); setError(e instanceof Error ? e.message : 'Não foi possível agendar.') } finally { setBusy(false) } }
  const [year, monthNumber] = month.split('-').map(Number)
  const firstWeekday = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()
  const monthLabel = new Intl.DateTimeFormat('pt-BR', { month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(Date.UTC(year, monthNumber - 1, 1)))
  function changeMonth(offset: number) { const next = new Date(Date.UTC(year, monthNumber - 1 + offset, 1)); setMonth(`${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}`); setSelected('') }
  const selectedDay = selected.slice(8,10), selectedTime = selected.slice(11,16)
  const formattedDate = new Intl.DateTimeFormat('pt-BR', { weekday:'long', day:'numeric', month:'long', timeZone:'UTC' }).format(new Date(date + 'T12:00:00Z'))
  const daySlots = slots.filter(s => s.slot.startsWith(date))
  const dateAvailable = date.startsWith(month) && daySlots.some(s => !s.reserved)
  return <main id="conteudo" className={styles.page}><div className={styles.shell}>
    <header className={styles.header}><Link href="/" aria-label="Priscilla Castão, página inicial"><img src="/brand/priscilla-castao-logo.svg" alt="Priscilla Castão" /></Link><span>AGENDA DE AULAS</span></header>
    <div className={styles.layout}>
      <section className={styles.intro}><div className={styles.portrait}><img src="/images/priscilla-catalogo-retrato.webp" alt="Priscilla Castão" /></div><div><h1>Agende sua aula com Priscilla Castão.</h1><p>Escolha uma data e um horário para sua aula de forró.</p><div className={styles.meta}><span>Feira de Santana, BA</span><span>Horário de Brasília</span></div></div></section>
      <section className={styles.panel} aria-label="Agendamento">
        {step !== 'done' && <div className={styles.progress} aria-label={`Etapa ${step === 'date' ? 1 : step === 'time' ? 2 : 3} de 3`}><span className={styles.currentStep}>{step === 'date' ? 'Data' : step === 'time' ? 'Horário' : 'Seus dados'}</span><div aria-hidden="true"><i className={styles.progressActive}/><i className={step !== 'date' ? styles.progressActive : ''}/><i className={step === 'form' ? styles.progressActive : ''}/></div><span>{step === 'date' ? '1' : step === 'time' ? '2' : '3'} / 3</span></div>}
        {step === 'done' ? <div className={styles.success}><span className={styles.check}>✓</span><h2>Horário reservado!</h2><p>Sua aula foi agendada para <strong>{selectedDay}/{selected.slice(5,7)}/{selected.slice(0,4)}, às {selectedTime}</strong>.</p><Link href="/">Voltar ao início ↗</Link></div> : step === 'date' ? <>
          <div className={styles.heading}><h2>Escolha uma data</h2><p>Selecione um dos dias disponíveis.</p></div>
          <div className={styles.month}><button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></button><strong>{monthLabel}</strong><button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></button></div>
          <div className={styles.calendar} role="group" aria-label="Escolha uma data">{['D','S','T','Q','Q','S','S'].map((day, index) => <span className={styles.weekday} key={index}>{day}</span>)}{Array.from({ length:firstWeekday }, (_, index) => <span key={`empty-${index}`} />)}{Array.from({ length:daysInMonth }, (_, index) => { const day = index + 1, key = `${month}-${String(day).padStart(2,'0')}`, available = slots.some(s => s.slot.startsWith(key) && !s.reserved); return <button type="button" key={key} disabled={!available} aria-label={`${day} de ${monthLabel}${available ? ', horários disponíveis' : ', indisponível'}`} aria-pressed={date === key} className={available ? `${styles.availableDay} ${date === key ? styles.activeDay : ''}` : ''} onClick={() => { setDate(key); setSelected('') }}>{day}</button> })}</div>
          {loading && <p className={styles.message}>Carregando horários...</p>}{error && <p className={styles.error} role="alert">{error}</p>}
          <button type="button" className={styles.primary} disabled={!dateAvailable || loading} onClick={() => setStep('time')}>Ver horários <span aria-hidden="true">→</span></button>
        </> : step === 'time' ? <>
          <button type="button" className={styles.back} onClick={() => setStep('date')}>← Voltar para datas</button>
          <div className={styles.heading}><h2>Escolha um horário</h2><p>Horários disponíveis para sua aula.</p></div>
          <div className={styles.dateSummary}><strong>{formattedDate}</strong><span>Horário de Brasília</span></div>
          <div className={styles.times}>{daySlots.map(s => <button key={s.slot} type="button" disabled={s.reserved} aria-pressed={selected === s.slot} className={selected === s.slot ? styles.activeTime : ''} onClick={() => setSelected(s.slot)}>{s.slot.slice(11)}{s.reserved && <small>Reservado</small>}</button>)}</div>
          {!daySlots.some(s => !s.reserved) && <p className={styles.message}>Não há mais horários disponíveis nesta data. Volte e escolha outra.</p>}
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button type="button" className={styles.primary} disabled={!selected || !daySlots.some(s => s.slot === selected && !s.reserved)} onClick={() => setStep('form')}>Continuar <span aria-hidden="true">→</span></button>
        </> : <>
          <button type="button" className={styles.back} onClick={() => { setStep('time'); setError('') }}>← Voltar para horários</button>
          <div className={styles.heading}><h2>Confirme sua aula</h2><p>Preencha seus dados para reservar o horário.</p></div>
          <div className={styles.summary}><span>Sua aula em Feira de Santana</span><strong>{selectedDay}/{selected.slice(5,7)}/{selected.slice(0,4)} · {selectedTime}</strong><small>Horário de Brasília</small></div>
          <form className={styles.form} onSubmit={submit}><label>Nome completo<input name="name" value={name} onChange={event => setName(event.target.value)} required minLength={2} maxLength={100} autoComplete="name" placeholder="Seu nome" /></label><label>WhatsApp<input name="phone" value={phone} onChange={event => setPhone(event.target.value)} type="tel" required minLength={10} maxLength={25} autoComplete="tel" placeholder="(00) 00000-0000" /></label><label>E-mail<input name="email" value={email} onChange={event => setEmail(event.target.value)} type="email" required maxLength={254} autoComplete="email" placeholder="voce@email.com" /></label>{error && <p className={styles.error} role="alert">{error}</p>}<button className={styles.primary} disabled={busy}>{busy ? 'Confirmando...' : 'Confirmar agendamento'} <span aria-hidden="true">→</span></button><p className={styles.footnote}>Ao confirmar, você concorda com nossa <a href="/politica-de-privacidade">política de privacidade</a>.</p></form>
        </>}
      </section>
    </div><footer className={styles.footer}>PRISCILLA CASTÃO</footer></div></main>
}
