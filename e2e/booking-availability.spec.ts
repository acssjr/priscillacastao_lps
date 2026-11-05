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
  await expect(page.getByRole('button', { name: /8 de novembro de 2026, horários indisponíveis/ })).toBeDisabled()
  await expect(page.getByRole('link', { name: 'Conversar pelo WhatsApp' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Ver horários' })).toBeDisabled()
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
  await expect(page.getByText('Não há horários disponíveis neste mês. Consulte outro mês.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Ver horários' })).toBeDisabled()
})

test('recupera uma falha temporária ao consultar a disponibilidade', async ({ page }) => {
  let fail = true
  await page.route('**/api/agendamento', route => fail ? route.fulfill({ status: 503, json: { error: 'indisponível' } }) : route.fulfill({ json: { slots: [slot('14:00')] } }))
  await page.goto('/agendar')
  await expect(page.getByText(/Não foi possível atualizar os horários/)).toBeVisible()
  fail = false
  await page.evaluate(() => window.dispatchEvent(new Event('focus')))
  await expect(page.getByRole('button', { name: 'Ver horários' })).toBeEnabled()
  await expect(page.getByText(/Não foi possível atualizar os horários/)).toHaveCount(0)
})


test('confirma com nome e WhatsApp e prepara a mensagem sem enviá-la', async ({ page }) => {
  let posted: Record<string, unknown> | undefined
  await page.route('**/api/agendamento', async route => {
    if (route.request().method() === 'POST') { posted = route.request().postDataJSON(); await route.fulfill({ json: { ok: true, receipt: {slot:'2026-11-08T14:00',status:'confirmed',booking_id:'test-booking'} } }); return }
    await route.fulfill({ json: { slots: [slot('14:00')] } })
  })
  await page.goto('/agendar')
  await page.getByRole('button', { name: 'Ver horários' }).click()
  await page.getByRole('button', { name: '14:00' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await expect(page.getByLabel('E-mail')).toHaveCount(0)
  await page.getByLabel('Nome completo').fill('Ana Lima')
  await page.getByLabel('WhatsApp').fill('+55 (75) 99999-9999')
  await expect(page.getByLabel('WhatsApp')).toHaveValue('(75) 99999-9999')
  await page.getByRole('button', { name: 'Confirmar agendamento' }).click()
  await expect(page.getByRole('heading', { name: 'Agendamento confirmado!' })).toBeVisible()
  expect(posted).toMatchObject({ slot: '2026-11-08T14:00', name: 'Ana Lima', phone: '(75) 99999-9999' })
  const url = new URL((await page.getByRole('link', { name: 'Enviar mensagem no WhatsApp' }).getAttribute('href'))!)
  expect(url.hostname).toBe('wa.me')
  expect(url.searchParams.get('text')).toContain('Ana Lima')
  expect(url.searchParams.get('text')).toContain('08/11/2026, às 14:00')
})


test('abre no primeiro mês com vaga e identifica data esgotada', async ({ page }) => {
  await page.route('**/api/agendamento', route => route.fulfill({ json: { slots: [
    { slot: '2027-02-03T10:00', reserved: true },
    { slot: '2027-03-04T15:00', reserved: false },
    { slot: '2027-03-05T15:00', reserved: true },
  ] } }))
  await page.goto('/agendar')
  await expect(page.getByText('março de 2027')).toBeVisible()
  await expect(page.getByRole('button', { name: /4 de março de 2027, horários disponíveis/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: /5 de março de 2027, horários indisponíveis/ })).toBeDisabled()
  await expect(page.getByText('Disponível',{exact:true})).toBeVisible()
})


test('aplica mensagem personalizada, cidade e WhatsApp configurados pela gestora', async ({ page }) => {
  await page.route('**/api/agendamento', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ json: { ok: true, receipt: { slot: '2026-11-08T14:00', status: 'confirmed', booking_id: 'custom-booking' } } })
      return
    }
    await route.fulfill({
      json: {
        slots: [slot('14:00')],
        settings: {
          whatsappPhone: '5577998422026',
          city: 'Salvador',
          locationNote: 'Estúdio no Rio Vermelho',
          confirmationNote: 'Te espero no estúdio no Rio Vermelho!',
          confirmationMessage: 'Olá Priscilla! Aqui é {nome}. Reservei aula em {cidade} ({local}) para {data} às {hora}.',
          inquiryMessage: 'Oi Priscilla! Quero saber sobre vagas em {cidade}.',
          adminReplyMessage: 'Oi {nome}!',
          welcomeTitle: 'Agende sua aula com Priscilla.',
          welcomeSubtitle: 'Escolha uma data e um horário para sua aula de forró.',
          publicNotice: '',
          bookingEnabled: true,
        },
      },
    })
  })
  await page.goto('/agendar')
  await page.getByRole('button', { name: 'Ver horários' }).click()
  await page.getByRole('button', { name: '14:00' }).click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await expect(page.getByText('Sua aula em Salvador')).toBeVisible()
  await expect(page.getByText('Estúdio no Rio Vermelho')).toBeVisible()
  await page.getByLabel('Nome completo').fill('Bruno Costa')
  await page.getByLabel('WhatsApp').fill('77988887777')
  await page.getByRole('button', { name: 'Confirmar agendamento' }).click()
  await expect(page.getByText('Te espero no estúdio no Rio Vermelho!')).toBeVisible()
  const url = new URL((await page.getByRole('link', { name: 'Enviar mensagem no WhatsApp' }).getAttribute('href'))!)
  expect(url.pathname).toBe('/5577998422026')
  expect(url.searchParams.get('text')).toBe(
    'Olá Priscilla! Aqui é Bruno Costa. Reservei aula em Salvador (Estúdio no Rio Vermelho) para 08/11/2026 às 14:00.',
  )
})
