import React from 'react';
import {
    User,
    Mail,
    Lock,
    Bell,
    Shield,
    CreditCard,
    Camera
} from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black mb-2 tracking-tight text-slate-900 uppercase">Account <span className="premium-gradient">Settings</span></h1>
                <p className="text-slate-500 font-medium">Manage your profile, security, and subscription.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column - Profile Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-violet-600" />
                        <div className="relative mb-6">
                            <div className="w-32 h-32 bg-violet-50 rounded-full mx-auto border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-violet-600">
                                JD
                            </div>
                            <button className="absolute bottom-1 right-1/2 translate-x-16 p-2.5 bg-slate-900 text-white rounded-full shadow-lg hover:scale-110 transition-all border-4 border-white">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-1">John Doe</h2>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-6">Pro Plan Member</p>
                        <div className="flex justify-center gap-2">
                            <span className="px-4 py-1.5 bg-violet-50 text-violet-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-violet-100 italic">Since Jan 2026</span>
                        </div>
                    </div>

                    <nav className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm space-y-1">
                        <button className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold bg-violet-50 text-violet-600 transition-all">
                            <User className="w-5 h-5" />
                            Profile Details
                        </button>
                        <button className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
                            <Lock className="w-5 h-5" />
                            Security
                        </button>
                        <button className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
                            <Bell className="w-5 h-5" />
                            Notifications
                        </button>
                        <button className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all border-t border-slate-50 mt-2">
                            <CreditCard className="w-5 h-5" />
                            Billing
                        </button>
                    </nav>
                </div>

                {/* Right Column - Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <Mail className="w-6 h-6 text-violet-600" />
                            Personal Information
                        </h3>

                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-widest px-1">First Name</label>
                                <input
                                    type="text"
                                    defaultValue="John"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-6 font-medium focus:border-violet-500 focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-widest px-1">Last Name</label>
                                <input
                                    type="text"
                                    defaultValue="Doe"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-6 font-medium focus:border-violet-500 focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-widest px-1">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue="john.doe@example.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-6 font-medium focus:border-violet-500 focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-widest px-1">Full Biography</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about yourself..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-medium focus:border-violet-500 focus:bg-white outline-none transition-all resize-none"
                                />
                            </div>
                            <div className="md:col-span-2 pt-4">
                                <button className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-red-50/50 p-10 rounded-[2.5rem] border border-red-100">
                        <h3 className="text-xl font-black text-red-600 mb-2 flex items-center gap-3">
                            <Shield className="w-6 h-6" />
                            Delete Account
                        </h3>
                        <p className="text-red-500 font-medium mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                        <button className="px-8 py-3 bg-white text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all">
                            Delete My Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
