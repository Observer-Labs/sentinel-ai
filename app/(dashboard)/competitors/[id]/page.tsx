export const dynamic = 'force-dynamic'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Globe, ExternalLink, ArrowLeft, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTimeline } from '@/components/competitors/AlertTimeline'
import { SocialMetricsCard } from '@/components/competitors/SocialMetricsCard'
import { TriggerCheckButton } from '@/components/competitors/TriggerCheckButton'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CompetitorDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: competitor }, { data: alerts }, { data: metrics }, { data: monitor }] = await Promise.all([
    supabase.from('competitors').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('alerts').select('*').eq('competitor_id', id).order('created_at', { ascending: false }),
    supabase.from('social_metrics').select('*').eq('competitor_id', id),
    supabase.from('website_monitors').select('*').eq('competitor_id', id).single(),
  ])

  if (!competitor) notFound()

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      {/* Back + header */}
      <Link
        href="/competitors"
        className="inline-flex items-center gap-2 text-body text-[#64748B] hover:text-[#F1F5F9] transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />Back to competitors
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-sans font-bold text-h2 text-[#F1F5F9]">{competitor.name}</h1>
            <Badge variant="secondary">
              {competitor.type === 'website' ? 'Website' : competitor.type === 'social' ? 'Social' : 'Website + Social'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-body text-[#64748B]">
            {competitor.website_url && (
              <a
                href={competitor.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#F1F5F9] transition-colors"
              >
                <Globe className="h-4 w-4" />
                {new URL(competitor.website_url).hostname}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <span>Category: {competitor.category}</span>
            <span>Added {formatDate(competitor.created_at)}</span>
          </div>
        </div>

        {monitor && (
          <TriggerCheckButton monitorId={monitor.id} url={monitor.url} />
        )}
      </div>

      {/* Social metrics */}
      {metrics && metrics.length > 0 && (
        <section className="mb-8">
          <h2 className="font-sans font-semibold text-body text-[#F1F5F9] uppercase tracking-wider text-[0.75rem] mb-4">
            Social Metrics
          </h2>
          <SocialMetricsCard metrics={metrics} />
        </section>
      )}

      {monitor && (
        <section className="mb-8">
          <h2 className="font-sans font-semibold text-body text-[#F1F5F9] uppercase tracking-wider text-[0.75rem] mb-3">
            Website Monitor
          </h2>
          <div className="rounded-card border border-[#1E293B] p-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <a
                href={monitor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-body text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
              >
                {monitor.url}
              </a>
              <p className="text-[0.75rem] text-[#64748B]">
                Frequency: {monitor.check_frequency} ·{' '}
                {monitor.last_checked
                  ? `Last checked ${formatDate(monitor.last_checked)}`
                  : 'Not yet checked'}
              </p>
            </div>
            <Badge variant={monitor.is_active ? 'success' : 'secondary'}>
              {monitor.is_active ? 'Active' : 'Paused'}
            </Badge>
          </div>
        </section>
      )}

      <Separator className="mb-8" />

      {/* Alert timeline */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans font-semibold text-body text-[#F1F5F9] uppercase tracking-wider text-[0.75rem]">
            Alert History ({alerts?.length ?? 0})
          </h2>
        </div>
        <AlertTimeline alerts={alerts ?? []} />
      </section>
    </div>
  )
}
