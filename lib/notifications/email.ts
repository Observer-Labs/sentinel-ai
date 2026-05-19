import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'
import type { Alert } from '@/types'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
}

export async function sendAlertEmail(
  userId: string,
  alert: Alert
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient()

    // Get user email
    const { data: userData } = await supabase.auth.admin.getUserById(userId)
    const email = userData?.user?.email
    if (!email) return { success: false, error: 'User email not found' }

    // Get competitor name
    const { data: competitor } = await supabase
      .from('competitors')
      .select('name')
      .eq('id', alert.competitor_id)
      .single()

    const competitorName = competitor?.name ?? 'Unknown Competitor'

    const severityEmoji = alert.severity === 'high' ? '🔴' : alert.severity === 'medium' ? '🟡' : '⚪'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const { data, error } = await getResend().emails.send({
      from: process.env.FROM_EMAIL ?? 'Sentinel <alerts@sentinelintel.com>',
      to: email,
      subject: `${severityEmoji} Sentinel Alert: ${alert.title}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sentinel Alert</title>
</head>
<body style="margin:0;padding:0;background-color:#0F172A;font-family:'IBM Plex Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F172A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;">
              <span style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.5px;">⚡ Sentinel</span>
            </td>
          </tr>
          <!-- Alert card -->
          <tr>
            <td style="background-color:#1E293B;border-radius:8px;border:1px solid #334155;padding:24px;">
              <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:1px;">
                ${severityEmoji} ${alert.severity.toUpperCase()} ALERT
              </p>
              <h1 style="margin:0 0 12px 0;font-size:20px;font-weight:700;color:#F1F5F9;">
                ${alert.title}
              </h1>
              <p style="margin:0 0 16px 0;font-size:14px;color:#94A3B8;line-height:1.5;">
                ${alert.description ?? ''}
              </p>
              <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding-right:24px;">
                    <p style="margin:0 0 2px 0;font-size:11px;color:#64748B;text-transform:uppercase;">Competitor</p>
                    <p style="margin:0;font-size:14px;color:#F1F5F9;font-weight:500;">${competitorName}</p>
                  </td>
                  <td>
                    <p style="margin:0 0 2px 0;font-size:11px;color:#64748B;text-transform:uppercase;">Detected</p>
                    <p style="margin:0;font-size:14px;font-family:'IBM Plex Mono',monospace;color:#F1F5F9;">
                      ${new Date(alert.created_at).toLocaleString()}
                    </p>
                  </td>
                </tr>
              </table>
              ${alert.change_data?.old_value ? `
              <div style="border-top:1px solid #334155;padding-top:16px;margin-top:16px;">
                <p style="margin:0 0 8px 0;font-size:12px;color:#64748B;">BEFORE</p>
                <p style="margin:0;font-family:'IBM Plex Mono',monospace;font-size:13px;color:#EF4444;text-decoration:line-through;">${alert.change_data.old_value}</p>
                <p style="margin:12px 0 8px 0;font-size:12px;color:#64748B;">AFTER</p>
                <p style="margin:0;font-family:'IBM Plex Mono',monospace;font-size:13px;color:#4ADE80;">${alert.change_data.new_value ?? ''}</p>
              </div>
              ` : ''}
              <div style="margin-top:24px;">
                <a href="${appUrl}/alerts" style="display:inline-block;background-color:#EF4444;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 20px;border-radius:6px;">
                  View Alert
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#64748B;line-height:1.5;">
                You are receiving this because you have email alerts enabled in Sentinel.
                <a href="${appUrl}/settings" style="color:#EF4444;text-decoration:none;">Manage preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    })

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

export async function sendDigestEmail(
  userId: string,
  alerts: Alert[]
): Promise<{ success: boolean; error?: string }> {
  if (alerts.length === 0) return { success: true }

  try {
    const supabase = await createServiceClient()
    const { data: userData } = await supabase.auth.admin.getUserById(userId)
    const email = userData?.user?.email
    if (!email) return { success: false, error: 'User email not found' }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const highCount = alerts.filter(a => a.severity === 'high').length
    const totalCount = alerts.length

    const { error } = await getResend().emails.send({
      from: process.env.FROM_EMAIL ?? 'Sentinel <alerts@sentinelintel.com>',
      to: email,
      subject: `Sentinel Digest: ${totalCount} alert${totalCount !== 1 ? 's' : ''}, ${highCount} high severity`,
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px 20px;background-color:#0F172A;font-family:'IBM Plex Sans',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;">
    <p style="font-size:20px;font-weight:700;color:#F1F5F9;margin-bottom:32px;">⚡ Sentinel Digest</p>
    <div style="background:#1E293B;border-radius:8px;border:1px solid #334155;padding:24px;margin-bottom:16px;">
      <h2 style="margin:0 0 16px 0;font-size:16px;color:#F1F5F9;">
        ${totalCount} alert${totalCount !== 1 ? 's' : ''} since your last digest
      </h2>
      ${alerts.map(a => `
        <div style="border-top:1px solid #334155;padding:12px 0;">
          <span style="font-size:11px;color:${a.severity === 'high' ? '#EF4444' : a.severity === 'medium' ? '#F59E0B' : '#64748B'};text-transform:uppercase;font-weight:600;">${a.severity}</span>
          <p style="margin:4px 0 0 0;font-size:14px;color:#F1F5F9;">${a.title}</p>
          ${a.description ? `<p style="margin:4px 0 0 0;font-size:13px;color:#94A3B8;">${a.description}</p>` : ''}
        </div>
      `).join('')}
    </div>
    <a href="${appUrl}/alerts" style="display:inline-block;background-color:#EF4444;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 20px;border-radius:6px;">
      View all alerts
    </a>
    <p style="margin-top:24px;font-size:12px;color:#64748B;">
      <a href="${appUrl}/settings" style="color:#EF4444;text-decoration:none;">Manage preferences</a>
    </p>
  </div>
</body>
</html>
      `.trim(),
    })

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
