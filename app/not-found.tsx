import Link from 'next/link'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-card bg-[#EF4444]/10 border border-[#EF4444]/30">
            <Shield className="h-6 w-6 text-[#EF4444]" />
          </div>
        </div>
        <p className="font-mono text-[4rem] font-bold text-[#1E293B] mb-4">404</p>
        <h1 className="font-sans font-bold text-h3 text-[#F1F5F9] mb-3">Page not found</h1>
        <p className="text-body text-[#94A3B8] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
