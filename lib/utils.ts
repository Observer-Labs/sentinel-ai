import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'
import type { Severity, AlertType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDate(date: string | Date) {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'MMM d, yyyy HH:mm')
}

export function severityColor(severity: Severity) {
  switch (severity) {
    case 'high':   return 'text-[#EF4444]'
    case 'medium': return 'text-[#F59E0B]'
    case 'low':    return 'text-[#64748B]'
  }
}

export function severityBg(severity: Severity) {
  switch (severity) {
    case 'high':   return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
    case 'medium': return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
    case 'low':    return 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/30'
  }
}

export function alertTypeLabel(type: AlertType) {
  switch (type) {
    case 'website_change':    return 'Website Change'
    case 'price_change':      return 'Price Change'
    case 'social_post':       return 'New Post'
    case 'follower_change':   return 'Follower Change'
    case 'engagement_change': return 'Engagement Change'
  }
}

export function alertTypeBg(type: AlertType) {
  switch (type) {
    case 'website_change':    return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    case 'price_change':      return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
    case 'social_post':       return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    case 'follower_change':   return 'bg-green-500/10 text-green-400 border-green-500/30'
    case 'engagement_change': return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
  }
}
