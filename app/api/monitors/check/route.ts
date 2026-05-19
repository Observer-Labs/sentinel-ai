import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkWebsite } from '@/lib/monitors/website'

// Called manually or by Vercel cron
export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Verify auth for manual calls
  const { data: { user } } = await supabase.auth.getUser()
  const body = await req.json().catch(() => ({}))
  const { monitorId } = body

  let monitors

  if (monitorId) {
    // Single monitor check (manual trigger from UI)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data } = await supabase
      .from('website_monitors')
      .select('*, competitors(user_id)')
      .eq('id', monitorId)
      .single()
    if (!data || (data.competitors as { user_id: string })?.user_id !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    monitors = [data]
  } else {
    // Cron: check all active monitors
    const { data } = await supabase
      .from('website_monitors')
      .select('*, competitors(user_id)')
      .eq('is_active', true)
    monitors = data ?? []
  }

  const results = await Promise.allSettled(
    monitors.map(m => checkWebsite(m, supabase))
  )

  const summary = results.map((r, i) => ({
    monitorId: monitors[i].id,
    status: r.status,
    changed: r.status === 'fulfilled' ? r.value.changed : false,
  }))

  if (monitorId && summary.length === 1) {
    return NextResponse.json(summary[0])
  }

  return NextResponse.json({ checked: monitors.length, results: summary })
}
