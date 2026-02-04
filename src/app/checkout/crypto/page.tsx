"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    CheckCircle2,
    Copy,
    ChevronRight,
    ShieldCheck,
    Clock,
    ArrowLeft,
    Wallet,
    QrCode,
    Sparkles,
    Shield,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/common/ScrollReveal';

const WALLET_ADDRESSES: Record<string, string> = {
    BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    USDT: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    USDC: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
};

const COIN_NAMES: Record<string, string> = {
    BTC: "Bitcoin",
    USDT: "Tether (ERC-20)",
    USDC: "USD Coin (ERC-20)",
};

function CheckoutContent() {
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'Monthly';
    const price = searchParams.get('price') || '29';

    const [selectedCoin, setSelectedCoin] = useState('USDT');
    const [copied, setCopied] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(WALLET_ADDRESSES[selectedCoin]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            const response = await fetch('/api/crypto/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan, price, coin: selectedCoin }),
            });

            if (response.ok) {
                setIsDone(true);
            } else {
                alert("Something went wrong. Please try again or contact support.");
            }
        } catch (error) {
            console.error("Payment confirmation failed:", error);
            alert("Connection error. Please try again.");
        } finally {
            setIsConfirming(false);
        }
    };

    if (isDone) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <ScrollReveal direction="up">
                    <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 text-slate-900 uppercase tracking-tight">Payment Received!</h2>
                        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                            We've logged your transaction. To speed up the process, please <span className="text-violet-600 font-bold">send a screenshot</span> of your receipt to our support team on Telegram.
                        </p>

                        <div className="space-y-4">
                            <a
                                href="https://t.me/putin2144"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full py-5 bg-[#229ED9] text-white font-black rounded-2xl hover:bg-[#1c86b9] transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M11.944 0C5.346 0 0 5.348 0 11.949c0 6.601 5.346 11.949 11.944 11.949 6.598 0 11.944-5.348 11.944-11.949C23.888 5.348 18.542 0 11.944 0zm5.553 8.3c-.179 1.915-1.077 7.07-1.526 9.456-.191 1.011-.561 1.35-1.42 1.428-1.042.095-2.003-.243-2.903-.789-1.399-.851-2.457-1.328-3.812-2.215-1.564-1.023-.551-1.586.341-2.511.233-.242 4.293-3.935 4.372-4.272.01-.042.019-.2-.075-.283-.094-.083-.231-.055-.331-.032-.142.032-2.41 1.531-6.791 4.495-.642.441-1.224.656-1.745.644-.573-.014-1.677-.325-2.498-.592-1.006-.328-1.807-.502-1.737-.1.036.21.323.421.859.632.536.21 1.072.316 1.608.316.536 0 1.071-.106 1.607-.317 1.019-.4 2.112-.903 3.28-1.509l.487-.253c.162-.084.24-.124.23-.118z" />
                                </svg>
                                Authenticate on Telegram
                            </a>

                            <Link href="/dashboard" className="block w-full py-4 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200">
                                Skip for now
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-4 md:px-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <Link href="/#pricing" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold mb-10 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Plans
                </Link>

                <ScrollReveal direction="up">
                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[750px] relative">

                        {/* LEFT SIDEBAR: SUMMARY & STEPS */}
                        <div className="lg:w-[380px] bg-slate-950 p-10 lg:p-12 text-white flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-600/20 via-transparent to-blue-600/10 pointer-events-none" />

                            <div className="relative z-10 space-y-10 h-full flex flex-col">
                                <div>
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                                            <Sparkles className="w-6 h-6 text-violet-400" />
                                        </div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Checkout</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-8 bg-white/[0.03] rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-inner">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">{plan} Plan</p>
                                            <p className="text-xl font-bold mb-1 opacity-90">Full Platform Access</p>
                                            <p className="text-4xl font-black text-white tracking-tight">${price}</p>
                                        </div>

                                        <div className="space-y-4 px-2">
                                            <div className="flex items-center gap-4 text-white/60 text-sm font-bold">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                <span>Secure Payment Handling</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-white/60 text-sm font-bold">
                                                <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                                                <span>Instant Dashboard Sync</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-10 border-t border-white/5">
                                    <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.4em] mb-10 text-center">Protocol Steps</h3>
                                    <div className="space-y-10">
                                        {[
                                            { step: 1, text: "Select Currency", active: true },
                                            { step: 2, text: `Transfer $${price} USD`, active: false },
                                            { step: 3, text: "Verify Transaction", active: false }
                                        ].map((item) => (
                                            <div key={item.step} className="flex gap-6 items-center group">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[12px] font-black border border-white/10 transition-all group-hover:bg-white/10 group-hover:scale-110">
                                                    {item.step}
                                                </div>
                                                <p className="text-sm font-black uppercase tracking-widest text-white/40 group-hover:text-white/90 transition-colors">{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT CONTENT: UNIFIED PAYMENT MODULE */}
                        <div className="flex-1 bg-white flex flex-col h-full relative">

                            {/* Unified Header & Switcher */}
                            <div className="p-10 lg:p-12 pb-0 flex flex-col md:flex-row md:items-end justify-between gap-8">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">Payment</h2>
                                    <p className="text-slate-400 font-bold text-sm tracking-wide">Select and complete your transfer</p>
                                </div>

                                <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner w-full md:w-auto">
                                    {['USDT', 'BTC', 'USDC'].map((coin) => (
                                        <button
                                            key={coin}
                                            onClick={() => setSelectedCoin(coin)}
                                            className={`flex-1 px-4 py-3 rounded-xl text-[10px] md:text-xs font-black tracking-widest transition-all duration-300 ${selectedCoin === coin
                                                ? 'bg-white text-violet-600 shadow-md scale-100'
                                                : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                        >
                                            {coin}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-10 lg:p-12 space-y-10 flex-1 flex flex-col">

                                {/* Unified Detail Card */}
                                <div className="bg-slate-50 rounded-[3rem] p-10 lg:p-12 border border-slate-100 flex-1 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/[0.03] blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none group-hover:bg-violet-600/[0.05] transition-colors" />

                                    <div className="w-56 h-56 bg-white rounded-[2.5rem] p-6 shadow-2xl shadow-slate-200/50 border border-slate-100 flex-shrink-0 flex items-center justify-center relative group/qr">
                                        <img
                                            src="/images/payments/qr-placeholder.png"
                                            alt="QR Code"
                                            className="w-full h-full object-contain grayscale opacity-60 group-hover/qr:opacity-100 group-hover/qr:grayscale-0 transition-all duration-500"
                                        />
                                        <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover/qr:opacity-100 transition-opacity rounded-[2.5rem] pointer-events-none" />
                                    </div>

                                    <div className="flex-1 w-full flex flex-col gap-10">
                                        <div>
                                            <div className="flex items-center justify-between mb-4 px-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                                                    Recipient Address
                                                </label>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-violet-500 uppercase tracking-widest">
                                                    <div className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" />
                                                    {COIN_NAMES[selectedCoin]}
                                                </div>
                                            </div>
                                            <div className="relative group/input">
                                                <div className="w-full bg-white border-2 border-slate-200 p-6 rounded-2xl text-sm font-mono break-all text-slate-600 pr-20 shadow-sm transition-all focus-within:border-violet-500 group-hover/input:border-slate-300">
                                                    {WALLET_ADDRESSES[selectedCoin]}
                                                </div>
                                                <button
                                                    onClick={copyToClipboard}
                                                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-4 transition-all rounded-xl shadow-lg border ${copied
                                                        ? 'bg-emerald-500 text-white border-emerald-500 scale-105'
                                                        : 'bg-slate-900 text-white border-slate-900 hover:bg-violet-600 hover:border-violet-600'
                                                        }`}
                                                >
                                                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {copied && (
                                                <ScrollReveal direction="up">
                                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-3 text-center">Address Copied to Protocol</p>
                                                </ScrollReveal>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-white/50 border border-slate-200 p-5 rounded-2xl flex items-center gap-4">
                                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <QrCode className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-500 leading-snug">
                                                    Scan QR with your mobile wallet
                                                </p>
                                            </div>
                                            <div className="bg-white/50 border border-slate-200 p-5 rounded-2xl flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <Wallet className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-500 leading-snug">
                                                    Ensure exactly <span className="text-slate-900 font-black">${price} USD</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Integrated Final Action */}
                                <div className="mt-auto space-y-6">
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isConfirming}
                                        className={`w-full py-7 rounded-3xl font-black text-xl uppercase tracking-[0.2em] transition-all relative overflow-hidden group/btn ${isConfirming
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-slate-950 text-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_rgba(124,58,237,0.2)] active:scale-[0.98]'
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />

                                        <span className="relative z-10 flex items-center justify-center gap-5">
                                            {isConfirming ? (
                                                <>
                                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Establish Verification
                                                    <ChevronRight className="w-8 h-8 group-hover/btn:translate-x-2 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </button>

                                    <div className="flex items-center justify-center gap-3">
                                        <div className="h-px w-8 bg-slate-100" />
                                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] text-center">
                                            Manual Chain Verification Secure
                                        </p>
                                        <div className="h-px w-8 bg-slate-100" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
