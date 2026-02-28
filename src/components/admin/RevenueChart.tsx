'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

type RevenueChartProps = {
    data: { date: string; revenue: number }[];
};

export default function RevenueChart({ data }: RevenueChartProps) {
    return (
        <div className="w-full h-[300px] md:h-[400px] bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm group">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Revenue Trend</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daily confirmed earnings</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-violet-600 rounded-full shadow-[0_0_8px_rgba(124,58,237,0.4)]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmed Payment</span>
                </div>
            </div>

            <div className="w-full h-[220px] md:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                color: '#fff',
                                padding: '12px'
                            }}
                            itemStyle={{ color: '#a78bfa', fontWeight: 800, fontSize: '14px' }}
                            labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                            formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, 'Revenue']}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#7c3aed"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
