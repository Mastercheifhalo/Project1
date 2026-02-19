'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Globe, Shield, Bell, Zap, Database, Key, Fingerprint } from 'lucide-react';

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
            {/* Header ... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Platform <span className="premium-gradient">Settings</span></h1>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">Configure global platform parameters and system integrations.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">
                    <Save className="w-5 h-5" />
                    Save Changes
                </button>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* General Config */}
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
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">{item.label}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => toggleSecurity(i)}
                                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${item.checked ? 'bg-slate-900' : 'bg-slate-200'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${item.checked ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* API Keys / Integrations */}
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
