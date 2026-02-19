'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    color: 'violet' | 'sky' | 'emerald' | 'amber';
}

const colorMap = {
    violet: 'bg-violet-600 shadow-violet-600/20 text-violet-600 border-violet-100 bg-violet-50/50',
    sky: 'bg-sky-600 shadow-sky-600/20 text-sky-600 border-sky-100 bg-sky-50/50',
    emerald: 'bg-emerald-600 shadow-emerald-600/20 text-emerald-600 border-emerald-100 bg-emerald-50/50',
    amber: 'bg-amber-600 shadow-amber-600/20 text-amber-600 border-amber-100 bg-amber-50/50',
};

const iconBgMap = {
    violet: 'bg-violet-600',
    sky: 'bg-sky-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
};

const StatCard = ({ title, value, icon: Icon, trend, color }: StatCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`p-6 rounded-3xl border transition-all duration-300 bg-white/40 backdrop-blur-xl ${colorMap[color].split(' ').slice(2).join(' ')}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${iconBgMap[color]} rounded-2xl flex items-center justify-center shadow-lg shadow-opacity-20`}>
                    <Icon className="text-white w-6 h-6" />
                </div>
                {trend && (
                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${trend.isUp ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                        }`}>
                        {trend.isUp ? '↑' : '↓'} {trend.value}
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
            </div>
        </motion.div>
    );
};

export default StatCard;
