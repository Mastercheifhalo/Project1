'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useAdmin } from '@/context/AdminContext';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    BarChart3,
    Settings,
    LogOut,
    GraduationCap,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    ClipboardList,
    Menu,
    X
} from 'lucide-react';

const AdminSidebar = () => {
    const pathname = usePathname();
    const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useAdmin();

    const navLinks = [
        { name: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Users', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
        { name: 'Courses', href: '/admin/courses', icon: <BookOpen className="w-5 h-5" /> },
        { name: 'Revenue', href: '/admin/revenue', icon: <BarChart3 className="w-5 h-5" /> },
        { name: 'Audit Log', href: '/admin/audit', icon: <ClipboardList className="w-5 h-5" /> },
        { name: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <>
            {/* Mobile Hamburger — only shown when sidebar is CLOSED to prevent logo overlap */}
            {!isMobileOpen && (
                <div className="lg:hidden fixed top-4 left-4 z-[1010]">
                    <motion.button
                        onClick={() => setIsMobileOpen(true)}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative p-3 bg-slate-900 rounded-2xl shadow-lg shadow-slate-900/25 text-white overflow-hidden group"
                        aria-label="Open admin sidebar"
                    >
                        <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ring-2 ring-white/20" />
                        <Menu className="w-5 h-5" />
                    </motion.button>
                </div>
            )}

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[1001]"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 left-0 h-full bg-white/40 backdrop-blur-xl border-r border-white/20 transition-all duration-500 z-[1002] flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${isCollapsed ? 'w-20' : 'w-64'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Header — close button lives here on mobile to avoid overlap */}
                <div className="p-5 flex items-center gap-2">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 min-w-0"
                        >
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                    <ShieldCheck className="text-white w-5 h-5" />
                                </div>
                                <span className="font-black tracking-tighter text-slate-900 text-lg">
                                    ADMIN<span className="premium-gradient">PRO</span>
                                </span>
                            </Link>
                        </motion.div>
                    )}
                    {isCollapsed && (
                        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-slate-900/20">
                            <ShieldCheck className="text-white w-5 h-5" />
                        </div>
                    )}
                    {/* X button inside header — only on mobile when open, zero overlap with logo */}
                    {isMobileOpen && !isCollapsed && (
                        <motion.button
                            onClick={() => setIsMobileOpen(false)}
                            whileTap={{ scale: 0.9 }}
                            className="lg:hidden ml-auto shrink-0 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all"
                            aria-label="Close sidebar"
                        >
                            <X className="w-4 h-4" />
                        </motion.button>
                    )}
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.name} href={link.href} onClick={() => setIsMobileOpen(false)}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-3 p-3 rounded-2xl font-bold transition-all relative group ${isActive
                                        ? 'text-slate-900'
                                        : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeAdminNav"
                                            className="absolute inset-0 bg-white shadow-sm border border-slate-100 rounded-2xl -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <div className={`${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`}>
                                        {link.icon}
                                    </div>
                                    {!isCollapsed && (
                                        <span className="tracking-tight">{link.name}</span>
                                    )}
                                    {isActive && !isCollapsed && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="ml-auto w-1.5 h-1.5 bg-slate-900 rounded-full shadow-[0_0_8px_rgba(15,23,42,0.3)]"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 space-y-2">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl font-bold text-slate-400 hover:bg-white/40 hover:text-slate-900 transition-all group"
                    >
                        <div className="group-hover:rotate-180 transition-transform duration-500">
                            {isCollapsed ? <ChevronRight className="w-5 h-5 mx-auto" /> : <ChevronLeft className="w-5 h-5" />}
                        </div>
                        {!isCollapsed && <span className="text-sm">Collapse Menu</span>}
                    </button>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl font-bold text-red-500/80 hover:bg-red-50 hover:text-red-700 transition-all active:scale-95 group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        {!isCollapsed && <span className="text-sm">Sign Out</span>}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
