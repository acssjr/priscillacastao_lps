import { test, expect } from '@playwright/test'
const sizes = [{width:320,height:568},{width:360,height:640},{width:375,height:667},{width:390,height:844},{width:430,height:932},{width:580,height:672},{width:768,height:1024},{width:1024,height:768},{width:1280,height:800},{width:1440,height:900}]
for (const size of sizes) test(`ação principal visível em ${size.width}x${size.height}`, async ({ page }) => {
  await page.setViewportSize(size)
  await page.route('**/api/agendamento', route => route.fulfill({ json: { slots: [{slot:'2026-11-08T14:00',reserved:false},{slot:'2026-11-08T15:00',reserved:false}] } }))
  await page.goto('/agendar')
  async function fits(name:string) {
    await page.evaluate(() => window.scrollTo(0,0))
    const button = page.getByRole('button', { name, exact:true })
    await expect(button).toBeVisible()
    const box = await button.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y + box!.height).toBeLessThanOrEqual(size.height)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
  }
  await fits('Ver horários')
  await page.getByRole('button', { name:'Ver horários' }).click()
  await expect(page.getByRole('heading', {name:'Escolha um horário'})).toBeVisible()
  await fits('Continuar')
  await page.getByRole('button', {name:'14:00'}).click()
  await page.getByRole('button', {name:'Continuar',exact:true}).click()
  await expect(page.getByRole('heading', {name:'Confirme sua aula'})).toBeVisible()
  await fits('Confirmar agendamento')
})
