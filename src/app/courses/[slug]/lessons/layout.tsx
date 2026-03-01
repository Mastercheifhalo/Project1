'use client';

import React, { useState } from 'react';
import CourseLessonSidebar from '@/components/courses/CourseLessonSidebar';
import Link from 'next/link';
import { ShieldCheck, ChevronLeft, LayoutDashboard, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseLessonsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock data for the layout - In a real app, this would be fetched based on :slug
    const mockCourse = {
        title: 'Mastering Next.js 14 & React 19',
        lessons: [
            { id: '1', title: 'Course Overview & Roadmap', duration: '05:24', isCompleted: true, isLocked: false },
            { id: '2', title: 'Setting up the Modern Dev Environment', duration: '12:45', isCompleted: true, isLocked: false },
            { id: '3', title: 'Deep Dive into Server Components', duration: '45:10', isCompleted: false, isLocked: false },
            { id: '4', title: 'Advanced Data Fetching & Caching', duration: '38:20', isCompleted: false, isLocked: false },
            { id: '5', title: 'State Management with React 19', duration: '52:15', isCompleted: false, isLocked: true },
            { id: '6', title: 'Optimizing for Core Web Vitals', duration: '41:10', isCompleted: false, isLocked: true },
        ]
    };

    const currentLessonId = '3';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">

            {/* Desktop sidebar (lg+) - always visible */}
            <div className="hidden lg:block lg:w-96 lg:h-screen lg:sticky lg:top-0 z-[40]">
                <CourseLessonSidebar
                    courseTitle={mockCourse.title}
                    lessons={mockCourse.lessons}
                    currentLessonId={currentLessonId}
                    onLessonClick={(id) => console.log('Navigate to lesson', id)}
                />
            </div>

            {/* Mobile sidebar drawer (< lg) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50]"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        {/* Slide-in drawer from right */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="lg:hidden fixed top-0 right-0 h-full w-[85vw] max-w-sm z-[51]"
                        >
                            {/* Close button */}
                            <div className="absolute top-4 left-4 z-10">
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 rounded-xl bg-white/80 backdrop-blur text-slate-600 hover:text-slate-900 shadow"
                                    aria-label="Close lesson list"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <CourseLessonSidebar
                                courseTitle={mockCourse.title}
                                lessons={mockCourse.lessons}
                                currentLessonId={currentLessonId}
                                onLessonClick={(id) => {
                                    console.log('Navigate to lesson', id);
                                    setIsSidebarOpen(false);
                                }}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Pane */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-14 md:h-20 px-4 md:px-8 flex items-center justify-between border-b border-slate-100 bg-white/40 backdrop-blur-xl sticky top-0 z-[30]">
                    <div className="flex items-center gap-3 md:gap-6">
                        <Link
                            href="/dashboard/my-courses"
                            className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-100"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div className="h-5 w-px bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 md:w-9 md:h-9 bg-slate-900 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="text-white w-4 h-4" />
                            </div>
                            <span className="font-black tracking-tighter text-slate-900 text-sm hidden sm:inline">
                                COURSE<span className="premium-gradient">PRO</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Dashboard link */}
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 bg-white border border-slate-100 rounded-2xl font-black text-[10px] text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="hidden md:inline">Dashboard</span>
                        </Link>
                        {/* Lesson list toggle — mobile only */}
                        <button
                            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-sm shadow-violet-600/20"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open lesson list"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Lessons</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}
