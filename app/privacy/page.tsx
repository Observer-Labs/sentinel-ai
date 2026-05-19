import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
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
        <h1 className="font-sans font-bold text-h2 text-[#F1F5F9] mb-6">Privacy Policy</h1>
        <div className="prose text-[#94A3B8] space-y-4 text-body leading-relaxed">
          <p>Last updated: May 2026</p>
          <p>Sentinel collects the information you provide when creating an account (email, team name) and the competitor data you enter. We use this data solely to provide the monitoring service.</p>
          <p>We do not sell your data to third parties. Competitor website snapshots are stored securely in our database and used only to detect changes on your behalf.</p>
          <p>Email notifications are sent via Resend. WhatsApp notifications use Meta's Cloud API with your explicit opt-in. We store only the phone number you provide.</p>
          <p>You may delete your account and all associated data at any time by contacting support.</p>
        </div>
      </div>
    </div>
  )
}
