'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface Props {
  monitorId: string
  url: string
}

export function TriggerCheckButton({ monitorId, url }: Props) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function triggerCheck() {
    setLoading(true)
    try {
      const res = await fetch('/api/monitors/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monitorId }),
      })
      const data = await res.json()
      if (data.changed) {
        toast({ title: 'Change detected!', description: `${url} has changed since last check.`, variant: 'destructive' })
      } else {
        toast({ title: 'No changes', description: `${url} looks the same as before.` })
      }
    } catch {
      toast({ title: 'Check failed', description: 'Could not reach the website.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={triggerCheck} disabled={loading}>
      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Checking…' : 'Check now'}
    </Button>
  )
}
