'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, Globe, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

const socialSchema = z.object({
  platform: z.enum(['instagram', 'twitter', 'linkedin', 'tiktok']),
  handle: z.string().min(1, 'Handle required'),
  url: z.string().url('Invalid URL'),
})

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  type: z.enum(['website', 'social', 'both']),
  category: z.string().default('General'),
  website_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_accounts: z.array(socialSchema),
})

type FormData = z.infer<typeof schema>

const categories = ['General', 'Direct Competitors', 'Adjacent Players', 'Influencers', 'Partners']
const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
]

interface Props {
  open: boolean
  onClose: () => void
  onCreated: () => void
  userId: string
}

export function AddCompetitorModal({ open, onClose, onCreated, userId }: Props) {
  const { toast } = useToast()
  const supabase = createClient()

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: { type: 'website', category: 'General', social_accounts: [] },
    })

  const { fields, append, remove } = useFieldArray({ control, name: 'social_accounts' })
  const type = watch('type')

  async function onSubmit(data: FormData) {
    const { error } = await supabase.from('competitors').insert({
      user_id: userId,
      name: data.name,
      type: data.type,
      category: data.category,
      website_url: data.website_url || null,
      social_accounts: data.social_accounts,
    })

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
      return
    }

    // If website type, create a monitor
    if (data.website_url && (data.type === 'website' || data.type === 'both')) {
      const { data: competitor } = await supabase
        .from('competitors')
        .select('id')
        .eq('user_id', userId)
        .eq('name', data.name)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (competitor) {
        await supabase.from('website_monitors').insert({
          competitor_id: competitor.id,
          url: data.website_url,
          check_frequency: 'daily',
          is_active: true,
        })
      }
    }

    toast({ title: 'Competitor added', description: `${data.name} is now being monitored.`, variant: 'success' })
    reset()
    onCreated()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Competitor</DialogTitle>
          <DialogDescription>Track a competitor's website, social media, or both.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Competitor name</Label>
            <Input id="name" placeholder="e.g. Acme Corp" {...register('name')} />
            {errors.name && <p className="text-body text-[#EF4444]">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Type</Label>
              <Select
                defaultValue="website"
                onValueChange={(v) => setValue('type', v as FormData['type'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website"><Globe className="h-4 w-4 inline mr-1" />Website</SelectItem>
                  <SelectItem value="social"><Users className="h-4 w-4 inline mr-1" />Social</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select
                defaultValue="General"
                onValueChange={(v) => setValue('category', v)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(type === 'website' || type === 'both') && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                type="url"
                placeholder="https://competitor.com"
                {...register('website_url')}
              />
              {errors.website_url && <p className="text-body text-[#EF4444]">{errors.website_url.message}</p>}
            </div>
          )}

          {(type === 'social' || type === 'both') && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Social accounts</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => append({ platform: 'instagram', handle: '', url: '' })}
                >
                  <Plus className="h-4 w-4" />Add account
                </Button>
              </div>
              {fields.map((field, idx) => (
                <div key={field.id} className="flex flex-col gap-2 rounded-card border border-[#334155] p-3">
                  <div className="flex items-center justify-between">
                    <Select
                      defaultValue={field.platform}
                      onValueChange={(v) => setValue(`social_accounts.${idx}.platform`, v as typeof field.platform)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(idx)}>
                      <Trash2 className="h-4 w-4 text-[#EF4444]" />
                    </Button>
                  </div>
                  <Input placeholder="@handle" {...register(`social_accounts.${idx}.handle`)} />
                  <Input type="url" placeholder="https://instagram.com/..." {...register(`social_accounts.${idx}.url`)} />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding…' : 'Add competitor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
