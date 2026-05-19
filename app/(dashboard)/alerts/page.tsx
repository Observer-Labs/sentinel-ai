'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { AlertCard } from '@/components/alerts/AlertCard'
import { useToast } from '@/components/ui/use-toast'
import type { AlertWithCompetitor, AlertType, Severity } from '@/types'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertWithCompetitor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<AlertType | 'all'>('all')
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all')
  const [showUnread, setShowUnread] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const loadAlerts = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('alerts')
      .select('*, competitors(id, name, type)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setAlerts((data ?? []) as AlertWithCompetitor[])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadAlerts() }, [loadAlerts])

  async function markRead(id: string) {
    await supabase.from('alerts').update({ is_read: true }).eq('id', id)
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a))
  }

  async function snooze(id: string) {
    const snoozedUntil = new Date(Date.now() + 3600_000).toISOString()
    await supabase.from('alerts').update({ snoozed_until: snoozedUntil, is_read: true }).eq('id', id)
    setAlerts(prev => prev.filter(a => a.id !== id))
    toast({ title: 'Alert snoozed', description: 'You will see this again in 1 hour.' })
  }

  async function markAllRead() {
    const unreadIds = alerts.filter(a => !a.is_read).map(a => a.id)
    if (unreadIds.length === 0) return
    await supabase.from('alerts').update({ is_read: true }).in('id', unreadIds)
    setAlerts(prev => prev.map(a => ({ ...a, is_read: true })))
    toast({ title: 'All alerts marked as read' })
  }

  const filtered = alerts.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase()) ||
      a.competitors?.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || a.type === typeFilter
    const matchesSeverity = severityFilter === 'all' || a.severity === severityFilter
    const matchesUnread = !showUnread || !a.is_read
    return matchesSearch && matchesType && matchesSeverity && matchesUnread
  })

  const unreadCount = alerts.filter(a => !a.is_read).length

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sans font-bold text-h2 text-[#F1F5F9]">Alerts</h1>
          <p className="text-body text-[#94A3B8] mt-1">
            {unreadCount} unread · {alerts.length} total
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
          <Input
            placeholder="Search alerts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="website_change">Website Change</SelectItem>
            <SelectItem value="price_change">Price Change</SelectItem>
            <SelectItem value="social_post">New Post</SelectItem>
            <SelectItem value="follower_change">Follower Change</SelectItem>
            <SelectItem value="engagement_change">Engagement Change</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as typeof severityFilter)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severity</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={showUnread ? 'default' : 'outline'}
          onClick={() => setShowUnread(!showUnread)}
          className="gap-2"
        >
          <Bell className="h-4 w-4" />
          Unread only
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-body text-[#64748B]">Loading alerts…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-[#1E293B] py-16 text-center">
          <Bell className="h-10 w-10 text-[#334155] mb-4" />
          <p className="text-body font-medium text-[#94A3B8] mb-1">No alerts found</p>
          <p className="text-body text-[#64748B]">
            {search || typeFilter !== 'all' || severityFilter !== 'all' || showUnread
              ? 'Try adjusting your filters.'
              : 'Alerts will appear here when your competitors change.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onMarkRead={markRead}
              onSnooze={snooze}
            />
          ))}
        </div>
      )}
    </div>
  )
}
