import type { Metadata } from 'next'
import Booking from './booking'
const base = new URL('https://agendamento-priscilla.vercel.app')
const shareImage = 'https://agendamento-priscilla.vercel.app/agendar/opengraph-image?v=2'
export const metadata: Metadata = {
  metadataBase: base,
  title: 'Agende sua aula | Priscilla Castão',
  description: 'Escolha uma data e um horário para sua aula de forró com Priscilla em Feira de Santana.',
  openGraph: { title: 'Agende sua aula | Priscilla Castão', description: 'Escolha seu horário para uma aula de forró em Feira de Santana.', url:'/', images: [{ url: shareImage, width: 1200, height: 630, alt: 'Agende sua aula de forró com Priscilla Castão' }], siteName:'Priscilla Castão', locale:'pt_BR', type:'website' },
  twitter: { card:'summary_large_image', title:'Agende sua aula | Priscilla Castão', description:'Escolha seu horário para uma aula de forró em Feira de Santana.', images: [shareImage] },
}
export default function Page() { return <Booking /> }
