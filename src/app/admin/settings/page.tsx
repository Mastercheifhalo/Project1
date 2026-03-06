'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Settings, Save, Globe, Shield, Bell, Zap, Database, Key, Fingerprint,
    Bitcoin, Wallet, CheckCircle2, AlertCircle, Loader2, QrCode, Eye, EyeOff
} from 'lucide-react';

// ─── Wallet Section ────────────────────────────────────────────────────────────
function WalletSettings() {
    const [addresses, setAddresses] = React.useState({ BTC: '', USDT: '', USDC: '' });
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
    const [revealed, setRevealed] = React.useState<Record<string, boolean>>({});

    React.useEffect(() => {
        fetch('/api/wallets')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => setAddresses({ BTC: data.BTC || '', USDT: data.USDT || '', USDC: data.USDC || '' }))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setStatus('idle');
        try {
            const res = await fetch('/api/admin/wallets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addresses),
            });
            setStatus(res.ok ? 'success' : 'error');
        } catch {
            setStatus('error');
        } finally {
            setSaving(false);
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const coins = [
        { key: 'BTC', label: 'Bitcoin', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        { key: 'USDT', label: 'Tether (USDT)', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { key: 'USDC', label: 'USD Coin (USDC)', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    ] as const;

    return (
        <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl shadow-slate-200/40 space-y-8">
            <div className="flex items-center justify-between gap-3 pb-6 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Crypto Wallet Addresses</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Changes apply instantly — no restart needed</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${saving || loading
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : status === 'success'
                            ? 'bg-emerald-500 text-white'
                            : status === 'error'
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-lg'
                        }`}
                >
                    {saving ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : status === 'success' ? (
                        <><CheckCircle2 className="w-4 h-4" /> Saved!</>
                    ) : status === 'error' ? (
                        <><AlertCircle className="w-4 h-4" /> Failed</>
                    ) : (
                        <><Save className="w-4 h-4" /> Save Wallets</>
                    )}
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                </div>
            ) : (
                <div className="space-y-6">
                    {coins.map(({ key, label, color, bg, border }) => (
                        <div key={key} className={`rounded-2xl border ${border} ${bg} p-5 space-y-3`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-black uppercase tracking-widest ${color}`}>{key}</span>
                                    <span className="text-[10px] font-medium text-slate-400">· {label}</span>
                                </div>
                                {addresses[key] && (
                                    <div className="flex items-center gap-2">
                                        {/* Live QR preview */}
                                        <div className="bg-white rounded-lg p-1.5 border border-slate-200 shadow-sm">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(addresses[key])}&color=0f172a&bgcolor=ffffff&margin=0`}
                                                alt={`${key} QR`}
                                                className="w-10 h-10 rounded"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative flex items-center gap-2">
                                <input
                                    type={revealed[key] ? 'text' : 'password'}
                                    value={addresses[key]}
                                    onChange={e => setAddresses(prev => ({ ...prev, [key]: e.target.value }))}
                                    placeholder={`Enter ${key} wallet address`}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setRevealed(prev => ({ ...prev, [key]: !prev[key] }))}
                                    className="shrink-0 p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
                                    title={revealed[key] ? 'Hide address' : 'Show address'}
                                >
                                    {revealed[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {addresses[key] && (
                                <p className="text-[9px] font-mono text-slate-400 truncate px-1">
                                    {addresses[key].slice(0, 18)}...{addresses[key].slice(-6)}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-amber-700 leading-relaxed">
                            <strong>Security note:</strong> Only admins can access this page. Wallet addresses are stored securely in the database and never exposed in client-side code.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}

// ─── Main Admin Settings Page ──────────────────────────────────────────────────
const AdminSettingsPage = () => {
    const [securitySettings, setSecuritySettings] = React.useState([
        { label: 'Two-Factor Authentication', desc: 'Require 2FA for all administrator accounts', icon: Fingerprint, checked: true },
        { label: 'Course Content Protection', desc: 'Disable Right-Click and Text Selection on videos', icon: Zap, checked: false },
        { label: 'IP Rate Limiting', desc: 'Enable global protection against brute force attacks', icon: Database, checked: true },
    ]);

    const toggleSecurity = (index: number) => {
        setSecuritySettings(prev => prev.map((s, i) => i === index ? { ...s, checked: !s.checked } : s));
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Platform <span className="premium-gradient">Settings</span></h1>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">Configure global platform parameters and system integrations.</p>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* General Config + Security + Wallets */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl shadow-slate-200/40 space-y-8">
                        <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                                <Globe className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">General Configuration</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Platform Name</label>
                                <input type="text" defaultValue="CoursePro" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-500 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Support Email</label>
                                <input type="email" defaultValue="admin@coursepro.ai" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-500 transition-all" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Platform Description</label>
                                <textarea rows={3} defaultValue="Join thousands of students and learn from industry experts with our subscription-based course platform." className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-500 transition-all resize-none" />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl shadow-slate-200/40 space-y-8">
                        <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Shield className="text-emerald-600 w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Security & Access</h3>
                        </div>

                        <div className="space-y-6">
                            {securitySettings.map((item, i) => (
                                <div key={i} className="flex items-center justify-between gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-slate-900 leading-tight">{item.label}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-tight mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => toggleSecurity(i)}
                                        className={`shrink-0 w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${item.checked ? 'bg-slate-900' : 'bg-slate-200'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${item.checked ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Wallet Addresses Section */}
                    <WalletSettings />
                </div>

                {/* API Keys / System Status */}
                <div className="space-y-8">
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl shadow-slate-200/40 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <Key className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">API Keys</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-900 rounded-2xl">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Publishable Key</p>
                                <code className="text-[10px] font-mono text-emerald-400 break-all">course_live_9a2h1...v9k</code>
                            </div>
                            <div className="p-4 bg-slate-900 rounded-2xl">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Secret Key</p>
                                <div className="flex items-center justify-between">
                                    <code className="text-[10px] font-mono text-slate-400">••••••••••••••••••••</code>
                                    <button className="text-[8px] font-black text-white bg-slate-800 px-2 py-1 rounded-md uppercase tracking-widest">Reveal</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2.5rem] shadow-xl space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                <Bell className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">System Status</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'API Gateway', status: 'Operational' },
                                { label: 'Asset CDN', status: 'Operational' },
                                { label: 'Database', status: 'Healthy' },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500">{s.label}</span>
                                    <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">{s.status}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
