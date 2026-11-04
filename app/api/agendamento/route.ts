import { NextResponse } from 'next/server'
import { db, ready } from '@/lib/scheduling'
import { sameOrigin } from '@/lib/cms/auth'
export const dynamic = 'force-dynamic'
export async function GET() {
  if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) { const { localDatabase, nowInBrazil } = await import('@/lib/scheduling-local'); const rows = localDatabase().prepare('SELECT slot, name FROM appointments WHERE enabled=1 ORDER BY slot').all(); return NextResponse.json({ slots: rows.map(row => ({ slot: row.slot, reserved: Boolean(row.name) || String(row.slot) <= nowInBrazil() })) }, { headers: { 'Cache-Control': 'no-store' } }) }
  try {
    await ready(); const sql = db()
    const rows = await sql`SELECT slot, (name IS NOT NULL OR (slot::timestamp AT TIME ZONE 'America/Sao_Paulo') <= now()) AS reserved FROM priscilla_appointments WHERE enabled = true ORDER BY slot`
    return NextResponse.json({ slots: rows }, { headers: { 'Cache-Control': 'no-store' } })
  } catch { return NextResponse.json({ error: 'Não foi possível carregar os horários. Tente novamente.' }, { status: 503 }) }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request)
    const raw = await request.text()
    if (raw.length > 4000) throw new Error('Dados inválidos.')
    const { slot, name, phone } = JSON.parse(raw)
    if (typeof slot !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(slot) || typeof name !== 'string' || name.trim().length < 2 || name.length > 100 || typeof phone !== 'string' || !/^\d{10,11}$/.test(phone.replace(/\D/g, '')) || phone.length > 25) throw new Error('Confira os dados informados.')
    if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) { const { localDatabase, nowInBrazil } = await import('@/lib/scheduling-local'); const result = localDatabase().prepare('UPDATE appointments SET name=?, phone=?, email=NULL, created_at=? WHERE slot=? AND enabled=1 AND name IS NULL AND slot>?').run(name.trim(), phone.trim(), new Date().toISOString(), slot, nowInBrazil()); if (!result.changes) return NextResponse.json({ error: 'Este horário não está mais disponível. Escolha outro.' }, { status: 409 }); return NextResponse.json({ ok:true }) }
    await ready(); const sql = db()
    const rows = await sql`UPDATE priscilla_appointments SET name=${name.trim()}, phone=${phone.trim()}, email=NULL, created_at=now() WHERE slot=${slot} AND enabled=true AND name IS NULL AND (slot::timestamp AT TIME ZONE 'America/Sao_Paulo') > now() RETURNING slot`
    if (!rows.length) return NextResponse.json({ error: 'Este horário não está mais disponível. Escolha outro.' }, { status: 409 })
    return NextResponse.json({ ok: true })
  } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === 'Confira os dados informados.' ? error.message : 'Não foi possível agendar. Tente novamente.' }, { status: 400 }) }
}
