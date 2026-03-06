"use client";

import React, { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    CheckCircle2,
    Copy,
    ChevronRight,
    Clock,
    ArrowLeft,
    Wallet,
    QrCode,
    Sparkles,
    Zap,
    ChevronDown,
    ChevronUp,
    Info,
    X,
    UploadCloud,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/common/ScrollReveal';

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
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file (PNG, JPG, etc)");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large. Max size is 5MB.");
            return;
        }
        setScreenshotFile(file);
        const reader = new FileReader();
        reader.onloadend = () => { setScreenshot(reader.result as string); };
        reader.readAsDataURL(file);
    };

    const removeScreenshot = () => {
        setScreenshot(null);
        setScreenshotFile(null);
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
                    courseId,
                    screenshot
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

    // ─── SUCCESS STATE ────────────────────────────────────────────────────────
    if (isDone) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-sm w-full bg-white rounded-3xl p-8 text-center shadow-xl border border-slate-100">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-3 text-slate-900 uppercase tracking-tight">Payment Received!</h2>
                    <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                        We've logged your transaction. Send a <span className="text-violet-600 font-bold">screenshot</span> of your receipt to our support team on Telegram to speed up activation.
                    </p>
                    <div className="space-y-3">
                        <a
                            href="https://t.me/putin2144"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 bg-[#229ED9] text-white font-black rounded-2xl hover:bg-[#1c86b9] transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M11.944 0C5.346 0 0 5.348 0 11.949c0 6.601 5.346 11.949 11.944 11.949 6.598 0 11.944-5.348 11.944-11.949C23.888 5.348 18.542 0 11.944 0zm5.553 8.3c-.179 1.915-1.077 7.07-1.526 9.456-.191 1.011-.561 1.35-1.42 1.428-1.042.095-2.003-.243-2.903-.789-1.399-.851-2.457-1.328-3.812-2.215-1.564-1.023-.551-1.586.341-2.511.233-.242 4.293-3.935 4.372-4.272.01-.042.019-.2-.075-.283-.094-.083-.231-.055-.331-.032-.142.032-2.41 1.531-6.791 4.495-.642.441-1.224.656-1.745.644-.573-.014-1.677-.325-2.498-.592-1.006-.328-1.807-.502-1.737-.1.036.21.323.421.859.632.536.21 1.072.316 1.608.316.536 0 1.071-.106 1.607-.317 1.019-.4 2.112-.903 3.28-1.509l.487-.253c.162-.084.24-.124.23-.118z" />
                            </svg>
                            Contact on Telegram
                        </a>
                        <Link href="/dashboard" className="block w-full py-3 text-slate-400 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-all">
                            Skip for now →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const periodLabel = plan === 'Monthly' ? '/mo' : plan === 'Quarterly' ? '/3mo' : '/yr';

    // ─── MAIN LAYOUT ──────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-50 pt-16 pb-28 md:pb-12">
            {/* Subtle background blobs */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-violet-500/5 blur-[140px] rounded-full -mr-80 -mt-80 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[140px] rounded-full -ml-80 -mb-80 pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">

                {/* Back Link */}
                <Link
                    href="/#pricing"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors font-semibold text-sm mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Plans
                </Link>

                <ScrollReveal direction="up">
                    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">

                        {/* ── LEFT: ORDER SUMMARY ──────────────────────────────────── */}
                        <div className="space-y-4">

                            {/* Plan Card */}
                            <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/25 via-transparent to-blue-600/15 pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                                            <Sparkles className="w-4 h-4 text-violet-300" />
                                        </div>
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                                            {type === 'course' ? 'One-Time Purchase' : `${plan} Plan`}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm font-bold text-white/70 mb-0.5">
                                            {type === 'course' ? courseTitle || 'Course Access' : 'Access Pass'}
                                        </p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black tracking-tight">${price}</span>
                                            {type !== 'course' && (
                                                <span className="text-sm text-white/40 font-medium">{periodLabel}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-white/60 text-xs font-semibold">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            Full Platform Access
                                        </div>
                                        <div className="flex items-center gap-2 text-white/60 text-xs font-semibold">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            Instant Activation
                                        </div>
                                        <div className="flex items-center gap-2 text-white/60 text-xs font-semibold">
                                            <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                            Secure & Encrypted
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Steps — hidden on mobile */}
                            <div className="hidden lg:block bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">How it works</p>
                                <div className="space-y-4">
                                    {[
                                        { step: "1", label: "Select Currency" },
                                        { step: "2", label: `Send exactly $${price}` },
                                        { step: "3", label: "Submit Proof" },
                                    ].map(item => (
                                        <div key={item.step} className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 text-xs font-black flex items-center justify-center shrink-0 border border-violet-100">
                                                {item.step}
                                            </div>
                                            <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT: PAYMENT MODULE ────────────────────────────────── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                            {/* Header */}
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">Payment</h1>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">Select currency & complete your transfer</p>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-lg">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                                </div>
                            </div>

                            <div className="p-5 space-y-5">

                                {/* Coin Selector */}
                                <div className="bg-slate-100 p-1 rounded-xl flex relative">
                                    <div
                                        className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
                                        style={{
                                            left: `calc(${(['USDT', 'BTC', 'USDC'].indexOf(selectedCoin) * 100) / 3}% + 4px)`,
                                            width: `calc(100% / 3 - 8px)`
                                        }}
                                    />
                                    {['USDT', 'BTC', 'USDC'].map((coin) => (
                                        <button
                                            key={coin}
                                            onClick={() => setSelectedCoin(coin)}
                                            className={`relative z-10 flex-1 py-2.5 text-xs font-black tracking-widest transition-colors duration-200 rounded-lg ${selectedCoin === coin
                                                ? 'text-violet-600'
                                                : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                        >
                                            {coin}
                                        </button>
                                    ))}
                                </div>

                                {/* Exchange Rate Bar */}
                                <div className="flex items-center justify-between bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exchange Rate</span>
                                    <div className="flex items-center gap-3">
                                        {isFetchingPrice ? (
                                            <div className="w-20 h-3.5 bg-violet-100 animate-pulse rounded" />
                                        ) : (
                                            <span className="text-sm font-black text-slate-800">
                                                1 {selectedCoin} = <span className="text-violet-600">${cryptoPrices[selectedCoin]?.toLocaleString()}</span>
                                            </span>
                                        )}
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                                            <Zap className="w-2.5 h-2.5 text-amber-500" />
                                            <span className="text-[9px] font-black text-slate-400 uppercase">Instant</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Wallet & Address */}
                                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-4">

                                    {/* Send Amount Label */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Send Exactly</p>
                                            <p className="text-lg font-black text-slate-900 tracking-tight">
                                                {calculateCryptoAmount()} <span className="text-violet-600">{selectedCoin}</span>
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium">${price} USD</p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1 h-1 rounded-full bg-violet-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{COIN_NAMES[selectedCoin]}</span>
                                        </div>
                                    </div>

                                    {/* QR Code */}
                                    <div className="flex flex-col items-center">
                                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 w-full max-w-[220px] mx-auto flex flex-col items-center gap-3">
                                            {walletError ? (
                                                <div className="w-[160px] h-[160px] flex flex-col items-center justify-center gap-2 text-red-400">
                                                    <QrCode className="w-8 h-8 opacity-40" />
                                                    <p className="text-[10px] font-bold text-center leading-tight">Address unavailable</p>
                                                </div>
                                            ) : !walletAddresses[selectedCoin] ? (
                                                <div className="w-[160px] h-[160px] bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
                                                    <QrCode className="w-8 h-8 text-slate-300" />
                                                </div>
                                            ) : (
                                                <img
                                                    key={selectedCoin}
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(walletAddresses[selectedCoin])}&color=0f172a&bgcolor=ffffff&margin=0`}
                                                    alt={`${selectedCoin} QR Code`}
                                                    className="w-[160px] h-[160px] rounded-lg"
                                                />
                                            )}
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <QrCode className="w-3 h-3" /> Scan to pay
                                            </p>
                                        </div>
                                    </div>

                                    {/* Wallet Address */}
                                    <div className="space-y-2">
                                        <div className="w-full bg-white border border-slate-200 px-3 py-3 rounded-xl text-xs font-mono text-slate-600 overflow-x-auto whitespace-nowrap scrollbar-hide">
                                            {walletError
                                                ? <span className="text-red-400 font-sans">Payment address unavailable. Contact support.</span>
                                                : walletAddresses[selectedCoin] ?? <span className="animate-pulse text-slate-300">Loading address...</span>
                                            }
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 ${copied
                                                ? 'bg-emerald-500 text-white border-emerald-500'
                                                : 'bg-slate-900 text-white border-slate-900 active:scale-95 hover:bg-slate-800'
                                                }`}
                                        >
                                            {copied ? (
                                                <><CheckCircle2 className="w-4 h-4" /> Copied!</>
                                            ) : (
                                                <><Copy className="w-4 h-4" /> Copy Address</>
                                            )}
                                        </button>
                                    </div>

                                    {/* Quick Tips */}
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <div className="bg-white border border-slate-100 rounded-xl p-3 flex items-start gap-2">
                                            <div className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                                <QrCode className="w-3 h-3 text-amber-500" />
                                            </div>
                                            <p className="text-[10px] font-semibold text-slate-500 leading-tight">Scan QR for quick transfer</p>
                                        </div>
                                        <div className="bg-white border border-slate-100 rounded-xl p-3 flex items-start gap-2">
                                            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                                <Wallet className="w-3 h-3 text-blue-500" />
                                            </div>
                                            <p className="text-[10px] font-semibold text-slate-500 leading-tight">Send exact <span className="font-black text-slate-800">${price}</span> only</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Instructions Accordion */}
                                <div className="border border-slate-100 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setInstructionsOpen(!instructionsOpen)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-white active:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                            <Info className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                                            ⚠️ Important Instructions
                                        </div>
                                        {instructionsOpen ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
                                    </button>
                                    {instructionsOpen && (
                                        <div className="px-4 pb-4 bg-white border-t border-slate-50 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                            {[
                                                `Use the ${selectedCoin === 'BTC' ? 'Bitcoin' : 'ERC-20'} network. Wrong network = permanent loss.`,
                                                "Transfers take 5–15 minutes to confirm on the blockchain.",
                                                "All crypto sales are final. No refunds once sent."
                                            ].map((text, i) => (
                                                <div key={i} className="flex gap-2 pt-2.5">
                                                    <div className="w-1 h-1 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Screenshot Upload */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1 h-3.5 bg-violet-600 rounded-full" />
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Submit Proof</h3>
                                        <span className="text-[10px] text-slate-400 font-medium">(Optional — speeds up activation)</span>
                                    </div>

                                    {!screenshot ? (
                                        <div className="relative group cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50 group-hover:bg-violet-50 group-hover:border-violet-200 transition-all">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-slate-100">
                                                    <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-violet-600" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">Upload payment screenshot</p>
                                                <p className="text-[10px] text-slate-400">PNG, JPG · Max 5MB</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                                            <img src={screenshot} alt="Payment Proof" className="w-full h-40 object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={removeScreenshot}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors flex items-center gap-1.5 font-bold text-xs shadow-lg"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="absolute top-3 left-3">
                                                <span className="px-2.5 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                                                    <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Desktop CTA */}
                                <div className="hidden md:block pt-1">
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isConfirming}
                                        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.15em] transition-all relative overflow-hidden group/btn ${isConfirming
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-slate-950 text-white hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.99]'
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            {isConfirming ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    I've Sent the Payment
                                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                    <p className="text-center text-[10px] text-slate-300 font-medium mt-3 uppercase tracking-widest">
                                        Manual Verification Protocol
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-100 p-3 pb-safe z-50">
                <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${isConfirming
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-slate-950 text-white shadow-lg active:scale-[0.98]'
                        }`}
                >
                    {isConfirming ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Verifying...
                        </div>
                    ) : "I've Completed Payment"}
                </button>
            </div>

            {/* Copied Toast */}
            {showToast && (
                <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl z-[60] animate-in slide-in-from-bottom-4 fade-in duration-200">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
