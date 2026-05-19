export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Bell, Users, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { CompetitorStatusGrid } from '@/components/dashboard/CompetitorStatusGrid'
import { AlertFeed } from '@/components/dashboard/AlertFeed'
import { RealTimeAlertToast } from '@/components/dashboard/RealTimeAlertToast'
import type { AlertWithCompetitor } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: competitors }, { data: alerts }] = await Promise.all([
    supabase
      .from('competitors')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('alerts')
      .select('*, competitors(id, name, type)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const allCompetitors = competitors ?? []
  const allAlerts = (alerts ?? []) as AlertWithCompetitor[]

  // Competitors with alerts in last 24h
  const cutoff = new Date(Date.now() - 86400_000).toISOString()
  const recentAlertCompetitorIds = new Set(
    allAlerts.filter(a => a.created_at > cutoff).map(a => a.competitor_id)
  )

  const unreadCount = allAlerts.filter(a => !a.is_read).length
  const highSeverityCount = allAlerts.filter(a => a.severity === 'high' && !a.is_read).length

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <RealTimeAlertToast userId={user.id} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sans font-bold text-h2 text-[#F1F5F9]">Dashboard</h1>
          <p className="text-body text-[#94A3B8] mt-1">
            Monitoring {allCompetitors.length} competitor{allCompetitors.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link href="/competitors">
            <Plus className="h-5 w-5" />Add Competitor
          </Link>
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-3">
        <StatCard
          icon={<Users className="h-5 w-5 text-blue-400" />}
          label="Competitors tracked"
          value={allCompetitors.length}
          bg="bg-blue-500/10"
          border="border-blue-500/20"
        />
        <StatCard
          icon={<Bell className="h-5 w-5 text-[#EF4444]" />}
          label="Unread alerts"
          value={unreadCount}
          bg="bg-[#EF4444]/10"
          border="border-[#EF4444]/20"
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5 text-[#F59E0B]" />}
          label="High severity"
          value={highSeverityCount}
          bg="bg-[#F59E0B]/10"
          border="border-[#F59E0B]/20"
          className="col-span-2 lg:col-span-1"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Competitors grid — wider */}
        <section className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-body text-[#F1F5F9] uppercase tracking-wider text-[0.75rem]">
              Competitors
            </h2>
            <Link href="/competitors" className="text-[0.75rem] text-[#EF4444] hover:underline">
              View all
            </Link>
          </div>
          <CompetitorStatusGrid
            competitors={allCompetitors.slice(0, 6)}
            recentAlertCompetitorIds={recentAlertCompetitorIds}
          />
        </section>

        {/* Alert feed — narrower */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-body text-[#F1F5F9] uppercase tracking-wider text-[0.75rem]">
              Recent Alerts
            </h2>
            <Link href="/alerts" className="text-[0.75rem] text-[#EF4444] hover:underline">
              View all
            </Link>
          </div>
          <AlertFeed alerts={allAlerts} />
        </section>
      </div>
    </div>
  )
}

function StatCard({
  icon, label, value, bg, border, className,
}: {
  icon: React.ReactNode
  label: string
  value: number
  bg: string
  border: string
  className?: string
}) {
  return (
    <div className={`rounded-card border ${border} ${bg} p-4 ${className ?? ''}`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="font-sans text-[0.75rem] font-medium text-[#94A3B8] uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-mono font-bold text-h3 text-[#F1F5F9]">{value}</p>
    </div>
  )
}
