import { authenticated } from '@/lib/cms/auth'
import Agenda from './view'
import Login from './login'
export const dynamic = 'force-dynamic'
export default async function Page() { return await authenticated() ? <Agenda /> : <Login /> }
