import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('booking steps keep keyboard focus and have no serious automated accessibility violations', async ({ page }) => {
  await page.goto('/agendar')
  await expect(page.getByRole('button', { name: 'Ver horários' })).toBeEnabled()
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  expect(results.violations.filter(item => item.impact === 'critical' || item.impact === 'serious')).toEqual([])
  await page.getByRole('button', { name: 'Ver horários' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Escolha um horário' })).toBeFocused()
  const timeResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  expect(timeResults.violations.filter(item => item.impact === 'critical' || item.impact === 'serious')).toEqual([])
  await page.getByRole('button', { name: '14:00' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await expect(page.getByRole('heading', { name: 'Confirme sua aula' })).toBeFocused()
  const formResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  expect(formResults.violations.filter(item => item.impact === 'critical' || item.impact === 'serious')).toEqual([])
  await page.getByRole('button', { name: 'Voltar para horários' }).click()
  await page.getByRole('button', { name: 'Voltar para datas' }).click()
  await expect(page.getByRole('heading', { name: 'Escolha uma data' })).toBeFocused()
})
