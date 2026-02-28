'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    BookOpen,
    CreditCard,
    Settings,
    LogOut,
    GraduationCap,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    X
} from 'lucide-react';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN';
    const navLinks = [
        { name: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'My Courses', href: '/dashboard/my-courses', icon: <BookOpen className="w-5 h-5" /> },
        { name: 'Billing', href: '/dashboard/billing', icon: <CreditCard className="w-5 h-5" /> },
        { name: 'Revenue', href: '/admin/revenue', icon: <ShieldCheck className="w-5 h-5" />, adminOnly: true },
        { name: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
    ];

    const handleNavClick = () => {
        if (onClose) onClose();
    };

    const sidebarContent = (
        <div
            className={`h-full bg-white/40 backdrop-blur-xl border-r border-white/20 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-500 ${isCollapsed ? 'w-20' : 'w-64'
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
                {/* Mobile close button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white/40 transition-all"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-2">
                {navLinks.map((link) => {
                    if (link.adminOnly && !isAdmin) return null;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={handleNavClick}
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

                {isAdmin && (
                    <Link
                        href="/admin"
                        onClick={handleNavClick}
                    >
                        <motion.div
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-3 rounded-2xl font-bold bg-amber-50/50 text-amber-600 hover:bg-amber-100/50 hover:text-amber-700 transition-all group mt-6`}
                        >
                            <div className="text-amber-500 group-hover:text-amber-600 transition-colors">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            {!isCollapsed && (
                                <span className="tracking-tight uppercase text-[10px] font-black tracking-widest">Admin Panel</span>
                            )}
                        </motion.div>
                    </Link>
                )}
            </nav>

            {/* Footer */}
            <div className="p-4 space-y-2">
                {/* Collapse toggle — desktop only */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex w-full items-center gap-3 p-3 rounded-2xl font-bold text-slate-400 hover:bg-white/40 hover:text-slate-900 transition-all group"
                >
                    <div className="group-hover:rotate-180 transition-transform duration-500">
                        {isCollapsed ? <ChevronRight className="w-5 h-5 mx-auto" /> : <ChevronLeft className="w-5 h-5" />}
                    </div>
                    {!isCollapsed && <span className="text-sm">Collapse Menu</span>}
                </button>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl font-bold text-red-500/80 hover:bg-red-50/50 hover:text-red-600 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <span className="text-sm">Sign Out</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar — always visible */}
            <div className="hidden md:block fixed top-0 left-0 h-full z-50">
                {sidebarContent}
            </div>

            {/* Mobile sidebar — overlay drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[998]"
                            onClick={onClose}
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="md:hidden fixed top-0 left-0 h-full z-[999]"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
