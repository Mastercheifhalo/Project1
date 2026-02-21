import React from 'react';
import {
    Clock,
    BarChart3,
    BookOpen,
    TrendingUp,
} from 'lucide-react';
import CoursePlayer from '@/components/video/CoursePlayer';
import { getDashboardStats } from '@/app/actions/dashboard';
import Link from 'next/link';

export default async function DashboardPage() {
    const data = await getDashboardStats();

    const userName = data?.userName || 'Student';
    const activeCourses = data?.activeCourses ?? 0;
    const totalHours = data?.totalHours ?? 0;
    const totalEnrollments = data?.totalEnrollments ?? 0;

    const stats = [
        { name: 'Courses', value: String(totalEnrollments), icon: <BookOpen className="w-5 h-5" />, color: 'bg-violet-100 text-violet-600', sub: 'enrolled' },
        { name: 'Watching', value: String(activeCourses), icon: <TrendingUp className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600', sub: 'in progress' },
        { name: 'Watch Time', value: `${totalHours}h`, icon: <Clock className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-600', sub: 'total' },
        { name: 'Access', value: (data as any)?.plan || 'Free', icon: <BarChart3 className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600', sub: 'plan' },
    ];

    const activeSession = data?.activeSession;

    return (
        <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Welcome Banner */}
            <div className="bg-white/70 backdrop-blur-md p-5 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-white/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-violet-600/10 transition-colors duration-500" />
                <div className="relative z-10">
                    <h1 className="text-2xl md:text-4xl font-black mb-2 md:mb-4 tracking-tight">Welcome back, <span className="premium-gradient">{userName}!</span></h1>
                    <p className="text-slate-500 font-medium max-w-lg leading-relaxed text-sm md:text-base">
                        {totalEnrollments > 0
                            ? <>You have <span className="text-slate-900 font-black">{totalEnrollments}</span> course{totalEnrollments !== 1 ? 's' : ''} in your library. Keep watching!</>
                            : <>Browse our catalog and get lifetime access to your first course!</>
                        }
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white/70 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${stat.color} flex items-center justify-center mb-3 md:mb-4 shadow-inner`}>
                            {stat.icon}
                        </div>
                        <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
                        <p className="text-2xl md:text-3xl font-black text-slate-900">{stat.value}</p>
                        {'sub' in stat && <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{stat.sub}</p>}
                    </div>
                ))}
            </div>

            {/* Continue Learning */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black tracking-tight">{activeSession ? 'Active Learning Session' : 'Quick Start'}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-violet-100 text-violet-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                                {activeSession ? 'Next Lesson' : 'Explore'}
                            </span>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                {activeSession ? `${activeSession.courseTitle} • ${activeSession.lessonTitle}` : 'Browse catalog to start learning'}
                            </span>
                        </div>
                    </div>
                    {!activeSession && (
                        <Link
                            href="/courses"
                            className="inline-flex items-center justify-center px-6 py-2 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20"
                        >
                            Browse Courses
                        </Link>
                    )}
                </div>

                <CoursePlayer
                    title={activeSession?.courseTitle || "Master Modern Development"}
                    thumbnail={activeSession?.thumbnail || "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop"}
                    videoUrl={activeSession?.lessonVideoUrl || undefined}
                />


            </div>
        </div>
    );
}
