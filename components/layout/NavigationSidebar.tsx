'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Shield, LayoutDashboard, Users, Bell, Settings, LogOut,
  Plug, ChevronDown, Sun, Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

const navItems = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/competitors',  label: 'Competitors',  icon: Users },
  { href: '/alerts',       label: 'Alerts',       icon: Bell },
  { href: '/settings',     label: 'Settings',     icon: Settings },
]

interface Props {
  userEmail?: string
  teamName?: string
}

export function NavigationSidebar({ userEmail, teamName }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { isLightMode, toggleLightMode } = useAppStore()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = (userEmail ?? 'U').slice(0, 2).toUpperCase()

  return (
    <aside className="flex h-full w-60 flex-col bg-[#0F172A] border-r border-[#1E293B]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-[#1E293B]">
        <div className="flex h-8 w-8 items-center justify-center rounded-card bg-[#EF4444]/10 border border-[#EF4444]/30">
          <Shield className="h-5 w-5 text-[#EF4444]" />
        </div>
        <span className="font-sans font-bold text-[1rem] text-[#F1F5F9] tracking-tight">Sentinel</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <ul className="flex flex-col gap-1 px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-btn font-sans text-body font-medium transition-colors min-h-touch',
                    active
                      ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
                      : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9]'
                  )}
                >
                  <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-[#EF4444]' : 'text-[#64748B]')} />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 px-2">
          <div className="h-px bg-[#1E293B]" />
          <ul className="mt-2 flex flex-col gap-1">
            <li>
              <Link
                href="/settings/integrations"
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-btn font-sans text-body font-medium transition-colors min-h-touch',
                  pathname === '/settings/integrations'
                    ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
                    : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9]'
                )}
              >
                <Plug className="h-5 w-5 shrink-0 text-[#64748B]" />
                Integrations
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* User menu */}
      <div className="border-t border-[#1E293B] p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-btn px-3 py-2.5 min-h-touch text-left hover:bg-[#1E293B] transition-colors">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="text-[0.75rem]">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate font-sans text-body font-medium text-[#F1F5F9]">
                  {teamName ?? 'My Team'}
                </p>
                <p className="truncate font-sans text-[0.75rem] text-[#64748B]">{userEmail}</p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-[#64748B]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleLightMode}>
              {isLightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {isLightMode ? 'Dark mode' : 'Light mode'}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings"><Settings className="h-4 w-4" />Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-[#EF4444] focus:text-[#EF4444]">
              <LogOut className="h-4 w-4" />Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
