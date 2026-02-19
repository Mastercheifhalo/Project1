"use client";

import React from 'react';
import MasterCoursePlayer from '@/components/video/MasterCoursePlayer';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Share2,
    Calendar,
    MessageSquare,
    Star
} from 'lucide-react';

const LessonPage = () => {
    const [isCompleted, setIsCompleted] = React.useState(false);

    // Mock current lesson data
    const lesson = {
        id: '3',
        title: 'Deep Dive into Server Components',
        duration: '45:10',
        description: 'In this module, we explore the architectural shift towards Server Components. We will cover the benefits of zero-bundle-size components, the distinction between Server and Client components, and when to use each for optimal performance and user experience.',
        objectives: [
            'Understanding RSC (React Server Components) payload mechanics',
            'Implementing hybrid components effectively',
            'Streaming and Suspense integration',
            'Caching strategies for data-heavy server components'
        ],
        nextLessonId: '4',
        prevLessonId: '2'
    };

    return (
        <div className="p-6 md:p-12 space-y-12 max-w-[1200px] mx-auto pb-24">
            {/* The Player Section */}
            <section className="space-y-8">
                <MasterCoursePlayer
                    videoUrl="https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190828_27_Super_Slow_Motion_1080p_001_preview.mp4"
                    thumbnail="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2940&auto=format&fit=crop"
                />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pt-4">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-violet-100">
                                Current Strategy
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">•</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lesson.duration} Duration</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight uppercase italic underline decoration-violet-600/30 underline-offset-8">
                            {lesson.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsCompleted(!isCompleted)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] transition-all shadow-xl active:scale-95 ${isCompleted
                                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800'
                                }`}
                        >
                            {isCompleted ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                    Completed
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 rounded-full border-2 border-white/30" />
                                    Mark as Complete
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* Description & Objectives */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-slate-100">
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Lesson Overview</h3>
                        <p className="text-slate-500 font-bold leading-relaxed">
                            {lesson.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Learning Objectives</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {lesson.objectives.map((obj, i) => (
                                <div key={i} className="flex items-start gap-3 p-5 bg-white border border-slate-50 rounded-2xl shadow-sm group hover:border-violet-100 transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                                    <span className="text-xs font-bold text-slate-600 leading-snug">{obj}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info (Meta) */}
                <div className="space-y-8">
                    <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Program</span>
                        </div>
                    </div>

                    {/* Next Lesson Preview */}
                    <div className="p-6 bg-violet-600 rounded-[2rem] text-white shadow-xl shadow-violet-600/20 group cursor-pointer overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Star className="w-16 h-16 fill-current" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-200">Next Lesson</p>
                            <h4 className="text-lg font-black tracking-tight leading-tight uppercase italic">{lesson.nextLessonId}. Advanced Data Caching</h4>
                            <div className="flex items-center gap-2 text-xs font-bold">
                                <span>Go to lesson</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonPage;
