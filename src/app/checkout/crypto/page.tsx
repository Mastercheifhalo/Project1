"use client";

import React, { useState, Suspense, useEffect } from 'react';
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
    Zap,
    ChevronDown,
    ChevronUp,
    Info
} from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/common/ScrollReveal';

// Wallet addresses are fetched server-side at runtime via /api/wallets

const COIN_NAMES: Record<string, string> = {
    BTC: "Bitcoin",
    USDT: "Tether (ERC-20)",
    USDC: "USD Coin (ERC-20)",
};

function CheckoutContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'subscription';
    const plan = searchParams.get('plan') || 'Monthly';
    const price = searchParams.get('price') || '29';
    const courseId = searchParams.get('courseId');
    const courseTitle = searchParams.get('courseTitle');

    const [selectedCoin, setSelectedCoin] = useState('USDT');
    const [copied, setCopied] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [instructionsOpen, setInstructionsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({ BTC: 0, USDT: 1, USDC: 1 });
    const [isFetchingPrice, setIsFetchingPrice] = useState(true);
    const [walletAddresses, setWalletAddresses] = useState<Record<string, string>>({});
    const [walletError, setWalletError] = useState(false);

    useEffect(() => {
        const fetchPrices = async () => {
            setIsFetchingPrice(true);
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether,usd-coin&vs_currencies=usd');
                const data = await response.json();
                setCryptoPrices({
                    BTC: data.bitcoin.usd,
                    USDT: data.tether.usd,
                    USDC: data['usd-coin'].usd
                });
            } catch (error) {
                console.error("Failed to fetch prices:", error);
            } finally {
                setIsFetchingPrice(false);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetch('/api/wallets')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((data: Record<string, string>) => setWalletAddresses(data))
            .catch(() => setWalletError(true));
    }, []);

    const calculateCryptoAmount = () => {
        const usdPrice = parseFloat(price);
        const cryptoPrice = cryptoPrices[selectedCoin];
        if (!cryptoPrice) return "0.00";
        return (usdPrice / cryptoPrice).toFixed(selectedCoin === 'BTC' ? 8 : 2);
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const copyToClipboard = () => {
        const addr = walletAddresses[selectedCoin];
        if (!addr) return;
        navigator.clipboard.writeText(addr);
        setCopied(true);
        setShowToast(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            const response = await fetch('/api/crypto/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    plan: type === 'course' ? 'OneTime' : plan,
                    price,
                    coin: selectedCoin,
                    courseId
                }),
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
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <ScrollReveal direction="up">
                    <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl border border-slate-100">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black mb-4 text-slate-900 uppercase tracking-tight">Payment Received!</h2>
                        <p className="text-sm md:text-base text-slate-500 font-medium mb-10 leading-relaxed">
                            We've logged your transaction. To speed up the process, please <span className="text-violet-600 font-bold">send a screenshot</span> of your receipt to our support team on Telegram.
                        </p>

                        <div className="space-y-4">
                            <a
                                href="https://t.me/putin2144"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full py-4 md:py-5 bg-[#229ED9] text-white font-black rounded-2xl hover:bg-[#1c86b9] transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]"
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
        <div className="min-h-screen bg-white md:bg-slate-50 pt-20 pb-32 md:py-32 px-0 md:px-6 relative flex flex-col items-center">
            {/* Background Accents (Reduced for mobile) */}
            <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
            <div className="hidden md:block absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none" />

            {/* Mobile Header */}
            <div className="md:hidden w-full px-6 mb-8 flex items-center justify-between">
                <Link href="/#pricing" className="p-2 -ml-2 text-slate-500 active:text-slate-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-lg font-black uppercase tracking-tight text-slate-900">Checkout</h1>
                <div className="w-9" /> {/* Spacer */}
            </div>

            <div className="max-w-6xl w-full mx-auto relative z-10 px-6 md:px-0">
                <Link href="/#pricing" className="hidden md:inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold mb-10 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Plans
                </Link>

                <ScrollReveal direction="up">
                    <div className="bg-white md:rounded-[3rem] md:shadow-2xl md:shadow-slate-200/50 border-0 md:border md:border-slate-100 overflow-hidden flex flex-col lg:flex-row items-stretch min-h-auto md:min-h-[750px] relative">

                        {/* LEFT SIDEBAR / TOP SUMMARY: COMPACT PLAN CARD */}
                        <div className="lg:w-[380px] bg-white md:bg-slate-950 p-6 md:p-12 text-slate-900 md:text-white flex flex-col relative overflow-hidden">
                            <div className="hidden md:block absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-600/20 via-transparent to-blue-600/10 pointer-events-none" />

                            <div className="relative z-10 h-full flex flex-col">
                                {/* Desktop Title */}
                                <div className="hidden md:flex items-center gap-4 mb-10 h-12">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 shrink-0">
                                        <Sparkles className="w-6 h-6 text-violet-400" />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-white !text-white leading-none">Checkout</h2>
                                </div>

                                {/* Compact Plan Card */}
                                <div className="p-5 md:p-8 bg-slate-50 md:bg-white/[0.03] rounded-2xl md:rounded-[2rem] border border-slate-100 md:border-white/10 shadow-sm md:shadow-inner">
                                    <div className="flex flex-col gap-2 mb-6">
                                        <p className="text-[10px] md:text-[11px] font-black text-slate-400 md:text-white/40 uppercase tracking-[0.2em]">
                                            {type === 'course' ? 'One-Time Purchase' : `${plan} Plan`}
                                        </p>
                                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 group">
                                            <p className="text-lg md:text-xl font-bold opacity-90 md:text-white leading-none">
                                                {type === 'course' ? courseTitle || 'Course Access' : 'Access Pass'}
                                            </p>
                                            <p className="text-2xl md:text-3xl lg:text-4xl font-black text-violet-600 md:text-white tracking-tight leading-none">${price}
                                                {type !== 'course' && (
                                                    <span className="text-xs md:text-sm font-medium text-slate-400 md:text-white/40 ml-1">
                                                        /{plan === 'Monthly' ? 'mo' : plan === 'Quarterly' ? '3mo' : 'yr'}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:space-y-3 border-t border-slate-200 md:border-white/5 pt-4">
                                        <div className="flex items-center gap-2 text-slate-500 md:text-white/60 text-xs font-bold">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span>Full Access</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 md:text-white/60 text-xs font-bold">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span>Secure Lock</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Steps */}
                                <div className="hidden md:block mt-auto pt-10 border-t border-white/5">
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

                            {/* Payment Section Title & Price */}
                            <div className="p-6 md:p-12 flex flex-col h-full">
                                <div className="md:hidden flex flex-col gap-2 mb-8">
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Payment Method</h2>
                                    <p className="text-slate-400 font-bold text-sm tracking-wide">Choose your preferred currency</p>
                                </div>
                                <div className="hidden md:block h-12 flex items-center mb-10">
                                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Payment</h2>
                                </div>
                                <div className="hidden md:block mb-10 -mt-8">
                                    <p className="text-slate-400 font-bold text-sm tracking-wide">Select and complete your transfer</p>
                                </div>

                                {/* Switchable Tabs */}
                                <div className="px-6 md:px-0">
                                    <div className="bg-slate-100 p-1 md:p-1.5 rounded-2xl flex relative shadow-inner w-full md:w-fit transition-all overflow-hidden h-[54px] md:h-auto">
                                        <div
                                            className="absolute top-1 bottom-1 bg-white rounded-xl shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
                                            style={{
                                                left: `calc(${(['USDT', 'BTC', 'USDC'].indexOf(selectedCoin) * 100) / 3}% + 4px)`,
                                                width: `calc(100% / 3 - 8px)`
                                            }}
                                        />

                                        {['USDT', 'BTC', 'USDC'].map((coin) => (
                                            <button
                                                key={coin}
                                                onClick={() => setSelectedCoin(coin)}
                                                className={`relative z-10 flex-1 md:flex-none md:px-8 py-3 rounded-xl text-[13px] md:text-xs font-black tracking-widest transition-colors duration-300 flex items-center justify-center ${selectedCoin === coin
                                                    ? 'text-violet-600'
                                                    : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                            >
                                                {coin}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Live Price Status Bar */}
                            <div className="px-6 md:px-12 mt-6">
                                <div className="bg-violet-600/5 border border-violet-100/50 rounded-2xl p-4 flex items-center justify-between group overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/[0.02] to-transparent pointer-events-none" />
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Live exchange rate</span>
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        {isFetchingPrice ? (
                                            <div className="w-16 h-4 bg-slate-100 animate-pulse rounded" />
                                        ) : (
                                            <p className="text-xs md:text-sm font-black text-slate-900 tracking-tight">
                                                1 {selectedCoin} = <span className="text-violet-600">${cryptoPrices[selectedCoin].toLocaleString()}</span>
                                            </p>
                                        )}
                                        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                                            <Zap className="w-3 h-3 text-amber-500" />
                                            <span className="text-[9px] font-black text-slate-400 uppercase">Instant</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-12 md:space-y-10 flex-1 flex flex-col pt-10 md:pt-12">

                                {/* Wallet & Address Module */}
                                <div className="bg-slate-50 md:rounded-[3rem] p-6 md:p-12 border-2 border-slate-100/50 md:border md:border-slate-100 mb-8 md:mb-10 overflow-hidden relative group">
                                    <div className="hidden md:block absolute top-0 right-0 w-96 h-96 bg-violet-600/[0.03] blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none group-hover:bg-violet-600/[0.05] transition-colors" />

                                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                                        {/* QR Code */}
                                        <div className="flex w-48 h-48 md:w-56 md:h-56 bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex-shrink-0 items-center justify-center relative group/qr mx-auto lg:mx-0">
                                            <img
                                                src="/images/payments/qr-placeholder.png"
                                                alt="QR Code"
                                                className="w-full h-full object-contain grayscale opacity-60 group-hover/qr:opacity-100 group-hover/qr:grayscale-0 transition-all duration-500"
                                            />
                                            <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover/qr:opacity-100 transition-opacity rounded-[2rem] md:rounded-[2.5rem] pointer-events-none" />
                                        </div>

                                        <div className="flex-1 w-full flex flex-col gap-6 md:gap-8">
                                            <div>
                                                <div className="flex items-center justify-between mb-3 md:mb-4 px-1">
                                                    <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">
                                                        Send exactly <span className="text-slate-900">{calculateCryptoAmount()}</span> {selectedCoin} <span className="text-slate-300 mx-1">/</span> <span className="text-slate-400">${price}</span>
                                                    </label>
                                                    <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-black text-violet-500 uppercase tracking-widest">
                                                        <div className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" />
                                                        {COIN_NAMES[selectedCoin]}
                                                    </div>
                                                </div>

                                                {/* Readable Wallet Box */}
                                                <div className="relative group/input flex flex-col gap-3">
                                                    <div className="w-full bg-white border-2 border-slate-200 p-4 md:p-6 rounded-2xl text-[13px] md:text-sm font-mono text-slate-600 shadow-sm transition-all overflow-x-auto whitespace-nowrap scrollbar-hide flex items-center">
                                                        {walletError
                                                            ? <span className="text-red-400 font-sans text-xs">Payment address unavailable. Contact support.</span>
                                                            : walletAddresses[selectedCoin] ?? <span className="animate-pulse text-slate-300">Loading address...</span>
                                                        }
                                                    </div>
                                                    <button
                                                        onClick={copyToClipboard}
                                                        className={`w-full min-h-[52px] transition-all rounded-2xl shadow-lg border-2 flex items-center justify-center gap-3 font-black uppercase tracking-widest ${copied
                                                            ? 'bg-emerald-500 text-white border-emerald-500 scale-[0.98]'
                                                            : 'bg-slate-900 text-white border-slate-900 active:scale-95'
                                                            }`}
                                                    >
                                                        {copied ? (
                                                            <>
                                                                <CheckCircle2 className="w-5 h-5" />
                                                                Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-5 h-5" />
                                                                Copy Address
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Micro-Instructions */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                                <div className="bg-white/70 border border-slate-200 p-4 rounded-2xl flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <QrCode className="w-4 h-4 text-amber-600" />
                                                    </div>
                                                    <p className="text-[10px] md:text-[11px] font-bold text-slate-500 leading-snug">
                                                        Scan QR for quick transfer
                                                    </p>
                                                </div>
                                                <div className="bg-white/70 border border-slate-200 p-4 rounded-2xl flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Wallet className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <p className="text-[10px] md:text-[11px] font-bold text-slate-500 leading-snug">
                                                        Exact <span className="text-slate-900 font-black">${price}</span> required
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Accordion Instructions */}
                                <div className="px-1 mb-8">
                                    <button
                                        onClick={() => setInstructionsOpen(!instructionsOpen)}
                                        className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl active:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                            <Info className="w-4 h-4 text-violet-500" />
                                            ⚠️ Important Instructions
                                        </div>
                                        {instructionsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                    </button>

                                    {instructionsOpen && (
                                        <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="flex gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                                    Ensure you are using the <span className="text-slate-900 font-bold">{selectedCoin === 'BTC' ? 'Bitcoin' : 'ERC-20'}</span> network. Wrong network = permanent loss.
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                                    Transfers take 5-15 minutes to confirm on the blockchain.
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                                    All crypto sales are final. No refunds once sent.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Desktop Final Action Button */}
                                <div className="hidden md:block mt-auto space-y-6">
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isConfirming}
                                        className={`w-full py-6 rounded-[2rem] font-black text-xl uppercase tracking-[0.2em] transition-all relative overflow-hidden group/btn ${isConfirming
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
                                                    I've Sent the Payment
                                                    <ChevronRight className="w-8 h-8 group-hover/btn:translate-x-2 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </button>

                                    <div className="flex items-center justify-center gap-3">
                                        <div className="h-px w-8 bg-slate-100" />
                                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] text-center">
                                            Established Manual Protocol
                                        </p>
                                        <div className="h-px w-8 bg-slate-100" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollReveal>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 pb-8 z-50">
                <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className={`w-full py-5 rounded-2xl font-black text-base uppercase tracking-widest transition-all ${isConfirming
                        ? 'bg-slate-200 text-slate-400'
                        : 'bg-slate-900 text-white shadow-xl active:scale-95'
                        }`}
                >
                    {isConfirming ? (
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Verifying...
                        </div>
                    ) : "I've Completed Payment"}
                </button>
            </div>

            {/* Copied Toast */}
            {showToast && (
                <div className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl z-[60] animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Address Copied!
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
