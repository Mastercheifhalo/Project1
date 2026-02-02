'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, FileText, Play, Settings, CreditCard, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CommandK: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    const items = [
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, category: 'Navigation' },
        { name: 'React Hooks Masterclass', href: '/dashboard/my-courses', icon: <Play className="w-4 h-4" />, category: 'Courses' },
        { name: 'Billing & Subscription', href: '/dashboard/billing', icon: <CreditCard className="w-4 h-4" />, category: 'Account' },
        { name: 'Profile Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4" />, category: 'Account' },
        { name: 'Advanced CSS Patterns', href: '/dashboard/my-courses', icon: <FileText className="w-4 h-4" />, category: 'Courses' },
    ];

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    const toggle = useCallback(() => setIsOpen(open => !open), []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggle, isOpen]);

    const handleSelect = (href: string) => {
        router.push(href);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <>
            {/* Global Shortcut Help (Subtle) */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={toggle}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/50 backdrop-blur-md border border-white/40 rounded-lg text-slate-400 text-xs font-bold shadow-sm hover:bg-white/80 transition-all"
                >
                    <Command className="w-3 h-3" />
                    <span>K</span>
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-2xl bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden"
                        >
                            {/* Search Header */}
                            <div className="flex items-center gap-3 p-6 border-b border-slate-100">
                                <Search className="w-6 h-6 text-violet-500" />
                                <input
                                    autoFocus
                                    placeholder="Search anything... (courses, settings, help)"
                                    className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-slate-900 placeholder:text-slate-400"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-md text-[10px] font-black text-slate-400 uppercase">
                                    Esc
                                </div>
                            </div>

                            {/* Results */}
                            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
                                {filteredItems.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredItems.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSelect(item.href)}
                                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-violet-50 transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-violet-600 group-hover:border-violet-100 transition-all shadow-sm">
                                                        {item.icon}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-slate-900 group-hover:text-violet-700">{item.name}</p>
                                                        <p className="text-xs font-medium text-slate-400">{item.category}</p>
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="px-2 py-1 bg-violet-100 rounded text-[10px] font-black text-violet-600 uppercase">Enter</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <X className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-900 font-bold">No results found for "{query}"</p>
                                        <p className="text-slate-400 text-sm">Try searching for something else.</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1"><Command className="w-3 h-3" /> Navigation</span>
                                    <span className="flex items-center gap-1"><Search className="w-3 h-3" /> Select</span>
                                </div>
                                <span>Powered by CoursePro AI</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CommandK;
