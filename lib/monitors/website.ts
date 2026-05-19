import * as cheerio from 'cheerio'
import type { SupabaseClient } from '@supabase/supabase-js'

interface Monitor {
  id: string
  competitor_id: string
  url: string
  last_snapshot?: string | null
  competitors?: { user_id: string } | null
}

function extractText($: ReturnType<typeof cheerio.load>): string {
  $('script, style, nav, footer, header').remove()
  return $('body').text().replace(/\s+/g, ' ').trim().slice(0, 50_000)
}

function detectPrices(text: string): string[] {
  const priceRegex = /\$\d+(?:[.,]\d{2})?|\€\d+(?:[.,]\d{2})?|\£\d+(?:[.,]\d{2})?/g
  return [...new Set(text.match(priceRegex) ?? [])]
}

function diffSummary(oldText: string, newText: string): string {
  const oldWords = new Set(oldText.split(' '))
  const newWords = new Set(newText.split(' '))
  const added = [...newWords].filter(w => !oldWords.has(w)).length
  const removed = [...oldWords].filter(w => !newWords.has(w)).length
  return `~${added} words added, ~${removed} words removed`
}

export async function checkWebsite(
  monitor: Monitor,
  supabase: SupabaseClient
): Promise<{ changed: boolean; alertId?: string }> {
  let html: string

  try {
    const response = await fetch(monitor.url, {
      headers: {
        'User-Agent': 'Sentinel-Monitor/1.0 (competitive intelligence bot)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15_000),
    })
    html = await response.text()
  } catch {
    await supabase
      .from('website_monitors')
      .update({ last_checked: new Date().toISOString() })
      .eq('id', monitor.id)
    return { changed: false }
  }

  const $ = cheerio.load(html)
  const newText = extractText($)
  const newPrices = detectPrices(newText)

  const now = new Date().toISOString()

  // Update last_checked always
  await supabase
    .from('website_monitors')
    .update({ last_checked: now, last_snapshot: newText })
    .eq('id', monitor.id)

  if (!monitor.last_snapshot) {
    // First check — save snapshot, no alert
    return { changed: false }
  }

  const oldText = monitor.last_snapshot
  const oldPrices = detectPrices(oldText)

  const textChanged = newText !== oldText
  const priceDelta = JSON.stringify(newPrices) !== JSON.stringify(oldPrices)

  if (!textChanged) return { changed: false }

  // Determine alert type and severity
  const type = priceDelta ? 'price_change' : 'website_change'
  const severity = priceDelta ? 'high' : 'medium'
  const title = priceDelta
    ? `Price change detected on ${new URL(monitor.url).hostname}`
    : `Website content changed: ${new URL(monitor.url).hostname}`

  const changeData = priceDelta
    ? {
        old_value: oldPrices.join(', '),
        new_value: newPrices.join(', '),
        diff: diffSummary(oldText, newText),
        url: monitor.url,
      }
    : {
        diff: diffSummary(oldText, newText),
        url: monitor.url,
      }

  // Get user_id via competitor
  const { data: competitor } = await supabase
    .from('competitors')
    .select('user_id')
    .eq('id', monitor.competitor_id)
    .single()

  if (!competitor) return { changed: false }

  const { data: alert } = await supabase
    .from('alerts')
    .insert({
      competitor_id: monitor.competitor_id,
      user_id: competitor.user_id,
      type,
      title,
      description: `${diffSummary(oldText, newText)}. View ${monitor.url} for details.`,
      change_data: changeData,
      severity,
      is_read: false,
    })
    .select()
    .single()

  // Dispatch notifications
  if (alert) {
    const { dispatch } = await import('@/lib/notifications/dispatcher')
    await dispatch(competitor.user_id, alert)
  }

  return { changed: true, alertId: alert?.id }
}
