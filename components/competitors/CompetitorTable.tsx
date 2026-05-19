'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MoreVertical, Globe, Users, Layers, Trash2, ExternalLink, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { timeAgo } from '@/lib/utils'
import type { Competitor } from '@/types'

interface Props {
  competitors: Competitor[]
  onDeleted: () => void
}

function TypeIcon({ type }: { type: Competitor['type'] }) {
  switch (type) {
    case 'website': return <Globe className="h-4 w-4 text-blue-400" />
    case 'social':  return <Users className="h-4 w-4 text-purple-400" />
    case 'both':    return <Layers className="h-4 w-4 text-[#EF4444]" />
  }
}

export function CompetitorTable({ competitors, onDeleted }: Props) {
  const { toast } = useToast()
  const supabase = createClient()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function deleteCompetitor(id: string, name: string) {
    setDeleting(id)
    const { error } = await supabase.from('competitors').delete().eq('id', id)
    setDeleting(null)
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return }
    toast({ title: 'Deleted', description: `${name} removed from tracking.` })
    onDeleted()
  }

  if (competitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-[#1E293B] py-16 text-center">
        <Users className="h-10 w-10 text-[#334155] mb-4" />
        <p className="text-body font-medium text-[#94A3B8] mb-1">No competitors tracked</p>
        <p className="text-body text-[#64748B]">Click "Add Competitor" to start monitoring.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-card border border-[#1E293B]">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1E293B] bg-[#1E293B]/50">
              <th className="px-4 py-3 text-left font-sans text-[0.75rem] font-semibold text-[#64748B] uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left font-sans text-[0.75rem] font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left font-sans text-[0.75rem] font-semibold text-[#64748B] uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left font-sans text-[0.75rem] font-semibold text-[#64748B] uppercase tracking-wider">Added</th>
              <th className="px-4 py-3 text-right font-sans text-[0.75rem] font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]">
            {competitors.map((c) => (
              <tr key={c.id} className="hover:bg-[#1E293B]/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <TypeIcon type={c.type} />
                    <Link
                      href={`/competitors/${c.id}`}
                      className="font-sans font-medium text-body text-[#F1F5F9] hover:text-[#EF4444] transition-colors"
                    >
                      {c.name}
                    </Link>
                    {c.website_url && (
                      <a href={c.website_url} target="_blank" rel="noopener noreferrer" className="text-[#64748B] hover:text-[#94A3B8]">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="text-[0.75rem]">
                    {c.type === 'website' ? 'Website' : c.type === 'social' ? 'Social' : 'Website + Social'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="text-body text-[#94A3B8]">{c.category}</span>
                </td>
                <td className="px-4 py-3">
                  <time className="font-mono text-[0.75rem] text-[#64748B]">{timeAgo(c.created_at)}</time>
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/competitors/${c.id}`}><Eye className="h-4 w-4" />View details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteCompetitor(c.id, c.name)}
                        disabled={deleting === c.id}
                        className="text-[#EF4444] focus:text-[#EF4444]"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deleting === c.id ? 'Deleting…' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="md:hidden divide-y divide-[#1E293B]">
        {competitors.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3">
            <TypeIcon type={c.type} />
            <div className="flex-1 min-w-0">
              <Link
                href={`/competitors/${c.id}`}
                className="font-sans font-medium text-body text-[#F1F5F9] hover:text-[#EF4444] block truncate"
              >
                {c.name}
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-[0.75rem]">{c.type}</Badge>
                <time className="font-mono text-[0.75rem] text-[#64748B]">{timeAgo(c.created_at)}</time>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => deleteCompetitor(c.id, c.name)}>
              <Trash2 className="h-4 w-4 text-[#64748B]" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
