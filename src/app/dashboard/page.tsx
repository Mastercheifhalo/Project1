import React from 'react';
import {
    Play,
    Clock,
    BarChart3,
    Zap,
    TrendingUp,
    Users
} from 'lucide-react';
import CoursePlayer from '@/components/video/CoursePlayer';

export default function DashboardPage() {
    const stats = [
        { name: 'Completed', value: '12', icon: <Zap className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600' },
        { name: 'In Progress', value: '4', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-violet-100 text-violet-600' },
        { name: 'Total Hours', value: '128', icon: <Clock className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-600' },
        { name: 'Ranking', value: '#42', icon: <BarChart3 className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Welcome Banner */}
            <div className="bg-white/70 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-violet-600/10 transition-colors duration-500" />
                <div className="relative z-10">
                    <h1 className="text-4xl font-black mb-4 tracking-tight">Welcome back, <span className="premium-gradient">Student!</span></h1>
                    <p className="text-slate-500 font-medium max-w-lg leading-relaxed">
                        You've completed <span className="text-slate-900 font-black">75%</span> of your weekly goals.
                        Keep it up and reach your target by Sunday!
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4 shadow-inner`}>
                            {stat.icon}
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
                        <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Continue Learning */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Active Learning Session</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-violet-100 text-violet-600 text-[10px] font-black rounded-full uppercase tracking-widest">Next Lesson</span>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Module 4 • Lesson 2</span>
                        </div>
                    </div>
                    <button className="text-violet-600 font-bold text-sm hover:underline">View Course Syllabus</button>
                </div>

                <CoursePlayer
                    title="Mastering Advanced React Hooks & Design Patterns"
                    thumbnail="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop"
                />

            </div>
        </div>
    );
}
