import { redirect } from 'next/navigation'
import { authenticated } from '@/lib/cms/auth'
import Agenda from './view'
export const dynamic = 'force-dynamic'
export default async function Page() { if (!await authenticated()) redirect('/admin'); return <Agenda /> }
