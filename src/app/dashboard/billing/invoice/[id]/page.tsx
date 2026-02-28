'use client';

import React, { useEffect, useState, use } from 'react';
import {
    Download,
    Printer,
    ArrowLeft,
    CheckCircle2,
    GraduationCap,
    Clock,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { getInvoiceDetails } from '@/app/actions/invoices';

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [invoice, setInvoice] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getInvoiceDetails(resolvedParams.id);
                setInvoice(data);
            } catch {
                // Invoice not found or unauthorized — handled by the null state below
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, [resolvedParams.id]);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-black mb-4 uppercase">Invoice Not Found</h2>
                <Link href="/dashboard/billing" className="text-violet-600 font-bold hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Billing
                </Link>
            </div>
        );
    }

    const { user, payment, invoiceNumber, amount, createdAt } = invoice;
    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(createdAt));

    return (
        <div className="min-h-screen bg-slate-50 md:py-20 animate-in fade-in duration-500">
            {/* Action Bar (Hidden on print) */}
            <div className="max-w-4xl mx-auto mb-8 px-6 flex items-center justify-between no-print">
                <Link href="/dashboard/billing" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-3 bg-violet-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-violet-700 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-violet-600/20"
                    >
                        <Download className="w-4 h-4" /> Save as PDF
                    </button>
                </div>
            </div>

            {/* Actual Invoice Body */}
            <div className="max-w-4xl mx-auto bg-white shadow-2xl shadow-slate-200/50 md:rounded-[3rem] overflow-hidden border border-slate-100 p-8 md:p-20 relative print-shadow-none print-border-none">
                {/* Decorative Accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/[0.02] blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />

                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-600/20">
                                <GraduationCap className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900">
                                COURSE<span className="text-violet-600">PRO</span>
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Billed To</p>
                            <p className="text-lg font-black text-slate-900">{user.name || 'Student'}</p>
                            <p className="text-sm font-bold text-slate-500">{user.email}</p>
                        </div>
                    </div>

                    <div className="text-left md:text-right space-y-6">
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Invoice Number</p>
                            <p className="text-xl font-black text-slate-900 uppercase tracking-tight"># {invoiceNumber}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Date Issued</p>
                            <p className="text-lg font-black text-slate-900">{formattedDate}</p>
                        </div>
                        <div className="inline-flex px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20 items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="w-full mb-20">
                    <div className="grid grid-cols-12 pb-4 border-b border-slate-100 mb-6">
                        <div className="col-span-8 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Description</div>
                        <div className="col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 text-right">Amount</div>
                    </div>

                    <div className="grid grid-cols-12 py-8 px-2 group">
                        <div className="col-span-8">
                            <p className="text-lg font-black text-slate-900 mb-1">
                                {payment.plan === 'OneTime' ? (payment.course?.title || 'Course Access') : `${payment.plan} Access Pass`}
                            </p>
                            <p className="text-xs font-bold text-slate-400">
                                {payment.plan === 'OneTime' ? 'Full lifetime access to course materials' : 'Full platform access subscription'}
                            </p>
                        </div>
                        <div className="col-span-4 text-right">
                            <p className="text-lg font-black text-slate-900">${amount.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="mt-12 pt-12 border-t-2 border-slate-50 space-y-4">
                        <div className="flex justify-between items-center px-4">
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Subtotal</p>
                            <p className="text-lg font-bold text-slate-900">${amount.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between items-center px-4">
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Tax (0%)</p>
                            <p className="text-lg font-bold text-slate-900">$0.00</p>
                        </div>
                        <div className="flex justify-between items-center p-8 bg-slate-50 rounded-[2rem] mt-8">
                            <p className="text-lg font-black text-slate-950 uppercase tracking-[0.2em]">Total</p>
                            <p className="text-3xl font-black text-violet-600">${amount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-emerald-500">
                            <Shield className="w-5 h-5" />
                            <p className="text-xs font-black uppercase tracking-widest">Payment Verified</p>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 leading-relaxed max-w-xs">
                            This transaction was completed securely via {payment.coin} on our established manual protocol. Proof of payment has been verified by our admin.
                        </p>
                    </div>
                    <div className="space-y-4 text-left md:text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Record</p>
                        <div className="flex items-center justify-start md:justify-end gap-2 text-[10px] font-mono text-slate-300">
                            <Clock className="w-3 h-3" />
                            <span>PID: {payment.id}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-32 text-center border-t border-slate-50 pt-10">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Thanks for learning with us</p>
                </div>
            </div>

            {/* Print Styling */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                    .print-shadow-none { box-shadow: none !important; }
                    .print-border-none { border: none !important; }
                }
            `}</style>
        </div>
    );
}
