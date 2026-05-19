export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NotificationSettingsForm } from '@/components/settings/NotificationSettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-6 max-w-[640px] mx-auto">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-h2 text-[#F1F5F9]">Settings</h1>
        <p className="text-body text-[#94A3B8] mt-1">
          Manage your account and notification preferences.
        </p>
      </div>

      <NotificationSettingsForm
        userId={user.id}
        email={user.email ?? ''}
        initialProfile={profile}
      />
    </div>
  )
}
