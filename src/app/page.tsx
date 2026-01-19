import PricingCard from '@/components/pricing/PricingCard';
import TrialVideo from '@/components/video/TrialVideo';

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
      price: "50",
      interval: "3 months",
      features: ["All Monthly features", "Exclusive workshop access", "1-on-1 mentor session", "Priority support"],
      isPopular: true
    },
    {
      tier: "Annual",
      price: "100",
      interval: "year",
      features: ["All Quarterly features", "Access to premium masterclass", "Downloadable resources", "Lifetime course updates"],
    }
  ];

  const trialVideos = [
    { title: "Introduction to Web Architecture", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800", isUnlocked: true },
    { title: "Next.js 14 Deep Dive", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800", isUnlocked: false },
    { title: "Advanced CSS Patterns", thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800", isUnlocked: false },
  ];

  return (
    <main className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-10 pointer-events-none -z-10" />

        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
          Master Modern <span className="premium-gradient">Development</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Join thousands of students and learn from industry experts with our subscription-based course platform.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#pricing" className="px-10 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl shadow-xl shadow-violet-600/20 transition-all">
            Get Started Now
          </a>
          <a href="#trial" className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 transition-all">
            Watch Trial Videos
          </a>
        </div>
      </section>

      {/* Trial Videos Section */}
      <section id="trial" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Inside the Classroom</h2>
          <p className="text-slate-400">Explore some of our premium lessons. Locked content is available to subscribers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trialVideos.map((video, index) => (
            <TrialVideo key={index} {...video} />
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Simple, Transparent <span className="text-violet-500">Pricing</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto">Choose the plan that fits your learning pace. Subscriptions unlock all current and future courses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={index} {...tier} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 pt-12 border-t border-slate-800 text-center text-slate-500">
        <p>© 2026 CoursePlatform Inc. All rights reserved.</p>
      </footer>
    </main>
  );
}
