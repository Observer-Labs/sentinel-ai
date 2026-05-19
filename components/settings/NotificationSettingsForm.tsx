'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, MessageCircle, Bell, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import type { Profile } from '@/types'

const schema = z.object({
  team_name: z.string().min(1, 'Team name required'),
  whatsapp_number: z.string()
    .regex(/^\+?[1-9]\d{6,14}$/, 'Enter a valid phone number with country code (e.g. +1234567890)')
    .optional()
    .or(z.literal('')),
  notification_frequency: z.enum(['immediate', 'daily', 'weekly']),
  email_enabled: z.boolean(),
  whatsapp_enabled: z.boolean(),
  in_app_enabled: z.boolean(),
})

type FormData = z.infer<typeof schema>

interface Props {
  userId: string
  email: string
  initialProfile: Profile | null
}

function channelsFromProfile(profile: Profile | null): { email: boolean; whatsapp: boolean; in_app: boolean } {
  const channels = profile?.notification_channels ?? ['in_app', 'email']
  return {
    email: channels.includes('email'),
    whatsapp: channels.includes('whatsapp'),
    in_app: channels.includes('in_app'),
  }
}

export function NotificationSettingsForm({ userId, email, initialProfile }: Props) {
  const { toast } = useToast()
  const supabase = createClient()
  const channels = channelsFromProfile(initialProfile)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        team_name: initialProfile?.team_name ?? '',
        whatsapp_number: initialProfile?.whatsapp_number ?? '',
        notification_frequency: initialProfile?.notification_frequency ?? 'immediate',
        email_enabled: channels.email,
        whatsapp_enabled: channels.whatsapp,
        in_app_enabled: channels.in_app,
      },
    })

  const whatsappEnabled = watch('whatsapp_enabled')
  const emailEnabled = watch('email_enabled')
  const inAppEnabled = watch('in_app_enabled')

  async function onSubmit(data: FormData) {
    const notificationChannels: string[] = []
    if (data.in_app_enabled) notificationChannels.push('in_app')
    if (data.email_enabled) notificationChannels.push('email')
    if (data.whatsapp_enabled) notificationChannels.push('whatsapp')

    const { error } = await supabase
      .from('profiles')
      .update({
        team_name: data.team_name,
        whatsapp_number: data.whatsapp_number || null,
        notification_frequency: data.notification_frequency,
        notification_channels: notificationChannels,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) {
      toast({ title: 'Error saving settings', description: error.message, variant: 'destructive' })
      return
    }
    toast({ title: 'Settings saved', description: 'Your notification preferences have been updated.' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* Account */}
      <section>
        <h2 className="font-sans font-semibold text-body text-[#F1F5F9] uppercase tracking-wider text-[0.75rem] mb-4">
          Account
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Email address</Label>
            <Input value={email} disabled className="opacity-60" />
            <p className="text-[0.75rem] text-[#64748B]">Email cannot be changed here. Contact support.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="team_name">Team / Company name</Label>
            <Input id="team_name" placeholder="Acme Inc." {...register('team_name')} />
            {errors.team_name && <p className="text-body text-[#EF4444]">{errors.team_name.message}</p>}
          </div>
        </div>
      </section>

      <Separator />

      {/* Alert frequency */}
      <section>
        <h2 className="font-sans font-semibold text-body text-[#F1F5F9] uppercase tracking-wider text-[0.75rem] mb-4">
          Alert Frequency
        </h2>
        <div className="flex flex-col gap-2">
          <Label>When to notify you</Label>
          <Select
            defaultValue={initialProfile?.notification_frequency ?? 'immediate'}
            onValueChange={(v) => setValue('notification_frequency', v as FormData['notification_frequency'])}
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate — as soon as detected</SelectItem>
              <SelectItem value="daily">Daily digest — once a day</SelectItem>
              <SelectItem value="weekly">Weekly summary — once a week</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[0.75rem] text-[#64748B]">
            In-app notifications always show immediately regardless of this setting.
          </p>
        </div>
      </section>

      <Separator />

      {/* Notification channels */}
      <section>
        <h2 className="font-sans font-semibold text-body text-[#F1F5F9] uppercase tracking-wider text-[0.75rem] mb-4">
          Notification Channels
        </h2>
        <div className="flex flex-col gap-4">
          {/* In-app */}
          <div className="flex items-center justify-between rounded-card border border-[#1E293B] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-purple-500/10 border border-purple-500/20">
                <Bell className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="font-sans font-medium text-body text-[#F1F5F9]">In-app notifications</p>
                <p className="text-[0.75rem] text-[#64748B]">Toast alerts within the dashboard</p>
              </div>
            </div>
            <Switch
              checked={inAppEnabled}
              onCheckedChange={(v) => setValue('in_app_enabled', v)}
            />
          </div>

          {/* Email */}
          <div className="flex items-center justify-between rounded-card border border-[#1E293B] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-blue-500/10 border border-blue-500/20">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="font-sans font-medium text-body text-[#F1F5F9]">Email alerts</p>
                <p className="text-[0.75rem] text-[#64748B]">Sent to {email}</p>
              </div>
            </div>
            <Switch
              checked={emailEnabled}
              onCheckedChange={(v) => setValue('email_enabled', v)}
            />
          </div>

          {/* WhatsApp */}
          <div className="rounded-card border border-[#1E293B] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-green-500/10 border border-green-500/20">
                  <MessageCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="font-sans font-medium text-body text-[#F1F5F9]">WhatsApp alerts</p>
                  <p className="text-[0.75rem] text-[#64748B]">Receive alerts via WhatsApp message</p>
                </div>
              </div>
              <Switch
                checked={whatsappEnabled}
                onCheckedChange={(v) => setValue('whatsapp_enabled', v)}
              />
            </div>

            {whatsappEnabled && (
              <div className="flex flex-col gap-2 pt-3 border-t border-[#334155]">
                <Label htmlFor="whatsapp_number">WhatsApp number</Label>
                <Input
                  id="whatsapp_number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register('whatsapp_number')}
                />
                {errors.whatsapp_number && (
                  <p className="text-body text-[#EF4444]">{errors.whatsapp_number.message}</p>
                )}
                <div className="rounded-sm bg-green-500/5 border border-green-500/20 p-3">
                  <p className="text-[0.75rem] text-green-400 font-medium mb-1">Setup required</p>
                  <p className="text-[0.75rem] text-[#94A3B8]">
                    WhatsApp alerts use the Meta Cloud API. You must opt in to receive messages
                    from our WhatsApp Business number. Enter your number with country code
                    (e.g. +1234567890) and we'll send a test message when you save.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Saving…' : 'Save settings'}
        </Button>
      </div>
    </form>
  )
}
