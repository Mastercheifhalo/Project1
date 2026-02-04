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
    QrCode
} from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/common/ScrollReveal';

const WALLET_ADDRESSES: Record<string, string> = {
    BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", // Placeholder
    USDT: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", // Placeholder
    USDC: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", // Placeholder
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
                            <Link
                                href="/support/telegram"
                                className="flex items-center justify-center gap-3 w-full py-5 bg-[#229ED9] text-white font-black rounded-2xl hover:bg-[#1c86b9] transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M11.944 0C5.346 0 0 5.348 0 11.949c0 6.601 5.346 11.949 11.944 11.949 6.598 0 11.944-5.348 11.944-11.949C23.888 5.348 18.542 0 11.944 0zm5.553 8.3c-.179 1.915-1.077 7.07-1.526 9.456-.191 1.011-.561 1.35-1.42 1.428-1.042.095-2.003-.243-2.903-.789-1.399-.851-2.457-1.328-3.812-2.215-1.564-1.023-.551-1.586.341-2.511.233-.242 4.293-3.935 4.372-4.272.01-.042.019-.2-.075-.283-.094-.083-.231-.055-.331-.032-.142.032-2.41 1.531-6.791 4.495-.642.441-1.224.656-1.745.644-.573-.014-1.677-.325-2.498-.592-1.006-.328-1.807-.502-1.737-.1.036.21.323.421.859.632.536.21 1.072.316 1.608.316.536 0 1.071-.106 1.607-.317 1.019-.4 2.112-.903 3.28-1.509l.487-.253c.162-.084.24-.124.23-.118z" />
                                </svg>
                                Authenticate on Telegram
                            </Link>

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
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                <Link href="/#pricing" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Plans
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Summary */}
                    <div className="lg:col-span-5 space-y-8">
                        <ScrollReveal direction="left">
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
                                <h1 className="text-3xl font-black mb-6 uppercase tracking-tight text-slate-900">Order Summary</h1>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{plan} Plan</p>
                                            <p className="text-xl font-bold text-slate-900">Full Platform Access</p>
                                        </div>
                                        <p className="text-2xl font-black text-violet-600">${price}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-slate-600 font-medium">
                                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                            <span>Instant Content Access (After Verification)</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 font-medium">
                                            <Clock className="w-5 h-5 text-violet-500" />
                                            <span>Manual 24/7 Verification</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={0.2}>
                            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 blur-3xl -mr-16 -mt-16 group-hover:bg-violet-600/30 transition-colors" />
                                <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Instructions</h3>
                                <ol className="space-y-4 text-white/70 font-medium">
                                    <li className="flex gap-4">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-black">1</span>
                                        <span>Select your preferred cryptocurrency.</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-black">2</span>
                                        <span>Send exactly <span className="text-white font-bold">${price}</span> worth of tokens.</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-black">3</span>
                                        <span>Click the confirmation button to notify us.</span>
                                    </li>
                                </ol>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right: Payment Details */}
                    <div className="lg:col-span-7">
                        <ScrollReveal direction="right">
                            <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl border border-slate-100">
                                <h2 className="text-2xl font-black mb-10 uppercase tracking-tight text-slate-900">Payment Details</h2>

                                {/* Coin Selection */}
                                <div className="grid grid-cols-3 gap-4 mb-12">
                                    {['USDT', 'BTC', 'USDC'].map((coin) => (
                                        <button
                                            key={coin}
                                            onClick={() => setSelectedCoin(coin)}
                                            className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedCoin === coin
                                                ? 'border-violet-600 bg-violet-50/50'
                                                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                                                }`}
                                        >
                                            <span className={`text-lg font-black ${selectedCoin === coin ? 'text-violet-600' : 'text-slate-400'}`}>{coin}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* QR and Address */}
                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                    <div className="w-48 h-48 bg-white rounded-2xl p-4 shadow-inner border border-slate-100 flex-shrink-0">
                                        <img
                                            src="/images/payments/qr-placeholder.png"
                                            alt="QR Code"
                                            className="w-full h-full object-contain grayscale opacity-80"
                                        />
                                    </div>

                                    <div className="flex-1 w-full space-y-6">
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                                Deposit Address ({selectedCoin})
                                            </label>
                                            <div className="relative group">
                                                <div className="w-full bg-white border border-slate-200 p-4 rounded-xl text-sm font-mono break-all text-slate-600 pr-12">
                                                    {WALLET_ADDRESSES[selectedCoin]}
                                                </div>
                                                <button
                                                    onClick={copyToClipboard}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-violet-600 transition-colors bg-white rounded-lg shadow-sm"
                                                >
                                                    {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <QrCode className="w-5 h-5 text-amber-600" />
                                            <p className="text-xs font-bold text-amber-700 leading-snug">
                                                Please double-check the network. Only send <span className="font-black underline">{COIN_NAMES[selectedCoin]}</span> to this address.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <button
                                    onClick={handleConfirm}
                                    disabled={isConfirming}
                                    className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all ${isConfirming
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-600/20 active:scale-[0.98]'
                                        }`}
                                >
                                    {isConfirming ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-3">
                                            I've Sent the Payment
                                            <ChevronRight className="w-6 h-6" />
                                        </span>
                                    )}
                                </button>

                                <p className="text-center mt-6 text-slate-400 text-xs font-medium">
                                    By clicking confirm, you acknowledge that you have sent the correct amount and currency.
                                    Total: <span className="text-slate-900 font-bold">${price}</span>
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
