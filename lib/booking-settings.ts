export type BookingSettings = {
  whatsappPhone: string
  city: string
  locationNote: string
  confirmationNote: string
  confirmationMessage: string
  inquiryMessage: string
  adminReplyMessage: string
  welcomeTitle: string
  welcomeSubtitle: string
  publicNotice: string
  bookingEnabled: boolean
}

export const DEFAULT_BOOKING_SETTINGS: BookingSettings = {
  whatsappPhone: '5577998422026',
  city: 'Feira de Santana',
  locationNote: 'Local a combinar',
  confirmationNote: 'O local será combinado.',
  confirmationMessage:
    'Oi, Priscilla! Sou {nome}. Acabei de agendar minha aula em {cidade} para {data}, às {hora}.',
  inquiryMessage:
    'Oi, Priscilla! Vim pela sua página de links e gostaria de saber mais sobre suas aulas de forró.',
  adminReplyMessage:
    'Oi, {nome}! Aqui é a Priscilla Castão. Recebi seu agendamento de aula para {data}, às {hora} ({cidade}). Vamos combinar os detalhes?',
  welcomeTitle: 'Agende sua aula com Priscilla.',
  welcomeSubtitle: 'Escolha uma data e um horário para sua aula de forró.',
  publicNotice: '',
  bookingEnabled: true,
}

export function normalizeBookingPhone(value: string): string | null {
  const digits = value.replace(/\D/g, '')
  const withCountry = digits.length === 10 || digits.length === 11 ? `55${digits}` : digits
  if (!/^55\d{10,11}$/.test(withCountry)) return null
  return withCountry
}

export function formatBookingPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('55') && digits.length > 11) digits = digits.slice(2)
  digits = digits.slice(0, 11)
  if (digits.length <= 2) return digits ? `(${digits}` : ''
  const area = digits.slice(0, 2)
  const number = digits.slice(2)
  const split = number.length > 8 ? 5 : 4
  return `(${area}) ${number.slice(0, split)}${number.length > split ? `-${number.slice(split)}` : ''}`
}

function cleanText(value: unknown, fallback: string, maxLength: number, allowEmpty = false): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  if (!trimmed && !allowEmpty) return fallback
  return trimmed.slice(0, maxLength)
}

export function sanitizeBookingSettings(raw: unknown): BookingSettings {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_BOOKING_SETTINGS }
  const obj = raw as Record<string, unknown>
  const normalizedPhone =
    typeof obj.whatsappPhone === 'string' ? normalizeBookingPhone(obj.whatsappPhone) : null

  return {
    whatsappPhone: normalizedPhone || DEFAULT_BOOKING_SETTINGS.whatsappPhone,
    city: cleanText(obj.city, DEFAULT_BOOKING_SETTINGS.city, 80),
    locationNote: cleanText(obj.locationNote, DEFAULT_BOOKING_SETTINGS.locationNote, 120),
    confirmationNote: cleanText(obj.confirmationNote, DEFAULT_BOOKING_SETTINGS.confirmationNote, 200),
    confirmationMessage: cleanText(
      obj.confirmationMessage,
      DEFAULT_BOOKING_SETTINGS.confirmationMessage,
      1000,
    ),
    inquiryMessage: cleanText(obj.inquiryMessage, DEFAULT_BOOKING_SETTINGS.inquiryMessage, 1000),
    adminReplyMessage: cleanText(
      obj.adminReplyMessage,
      DEFAULT_BOOKING_SETTINGS.adminReplyMessage,
      1000,
    ),
    welcomeTitle: cleanText(obj.welcomeTitle, DEFAULT_BOOKING_SETTINGS.welcomeTitle, 120),
    welcomeSubtitle: cleanText(obj.welcomeSubtitle, DEFAULT_BOOKING_SETTINGS.welcomeSubtitle, 240),
    publicNotice: cleanText(obj.publicNotice, DEFAULT_BOOKING_SETTINGS.publicNotice, 300, true),
    bookingEnabled:
      typeof obj.bookingEnabled === 'boolean'
        ? obj.bookingEnabled
        : DEFAULT_BOOKING_SETTINGS.bookingEnabled,
  }
}

export function validateBookingSettingsInput(
  raw: unknown,
): { ok: true; settings: BookingSettings } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Dados de configuração inválidos.' }
  }
  const obj = raw as Record<string, unknown>
  const rawPhone = typeof obj.whatsappPhone === 'string' ? obj.whatsappPhone : ''
  const normalizedPhone = normalizeBookingPhone(rawPhone)
  if (!normalizedPhone) {
    return { ok: false, error: 'Informe um WhatsApp de atendimento válido com DDD (ex: 77 99842-2026).' }
  }

  const requiredFields: Array<[keyof BookingSettings, string, number]> = [
    ['city', 'Informe a cidade ou região das aulas.', 80],
    ['locationNote', 'Informe a observação curta de local.', 120],
    ['confirmationNote', 'Informe a frase de confirmação de local.', 200],
    ['confirmationMessage', 'Informe a mensagem de confirmação do WhatsApp.', 1000],
    ['inquiryMessage', 'Informe a mensagem de contato para novos horários.', 1000],
    ['adminReplyMessage', 'Informe a mensagem padrão para responder aos alunos.', 1000],
    ['welcomeTitle', 'Informe o título de boas-vindas da página.', 120],
    ['welcomeSubtitle', 'Informe o subtítulo de boas-vindas da página.', 240],
  ]

  for (const [key, errorMsg, maxLen] of requiredFields) {
    const val = obj[key]
    if (typeof val !== 'string' || val.trim().length < 2) {
      return { ok: false, error: errorMsg }
    }
    if (val.trim().length > maxLen) {
      return { ok: false, error: `O campo excede o limite de ${maxLen} caracteres.` }
    }
  }

  if (typeof obj.publicNotice === 'string' && obj.publicNotice.trim().length > 300) {
    return { ok: false, error: 'O aviso opcional deve ter no máximo 300 caracteres.' }
  }

  return {
    ok: true,
    settings: sanitizeBookingSettings({
      ...obj,
      whatsappPhone: normalizedPhone,
    }),
  }
}

export type BookingMessageVars = {
  name?: string
  date?: string
  time?: string
  timeRange?: string
  city?: string
  locationNote?: string
}

export function formatBookingMessage(template: string, vars: BookingMessageVars): string {
  const base = template.trim() || DEFAULT_BOOKING_SETTINGS.confirmationMessage
  const replacements: Record<string, string> = {
    nome: vars.name?.trim() || '',
    cliente: vars.name?.trim() || '',
    aluno: vars.name?.trim() || '',
    data: vars.date?.trim() || '',
    dia: vars.date?.trim() || '',
    hora: vars.time?.trim() || '',
    horario: vars.time?.trim() || '',
    horário: vars.time?.trim() || '',
    intervalo: vars.timeRange?.trim() || vars.time?.trim() || '',
    cidade: vars.city?.trim() || DEFAULT_BOOKING_SETTINGS.city,
    local: vars.locationNote?.trim() || DEFAULT_BOOKING_SETTINGS.locationNote,
  }

  return base.replace(
    /\{(nome|cliente|aluno|data|dia|hora|horario|horário|intervalo|cidade|local)\}/gi,
    (match, token: string) => {
      const key = token.toLowerCase()
      return key in replacements ? replacements[key] : match
    },
  )
}

export function buildBookingWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizeBookingPhone(phone) || DEFAULT_BOOKING_SETTINGS.whatsappPhone
  const text = message.trim()
  return `https://wa.me/${normalized}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}
