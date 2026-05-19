export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NavigationSidebar } from '@/components/layout/NavigationSidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MobileSidebarDrawer } from '@/components/layout/MobileSidebarDrawer'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('team_name')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F172A]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <NavigationSidebar userEmail={user.email} teamName={profile?.team_name} />
      </div>

      {/* Mobile sidebar drawer */}
      <MobileSidebarDrawer userEmail={user.email} teamName={profile?.team_name} />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  )
}
