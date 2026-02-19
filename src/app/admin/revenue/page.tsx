'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Download, Filter, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, Banknote } from 'lucide-react';

const mockTransactions = [
    { id: 'TX-9012', user: 'Sarah Connor', amount: '$29.00', status: 'Completed', date: 'Feb 16, 2026', method: 'Crypto' },
    { id: 'TX-9011', user: 'Alex Rivera', amount: '$49.00', status: 'Completed', date: 'Feb 16, 2026', method: 'Card' },
    { id: 'TX-9010', user: 'James Knight', amount: '$99.00', status: 'Refunded', date: 'Feb 15, 2026', method: 'Crypto' },
    { id: 'TX-9009', user: 'Emma Wilson', amount: '$29.00', status: 'Completed', date: 'Feb 15, 2026', method: 'Card' },
    { id: 'TX-9008', user: 'David Miller', amount: '$49.00', status: 'Completed', date: 'Feb 14, 2026', method: 'Crypto' },
];

const RevenuePage = () => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Revenue <span className="premium-gradient">Analytics</span></h1>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">Monitor your financial performance and transaction history.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl font-bold text-slate-900 shadow-sm hover:bg-slate-50 transition-all">
                    <Download className="w-5 h-5" />
                    Export Report
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Revenue', value: '$124,592', icon: Wallet, color: 'violet' },
                    { label: 'Monthly Growth', value: '+12.5%', icon: TrendingUp, color: 'emerald' },
                    { label: 'Pending Payouts', value: '$12,400', icon: Banknote, color: 'amber' },
                ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.color === 'violet' ? 'bg-violet-600 shadow-violet-600/20' :
                            stat.color === 'emerald' ? 'bg-emerald-600 shadow-emerald-600/20' :
                                'bg-amber-600 shadow-amber-600/20'
                            }`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Area Replacement */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 shadow-2xl shadow-slate-200/40 flex flex-col items-center justify-center text-center text-center min-h-[350px]">
                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6">
                    <TrendingUp className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Financial Insights Pending</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-3 max-w-sm">We're updating our data engine for peak accuracy. Interactive performance charts will return shortly.</p>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden overflow-x-auto">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Transactions</h3>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order ID</th>
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student</th>
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Amount</th>
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Method</th>
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {mockTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors">
                                <td className="px-8 py-6 font-black text-slate-900 text-sm">{tx.id}</td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">
                                            {tx.user.charAt(0)}
                                        </div>
                                        <p className="text-sm font-bold text-slate-600">{tx.user}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6 font-black text-slate-900 text-sm">{tx.amount}</td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                        {tx.method === 'Crypto' ? <Wallet className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                                        {tx.method}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] ${tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                        {tx.status}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RevenuePage;
