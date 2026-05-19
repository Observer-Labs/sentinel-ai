import { NextRequest, NextResponse } from 'next/server'
import { sendAlertEmail } from '@/lib/notifications/email'

export async function POST(req: NextRequest) {
  const { userId, alert } = await req.json()
  if (!userId || !alert) {
    return NextResponse.json({ error: 'Missing userId or alert' }, { status: 400 })
  }

  const result = await sendAlertEmail(userId, alert)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  return NextResponse.json({ sent: true })
}
