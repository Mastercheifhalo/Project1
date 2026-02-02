'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    BookOpen,
    CreditCard,
    Settings,
    LogOut,
    GraduationCap,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const Sidebar = () => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const navLinks = [
        { name: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'My Courses', href: '/dashboard/my-courses', icon: <BookOpen className="w-5 h-5" /> },
        { name: 'Billing', href: '/dashboard/billing', icon: <CreditCard className="w-5 h-5" /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <div
            className={`fixed top-0 left-0 h-full bg-white/40 backdrop-blur-xl border-r border-white/20 transition-all duration-500 z-50 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform duration-300">
                                <GraduationCap className="text-white w-5 h-5" />
                            </div>
                            <span className="font-black tracking-tighter text-slate-900 text-lg">
                                COURSE<span className="premium-gradient">PRO</span>
                            </span>
                        </Link>
                    </motion.div>
                )}
                {isCollapsed && (
                    <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-violet-600/20">
                        <GraduationCap className="text-white w-5 h-5" />
                    </div>
                )}
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-2">
                {navLinks.map((link, index) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                        >
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-3 p-3 rounded-2xl font-bold transition-all relative group ${isActive
                                    ? 'text-violet-600'
                                    : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-white/60 shadow-sm border border-white/40 rounded-2xl -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <div className={`${isActive ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`}>
                                    {link.icon}
                                </div>
                                {!isCollapsed && (
                                    <span className="tracking-tight">{link.name}</span>
                                )}
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="ml-auto w-1.5 h-1.5 bg-violet-600 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]"
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
                <button className="w-full flex items-center gap-3 p-3 rounded-2xl font-bold text-red-500/80 hover:bg-red-50/50 hover:text-red-600 transition-all">
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <span className="text-sm">Sign Out</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
