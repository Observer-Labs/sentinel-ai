'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { alertTypeLabel, alertTypeBg, severityBg, formatDateTime } from '@/lib/utils'
import type { Alert } from '@/types'

interface Props {
  alerts: Alert[]
}

export function AlertTimeline({ alerts }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-[#1E293B] py-12 text-center">
        <Bell className="h-8 w-8 text-[#334155] mb-3" />
        <p className="text-body text-[#94A3B8]">No alerts yet for this competitor.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#1E293B]" />

      <div className="flex flex-col gap-4">
        {alerts.map((alert) => {
          const isExpanded = expanded.has(alert.id)
          return (
            <div key={alert.id} className="flex gap-4">
              {/* Dot */}
              <div className={`mt-2 h-3.5 w-3.5 shrink-0 rounded-full border-2 z-10 ${
                alert.severity === 'high' ? 'border-[#EF4444] bg-[#EF4444]/30' :
                alert.severity === 'medium' ? 'border-[#F59E0B] bg-[#F59E0B]/30' :
                'border-[#64748B] bg-[#64748B]/30'
              }`} />

              {/* Content */}
              <div className="flex-1 rounded-card border border-[#1E293B] bg-[#1E293B] p-3 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
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
                      <p className="text-body text-[#94A3B8]">{alert.description}</p>
                    )}
                    <time className="font-mono text-[0.75rem] text-[#64748B]">
                      {formatDateTime(alert.created_at)}
                    </time>
                  </div>
                  {alert.change_data && (
                    <button
                      onClick={() => toggle(alert.id)}
                      className="shrink-0 p-1 text-[#64748B] hover:text-[#F1F5F9] transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  )}
                </div>

                {isExpanded && alert.change_data && (
                  <div className="mt-3 rounded-sm border border-[#334155] p-3 bg-[#0F172A]">
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
                      <div className="mt-2">
                        <p className="font-mono text-[0.75rem] text-[#64748B] mb-1">Summary</p>
                        <p className="font-mono text-[0.75rem] text-[#94A3B8]">{alert.change_data.diff}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
