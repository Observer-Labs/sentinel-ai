'use client'

import { useState, useEffect, useCallback } from 'react'
import { Globe, Plus, Trash2, RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { formatDate } from '@/lib/utils'
import type { WebsiteMonitor, Competitor } from '@/types'

const schema = z.object({
  competitor_id: z.string().min(1, 'Select a competitor'),
  url: z.string().url('Invalid URL'),
  check_frequency: z.enum(['hourly', 'daily', 'weekly']),
})
type FormData = z.infer<typeof schema>

export default function IntegrationsPage() {
  const [monitors, setMonitors] = useState<(WebsiteMonitor & { competitors: { name: string } })[]>([])
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: monitorData }, { data: competitorData }] = await Promise.all([
      supabase
        .from('website_monitors')
        .select('*, competitors(name)')
        .in('competitor_id',
          (await supabase.from('competitors').select('id').eq('user_id', user.id)).data?.map(c => c.id) ?? []
        )
        .order('created_at', { ascending: false }),
      supabase.from('competitors').select('*').eq('user_id', user.id),
    ])

    setMonitors(monitorData ?? [])
    setCompetitors(competitorData ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { check_frequency: 'daily' },
  })

  async function onAddMonitor(data: FormData) {
    const { error } = await supabase.from('website_monitors').insert({
      competitor_id: data.competitor_id,
      url: data.url,
      check_frequency: data.check_frequency,
      is_active: true,
    })
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return }
    toast({ title: 'Monitor added', description: `Now monitoring ${data.url}` })
    reset()
    setShowAddForm(false)
    load()
  }

  async function toggleMonitor(id: string, active: boolean) {
    await supabase.from('website_monitors').update({ is_active: active }).eq('id', id)
    setMonitors(prev => prev.map(m => m.id === id ? { ...m, is_active: active } : m))
  }

  async function deleteMonitor(id: string) {
    await supabase.from('website_monitors').delete().eq('id', id)
    setMonitors(prev => prev.filter(m => m.id !== id))
    toast({ title: 'Monitor removed' })
  }

  return (
    <div className="p-6 max-w-[800px] mx-auto">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-h2 text-[#F1F5F9]">Integrations</h1>
        <p className="text-body text-[#94A3B8] mt-1">
          Configure website monitors and social account tracking.
        </p>
      </div>

      {/* Website monitors */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-blue-400" />
            <h2 className="font-sans font-semibold text-body text-[#F1F5F9] uppercase tracking-wider text-[0.75rem]">
              Website Monitors
            </h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4" />Add monitor
          </Button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit(onAddMonitor)} className="rounded-card border border-[#1E293B] p-4 mb-4 flex flex-col gap-4">
            <h3 className="font-sans font-medium text-body text-[#F1F5F9]">New website monitor</h3>
            <div className="flex flex-col gap-2">
              <Label>Competitor</Label>
              <Select onValueChange={(v) => setValue('competitor_id', v)}>
                <SelectTrigger><SelectValue placeholder="Select competitor…" /></SelectTrigger>
                <SelectContent>
                  {competitors.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.competitor_id && <p className="text-body text-[#EF4444]">{errors.competitor_id.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="url">URL to monitor</Label>
              <Input id="url" type="url" placeholder="https://competitor.com/pricing" {...register('url')} />
              {errors.url && <p className="text-body text-[#EF4444]">{errors.url.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Check frequency</Label>
              <Select defaultValue="daily" onValueChange={(v) => setValue('check_frequency', v as FormData['check_frequency'])}>
                <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding…' : 'Add monitor'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-body text-[#64748B]">Loading…</p>
        ) : monitors.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-[#1E293B] py-10 text-center">
            <Globe className="h-8 w-8 text-[#334155] mb-3" />
            <p className="text-body text-[#94A3B8]">No website monitors configured.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {monitors.map((m) => (
              <div key={m.id} className="flex items-center gap-4 rounded-card border border-[#1E293B] p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-sans font-medium text-body text-[#F1F5F9] truncate">{m.competitors?.name}</p>
                    <Badge variant="secondary" className="shrink-0 text-[0.75rem]">{m.check_frequency}</Badge>
                  </div>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.75rem] text-[#64748B] hover:text-[#94A3B8] truncate block"
                  >
                    {m.url}
                  </a>
                  {m.last_checked && (
                    <p className="font-mono text-[0.75rem] text-[#64748B] mt-1">
                      Last checked {formatDate(m.last_checked)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={m.is_active}
                    onCheckedChange={(v) => toggleMonitor(m.id, v)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteMonitor(m.id)}
                  >
                    <Trash2 className="h-4 w-4 text-[#EF4444]" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator />

      <section className="mt-8">
        <h2 className="font-sans font-semibold text-body text-[#F1F5F9] uppercase tracking-wider text-[0.75rem] mb-4">
          Social Media
        </h2>
        <div className="rounded-card border border-dashed border-[#1E293B] p-6 text-center">
          <p className="text-body text-[#94A3B8] mb-2">Social handles are configured per competitor.</p>
          <p className="text-[0.75rem] text-[#64748B]">
            Go to a competitor's detail page to add or edit social accounts.
          </p>
        </div>
      </section>
    </div>
  )
}
