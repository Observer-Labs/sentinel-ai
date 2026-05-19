'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CompetitorTable } from '@/components/competitors/CompetitorTable'
import { AddCompetitorModal } from '@/components/competitors/AddCompetitorModal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Competitor } from '@/types'

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | Competitor['type']>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadCompetitors = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    const { data } = await supabase
      .from('competitors')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setCompetitors(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadCompetitors() }, [loadCompetitors])

  const filtered = competitors.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || c.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sans font-bold text-h2 text-[#F1F5F9]">Competitors</h1>
          <p className="text-body text-[#94A3B8] mt-1">
            {competitors.length} competitor{competitors.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-5 w-5" />Add Competitor
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
          <Input
            placeholder="Search competitors…"
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
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="rounded-card border border-[#1E293B] p-8 text-center">
          <p className="text-body text-[#64748B]">Loading…</p>
        </div>
      ) : (
        <CompetitorTable competitors={filtered} onDeleted={loadCompetitors} />
      )}

      <AddCompetitorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={loadCompetitors}
        userId={userId}
      />
    </div>
  )
}
