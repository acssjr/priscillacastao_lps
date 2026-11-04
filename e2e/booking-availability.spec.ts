import { test, expect } from '@playwright/test'

const slot = (time: string, reserved = false) => ({ slot: `2026-11-08T${time}`, reserved })

test('explica períodos sem horários e permite consultar outra data', async ({ page }) => {
  await page.route('**/api/agendamento', route => route.fulfill({ json: { slots: [slot('14:00'), slot('15:00')] } }))
  await page.goto('/agendar')
  await page.getByRole('button', { name: 'Ver horários' }).click()
  await expect(page.getByText('Nesta data, não foram abertos horários pela manhã.')).toBeVisible()
  await page.getByRole('button', { name: 'Consultar outra data' }).click()
  await expect(page.getByRole('heading', { name: 'Escolha uma data' })).toBeFocused()
})

test('mostra explicação e contato quando todos os horários estão indisponíveis', async ({ page }) => {
  await page.route('**/api/agendamento', route => route.fulfill({ json: { slots: [slot('09:00', true), slot('14:00', true)] } }))
  await page.goto('/agendar')
  await expect(page.getByText(/todos os horários cadastrados estão indisponíveis/)).toBeVisible()
  await page.getByRole('button', { name: 'Ver horários' }).click()
  await expect(page.getByText(/Os horários desta data estão indisponíveis/)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Conversar pelo WhatsApp' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeDisabled()
})

test('orienta a pessoa quando ainda não existem datas', async ({ page }) => {
  await page.route('**/api/agendamento', route => route.fulfill({ json: { slots: [] } }))
  await page.goto('/agendar')
  await expect(page.getByText(/Ainda não há horários cadastrados/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Ver horários' })).toBeDisabled()
  await expect(page.getByRole('link', { name: 'Conversar pelo WhatsApp' })).toBeVisible()
})

test('permite trocar o horário se outra pessoa o reservar durante o preenchimento', async ({ page }) => {
  let reserved = false
  await page.route('**/api/agendamento', async route => {
    if (route.request().method() === 'POST') { reserved = true; await route.fulfill({ status: 409, json: { error: 'Este horário não está mais disponível. Escolha outro.' } }); return }
    await route.fulfill({ json: { slots: [slot('14:00', reserved), slot('15:00')] } })
  })
  await page.goto('/agendar')
  await page.getByRole('button', { name: 'Ver horários' }).click()
  await page.getByRole('button', { name: '14:00' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByLabel('Nome completo').fill('Teste Local')
  await page.getByLabel('WhatsApp').fill('11999999999')
  await page.getByLabel('E-mail').fill('teste@example.com')
  await page.getByRole('button', { name: 'Confirmar agendamento' }).click()
  await expect(page.getByRole('alert').filter({ hasText: 'não está mais disponível' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Confirmar agendamento' })).toBeDisabled()
  await page.getByRole('button', { name: 'Escolher outro horário' }).click()
  await expect(page.getByRole('button', { name: /14:00/ })).toBeDisabled()
  await expect(page.getByRole('button', { name: '15:00' })).toBeEnabled()
})



test('informa quando o mês consultado não possui horários', async ({ page }) => {
  await page.route('**/api/agendamento', route => route.fulfill({ json: { slots: [slot('14:00')] } }))
  await page.goto('/agendar')
  await page.getByRole('button', { name: 'Próximo mês' }).click()
  await expect(page.getByText('Não há horários cadastrados neste mês. Consulte outro mês.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Ver horários' })).toBeDisabled()
})

test('recupera uma falha temporária ao consultar a disponibilidade', async ({ page }) => {
  let fail = true
  await page.route('**/api/agendamento', route => fail ? route.fulfill({ status: 503, json: { error: 'indisponível' } }) : route.fulfill({ json: { slots: [slot('14:00')] } }))
  await page.goto('/agendar')
  await expect(page.getByText(/Não foi possível carregar os horários/)).toBeVisible()
  fail = false
  await page.evaluate(() => window.dispatchEvent(new Event('focus')))
  await expect(page.getByRole('button', { name: 'Ver horários' })).toBeEnabled()
  await expect(page.getByText(/Não foi possível carregar os horários/)).toHaveCount(0)
})
