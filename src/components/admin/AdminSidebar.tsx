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
    ClipboardList
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
            {/* Mobile Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-[1010]">
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-3 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg text-slate-900"
                >
                    <ShieldCheck className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[1001]"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 left-0 h-full bg-white/40 backdrop-blur-xl border-r border-white/20 transition-all duration-500 z-[1002] flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${isCollapsed ? 'w-20' : 'w-64'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform duration-300">
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
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.name} href={link.href}>
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
