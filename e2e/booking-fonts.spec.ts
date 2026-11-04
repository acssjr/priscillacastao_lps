import { test, expect, type Page } from '@playwright/test'

async function expectSaans(page: Page, family: string) {
  await page.evaluate(() => document.fonts.ready)
  const result = await page.locator('main').evaluate((main, expected) => {
    const failures = Array.from(main.querySelectorAll<HTMLElement>('*')).filter(element => {
      const visible = element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden'
      const hasText = Array.from(element.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      const isField = element.matches('input, textarea, select')
      return visible && (hasText || isField) && !getComputedStyle(element).fontFamily.toLowerCase().includes(expected.toLowerCase())
    }).map(element => ({tag:element.tagName, text:element.textContent?.trim().slice(0,30), family:getComputedStyle(element).fontFamily}))
    return { failures, loaded: document.fonts.check(`400 16px ${expected}`) && document.fonts.check(`700 16px ${expected}`) }
  }, family)
  expect(result.failures).toEqual([])
  expect(result.loaded).toBe(true)
}

test('Saans é usada em todas as etapas públicas e nos controles', async ({ page }) => {
  await page.route('**/api/agendamento', route => route.fulfill({ json: { slots: [{slot:'2026-11-08T14:00',reserved:false}] } }))
  await page.goto('/agendar')
  await expect(page.getByRole('button',{name:'Ver horários'})).toBeEnabled()
  await expectSaans(page,'Saans')
  await page.getByRole('button',{name:'Ver horários'}).click()
  await expect(page.getByRole('heading',{name:'Escolha um horário'})).toBeVisible()
  await expectSaans(page,'Saans')
  await page.getByRole('button',{name:'14:00'}).click()
  await page.getByRole('button',{name:'Continuar'}).click()
  await expect(page.getByRole('heading',{name:'Confirme sua aula'})).toBeVisible()
  await expectSaans(page,'Saans')
})

test('login da agenda usa Saans nos textos e campos', async ({ page }) => {
  await page.goto('/admin/agendamentos')
  await expect(page.getByRole('heading',{name:/Sua agenda/})).toBeVisible()
  await expectSaans(page,'SaansLogin')
})
