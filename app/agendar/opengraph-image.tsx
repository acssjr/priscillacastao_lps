import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Agende sua aula de forró com Priscilla Castão em Feira de Santana'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const [background, logo, font] = await Promise.all([
    readFile(join(process.cwd(), 'app/agendar/share-calendar.jpg')),
    readFile(join(process.cwd(), 'app/agendar/share-logo.png')),
    readFile(join(process.cwd(), 'app/proposta-priscilla/fonts/Saans-Bold.otf')),
  ])
  const bg = `data:image/jpeg;base64,${background.toString('base64')}`
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`
  return new ImageResponse(
    <div style={{ display:'flex', position:'relative', width:'100%', height:'100%', color:'#fae9d8', fontFamily:'Saans' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bg} alt="" width={1200} height={630} style={{ position:'absolute', inset:0 }} />
      <div style={{ display:'flex', flexDirection:'column', position:'absolute', left:72, top:64, width:530, height:502 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={274} height={69} style={{ objectFit:'contain', objectPosition:'left center' }} />
        <div style={{ display:'flex', flexDirection:'column', marginTop:76, fontSize:60, fontWeight:700, lineHeight:1.05, letterSpacing:-2.2 }}><span>Agende sua</span><span>aula de forró</span></div>
        <div style={{ display:'flex', marginTop:24, fontSize:25, lineHeight:1.35, color:'#efd0b8' }}>Escolha data e horário</div>
      </div>
    </div>,
    { ...size, fonts:[{ name:'Saans', data:font, style:'normal', weight:700 }] },
  )
}

