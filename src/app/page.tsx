import PricingCard from '@/components/pricing/PricingCard';
import TrialVideo from '@/components/video/TrialVideo';
import Testimonials from '@/components/home/Testimonials';
import ScrollReveal from '@/components/common/ScrollReveal';
import { ArrowRight, Zap, ShieldCheck, PlayCircle, Infinity, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const pricingTiers = [
    {
      tier: 'Monthly',
      price: '29',
      interval: 'month',
      features: ['Access to all courses', 'Community support', 'Weekly live Q&A', 'Downloadable resources'],
    },
    {
      tier: 'Quarterly',
      price: '49',
      interval: '3 months',
      features: ['All Monthly features', 'Exclusive workshop access', '1-on-1 mentor session', 'Priority support'],
      isPopular: true,
    },
    {
      tier: 'Annual',
      price: '99',
      interval: 'year',
      features: ['All Quarterly features', 'Access to premium masterclass', 'Downloadable resources', 'Lifetime course updates'],
    },
  ];

  const trialVideos = [
    { title: 'Introduction to React', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2940&auto=format&fit=crop', isUnlocked: true },
    { title: 'Tailwind CSS Layouts', thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop', isUnlocked: false },
    { title: 'Next.js 14 Fundamentals', thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2834&auto=format&fit=crop', isUnlocked: false },
  ];

  const features = [
    {
      icon: <PlayCircle className="w-7 h-7 text-violet-600" />,
      title: 'Expert-Led Courses',
      description: 'Every course is built by active professionals with real-world experience — not just theory.',
      gradient: 'from-violet-50 to-purple-50',
      accent: 'bg-violet-100',
    },
    {
      icon: <Infinity className="w-7 h-7 text-sky-600" />,
      title: 'Lifetime Access',
      description: 'Buy once, keep forever. Your purchased courses never expire, even as content gets updated.',
      gradient: 'from-sky-50 to-cyan-50',
      accent: 'bg-sky-100',
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-emerald-600" />,
      title: 'Crypto Payments',
      description: 'Pay privately with BTC, USDT, or USDC. No chargebacks, no friction, instant access.',
      gradient: 'from-emerald-50 to-teal-50',
      accent: 'bg-emerald-100',
    },
    {
      icon: <Zap className="w-7 h-7 text-amber-600" />,
      title: 'Learn at Your Pace',
      description: 'No deadlines, no pressure. Progress through lessons whenever and wherever suits you.',
      gradient: 'from-amber-50 to-orange-50',
      accent: 'bg-amber-100',
    },
  ];

  return (
    <main className="min-h-screen pb-24 bg-gradient-to-br from-slate-50 via-white to-violet-50/20 overflow-x-hidden">

      {/* ── HERO ─────────────────────────────── */}
      <ScrollReveal direction="none">
        <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-4 md:px-6 max-w-7xl mx-auto text-center">

          {/* Animated blob decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-16 left-1/4 w-72 h-72 bg-violet-200/25 rounded-full blur-3xl animate-blob" />
            <div className="absolute top-32 right-1/4 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
          </div>

          {/* Dot grid pattern */}
          <div className="absolute inset-0 bg-pattern-dots opacity-[0.35] pointer-events-none -z-10" />

          <ScrollReveal direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-violet-100 rounded-full text-violet-600 text-xs font-black uppercase tracking-widest mb-8 shadow-sm shadow-violet-100">
              <Sparkles className="w-3.5 h-3.5" />
              New courses added every month
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 px-2 leading-[1.05]">
              {"Don't Just Code."} <br />
              <span className="premium-gradient uppercase italic">Build The Future.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto mb-12 font-medium px-4 leading-relaxed">
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
                className="px-10 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 hover:border-slate-300 transition-all w-full sm:w-auto text-center shadow-sm"
              >
                Browse Courses
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </ScrollReveal>

      {/* ── FEATURES ─────────────────────────── */}
      <ScrollReveal>
        <section className="py-16 md:py-20 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className={`bg-gradient-to-br ${f.gradient} border border-white rounded-[2rem] p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 group`}>
                  <div className={`w-14 h-14 ${f.accent} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
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
        <section id="trial" className="py-20 md:py-28 px-4 md:px-6 max-w-7xl mx-auto scroll-mt-32">
          {/* Section header with accent line */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-100 rounded-full text-violet-500 text-[10px] font-black uppercase tracking-widest mb-5">
              <PlayCircle className="w-3 h-3" />
              Free Previews
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">
              High-Quality <span className="premium-gradient">Learning</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed font-medium">
              {"The first lesson of every course is completely free — no account required."}
            </p>
            <Link href="/courses" className="inline-flex items-center gap-2 mt-6 text-sm font-black text-violet-600 hover:text-violet-800 transition-colors group">
              Browse all courses
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {trialVideos.map((video, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <TrialVideo {...video} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── SECTION DIVIDER ──────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* ── PRICING ──────────────────────────── */}
      <ScrollReveal>
        <section id="pricing" className="py-20 md:py-28 px-4 md:px-6 max-w-7xl mx-auto scroll-mt-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-5">
              <ShieldCheck className="w-3 h-3" />
              Transparent Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">
              Simple, Clear <span className="premium-gradient">Plans</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed font-medium">
              Subscribe for full catalog access, or purchase individual courses for lifetime ownership. Pay with crypto or card.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pricingTiers.map((tier, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <PricingCard {...tier} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-10 text-center p-6 bg-white/80 backdrop-blur border border-slate-100 rounded-[2rem] shadow-sm">
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
      <div className="px-4 md:px-6">
        <Testimonials />
      </div>

      {/* ── FINAL CTA ────────────────────────── */}
      <ScrollReveal direction="none">
        <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 md:px-6 mb-16">
          <div className="relative bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-20 overflow-hidden text-center group">
            {/* Blob glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/25 blur-[80px] -mr-40 -mt-40 group-hover:bg-violet-600/35 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-600/15 blur-[80px] -ml-40 -mb-40 group-hover:bg-sky-600/25 transition-colors duration-700" />
            {/* Subtle dot grid on dark bg */}
            <div className="absolute inset-0 opacity-[0.06] bg-pattern-dots" />

            <div className="relative z-10 flex flex-col items-center">
              <ScrollReveal direction="up" delay={0.2}>
                <h2 className="text-3xl md:text-6xl font-black !text-white mb-6 tracking-tight leading-tight">
                  Ready to level up? <br />
                  <span className="text-violet-400">Start learning today.</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.4}>
                <p className="!text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-10 font-medium leading-relaxed">
                  A growing community of developers building real skills with CoursePro.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.6}>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-3 px-10 md:px-14 py-5 bg-white text-slate-900 text-lg md:text-xl font-black rounded-2xl hover:bg-slate-100 transition-all hover:scale-105 shadow-2xl shadow-white/10 w-full sm:w-auto"
                >
                  Create Free Account
                  <ArrowRight className="w-6 h-6" />
                </Link>
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
