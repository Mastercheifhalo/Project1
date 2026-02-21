import PricingCard from '@/components/pricing/PricingCard';
import TrialVideo from '@/components/video/TrialVideo';
import Testimonials from '@/components/home/Testimonials';
import ScrollReveal from '@/components/common/ScrollReveal';
import { ArrowRight, Zap, ShieldCheck, PlayCircle, Infinity } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const pricingTiers = [
    {
      tier: "Monthly",
      price: "29",
      interval: "month",
      features: ["Access to all courses", "Community support", "Weekly live Q&A", "Downloadable resources"],
    },
    {
      tier: "Quarterly",
      price: "49",
      interval: "3 months",
      features: ["All Monthly features", "Exclusive workshop access", "1-on-1 mentor session", "Priority support"],
      isPopular: true
    },
    {
      tier: "Annual",
      price: "99",
      interval: "year",
      features: ["All Quarterly features", "Access to premium masterclass", "Downloadable resources", "Lifetime course updates"],
    }
  ];

  const trialVideos = [
    { title: "Introduction to React", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2940&auto=format&fit=crop", isUnlocked: true },
    { title: "Tailwind CSS Layouts", thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop", isUnlocked: false },
    { title: "Next.js 14 Fundamentals", thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2834&auto=format&fit=crop", isUnlocked: false },
  ];

  const features = [
    {
      icon: <PlayCircle className="w-7 h-7 text-violet-600" />,
      title: "Expert-Led Courses",
      description: "Every course is built by active professionals with real-world experience — not just theory.",
    },
    {
      icon: <Infinity className="w-7 h-7 text-violet-600" />,
      title: "Lifetime Access",
      description: "Buy once, keep forever. Your purchased courses never expire, even as content gets updated.",
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-violet-600" />,
      title: "Crypto Payments",
      description: "Pay privately with BTC, USDT, or USDC. No chargebacks, no friction, instant access.",
    },
    {
      icon: <Zap className="w-7 h-7 text-violet-600" />,
      title: "Learn at Your Pace",
      description: "No deadlines, no pressure. Progress through lessons whenever and wherever suits you.",
    },
  ];

  return (
    <main className="min-h-screen pb-24">

      {/* ── HERO ─────────────────────────────── */}
      <ScrollReveal direction="none">
        <section className="relative pt-32 md:pt-36 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-5 pointer-events-none -z-10" />

          <ScrollReveal direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-full text-violet-600 text-xs font-black uppercase tracking-widest mb-8">
              <Zap className="w-3.5 h-3.5" />
              New courses added every month
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 px-2 leading-[1.1]">
              Don&apos;t Just Code. <br />
              <span className="premium-gradient uppercase italic">Build The Future.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-medium px-4">
              Practical, project-based courses designed by working developers.
              Learn skills that matter — and apply them from day one.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.6}>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-6 sm:px-0">
              <a href="#pricing" className="button-premium w-full sm:w-auto">
                View Plans
              </a>
              <Link
                href="/courses"
                className="px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-2xl border border-slate-200 transition-all w-full sm:w-auto text-center"
              >
                Browse Courses
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </ScrollReveal>

      {/* ── FEATURES / VALUE PROPS ───────────── */}
      <ScrollReveal>
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-white border border-slate-100 rounded-[2rem] p-8 hover:border-violet-100 hover:shadow-lg transition-all group">
                  <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-violet-100 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2 uppercase tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── TRIAL VIDEOS ─────────────────────── */}
      <ScrollReveal>
        <section id="trial" className="py-24 px-4 md:px-6 max-w-7xl mx-auto scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight uppercase">High-Quality <span className="text-violet-500">Learning</span></h2>
            <p className="text-slate-600 max-w-xl mx-auto text-lg leading-relaxed font-medium">
              Get a taste of what&apos;s inside. The first lesson of every course is completely free — no account required.
            </p>
            <Link href="/courses" className="inline-flex items-center gap-2 mt-6 text-sm font-black text-violet-600 hover:text-violet-800 transition-colors">
              Browse all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trialVideos.map((video, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <TrialVideo {...video} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── PRICING ──────────────────────────── */}
      <ScrollReveal>
        <section id="pricing" className="py-24 px-4 md:px-6 max-w-7xl mx-auto scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight uppercase">Simple, Transparent <span className="text-violet-500">Pricing</span></h2>
            <p className="text-slate-600 max-w-xl mx-auto text-lg leading-relaxed font-medium">
              Subscribe for full catalog access, or purchase individual courses for lifetime ownership. Pay with crypto or card.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <PricingCard {...tier} />
              </ScrollReveal>
            ))}
          </div>

          {/* One-time purchase note */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-12 text-center p-8 bg-slate-50 border border-slate-100 rounded-[2rem]">
              <p className="text-slate-500 font-medium text-sm">
                Prefer to buy one course at a time?{' '}
                <Link href="/courses" className="text-violet-600 font-black hover:underline">
                  Browse individual courses →
                </Link>{' '}
                Each course is also available as a one-time lifetime purchase.
              </p>
            </div>
          </ScrollReveal>
        </section>
      </ScrollReveal>

      {/* ── TESTIMONIALS ─────────────────────── */}
      <Testimonials />

      {/* ── FINAL CTA ────────────────────────── */}
      <ScrollReveal direction="none">
        <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 md:px-6 mb-24">
          <div className="relative bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-24 overflow-hidden text-center group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/30 blur-[100px] -mr-48 -mt-48 group-hover:bg-violet-600/40 transition-colors" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-600/20 blur-[100px] -ml-48 -mb-48 group-hover:bg-sky-600/30 transition-colors" />

            <div className="relative z-10 flex flex-col items-center">
              <ScrollReveal direction="up" delay={0.2}>
                <h2 className="text-3xl md:text-6xl font-black !text-white mb-8 tracking-tight leading-tight">
                  Ready to level up? <br />
                  <span className="text-violet-400">Start learning today.</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.4}>
                <p className="!text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
                  A growing community of developers building real skills with CoursePro.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.6}>
                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-3 px-8 md:px-12 py-5 bg-white text-slate-900 text-lg md:text-xl font-black rounded-2xl hover:bg-slate-100 transition-all hover:scale-105 shadow-2xl shadow-white/10 w-full sm:w-auto"
                >
                  Create Free Account
                  <ArrowRight className="w-6 h-6" />
                </a>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── FOOTER ───────────────────────────── */}
      <footer className="border-t border-slate-100 pt-14 pb-12 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12 12 0 01.84 6.894A11.955 11.955 0 0112 21a11.955 11.955 0 01-6.999-2.528 12 12 0 01.84-6.894L12 14z" />
                </svg>
              </div>
              <span className="font-black text-slate-900 tracking-tight">COURSE<span className="premium-gradient">PRO</span></span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Practical skills for builders. Learn, ship, grow.
            </p>
          </div>

          {/* Learn */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Learn</p>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><Link href="/courses" className="hover:text-violet-600 transition-colors">All Courses</Link></li>
              <li><a href="#pricing" className="hover:text-violet-600 transition-colors">Pricing Plans</a></li>
              <li><Link href="/courses" className="hover:text-violet-600 transition-colors">Free Lessons</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Platform</p>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><Link href="/dashboard" className="hover:text-violet-600 transition-colors">Dashboard</Link></li>
              <li><Link href="/support" className="hover:text-violet-600 transition-colors">Support</Link></li>
              <li><Link href="/login" className="hover:text-violet-600 transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Legal</p>
            <ul className="space-y-3 text-sm font-medium text-slate-500">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
              <li><span className="cursor-default">Refund Policy</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs font-medium">© 2026 CoursePro. All rights reserved.</p>
          <p className="text-slate-300 text-xs font-medium">Built for builders.</p>
        </div>
      </footer>

    </main>
  );
}
