import { NextResponse } from 'next/server'
import { authenticated, sameOrigin } from '@/lib/cms/auth'
import { db, ready } from '@/lib/scheduling'
export const dynamic = 'force-dynamic'
export async function GET() {
  try { if (!await authenticated()) return NextResponse.json({ error: 'Acesse sua conta.' }, { status: 401 }); if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) { const { localDatabase } = await import('@/lib/scheduling-local'); return NextResponse.json({ slots: localDatabase().prepare('SELECT slot, name, phone, email, created_at, enabled FROM appointments ORDER BY slot').all().map(row => ({ ...row, enabled: Boolean(row.enabled) })) }, { headers: { 'Cache-Control': 'no-store' } }) }; await ready(); const sql = db(); return NextResponse.json({ slots: await sql`SELECT slot, name, phone, email, created_at, enabled FROM priscilla_appointments ORDER BY slot` }, { headers: { 'Cache-Control': 'no-store' } }) } catch { return NextResponse.json({ error: 'Não foi possível carregar a agenda.' }, { status: 503 }) }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request); if (!await authenticated()) return NextResponse.json({ error: 'Acesse sua conta.' }, { status: 401 })
    const { action, slot, expectedName, expectedPhone, name, phone } = await request.json()
    if (typeof slot !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(slot)) throw new Error('Horário inválido.')
    if (!['add','cancel','remove'].includes(action)) throw new Error('Ação inválida.')
    if (action === 'cancel' && (typeof expectedName !== 'string' || (expectedPhone !== null && typeof expectedPhone !== 'string'))) throw new Error('Dados da reserva inválidos.')
    let newName: string | null = null, newPhone: string | null = null
    if (action === 'add') {
      if (name !== undefined && typeof name !== 'string' || phone !== undefined && typeof phone !== 'string') throw new Error('Dados inválidos.')
      newName = typeof name === 'string' && name.trim() ? name.trim() : null
      const phoneText = typeof phone === 'string' ? phone.trim() : ''
      if (newName && (newName.length < 2 || newName.length > 100)) throw new Error('Nome inválido.')
      if (phoneText && (!newName || phoneText.length > 25 || !/^\d{10,11}$/.test(phoneText.replace(/\D/g, '')))) throw new Error('Telefone inválido.')
      newPhone = phoneText || null
    }
    let changed = false
    if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) {
      const { localDatabase } = await import('@/lib/scheduling-local'); const local = localDatabase()
      if (action === 'add') changed = Number(local.prepare('INSERT INTO appointments(slot,name,phone,created_at) VALUES (?,?,?,?) ON CONFLICT(slot) DO UPDATE SET enabled=1,name=excluded.name,phone=excluded.phone,created_at=excluded.created_at WHERE enabled=0 AND name IS NULL').run(slot,newName,newPhone,newName ? new Date().toISOString() : null).changes) > 0
      if (action === 'cancel') changed = Number(local.prepare('UPDATE appointments SET name=NULL, phone=NULL, email=NULL, created_at=NULL WHERE slot=? AND enabled=1 AND name=? AND phone IS ?').run(slot, expectedName, expectedPhone).changes) > 0
      if (action === 'remove') changed = Number(local.prepare('UPDATE appointments SET enabled=0 WHERE slot=? AND enabled=1 AND name IS NULL').run(slot).changes) > 0
    } else {
      await ready(); const sql = db()
      if (action === 'add') changed = (await sql`INSERT INTO priscilla_appointments (slot,name,phone,created_at) VALUES (${slot},${newName},${newPhone},${newName ? new Date().toISOString() : null}) ON CONFLICT (slot) DO UPDATE SET enabled=true,name=EXCLUDED.name,phone=EXCLUDED.phone,created_at=EXCLUDED.created_at WHERE priscilla_appointments.enabled=false AND priscilla_appointments.name IS NULL RETURNING slot`).length > 0
      if (action === 'cancel') changed = (await sql`UPDATE priscilla_appointments SET name=NULL, phone=NULL, email=NULL, created_at=NULL WHERE slot=${slot} AND enabled=true AND name=${expectedName} AND phone IS NOT DISTINCT FROM ${expectedPhone} RETURNING slot`).length > 0
      if (action === 'remove') changed = (await sql`UPDATE priscilla_appointments SET enabled=false WHERE slot=${slot} AND enabled=true AND name IS NULL RETURNING slot`).length > 0
    }
    if (!changed) return NextResponse.json({ error:'Este horário mudou desde a última atualização. Feche a janela e confira a agenda novamente.' }, { status:409 })
    return NextResponse.json({ ok:true })
  } catch { return NextResponse.json({ error: 'Não foi possível atualizar a agenda.' }, { status: 400 }) }
}
