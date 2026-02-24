'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Search } from 'lucide-react';
import { getAdminRevenue, activatePayment } from '@/app/actions/admin';

type PaymentData = {
    id: string;
    userName: string;
    userEmail: string;
    amount: number;
    currency: string;
    method: string;
    coin: string | null;
    plan: string;
    status: string;
    date: string;
};

export default function AdminRevenuePage() {
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activatingId, setActivatingId] = useState<string | null>(null);

    const loadPayments = () => {
        setLoading(true);
        getAdminRevenue()
            .then(data => { setPayments(data); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadPayments();
    }, []);

    const handleActivate = async (id: string) => {
        if (!confirm('Are you sure you want to activate this payment? This will grant the user immediate access.')) return;

        setActivatingId(id);
        try {
            await activatePayment(id);
            loadPayments(); // Refresh list
        } catch (error) {
            console.error('Failed to activate:', error);
            alert('Failed to activate payment. See console for details.');
        } finally {
            setActivatingId(null);
        }
    };

    const totalRevenue = payments.filter(p => p.status === 'CONFIRMED').reduce((sum, p) => sum + p.amount, 0);
    const pendingRevenue = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);
    const confirmedCount = payments.filter(p => p.status === 'CONFIRMED').length;

    const filtered = payments.filter(p =>
        p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.plan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'FAILED': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-2xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight text-slate-900 uppercase">Revenue <span className="premium-gradient">Analytics</span></h1>
                <p className="text-slate-500 font-medium text-sm md:text-base">Track payments and manage manual fulfillment.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmed Revenue</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">${totalRevenue.toLocaleString()}</p>
                    <p className="text-xs font-bold text-emerald-500 mt-1">{confirmedCount} transactions</p>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">${pendingRevenue.toLocaleString()}</p>
                    <p className="text-xs font-bold text-amber-500 mt-1">Awaiting confirmation</p>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Txns</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{payments.length}</p>
                    <p className="text-xs font-bold text-blue-500 mt-1">All time</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-violet-500 transition-all shadow-sm w-full md:w-72"
                />
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-4 animate-pulse">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-14 bg-slate-50 rounded-xl" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-16 text-center">
                        <DollarSign className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-lg font-bold text-slate-400">No transactions yet</p>
                        <p className="text-sm font-medium text-slate-300 mt-1">Revenue data will appear here once payments are processed.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Plan</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Method</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(payment => (
                                    <tr key={payment.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-900 truncate max-w-[140px]">{payment.userName}</p>
                                            <p className="text-xs font-medium text-slate-400 truncate max-w-[140px]">{payment.userEmail}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700 hidden md:table-cell">{payment.plan}</td>
                                        <td className="px-6 py-4 text-sm font-black text-slate-900">${payment.amount}</td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className="text-xs font-bold text-slate-500">
                                                {payment.method}{payment.coin ? ` (${payment.coin})` : ''}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${statusColor(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {payment.status === 'PENDING' ? (
                                                <button
                                                    onClick={() => handleActivate(payment.id)}
                                                    disabled={activatingId === payment.id}
                                                    className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-md shadow-violet-600/10 active:scale-95 disabled:opacity-50"
                                                >
                                                    {activatingId === payment.id ? 'Processing...' : 'Verify & Activate'}
                                                </button>
                                            ) : (
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verified</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
