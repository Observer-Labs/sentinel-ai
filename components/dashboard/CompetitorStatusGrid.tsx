'use client'

import Link from 'next/link'
import { Globe, Users, Layers, MoreVertical, AlertCircle, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { timeAgo } from '@/lib/utils'
import type { Competitor } from '@/types'

interface Props {
  competitors: Competitor[]
  recentAlertCompetitorIds: Set<string>
}

function TypeIcon({ type }: { type: Competitor['type'] }) {
  switch (type) {
    case 'website': return <Globe className="h-4 w-4 text-blue-400" />
    case 'social':  return <Users className="h-4 w-4 text-purple-400" />
    case 'both':    return <Layers className="h-4 w-4 text-[#EF4444]" />
  }
}

function TypeLabel({ type }: { type: Competitor['type'] }) {
  const map = { website: 'Website', social: 'Social', both: 'Website + Social' }
  return map[type]
}

export function CompetitorStatusGrid({ competitors, recentAlertCompetitorIds }: Props) {
  if (competitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-[#1E293B] py-16 text-center">
        <Users className="h-10 w-10 text-[#334155] mb-4" />
        <p className="text-body font-medium text-[#94A3B8] mb-1">No competitors tracked yet</p>
        <p className="text-body text-[#64748B]">Add your first competitor to start monitoring.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {competitors.map((competitor, i) => {
        const hasAlert = recentAlertCompetitorIds.has(competitor.id)
        return (
          <motion.div
            key={competitor.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="relative hover:border-[#334155] transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <TypeIcon type={competitor.type} />
                    <Link
                      href={`/competitors/${competitor.id}`}
                      className="font-sans font-semibold text-body text-[#F1F5F9] hover:text-[#EF4444] transition-colors truncate"
                    >
                      {competitor.name}
                    </Link>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/competitors/${competitor.id}`}>View details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/competitors/${competitor.id}?edit=true`}>Edit</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[0.75rem]">
                      <TypeIcon type={competitor.type} />
                      <span className="ml-1">{TypeLabel({ type: competitor.type })}</span>
                    </Badge>
                    {competitor.category !== 'General' && (
                      <Badge variant="outline" className="text-[0.75rem]">{competitor.category}</Badge>
                    )}
                  </div>

                  {hasAlert ? (
                    <div className="flex items-center gap-1.5 text-[#EF4444]">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-mono text-[0.75rem]">Changed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-mono text-[0.75rem]">Stable</span>
                    </div>
                  )}
                </div>

                <p className="mt-3 font-mono text-[0.75rem] text-[#64748B]">
                  Added {timeAgo(competitor.created_at)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
