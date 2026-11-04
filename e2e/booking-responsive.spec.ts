import { test, expect } from '@playwright/test'
const sizes = [{width:320,height:568},{width:360,height:640},{width:375,height:667},{width:360,height:700},{width:390,height:740},{width:393,height:780},{width:390,height:844},{width:430,height:932},{width:580,height:672},{width:768,height:1024},{width:1024,height:768},{width:1280,height:800},{width:1440,height:900}]
for (const size of sizes) test(`ação principal acessível em ${size.width}x${size.height}`, async ({ page }) => {
  await page.setViewportSize(size)
  await page.route('**/api/agendamento', route => route.fulfill({ json: { slots: [{slot:'2026-11-08T14:00',reserved:false},{slot:'2026-11-08T15:00',reserved:false}] } }))
  await page.goto('/agendar')
  async function fits(name:string) {
    await page.evaluate(() => window.scrollTo(0,0))
    const button = page.getByRole('button', { name, exact:true })
    await expect(button).toBeVisible()
    await button.scrollIntoViewIfNeeded()
    const box = await button.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y + box!.height).toBeLessThanOrEqual(size.height + 1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
  }
  const dateButton = page.getByRole('button', { name: /8 de novembro de 2026, horários disponíveis/ })
  await expect(dateButton).toBeVisible()
  const dateBox = await dateButton.boundingBox()
  expect(dateBox!.width).toBeGreaterThanOrEqual(44)
  expect(dateBox!.height).toBeGreaterThanOrEqual(44)
  await fits('Ver horários')
  await page.getByRole('button', { name:'Ver horários' }).click()
  await expect(page.getByRole('heading', {name:'Escolha um horário'})).toBeVisible()
  await fits('Continuar')
  await page.getByRole('button', {name:'14:00'}).click()
  await page.getByRole('button', {name:'Continuar',exact:true}).click()
  await expect(page.getByRole('heading', {name:'Confirme sua aula'})).toBeVisible()
  await fits('Confirmar agendamento')
})


test('calendário de seis semanas mantém a ação acessível em celular pequeno', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.route('**/api/agendamento', route => route.fulfill({ json: { slots: [{slot:'2026-11-08T14:00',reserved:false},{slot:'2027-01-15T14:00',reserved:false}] } }))
  await page.goto('/agendar')
  await page.getByRole('button', { name: 'Próximo mês' }).click()
  await page.getByRole('button', { name: 'Próximo mês' }).click()
  await page.getByRole('button', { name: /15 de janeiro de 2027, horários disponíveis/ }).click()
  const button = page.getByRole('button', { name: 'Ver horários' })
  await expect(button).toBeEnabled()
  await button.scrollIntoViewIfNeeded()
  const box = await button.boundingBox()
  expect(box!.y + box!.height).toBeLessThanOrEqual(568)
})

test('círculo da data permanece redondo e centralizado em diferentes telas', async ({ page }) => {
  await page.route('**/api/agendamento', route => route.fulfill({ json: { slots: [{slot:'2026-11-08T14:00',reserved:false}] } }))
  for (const width of [320, 360, 430, 768, 1024, 1440]) {
    await page.setViewportSize({width,height:700})
    await page.goto('/agendar')
    const date = page.getByRole('button', { name: /8 de novembro de 2026, horários disponíveis/ })
    await expect(date).toHaveAttribute('aria-pressed', 'true')
    await page.locator('[class*=stepContent]').evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished.catch(() => undefined))))
    const metrics = await date.evaluate(element => {
      const rect = element.getBoundingClientRect(), range = document.createRange()
      range.selectNodeContents(element)
      const text = range.getBoundingClientRect(), after = getComputedStyle(element, '::after')
      return { width:rect.width, height:rect.height, dx:Math.abs((rect.left+rect.right-text.left-text.right)/2), dy:Math.abs((rect.top+rect.bottom-text.top-text.bottom)/2), after:after.content }
    })
    expect(metrics.width).toBe(44); expect(metrics.height).toBe(44)
    expect(metrics.dx).toBeLessThan(2); expect(metrics.dy).toBeLessThan(3)
    expect(['none','normal']).toContain(metrics.after)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})
