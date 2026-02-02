import PricingCard from '@/components/pricing/PricingCard';
import TrialVideo from '@/components/video/TrialVideo';
import Testimonials from '@/components/home/Testimonials';
import FAQAccordion from '@/components/home/FAQAccordion';
import ScrollReveal from '@/components/common/ScrollReveal';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const pricingTiers = [
    {
      tier: "Monthly",
      price: "29",
      interval: "month",
      features: ["Access to all courses", "Community support", "Weekly live Q&A", "Completion certificates"],
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

  return (
    <main className="min-h-screen pb-24">
      {/* Hero Section */}
      <ScrollReveal direction="none">
        <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-5 pointer-events-none -z-10" />

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 px-2 leading-[1.1]">
              Don't Just Code. <br />
              <span className="premium-gradient uppercase italic">Build The Future.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 font-medium px-4">
              Master the skills top tech companies are hiring for right now.
              Expert-led courses designed to turn you into a <span className="text-violet-600 font-black">Top 1% Developer</span>.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.6}>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-6 sm:px-0">
              <a href="#pricing" className="button-premium w-full sm:w-auto">
                Get Started Now
              </a>
              <a href="#trial" className="px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-2xl border border-slate-200 transition-all w-full sm:w-auto">
                Watch Lessons
              </a>
            </div>
          </ScrollReveal>
        </section>
      </ScrollReveal>


      {/* Trial Videos Section */}
      <ScrollReveal>
        <section id="trial" className="py-24 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold mb-6 tracking-tight uppercase">High-Quality <span className="text-violet-500">Learning</span></h2>
            <p className="text-slate-600 max-w-xl mx-auto text-lg leading-relaxed font-medium">Get a taste of our premium content. Watch these trial lessons to see why thousands of students trust us.</p>
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

      <ScrollReveal>
        <section id="pricing" className="py-24 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold mb-6 tracking-tight uppercase">Simple, Transparent <span className="text-violet-500">Pricing</span></h2>
            <p className="text-slate-600 max-w-xl mx-auto text-lg leading-relaxed font-medium">Choose the plan that fits your learning pace. Subscriptions unlock all current and future courses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <PricingCard {...tier} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ */}
      <FAQAccordion />

      {/* Testimonials */}
      <Testimonials />

      {/* Final CTA Magnet */}
      <ScrollReveal direction="none">
        <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 md:px-6 mb-24">
          <div className="relative bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-24 overflow-hidden text-center group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/30 blur-[100px] -mr-48 -mt-48 group-hover:bg-violet-600/40 transition-colors" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-600/20 blur-[100px] -ml-48 -mb-48 group-hover:bg-sky-600/30 transition-colors" />

            <div className="relative z-10 flex flex-col items-center">
              <ScrollReveal direction="up" delay={0.2}>
                <h2 className="text-3xl md:text-6xl font-black !text-white mb-8 tracking-tight leading-tight">Your Future Self is Waiting. <br /><span className="text-violet-400">Unlock Your Potential Today.</span></h2>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.4}>
                <p className="!text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">Join 25,000+ students already leveling up their careers with our premium courses.</p>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.6}>
                <a href="/login" className="inline-flex items-center justify-center gap-3 px-8 md:px-12 py-5 bg-white text-slate-900 text-lg md:text-xl font-black rounded-2xl hover:bg-slate-100 transition-all hover:scale-105 shadow-2xl shadow-white/10 w-full sm:w-auto">
                  Join The Community
                  <ArrowRight className="w-6 h-6" />
                </a>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer className="mt-24 pt-12 border-t border-slate-100 text-center text-slate-400 pb-12">
        <p>© 2026 CoursePro Platform Inc. All rights reserved.</p>
      </footer>
    </main>
  );
}
