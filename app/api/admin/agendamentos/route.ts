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
    const { action, slot } = await request.json()
    if (typeof slot !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(slot)) throw new Error('Horário inválido.')
    if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) { const { localDatabase } = await import('@/lib/scheduling-local'); const local = localDatabase(); if (action === 'add') local.prepare('INSERT INTO appointments(slot) VALUES (?) ON CONFLICT(slot) DO UPDATE SET enabled=1').run(slot); else if (action === 'cancel') local.prepare('UPDATE appointments SET name=NULL, phone=NULL, email=NULL, created_at=NULL WHERE slot=?').run(slot); else if (action === 'remove') local.prepare('UPDATE appointments SET enabled=0 WHERE slot=? AND name IS NULL').run(slot); else throw new Error('Ação inválida.'); return NextResponse.json({ ok:true }) }
    await ready(); const sql = db()
    if (action === 'add') await sql`INSERT INTO priscilla_appointments (slot) VALUES (${slot}) ON CONFLICT (slot) DO UPDATE SET enabled=true`
    else if (action === 'cancel') await sql`UPDATE priscilla_appointments SET name=NULL, phone=NULL, email=NULL, created_at=NULL WHERE slot=${slot}`
    else if (action === 'remove') await sql`UPDATE priscilla_appointments SET enabled=false WHERE slot=${slot} AND name IS NULL`
    else throw new Error('Ação inválida.')
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ error: 'Não foi possível atualizar a agenda.' }, { status: 400 }) }
}
