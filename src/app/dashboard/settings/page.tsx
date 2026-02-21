'use client';

import React, { useEffect, useState } from 'react';
import {
    User,
    Mail,
    Lock,
    Bell,
    Shield,
    CreditCard,
    Camera,
    Check,
    AlertCircle,
    Smartphone,
    Save,
    Trash2
} from 'lucide-react';
import { getUserProfile, updateUserProfile, deleteAccount } from '@/app/actions/dashboard';
import { signOut } from 'next-auth/react';
import DeleteAccountModal from '@/components/dashboard/DeleteAccountModal';

type TabType = 'profile' | 'security' | 'notifications' | 'billing';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        getUserProfile().then((data) => {
            setProfile(data);
            setLoading(false);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const result = await updateUserProfile(formData);

        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            const updated = await getUserProfile();
            setProfile(updated);
        } else {
            setMessage({ type: 'error', text: result.error || 'Something went wrong' });
        }
        setSaving(false);
        setTimeout(() => setMessage(null), 4000);
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        const result = await deleteAccount();
        if (result.success) {
            signOut({ callbackUrl: '/' });
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to delete account' });
            setIsDeleteModalOpen(false);
            setIsDeleting(false);
        }
    };

    const initials = profile?.name
        ? profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    if (loading) {
        return (
            <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-20">
                <div className="h-10 w-72 bg-slate-100 rounded-xl animate-pulse mb-2" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-80 animate-pulse" />
                    <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-96 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight text-slate-900 uppercase">Account <span className="premium-gradient">Settings</span></h1>
                    <p className="text-slate-500 font-medium text-sm md:text-base">Manage your profile, security, and subscription.</p>
                </div>
                {activeTab === 'profile' && (
                    <button
                        form="profile-form"
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                )}
            </div>

            {/* Save Status Banner */}
            {message && (
                <div className={`flex items-center gap-3 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-bold text-sm">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                {/* Left Column - Navigation */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-violet-600" />
                        <div className="relative mb-6">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-violet-50 rounded-full mx-auto border-4 border-white shadow-xl flex items-center justify-center text-3xl md:text-4xl font-black text-violet-600">
                                {initials}
                            </div>
                            <button className="absolute bottom-1 right-1/2 translate-x-12 md:translate-x-16 p-2 bg-slate-900 text-white rounded-full shadow-lg border-2 border-white">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1">{profile?.name || 'User'}</h2>
                        <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-6">{profile?.plan} Plan Member</p>
                        <span className="px-4 py-1.5 bg-violet-50 text-violet-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-violet-100">Since {profile?.memberSince}</span>
                    </div>

                    <nav className="bg-white p-3 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm space-y-1">
                        {[
                            { id: 'profile', icon: User, label: 'Profile Details' },
                            { id: 'security', icon: Lock, label: 'Security' },
                            { id: 'notifications', icon: Bell, label: 'Notifications' },
                            { id: 'billing', icon: CreditCard, label: 'Billing' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-violet-50 text-violet-600 shadow-sm shadow-violet-600/5'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Right Column - Tab Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-5 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[500px]">
                        {activeTab === 'profile' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="border-b border-slate-100 pb-6 mb-8">
                                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                                        <Mail className="w-6 h-6 text-violet-600" />
                                        Personal Info
                                    </h3>
                                    <p className="text-slate-400 text-sm font-medium mt-1">Update your basic profile information.</p>
                                </div>

                                <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={profile?.name || ''}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-medium focus:border-violet-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            defaultValue={profile?.email || ''}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-medium focus:border-violet-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="border-b border-slate-100 pb-6 mb-8">
                                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                                        <Shield className="w-6 h-6 text-violet-600" />
                                        Security Settings
                                    </h3>
                                    <p className="text-slate-400 text-sm font-medium mt-1">Manage your password and security options.</p>
                                </div>

                                <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                                        <Lock className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-slate-900 text-lg">Change Password</h4>
                                        <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">Password management is handled via the dashboard for security.</p>
                                    </div>
                                    <button className="px-8 py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-all opacity-50 cursor-not-allowed">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="border-b border-slate-100 pb-6 mb-8">
                                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                                        <Bell className="w-6 h-6 text-violet-600" />
                                        Notification Preferences
                                    </h3>
                                    <p className="text-slate-400 text-sm font-medium mt-1">Choose how and when you want to be notified.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { title: 'Email Notifications', desc: 'Summary of yours and your student activities' },
                                        { title: 'New Course Alerts', desc: 'Get notified when new content is released' },
                                        { title: 'System Updates', desc: 'Important news about your account and the platform' },
                                    ].map((pref, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                                            <div>
                                                <p className="font-black text-slate-900 uppercase tracking-tight">{pref.title}</p>
                                                <p className="text-slate-500 text-xs font-medium">{pref.desc}</p>
                                            </div>
                                            <div className="w-14 h-8 bg-violet-600 rounded-full flex items-center px-1">
                                                <div className="w-6 h-6 bg-white rounded-full shadow-md ml-auto" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="border-b border-slate-100 pb-6 mb-8">
                                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                                        <CreditCard className="w-6 h-6 text-violet-600" />
                                        Billing & Subscription
                                    </h3>
                                    <p className="text-slate-400 text-sm font-medium mt-1">Manage your current plan and payment history.</p>
                                </div>

                                <div className="p-8 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] text-white shadow-xl shadow-violet-600/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">Current Plan</p>
                                            <h4 className="text-3xl font-black tracking-tight">{profile?.plan} Access</h4>
                                            <p className="text-white/60 text-sm font-medium mt-2">Billed {profile?.plan === 'Free' ? 'never' : 'monthly'}. No next billing date available.</p>
                                        </div>
                                        <button className="px-8 py-3 bg-white text-violet-600 font-black rounded-xl hover:bg-violet-50 transition-all text-sm shadow-md">
                                            Upgrade Plan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Danger Zone */}
                    <div className="mt-8 bg-red-50/30 p-8 rounded-[2.5rem] border border-red-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h4 className="text-red-600 font-black flex items-center gap-2 uppercase tracking-tight mb-1">
                                    <Trash2 className="w-5 h-5" />
                                    Danger Zone
                                </h4>
                                <p className="text-slate-500 text-sm font-medium">Permanently delete your account and all associated data.</p>
                            </div>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="px-8 py-3 bg-white text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                loading={isDeleting}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        </div>
    );
}
