"use client";

import React, { useState } from 'react';
import CourseLessonSidebar from '@/components/courses/CourseLessonSidebar';
import Link from 'next/link';
import { ShieldCheck, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CourseLessonsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Mock data for the layout - In a real app, this would be fetched based on :slug
    const mockCourse = {
        title: "Mastering Next.js 14 & React 19",
        lessons: [
            { id: '1', title: 'Course Overview & Roadmap', duration: '05:24', isCompleted: true, isLocked: false },
            { id: '2', title: 'Setting up the Modern Dev Environment', duration: '12:45', isCompleted: true, isLocked: false },
            { id: '3', title: 'Deep Dive into Server Components', duration: '45:10', isCompleted: false, isLocked: false },
            { id: '4', title: 'Advanced Data Fetching & Caching', duration: '38:20', isCompleted: false, isLocked: false },
            { id: '5', title: 'State Management with React 19', duration: '52:15', isCompleted: false, isLocked: true },
            { id: '6', title: 'Optimizing for Core Web Vitals', duration: '41:10', isCompleted: false, isLocked: true },
        ]
    };

    // Assuming we're on lesson 3 for now in mock state
    const currentLessonId = '3';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            {/* Sidebar (Navigation) */}
            <div className="lg:w-96 lg:h-screen lg:sticky lg:top-0 z-[40]">
                <CourseLessonSidebar
                    courseTitle={mockCourse.title}
                    lessons={mockCourse.lessons}
                    currentLessonId={currentLessonId}
                    onLessonClick={(id) => console.log('Navigate to lesson', id)}
                />
            </div>

            {/* Main Content Pane */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Header (Minimalist) */}
                <header className="h-20 px-8 flex items-center justify-between border-b border-slate-100 bg-white/40 backdrop-blur-xl sticky top-0 z-[30]">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/my-courses" className="p-2.5 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-100">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div className="h-6 w-px bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="text-white w-5 h-5" />
                            </div>
                            <span className="font-black tracking-tighter text-slate-900 text-sm">
                                COURSE<span className="premium-gradient">PRO</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-2xl font-black text-[10px] text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}
