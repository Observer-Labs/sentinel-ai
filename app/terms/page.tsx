import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-12">
      <div className="max-w-[640px] mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-card bg-[#EF4444]/10 border border-[#EF4444]/30">
              <Shield className="h-5 w-5 text-[#EF4444]" />
            </div>
            <span className="font-sans font-bold text-body text-[#F1F5F9]">Sentinel</span>
          </Link>
        </div>
        <h1 className="font-sans font-bold text-h2 text-[#F1F5F9] mb-6">Terms of Service</h1>
        <div className="text-[#94A3B8] space-y-4 text-body leading-relaxed">
          <p>Last updated: May 2026</p>
          <p>By using Sentinel, you agree to use the service only for lawful competitive intelligence purposes. You may not use Sentinel to scrape or monitor websites in violation of their Terms of Service, or to collect personal data about individuals without their consent.</p>
          <p>Sentinel is a monitoring tool. We do not republish or redistribute any competitor content. All data collected remains yours.</p>
          <p>We reserve the right to terminate accounts that abuse the monitoring service (excessive checks, targeting protected endpoints, etc.).</p>
          <p>The service is provided "as-is". We do not guarantee 100% uptime or accuracy of change detection.</p>
        </div>
      </div>
    </div>
  )
}
