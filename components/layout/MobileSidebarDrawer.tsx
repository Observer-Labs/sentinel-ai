'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { NavigationSidebar } from './NavigationSidebar'
import { cn } from '@/lib/utils'

interface Props {
  userEmail?: string
  teamName?: string
}

export function MobileSidebarDrawer({ userEmail, teamName }: Props) {
  const { sidebarOpen, setSidebarOpen } = useAppStore()

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  if (!sidebarOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setSidebarOpen(false)}
      />
      {/* Drawer */}
      <div className={cn('absolute left-0 top-0 h-full animate-slide-in-right')}>
        <div className="relative h-full">
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-3 top-3 z-10 p-2 text-[#64748B] hover:text-[#F1F5F9] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <NavigationSidebar userEmail={userEmail} teamName={teamName} />
        </div>
      </div>
    </div>
  )
}
