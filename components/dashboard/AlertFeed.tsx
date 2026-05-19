'use client'

import Link from 'next/link'
import { Bell, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { timeAgo, alertTypeLabel, alertTypeBg, severityBg } from '@/lib/utils'
import type { AlertWithCompetitor } from '@/types'

interface Props {
  alerts: AlertWithCompetitor[]
}

export function AlertFeed({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-[#1E293B] py-12 text-center">
        <Bell className="h-8 w-8 text-[#334155] mb-3" />
        <p className="text-body text-[#94A3B8]">No alerts yet. Add competitors to start monitoring.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y divide-[#1E293B] rounded-card border border-[#1E293B] overflow-hidden">
      {alerts.map((alert, i) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className={`flex items-start gap-4 px-4 py-3 transition-colors hover:bg-[#1E293B]/50 ${!alert.is_read ? 'border-l-2 border-l-[#EF4444]' : ''}`}
        >
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-sans font-medium text-body text-[#F1F5F9] truncate">
                {alert.title}
              </span>
              <Badge className={`shrink-0 text-[0.75rem] border ${alertTypeBg(alert.type)}`}>
                {alertTypeLabel(alert.type)}
              </Badge>
              <Badge className={`shrink-0 text-[0.75rem] border ${severityBg(alert.severity)}`}>
                {alert.severity}
              </Badge>
            </div>
            {alert.description && (
              <p className="text-body text-[#94A3B8] line-clamp-1">{alert.description}</p>
            )}
            <div className="flex items-center gap-3">
              <time className="font-mono text-[0.75rem] text-[#64748B]">
                {timeAgo(alert.created_at)}
              </time>
              {alert.competitors && (
                <span className="text-[0.75rem] text-[#64748B]">
                  · {alert.competitors.name}
                </span>
              )}
            </div>
          </div>
          <Link
            href={`/alerts#${alert.id}`}
            className="shrink-0 p-1 text-[#64748B] hover:text-[#F1F5F9] transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
