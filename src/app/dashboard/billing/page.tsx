'use client';

import React, { useEffect, useState } from 'react';
import {
    Receipt,
    Download,
    ExternalLink,
    CreditCard,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    History,
    FileText,
    CheckCircle2,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import { getUserInvoices } from '@/app/actions/invoices';

export default function BillingPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadInvoices() {
            try {
                const data = await getUserInvoices();
                setInvoices(data);
            } catch (error) {
                console.error("Failed to load invoices:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadInvoices();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/20">
                            <Receipt className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Billing</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Manage your subscriptions, view payment history and download invoices.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            className="bg-transparent border-none text-sm font-bold placeholder:text-slate-400 focus:ring-0 w-32 md:w-48"
                        />
                    </div>
                    <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-colors active:scale-95 shadow-sm">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Total Invested</p>
                    <h3 className="text-4xl font-black mb-2 text-slate-900">${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}</h3>
                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>Knowledge Capital</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Pending Proofs</p>
                    <h3 className="text-4xl font-black mb-2 text-slate-900">0</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                        <Clock className="w-3 h-3" />
                        <span>All Verified</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Active Plan</p>
                    <h3 className="text-3xl font-black mb-2 text-slate-900">Full Access</h3>
                    <div className="flex items-center gap-2 text-violet-600 text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Premium Student</span>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Transaction History</h2>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {invoices.length} Records
                    </span>
                </div>

                {/* ── MOBILE: invoice cards ── */}
                <div className="md:hidden divide-y divide-slate-50">
                    {isLoading ? (
                        <div className="p-8 space-y-4 animate-pulse">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-slate-50 rounded-2xl" />
                            ))}
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="px-8 py-16 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-slate-200" />
                            </div>
                            <p className="text-slate-900 font-black text-lg">No invoices found</p>
                            <p className="text-slate-400 font-medium text-xs mt-1">Your payment history will appear here once verified.</p>
                        </div>
                    ) : (
                        invoices.map((inv) => (
                            <div key={inv.id} className="p-5 space-y-4 flex flex-col group hover:bg-slate-50/50 transition-colors">
                                {/* Top Row: ID & Status */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <span className="text-sm font-black text-slate-900"># {inv.number}</span>
                                        <p className="text-[11px] font-bold text-slate-500 mt-1 truncate">{inv.item}</p>
                                    </div>
                                    <span className={`shrink-0 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${inv.status.toUpperCase() === 'PAID'
                                        ? 'bg-emerald-100 text-emerald-600'
                                        : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        {inv.status}
                                    </span>
                                </div>
                                {/* Bottom Row: Amount, Date, Action */}
                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <span className="text-lg font-black text-slate-900">${inv.amount}</span>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{inv.date}</p>
                                    </div>
                                    <Link
                                        href={`/dashboard/billing/invoice/${inv.id}`}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-600 hover:text-violet-600 hover:bg-violet-50 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" /> View
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* ── DESKTOP: full table ── */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item / Purpose</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1, 2, 3].map((i) => (
                                    <tr key={i} className="animate-pulse">
                                        {Array(6).fill(0).map((_, j) => (
                                            <td key={j} className="px-8 py-6">
                                                <div className="h-4 bg-slate-100 rounded w-full" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                <FileText className="w-8 h-8 text-slate-200" />
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-black text-lg">No invoices found</p>
                                                <p className="text-slate-400 font-medium text-sm">Your payment history will appear here once verified.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((inv) => (
                                    <tr key={inv.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-slate-900"># {inv.number}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-slate-600">{inv.item}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-slate-400">{inv.date}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-slate-900">${inv.amount}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/billing/invoice/${inv.id}`}
                                                    className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all active:scale-95"
                                                    title="View Invoice"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Support Box */}
            <div className="p-8 bg-violet-600/5 rounded-[2.5rem] border border-violet-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-600/20 shrink-0">
                        <CreditCard className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Need assistance?</h3>
                        <p className="text-slate-500 font-medium text-sm">Facing issues with payments or need a custom invoice? Our team is here to help.</p>
                    </div>
                </div>
                <a
                    href="https://t.me/putin2144"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] shrink-0"
                >
                    Contact Support
                    <ChevronRight className="w-5 h-5" />
                </a>
            </div>
        </div>
    );
}
