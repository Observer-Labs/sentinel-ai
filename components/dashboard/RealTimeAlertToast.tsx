'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { alertTypeLabel, severityBg } from '@/lib/utils'
import type { AlertWithCompetitor } from '@/types'

export function RealTimeAlertToast({ userId }: { userId: string }) {
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('alerts-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const alert = payload.new as AlertWithCompetitor
          toast({
            title: alert.title,
            description: alertTypeLabel(alert.type),
            variant: alert.severity === 'high' ? 'destructive' : 'default',
            duration: 8000,
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, supabase, toast])

  return null
}
