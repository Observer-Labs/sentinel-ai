import Link from 'next/link'
import { ArrowRight, Globe, Bell, TrendingUp, Eye, Zap, BarChart3, Shield, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F1F5F9] font-sans overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[#1E293B]/60 backdrop-blur-md bg-[#0F172A]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#EF4444] flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="font-sans font-bold text-[1.05rem] tracking-tight text-[#F1F5F9]">Sentinel</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[0.85rem] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-[0.85rem] font-medium bg-[#EF4444] hover:bg-[#DC2626] text-white px-4 py-1.5 rounded-btn transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444] text-[0.75rem] font-medium px-3 py-1 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
            Real-time competitor monitoring
          </div>

          <h1 className="font-bold text-[3rem] md:text-[3.8rem] leading-[1.1] tracking-tight text-[#F1F5F9] mb-6">
            Your competitors are moving.
            <br />
            <span className="text-[#EF4444]">Are you watching?</span>
          </h1>

          <p className="text-[1.1rem] text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
            Sentinel tracks competitor websites, pricing changes, and social media activity
            for brands and influencers — and alerts you the moment something shifts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium px-6 py-3 rounded-btn transition-colors text-[0.9rem]"
            >
              Start monitoring free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border border-[#1E293B] hover:border-[#334155] text-[#94A3B8] hover:text-[#F1F5F9] font-medium px-6 py-3 rounded-btn transition-colors text-[0.9rem]"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="rounded-xl border border-[#1E293B] overflow-hidden shadow-2xl shadow-black/40">
            <div className="bg-[#0F172A] border-b border-[#1E293B] px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
              <div className="w-3 h-3 rounded-full bg-[#10B981]/60" />
              <span className="ml-3 text-[0.7rem] font-mono text-[#475569]">sentinel-ai.vercel.app/dashboard</span>
            </div>
            <div className="bg-[#0B1120] p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Competitors tracked', value: '12', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
                { label: 'Unread alerts', value: '4', color: 'text-[#EF4444]', border: 'border-[#EF4444]/20', bg: 'bg-[#EF4444]/10' },
                { label: 'High severity', value: '1', color: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20', bg: 'bg-[#F59E0B]/10' },
              ].map((s) => (
                <div key={s.label} className={`rounded-card border ${s.border} ${s.bg} p-4`}>
                  <p className="text-[0.7rem] text-[#64748B] uppercase tracking-wider mb-1">{s.label}</p>
                  <p className={`font-mono font-bold text-2xl ${s.color}`}>{s.value}</p>
                </div>
              ))}
              <div className="md:col-span-3 rounded-card border border-[#1E293B] bg-[#0F172A] p-4">
                <p className="text-[0.7rem] text-[#475569] uppercase tracking-wider mb-3">Recent Alerts</p>
                {[
                  { name: 'Nike', type: 'Website change', time: '2m ago', severity: 'high', desc: 'Homepage hero updated — new campaign detected' },
                  { name: 'Adidas', type: 'Price change', time: '1h ago', severity: 'medium', desc: 'Running shoes dropped 15% sitewide' },
                  { name: '@gymmotivation', type: 'Follower spike', time: '3h ago', severity: 'low', desc: '+12K followers in 24h after collab post' },
                ].map((a) => (
                  <div key={a.name} className="flex items-start gap-3 py-2.5 border-b border-[#1E293B] last:border-0">
                    <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.severity === 'high' ? 'bg-[#EF4444]' : a.severity === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.8rem] font-medium text-[#F1F5F9]">{a.name}</span>
                        <span className="text-[0.7rem] text-[#475569]">{a.type}</span>
                      </div>
                      <p className="text-[0.75rem] text-[#64748B] truncate">{a.desc}</p>
                    </div>
                    <span className="text-[0.7rem] font-mono text-[#475569] flex-shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Brands / For Influencers ── */}
      <section className="py-24 px-6 border-t border-[#1E293B]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[0.75rem] text-[#EF4444] font-medium uppercase tracking-widest mb-3">Built for two worlds</p>
            <h2 className="font-bold text-[2.2rem] text-[#F1F5F9]">One tool, two use cases</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-card border border-[#1E293B] bg-[#0B1120] p-8">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-[1.3rem] font-bold text-[#F1F5F9] mb-2">For Brands</h3>
              <p className="text-[0.875rem] text-[#64748B] mb-6 leading-relaxed">
                Stay ahead of competitor pricing, campaign launches, and website changes before they impact your market position.
              </p>
              <ul className="space-y-3">
                {[
                  'Website & landing page change detection',
                  'Pricing page monitoring & alerts',
                  'Competitor campaign launch detection',
                  'Social media follower & engagement tracking',
                  'Instant alerts via email or WhatsApp',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.85rem] text-[#94A3B8]">
                    <Check className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card border border-[#EF4444]/20 bg-[#EF4444]/5 p-8">
              <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mb-6">
                <TrendingUp className="w-5 h-5 text-[#EF4444]" />
              </div>
              <h3 className="text-[1.3rem] font-bold text-[#F1F5F9] mb-2">For Influencers</h3>
              <p className="text-[0.875rem] text-[#64748B] mb-6 leading-relaxed">
                Monitor what other creators and public accounts are doing across Instagram, TikTok, X, and LinkedIn — without logging in to each platform.
              </p>
              <ul className="space-y-3">
                {[
                  'Track follower growth across platforms',
                  'Engagement rate comparisons',
                  'New post & collab detection',
                  'Spot viral content before it peaks',
                  'Weekly digest to your inbox or phone',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.85rem] text-[#94A3B8]">
                    <Check className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 border-t border-[#1E293B]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[0.75rem] text-[#EF4444] font-medium uppercase tracking-widest mb-3">What we monitor</p>
            <h2 className="font-bold text-[2.2rem] text-[#F1F5F9] mb-4">Everything in one place</h2>
            <p className="text-[#64748B] text-[0.9rem] max-w-xl mx-auto">
              Add a competitor, choose what to monitor, and let Sentinel do the rest.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Globe className="w-5 h-5 text-blue-400" />,
                bg: 'bg-blue-500/10', border: 'border-blue-500/20',
                title: 'Website Monitoring',
                desc: 'Sentinel snapshots competitor pages and alerts you the moment copy, pricing, or design changes — down to the paragraph.',
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-purple-400" />,
                bg: 'bg-purple-500/10', border: 'border-purple-500/20',
                title: 'Social Metrics',
                desc: 'Track follower counts, engagement rates, and posting frequency across Instagram, TikTok, LinkedIn, and X in one dashboard.',
              },
              {
                icon: <Bell className="w-5 h-5 text-[#EF4444]" />,
                bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/20',
                title: 'Real-time Alerts',
                desc: 'Get notified immediately via email or WhatsApp when something significant happens. No more manual checking.',
              },
            ].map((f) => (
              <div key={f.title} className="rounded-card border border-[#1E293B] bg-[#0B1120] p-6">
                <div className={`w-10 h-10 rounded-lg ${f.bg} border ${f.border} flex items-center justify-center mb-5`}>
                  {f.icon}
                </div>
                <h3 className="text-[1rem] font-semibold text-[#F1F5F9] mb-2">{f.title}</h3>
                <p className="text-[0.85rem] text-[#64748B] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6 border-t border-[#1E293B]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-bold text-[2.2rem] text-[#F1F5F9] mb-4">Up and running in 2 minutes</h2>
            <p className="text-[#64748B] text-[0.9rem]">No integrations, no API keys, no setup headache.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Add a competitor', desc: "Paste their website URL or social handle. That's it." },
              { step: '02', title: 'Choose what to watch', desc: 'Website changes, pricing, social metrics — pick what matters to you.' },
              { step: '03', title: 'Get alerted instantly', desc: 'Email or WhatsApp notification the moment something changes.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="font-mono text-[2.5rem] font-bold text-[#EF4444]/25 mb-3">{s.step}</div>
                <h3 className="text-[1rem] font-semibold text-[#F1F5F9] mb-2">{s.title}</h3>
                <p className="text-[0.85rem] text-[#64748B] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 border-t border-[#1E293B]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mx-auto mb-8">
            <Zap className="w-6 h-6 text-[#EF4444]" />
          </div>
          <h2 className="font-bold text-[2.2rem] text-[#F1F5F9] mb-4">
            Start watching your competitors today
          </h2>
          <p className="text-[#64748B] text-[0.9rem] mb-8 leading-relaxed">
            Free to start. No credit card required.<br />
            Add your first competitor in under 2 minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium px-8 py-3.5 rounded-btn transition-colors text-[0.9rem]"
          >
            Create free account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1E293B] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#EF4444] flex items-center justify-center">
              <Eye className="w-3 h-3 text-white" />
            </div>
            <span className="text-[0.8rem] font-semibold text-[#94A3B8]">Sentinel</span>
            <span className="text-[0.75rem] text-[#475569] ml-2">by Observer AI Studio</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[0.75rem] text-[#475569] hover:text-[#94A3B8] transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[0.75rem] text-[#475569] hover:text-[#94A3B8] transition-colors">Terms</Link>
            <Link href="/login" className="text-[0.75rem] text-[#475569] hover:text-[#94A3B8] transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
