'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Search, Eye, X, ImageIcon, TrendingUp } from 'lucide-react';
import { getAdminRevenue, activatePayment, getRevenueChartData } from '@/app/actions/admin';
import RevenueChart from '@/components/admin/RevenueChart';

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
    screenshot: string | null;
    date: string;
};

export default function AdminRevenuePage() {
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activatingId, setActivatingId] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [chartData, setChartData] = useState<{ date: string; revenue: number }[]>([]);
    const [chartDays, setChartDays] = useState(30);

    const loadData = async () => {
        setLoading(true);
        try {
            const [paymentsData, revenueData] = await Promise.all([
                getAdminRevenue(),
                getRevenueChartData(chartDays)
            ]);
            setPayments(paymentsData);
            setChartData(revenueData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [chartDays]);

    const handleActivate = async (id: string) => {
        if (!confirm('Are you sure you want to activate this payment? This will grant the user immediate access.')) return;

        setActivatingId(id);
        try {
            await activatePayment(id);
            loadData(); // Refresh all data
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

            {/* Revenue Chart */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-violet-600" />
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Revenue <span className="premium-gradient">Visualization</span></h2>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {[7, 30, 90].map(d => (
                            <button
                                key={d}
                                onClick={() => setChartDays(d)}
                                className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${chartDays === d ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {d}D
                            </button>
                        ))}
                    </div>
                </div>
                <RevenueChart data={chartData} />
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
                                            <div className="flex items-center justify-end gap-3">
                                                {payment.screenshot && (
                                                    <button
                                                        onClick={() => setPreviewImage(payment.screenshot)}
                                                        className="p-2 bg-slate-100 text-slate-500 hover:text-violet-600 rounded-lg transition-all active:scale-95"
                                                        title="View Proof"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative max-w-4xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="absolute top-6 right-6 z-10">
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="p-3 bg-white/80 backdrop-blur-md text-slate-900 rounded-full hover:bg-white transition-all shadow-xl active:scale-95"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
                                <ImageIcon className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Payment Verification</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visual Evidence</p>
                            </div>
                        </div>
                        <div className="bg-slate-200 aspect-video md:aspect-auto max-h-[70vh] flex items-center justify-center overflow-auto p-4">
                            <img
                                src={previewImage}
                                alt="Payment Proof"
                                className="max-w-full h-auto rounded-xl shadow-lg border border-white/20"
                            />
                        </div>
                        <div className="p-8 bg-white text-center">
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="px-12 py-4 bg-slate-950 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98]"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
