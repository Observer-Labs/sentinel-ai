import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppAlert } from '@/lib/notifications/whatsapp'

export async function POST(req: NextRequest) {
  const { whatsappNumber, alert } = await req.json()
  if (!whatsappNumber || !alert) {
    return NextResponse.json({ error: 'Missing whatsappNumber or alert' }, { status: 400 })
  }

  const result = await sendWhatsAppAlert(whatsappNumber, alert)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  return NextResponse.json({ sent: true })
}
