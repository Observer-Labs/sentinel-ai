'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, BellOff, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { alertTypeLabel, alertTypeBg, severityBg, timeAgo } from '@/lib/utils'
import type { AlertWithCompetitor } from '@/types'

interface Props {
  alert: AlertWithCompetitor
  onMarkRead: (id: string) => void
  onSnooze: (id: string) => void
}

export function AlertCard({ alert, onMarkRead, onSnooze }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      id={alert.id}
      className={`rounded-card border transition-colors ${
        !alert.is_read
          ? 'border-l-4 border-l-[#EF4444] border-[#1E293B] bg-[#1E293B]'
          : 'border-[#1E293B] bg-[#1E293B]/60'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Severity indicator */}
          <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
            alert.severity === 'high' ? 'bg-[#EF4444]' :
            alert.severity === 'medium' ? 'bg-[#F59E0B]' :
            'bg-[#64748B]'
          }`} />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`font-sans font-medium text-body ${!alert.is_read ? 'text-[#F1F5F9]' : 'text-[#94A3B8]'}`}>
                {alert.title}
              </span>
              <Badge className={`text-[0.75rem] border ${alertTypeBg(alert.type)}`}>
                {alertTypeLabel(alert.type)}
              </Badge>
              <Badge className={`text-[0.75rem] border ${severityBg(alert.severity)}`}>
                {alert.severity}
              </Badge>
            </div>

            {alert.description && (
              <p className="text-body text-[#94A3B8] mb-2">{alert.description}</p>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              {alert.competitors && (
                <Link
                  href={`/competitors/${alert.competitor_id}`}
                  className="text-[0.75rem] text-[#EF4444] hover:underline"
                >
                  {alert.competitors.name}
                </Link>
              )}
              <time className="font-mono text-[0.75rem] text-[#64748B]">
                {timeAgo(alert.created_at)}
              </time>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!alert.is_read && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onMarkRead(alert.id)} title="Mark as read">
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onSnooze(alert.id)} title="Snooze for 1 hour">
              <BellOff className="h-4 w-4" />
            </Button>
            {alert.change_data && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {expanded && alert.change_data && (
          <div className="mt-3 ml-5 rounded-sm border border-[#334155] p-3 bg-[#0F172A]">
            {alert.change_data.old_value && (
              <div className="mb-2">
                <p className="font-mono text-[0.75rem] text-[#64748B] mb-1">Before</p>
                <p className="font-mono text-[0.75rem] text-[#EF4444] line-through">{alert.change_data.old_value}</p>
              </div>
            )}
            {alert.change_data.new_value && (
              <div>
                <p className="font-mono text-[0.75rem] text-[#64748B] mb-1">After</p>
                <p className="font-mono text-[0.75rem] text-green-400">{alert.change_data.new_value}</p>
              </div>
            )}
            {alert.change_data.diff && (
              <p className="font-mono text-[0.75rem] text-[#94A3B8] mt-2">{alert.change_data.diff}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
