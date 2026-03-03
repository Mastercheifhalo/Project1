'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, BookOpen, DollarSign, TrendingUp, BarChart3, Activity, ArrowUpRight } from 'lucide-react';
import { getAdminOverviewStats } from '@/app/actions/admin';

export default function AdminPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminOverviewStats()
            .then(data => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const cards = [
        { name: 'Total Users', value: stats?.totalUsers ?? '—', icon: <Users className="w-5 h-5" />, color: 'bg-violet-100 text-violet-600', trend: '+12%', href: '/admin/users' },
        { name: 'Total Courses', value: stats?.totalCourses ?? '—', icon: <BookOpen className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-600', trend: '+3', href: '/admin/courses' },
        { name: 'Enrollments', value: stats?.totalEnrollments ?? '—', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600', trend: `+${stats?.recentEnrollments ?? 0} this month`, href: '/admin/revenue' },
        { name: 'Revenue', value: stats?.totalRevenue != null ? `$${stats.totalRevenue.toLocaleString()}` : '—', icon: <DollarSign className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600', trend: `${stats?.totalPayments ?? 0} transactions`, href: '/admin/revenue' },
    ];

    return (
        <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight text-slate-900 uppercase">Admin <span className="premium-gradient">Overview</span></h1>
                <p className="text-slate-500 font-medium text-sm md:text-base">Monitor platform performance and key metrics.</p>
            </div>

            {/* Stats Grid — 2 cols on mobile, 4 on lg */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {cards.map((card) => (
                    <Link
                        key={card.name}
                        href={card.href}
                        className={`group bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-violet-200 transition-all duration-300 cursor-pointer ${loading ? 'animate-pulse' : ''}`}
                    >
                        <div className="flex items-start justify-between mb-3 md:mb-4">
                            <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${card.color} flex items-center justify-center shadow-inner`}>
                                {card.icon}
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-colors shrink-0" />
                        </div>
                        <p className="text-[9px] md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 leading-tight">{card.name}</p>
                        <p className="text-xl md:text-3xl font-black text-slate-900">{card.value}</p>
                        <p className="text-xs font-bold text-emerald-500 mt-1 leading-tight">{card.trend}</p>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-violet-600" />
                        </div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Activity</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">{stats?.recentEnrollments ?? 0} new enrollments</p>
                                <p className="text-xs font-medium text-slate-400">Last 30 days</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                <DollarSign className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">{stats?.totalPayments ?? 0} total transactions</p>
                                <p className="text-xs font-medium text-slate-400">All time</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-amber-600" />
                        </div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">Platform Health</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3">
                            <span className="text-sm font-bold text-slate-500">Active Users</span>
                            <span className="text-sm font-black text-slate-900">{stats?.totalUsers ?? 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3">
                            <span className="text-sm font-bold text-slate-500">Published Courses</span>
                            <span className="text-sm font-black text-slate-900">{stats?.totalCourses ?? 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3">
                            <span className="text-sm font-bold text-slate-500">Revenue</span>
                            <span className="text-sm font-black text-emerald-600">${(stats?.totalRevenue ?? 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
