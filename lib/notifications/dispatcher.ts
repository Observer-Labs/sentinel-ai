import { createServiceClient } from '@/lib/supabase/server'
import { sendAlertEmail } from './email'
import { sendWhatsAppAlert } from './whatsapp'
import type { Alert } from '@/types'

export async function dispatch(userId: string, alert: Alert): Promise<void> {
  try {
    const supabase = await createServiceClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('notification_frequency, notification_channels, whatsapp_number')
      .eq('id', userId)
      .single()

    if (!profile) return

    const channels: string[] = profile.notification_channels ?? ['in_app']
    const frequency: string = profile.notification_frequency ?? 'immediate'

    const promises: Promise<unknown>[] = []

    // Email — send immediately or queue for digest
    if (channels.includes('email') && frequency === 'immediate') {
      promises.push(sendAlertEmail(userId, alert))
    }

    // WhatsApp — only for immediate frequency
    if (
      channels.includes('whatsapp') &&
      profile.whatsapp_number &&
      frequency === 'immediate'
    ) {
      promises.push(sendWhatsAppAlert(profile.whatsapp_number, alert))
    }

    await Promise.allSettled(promises)
  } catch (err) {
    console.error('[dispatcher] Error dispatching notification:', err)
  }
}
