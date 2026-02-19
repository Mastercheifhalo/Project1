'use client';

import React from 'react';
import { Users, BookOpen, CreditCard, TrendingUp, BarChart3, Activity } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { motion } from 'framer-motion';

const AdminOverview = () => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const stats = [
        {
            title: 'Total Revenue',
            value: '$124,592',
            icon: CreditCard,
            trend: { value: '12%', isUp: true },
            color: 'emerald' as const
        },
        {
            title: 'Active Students',
            value: '8,432',
            icon: Users,
            trend: { value: '5%', isUp: true },
            color: 'violet' as const
        },
        {
            title: 'Course Sales',
            value: '1,204',
            icon: BookOpen,
            trend: { value: '2%', isUp: false },
            color: 'sky' as const
        },
        {
            title: 'Avg. Engagement',
            value: '76%',
            icon: Activity,
            trend: { value: '8%', isUp: true },
            color: 'amber' as const
        }
    ];

    return (
        <div className="space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Platform <span className="premium-gradient">Overview</span></h1>
                <p className="text-slate-500 font-bold">Welcome back, Master Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart Placeholder or Alternative */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center text-center min-h-[400px]"
                >
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                        <BarChart3 className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Analytics Coming Soon</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-[280px]">We're perfecting our real-time revenue tracking. Check back soon for deep insights.</p>
                </motion.div>

                {/* Top Courses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Top Courses</h3>
                        <Activity className="w-5 h-5 text-slate-300" />
                    </div>

                    <div className="space-y-6">
                        {[
                            { title: 'Next.js Mastery', sales: '842', trend: '+12%', color: 'violet' },
                            { title: 'UX Design Systems', sales: '614', trend: '+8%', color: 'sky' },
                            { title: 'Fullstack Patterns', sales: '432', trend: '+5%', color: 'emerald' },
                            { title: 'Modern CSS Grid', sales: '389', trend: '-2%', color: 'amber' },
                        ].map((course, idx) => {
                            const colorClasses = {
                                violet: 'bg-violet-50 text-violet-600',
                                sky: 'bg-sky-50 text-sky-600',
                                emerald: 'bg-emerald-50 text-emerald-600',
                                amber: 'bg-amber-50 text-amber-600'
                            }[course.color as 'violet' | 'sky' | 'emerald' | 'amber'];

                            return (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl ${colorClasses} flex items-center justify-center font-black text-xs`}>
                                            0{idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 group-hover:text-violet-600 transition-colors uppercase tracking-tight">{course.title}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.sales} Students</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black ${course.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-400'}`}>
                                        {course.trend}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <button className="w-full mt-10 py-3 rounded-2xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">
                        View All Courses
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminOverview;
