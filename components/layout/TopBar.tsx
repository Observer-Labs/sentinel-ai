'use client'

import { Menu, Shield, Bell } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'

export function TopBar() {
  const { toggleSidebar } = useAppStore()

  return (
    <header className="flex items-center justify-between border-b border-[#1E293B] bg-[#0F172A] px-4 py-3 md:hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-card bg-[#EF4444]/10 border border-[#EF4444]/30">
          <Shield className="h-5 w-5 text-[#EF4444]" />
        </div>
        <span className="font-sans font-bold text-body text-[#F1F5F9]">Sentinel</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/alerts"><Bell className="h-5 w-5" /></Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
