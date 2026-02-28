import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Users, PlayCircle, CheckCircle2, Award } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function SampleHero() {
    return (
        <main className="min-h-screen bg-[#FDFCFB] text-slate-900 pb-24 overflow-hidden font-sans">
            {/* ── SOFT GLOW BACKGROUNDS ── */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-rose-100/40 via-orange-50/40 to-violet-100/30 blur-[120px] rounded-full -ml-40 -mt-40 pointer-events-none" />
            <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-200/30 to-blue-100/30 blur-[100px] rounded-full -mr-40 pointer-events-none" />

            {/* ── HERO SECTION ── */}
            <section className="relative pt-32 md:pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

                    {/* ── LEFT CONTENT ── */}
                    <div className="flex flex-col relative z-10 max-w-2xl">
                        <ScrollReveal direction="up" delay={0.1}>
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/60 border border-slate-200/60 rounded-full shadow-sm backdrop-blur-md mb-8">
                                <div className="flex -space-x-2">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop" alt="Student" className="w-6 h-6 rounded-full border border-white" />
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop" alt="Student" className="w-6 h-6 rounded-full border border-white" />
                                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop" alt="Student" className="w-6 h-6 rounded-full border border-white" />
                                </div>
                                <span className="text-sm font-semibold text-slate-600">
                                    Join <span className="text-violet-600 font-bold">10,000+</span> happy learners
                                </span>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.2}>
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.05] text-slate-900">
                                Master Top Tech <br />
                                Skills With <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-rose-500 italic pe-2">Experts.</span>
                            </h1>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.3}>
                            <p className="text-lg md:text-xl text-slate-600 mb-10 font-medium leading-relaxed max-w-xl">
                                Elevate your career with project-based, interactive courses designed by industry leaders. Learn at your own pace, anytime, anywhere.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.4}>
                            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-stretch">
                                <Link
                                    href="/register"
                                    className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 group"
                                >
                                    Start Learning Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="#trial"
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-all hover:bg-slate-50 flex items-center justify-center gap-2"
                                >
                                    <PlayCircle className="w-5 h-5 text-violet-500" />
                                    Watch Free Trial
                                </Link>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.5}>
                            <div className="mt-10 flex items-center gap-6 text-sm font-semibold text-slate-500">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    Lifetime Access
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    Expert Mentors
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* ── RIGHT VISUAL COMPOSITION ── */}
                    <div className="relative z-10 lg:h-[600px] w-full flex items-center justify-center lg:justify-end">
                        <ScrollReveal direction="up" delay={0.3} className="relative w-full max-w-md lg:max-w-none">

                            {/* Dynamic Shape Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-violet-100 rounded-[3rem] transform rotate-3 scale-105 -z-10" />

                            {/* Main Image Container */}
                            <div className="relative w-full aspect-[4/5] lg:h-[550px] lg:w-[450px] bg-white rounded-[2.5rem] p-2 border border-white shadow-2xl overflow-hidden group">
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2951&auto=format&fit=crop"
                                    alt="Students collaborating"
                                    className="w-full h-full object-cover rounded-[2rem] group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>

                            {/* Floating Badge 1 - Rating */}
                            <div className="absolute -top-6 -left-6 md:-left-12 bg-white/90 backdrop-blur-xl p-4 md:p-5 rounded-2xl shadow-xl border border-white/40 animate-bounce-slow flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 text-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                                <div>
                                    <div className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1">4.9/5</div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Student Rating</div>
                                </div>
                            </div>

                            {/* Floating Badge 2 - Mentor */}
                            <div className="absolute -bottom-8 -right-4 md:-right-8 bg-white/90 backdrop-blur-xl p-4 md:p-5 rounded-[2rem] shadow-xl border border-white/40 animate-pulse-slow flex items-center gap-4 max-w-[220px]">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" alt="Mentor" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Sarah Jenkins</div>
                                    <div className="text-xs font-medium text-violet-600">Senior Dev Mentor</div>
                                </div>
                            </div>

                            {/* Floating Badge 3 - Mini Stat */}
                            <div className="absolute top-1/2 -translate-y-1/2 -right-6 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 hidden md:flex flex-col items-center justify-center">
                                <Award className="w-6 h-6 text-rose-500 mb-1" />
                                <span className="text-[10px] font-bold uppercase text-slate-400 text-center">Top<br />Rated</span>
                            </div>

                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* ── LOGOS STRIP (Optional social proof below hero) ── */}
            <section className="border-y border-slate-100/50 bg-white/40 backdrop-blur-md py-8">
                <div className="max-w-7xl mx-auto px-6 overflow-hidden flex flex-col items-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">Trusted by developers from</p>
                    <div className="flex gap-12 md:gap-24 opacity-40 grayscale flex-wrap justify-center">
                        {/* Mock text logos */}
                        <span className="text-xl font-bold font-serif">Acmecorp</span>
                        <span className="text-xl font-black tracking-tighter">GLOBEX</span>
                        <span className="text-xl font-black italic">Soylent</span>
                        <span className="text-xl font-medium tracking-widest">INITECH</span>
                        <span className="text-xl font-extrabold uppercase hidden md:block">Massive Dynamic</span>
                    </div>
                </div>
            </section>

        </main>
    );
}
