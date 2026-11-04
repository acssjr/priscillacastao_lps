import { neon } from '@neondatabase/serverless'

export const initial = ['2026-11-08T14:00','2026-11-08T15:00','2026-11-08T16:00','2026-11-09T09:00','2026-11-09T10:00','2026-11-09T11:00','2026-11-09T14:00','2026-11-09T15:00','2026-11-09T16:00','2026-11-10T09:00','2026-11-10T10:00','2026-11-10T11:00']
export function db() {
  if (!process.env.DATABASE_URL) throw new Error('O agendamento ainda não foi configurado. Tente novamente mais tarde.')
  return neon(process.env.DATABASE_URL)
}
let initialization: Promise<void> | undefined
export async function ready() {
  initialization ??= (async () => {
    const sql = db()
    await sql`CREATE TABLE IF NOT EXISTS priscilla_appointments (slot text PRIMARY KEY, name text, phone text, email text, created_at timestamptz, enabled boolean NOT NULL DEFAULT true)`
    for (const slot of initial) await sql`INSERT INTO priscilla_appointments(slot) VALUES (${slot}) ON CONFLICT DO NOTHING`
  })()
  try { await initialization } catch (error) { initialization = undefined; throw error }
}
