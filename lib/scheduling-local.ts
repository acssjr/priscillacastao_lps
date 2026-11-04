import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { initial } from './scheduling'

let connection: DatabaseSync | undefined
export function localDatabase() {
  if (process.env.NODE_ENV === 'production') throw new Error('Configure DATABASE_URL em produção.')
  if (connection) return connection
  const directory = process.env.CMS_DATA_DIRECTORY || path.join(process.cwd(), '.cms')
  mkdirSync(directory, { recursive: true })
  const db = new DatabaseSync(path.join(directory, 'appointments.sqlite'))
  db.exec('PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS appointments (slot TEXT PRIMARY KEY, name TEXT, phone TEXT, email TEXT, created_at TEXT, enabled INTEGER NOT NULL DEFAULT 1)')
  const seed = db.prepare('INSERT OR IGNORE INTO appointments(slot) VALUES (?)')
  for (const slot of initial) seed.run(slot)
  connection = db
  return db
}
export function nowInBrazil() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone:'America/Sao_Paulo', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23' }).format(new Date()).replace(' ', 'T')
}
