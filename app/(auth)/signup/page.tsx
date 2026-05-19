'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  team_name: z.string().min(1, 'Team name is required'),
  industry: z.string().min(1, 'Industry is required'),
})

type FormData = z.infer<typeof schema>

const industries = [
  'E-commerce', 'SaaS', 'Consumer Goods', 'Media & Publishing',
  'Finance', 'Healthcare', 'Real Estate', 'Other',
]

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setAuthError(null)
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { team_name: data.team_name, industry: data.industry },
      },
    })
    if (error) { setAuthError(error.message); return }

    if (signUpData.user) {
      await supabase.from('profiles').upsert({
        id: signUpData.user.id,
        team_name: data.team_name,
        industry: data.industry,
        notification_frequency: 'immediate',
        notification_channels: ['in_app', 'email'],
      })
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <h1 className="font-sans font-bold text-h3 text-[#F1F5F9] mb-3">Check your email</h1>
          <p className="text-body text-[#94A3B8] mb-6">
            We sent a confirmation link to your email. Click it to activate your account.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">Back to sign in</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-12">
          <div className="flex h-9 w-9 items-center justify-center rounded-card bg-[#EF4444]/10 border border-[#EF4444]/30">
            <Shield className="h-5 w-5 text-[#EF4444]" />
          </div>
          <span className="font-sans font-bold text-h3 text-[#F1F5F9] tracking-tight">Sentinel</span>
        </div>

        <div className="mb-8">
          <h1 className="font-sans font-bold text-h2 text-[#F1F5F9] mb-2">Create account</h1>
          <p className="text-body text-[#94A3B8]">Start monitoring your competitors today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {authError && (
            <div className="flex items-center gap-2 rounded-card border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3">
              <AlertCircle className="h-5 w-5 text-[#EF4444] shrink-0" />
              <p className="text-body text-[#EF4444]">{authError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="team_name">Team / Company</Label>
              <Input id="team_name" placeholder="Acme Inc." {...register('team_name')} />
              {errors.team_name && <p className="text-body text-[#EF4444]">{errors.team_name.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="industry">Industry</Label>
              <select
                id="industry"
                className="flex h-11 min-h-touch w-full rounded-input border border-[#1E293B] bg-[#1E293B] px-4 py-2 font-sans text-body text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#EF4444]"
                {...register('industry')}
              >
                <option value="">Select…</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              {errors.industry && <p className="text-body text-[#EF4444]">{errors.industry.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" {...register('email')} />
            {errors.email && <p className="text-body text-[#EF4444]">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-body text-[#EF4444]">{errors.password.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-body text-[#94A3B8]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#EF4444] hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
