'use client'

import { TrendingUp, TrendingDown, Minus, Instagram, Twitter, Linkedin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { SocialMetrics, Platform } from '@/types'

interface Props {
  metrics: SocialMetrics[]
}

function PlatformIcon({ platform }: { platform: Platform }) {
  switch (platform) {
    case 'instagram': return <Instagram className="h-5 w-5 text-pink-400" />
    case 'twitter':   return <Twitter className="h-5 w-5 text-blue-400" />
    case 'linkedin':  return <Linkedin className="h-5 w-5 text-blue-600" />
    case 'tiktok':    return <span className="font-mono text-[0.75rem] font-bold text-white">TT</span>
  }
}

function PlatformLabel({ platform }: { platform: Platform }) {
  const map: Record<Platform, string> = {
    instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok'
  }
  return map[platform]
}

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function SocialMetricsCard({ metrics }: Props) {
  if (metrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-[#1E293B] py-8 text-center">
        <p className="text-body text-[#94A3B8]">No social accounts tracked.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {metrics.map((m) => (
        <Card key={m.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PlatformIcon platform={m.platform} />
              <CardTitle><PlatformLabel platform={m.platform} /></CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[0.75rem] text-[#64748B] uppercase tracking-wider mb-1">Followers</p>
                <p className="font-mono font-bold text-h3 text-[#F1F5F9]">
                  {m.follower_count ? formatFollowers(m.follower_count) : '—'}
                </p>
              </div>
              <div>
                <p className="text-[0.75rem] text-[#64748B] uppercase tracking-wider mb-1">Engagement</p>
                <p className="font-mono font-bold text-h3 text-[#F1F5F9]">
                  {m.engagement_rate ? `${m.engagement_rate.toFixed(1)}%` : '—'}
                </p>
              </div>
            </div>
            {m.last_post_date && (
              <p className="mt-3 font-mono text-[0.75rem] text-[#64748B]">
                Last post: {formatDate(m.last_post_date)}
              </p>
            )}
            <p className="font-mono text-[0.75rem] text-[#64748B]">
              Updated: {formatDate(m.last_checked)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
