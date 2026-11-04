import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Agende sua aula de forró com Priscilla Castão em Feira de Santana'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const [background, logo, font] = await Promise.all([
    readFile(join(process.cwd(), 'app/agendar/share-background.jpg')),
    readFile(join(process.cwd(), 'app/agendar/share-logo.png')),
    readFile(join(process.cwd(), 'app/proposta-priscilla/fonts/Saans-Bold.otf')),
  ])
  const bg = `data:image/jpeg;base64,${background.toString('base64')}`
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`
  return new ImageResponse(
    <div style={{ display:'flex', position:'relative', width:'100%', height:'100%', color:'#fae9d8', fontFamily:'Saans' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bg} alt="" width={1200} height={630} style={{ position:'absolute', inset:0 }} />
      <div style={{ display:'flex', position:'absolute', left:735, top:220, width:300, flexDirection:'column', transform:'rotate(4deg)', opacity:.48 }}>
        <div style={{ display:'flex', width:105, height:7, background:'#713c2c', borderRadius:4, marginBottom:24 }} />
        {[0,1,2,3,4].map(row => <div key={row} style={{ display:'flex', gap:25, marginBottom:20 }}>{[0,1,2,3,4,5,6].map(col => <div key={col} style={{ display:'flex', width:14, height:14, borderRadius:7, background:row === 1 && col === 3 ? '#9e4a30' : '#a98b79' }} />)}</div>)}
      </div>
      <div style={{ display:'flex', flexDirection:'column', position:'absolute', left:72, top:64, width:530, height:502 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={274} height={69} style={{ objectFit:'contain', objectPosition:'left center' }} />
        <div style={{ display:'flex', flexDirection:'column', marginTop:76, fontSize:60, fontWeight:700, lineHeight:1.05, letterSpacing:-2.2 }}><span>Agende sua</span><span>aula de forró</span></div>
        <div style={{ display:'flex', marginTop:24, fontSize:25, lineHeight:1.35, color:'#efd0b8' }}>Escolha seu horário com Priscilla</div>
        <div style={{ display:'flex', alignItems:'center', marginTop:'auto', fontSize:20, color:'#f3d5c3', letterSpacing:.3 }}>Feira de Santana, BA</div>
      </div>
    </div>,
    { ...size, fonts:[{ name:'Saans', data:font, style:'normal', weight:700 }] },
  )
}

