import type { Metadata } from 'next'
import Booking from './booking'
const base = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://priscillacastao-lps.vercel.app')
export const metadata: Metadata = {
  metadataBase: base,
  title: 'Agende sua aula | Priscilla Castão',
  description: 'Escolha uma data e um horário para sua aula de forró com Priscilla em Feira de Santana.',
  openGraph: { title: 'Agende sua aula | Priscilla Castão', description: 'Escolha seu horário para uma aula de forró em Feira de Santana.', url:'/agendar', siteName:'Priscilla Castão', locale:'pt_BR', type:'website' },
  twitter: { card:'summary_large_image', title:'Agende sua aula | Priscilla Castão', description:'Escolha seu horário para uma aula de forró em Feira de Santana.' },
}
export default function Page() { return <Booking /> }
