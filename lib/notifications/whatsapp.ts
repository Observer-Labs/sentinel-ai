import type { Alert } from '@/types'

const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID!
const ACCESS_TOKEN = process.env.META_WHATSAPP_ACCESS_TOKEN!
const API_URL = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`

export async function sendWhatsAppAlert(
  whatsappNumber: string,
  alert: Alert
): Promise<{ success: boolean; error?: string }> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    return { success: false, error: 'WhatsApp not configured (missing META_PHONE_NUMBER_ID or META_WHATSAPP_ACCESS_TOKEN)' }
  }

  try {
    const to = whatsappNumber.replace(/\D/g, '')

    const body = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: 'sentinel_alert',
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: alert.title },
              { type: 'text', text: alert.severity.toUpperCase() },
              { type: 'text', text: alert.description ?? 'No additional details.' },
            ],
          },
        ],
      },
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      const errMsg = data?.error?.message ?? 'WhatsApp API error'
      return { success: false, error: errMsg }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export async function sendWhatsAppText(
  whatsappNumber: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    return { success: false, error: 'WhatsApp not configured' }
  }

  try {
    const to = whatsappNumber.replace(/\D/g, '')

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      return { success: false, error: data?.error?.message ?? 'WhatsApp API error' }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
