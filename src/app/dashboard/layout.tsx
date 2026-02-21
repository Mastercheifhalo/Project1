'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import AuraBackground from '@/components/dashboard/AuraBackground';
import { Menu, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const progress = 45;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen relative flex">
            <AuraBackground progress={progress} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Header Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors active:scale-95"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-600/20">
                            <GraduationCap className="text-white w-4 h-4" />
                        </div>
                        <span className="text-lg font-black tracking-tight text-slate-900">
                            COURSE<span className="premium-gradient">PRO</span>
                        </span>
                    </Link>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>
            </div>

            <main className="flex-1 min-h-screen transition-all duration-500 pt-16 md:pt-0 p-4 md:p-8 md:pl-72">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
