import type { Metadata } from 'next'
import { getBookingSettings } from '@/lib/scheduling-service'
import { DEFAULT_BOOKING_SITE_URL } from '@/lib/whatsapp'
import Booking from './booking'

const base = new URL(DEFAULT_BOOKING_SITE_URL)
const shareImage = `${DEFAULT_BOOKING_SITE_URL}/brand/agendamento-preview-v3.jpg`

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBookingSettings()
  const description = `Escolha uma data e um horário para sua aula de forró com Priscilla em ${settings.city}.`
  const shortDescription = `Escolha seu horário para uma aula de forró em ${settings.city}.`

  return {
    metadataBase: base,
    title: 'Agende sua aula | Priscilla Castão',
    description,
    openGraph: {
      title: 'Agende sua aula | Priscilla Castão',
      description: shortDescription,
      url: '/',
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: `Agende sua aula de forró com Priscilla Castão em ${settings.city}`,
        },
      ],
      siteName: 'Priscilla Castão',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Agende sua aula | Priscilla Castão',
      description: shortDescription,
      images: [shareImage],
    },
  }
}

export default function Page() {
  return <Booking />
}
