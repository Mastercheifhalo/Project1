'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, GraduationCap } from 'lucide-react';

const SignupPage = () => {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-6 flex items-center justify-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] opacity-5 pointer-events-none -z-10" />

            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex w-16 h-16 bg-violet-600 rounded-2xl items-center justify-center shadow-xl shadow-violet-600/20 mb-6 group hover:scale-110 transition-transform">
                        <GraduationCap className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">Create Account</h1>
                    <p className="text-slate-500 font-medium">Join CoursePro and start building your future.</p>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 px-1 uppercase tracking-widest">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all shadow-sm focus:bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 px-1 uppercase tracking-widest">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all shadow-sm focus:bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 px-1 uppercase tracking-widest">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all shadow-sm focus:bg-white"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="button-premium w-full mt-4"
                        >
                            Create Account
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="text-violet-600 font-black hover:text-violet-500 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SignupPage;
