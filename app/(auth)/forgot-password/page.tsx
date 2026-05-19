'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/dashboard`,
    })
    if (error) { setError(error.message); return }
    setSent(true)
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

        {sent ? (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <h1 className="font-sans font-bold text-h3 text-[#F1F5F9] mb-3">Reset link sent</h1>
            <p className="text-body text-[#94A3B8] mb-6">Check your email for a password reset link.</p>
            <Link href="/login"><Button variant="outline" className="w-full">Back to sign in</Button></Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="font-sans font-bold text-h2 text-[#F1F5F9] mb-2">Reset password</h1>
              <p className="text-body text-[#94A3B8]">Enter your email and we'll send a reset link.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {error && (
                <div className="flex items-center gap-2 rounded-card border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3">
                  <AlertCircle className="h-5 w-5 text-[#EF4444] shrink-0" />
                  <p className="text-body text-[#EF4444]">{error}</p>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" {...register('email')} />
                {errors.email && <p className="text-body text-[#EF4444]">{errors.email.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
            <p className="mt-6 text-center text-body text-[#94A3B8]">
              <Link href="/login" className="text-[#EF4444] hover:underline">Back to sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
