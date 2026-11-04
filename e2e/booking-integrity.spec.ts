import { test,expect } from '@playwright/test'
const slot='2035-11-08T14:00'
test('resposta antiga não reabre um horário ocupado',async({page})=>{
 let count=0,release:()=>void=()=>{};const held=new Promise<void>(r=>release=r)
 await page.route('**/api/agendamento',async r=>{const n=++count;if(n===2)await held;await r.fulfill({json:{slots:[{slot,reserved:n>=3}]}})})
 await page.goto('/agendar');await page.getByRole('button',{name:'Ver horários'}).click();await page.evaluate(()=>dispatchEvent(new Event('focus')));await expect.poll(()=>count).toBe(2);await page.evaluate(()=>dispatchEvent(new Event('focus')));await expect(page.getByRole('button',{name:'14:00'})).toBeDisabled();release();await page.waitForTimeout(150);await expect(page.getByRole('button',{name:'14:00'})).toBeDisabled()
})
test('recupera gravação com resposta perdida e conserva resultado ao recarregar',async({page})=>{
 let reserved=false,key=''
 await page.route('**/api/agendamento',async r=>{
 if(r.request().method()==='POST'){const body=r.request().postDataJSON();if(body.action==='recover'){expect(body.requestId).toBe(key);await r.fulfill({json:{receipt:reserved?{slot,status:'confirmed',booking_id:'receipt-test'}:null}})}else{key=body.requestId;reserved=true;await r.abort('failed')}return}
 await r.fulfill({json:{slots:[{slot,reserved}]}})
 })
 await page.goto('/agendar');await page.getByRole('button',{name:'Ver horários'}).click();await page.getByRole('button',{name:'14:00'}).click();await page.getByRole('button',{name:'Continuar'}).click();await page.getByLabel('Nome completo').fill('Teste Cliente');await page.getByLabel('WhatsApp').fill('71999999999');await page.getByRole('button',{name:'Confirmar agendamento'}).click();await expect(page.getByRole('button',{name:'Verificar confirmação'})).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Agendamento confirmado!'})).toBeVisible();expect(reserved).toBe(true)
})
test('envio pendente bloqueia navegação e edição',async({page})=>{
 let release:()=>void=()=>{};const held=new Promise<void>(r=>release=r)
 await page.route('**/api/agendamento',async r=>{if(r.request().method()==='POST'){await held;await r.fulfill({json:{receipt:{slot,status:'confirmed',booking_id:'test'}}})}else await r.fulfill({json:{slots:[{slot,reserved:false}]}})})
 await page.goto('/agendar');await page.getByRole('button',{name:'Ver horários'}).click();await page.getByRole('button',{name:'14:00'}).click();await page.getByRole('button',{name:'Continuar'}).click();await page.getByLabel('Nome completo').fill('Teste Cliente');await page.getByLabel('WhatsApp').fill('71999999999');await page.getByRole('button',{name:'Confirmar agendamento'}).click();await expect(page.getByRole('button',{name:'Voltar para horários',exact:true})).toBeDisabled();await expect(page.getByLabel('Nome completo')).toBeDisabled();release();await expect(page.getByRole('heading',{name:'Agendamento confirmado!'})).toBeVisible()
})
