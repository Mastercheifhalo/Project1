"use client";

import React from 'react';
import {
    CheckCircle2,
    PlayCircle,
    Lock,
    Clock,
    ChevronRight,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Lesson {
    id: string;
    title: string;
    duration: string;
    isCompleted: boolean;
    isLocked: boolean;
}

interface CourseLessonSidebarProps {
    courseTitle: string;
    lessons: Lesson[];
    currentLessonId: string;
    onLessonClick: (id: string) => void;
}

const CourseLessonSidebar = ({ courseTitle, lessons, currentLessonId, onLessonClick }: CourseLessonSidebarProps) => {
    const completedCount = lessons.filter(l => l.isCompleted).length;
    const progressPercentage = (completedCount / lessons.length) * 100;

    return (
        <div className="w-full lg:w-96 flex flex-col bg-white border-l border-slate-100 min-h-screen overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-8 border-b border-slate-50 space-y-6">
                <div className="space-y-1">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{courseTitle}</h2>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">Course Content</h1>
                </div>

                {/* Progress Card */}
                <div className="p-5 bg-slate-900 rounded-3xl shadow-xl shadow-slate-900/20 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Progress</span>
                            <span className="text-xs font-black">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                className="h-full bg-violet-400 rounded-full"
                            />
                        </div>
                        <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {completedCount} of {lessons.length} lessons completed
                        </p>
                    </div>
                </div>
            </div>

            {/* Lesson List */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-6">
                <div className="px-6 space-y-2">
                    {lessons.map((lesson, idx) => {
                        const isActive = lesson.id === currentLessonId;
                        return (
                            <button
                                key={lesson.id}
                                onClick={() => !lesson.isLocked && onLessonClick(lesson.id)}
                                disabled={lesson.isLocked}
                                className={`w-full group flex items-start gap-4 p-4 rounded-[1.5rem] transition-all duration-300 text-left relative ${isActive
                                        ? 'bg-violet-50 border-violet-100 shadow-sm'
                                        : lesson.isLocked
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-slate-50'
                                    }`}
                            >
                                <div className="relative pt-1">
                                    {lesson.isCompleted ? (
                                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        </div>
                                    ) : lesson.isLocked ? (
                                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                                            <Lock className="w-3 h-3 text-slate-400" />
                                        </div>
                                    ) : (
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-violet-600' : 'border-slate-200'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-violet-600' : 'bg-transparent'}`} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-violet-600' : 'text-slate-400'
                                            }`}>
                                            Lesson 0{idx + 1}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[9px] font-bold">{lesson.duration}</span>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-bold tracking-tight leading-snug ${isActive ? 'text-slate-900 font-extrabold' : 'text-slate-600'
                                        }`}>
                                        {lesson.title}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl font-black text-[11px] text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm">
                    Course Resources Coming Soon
                </button>
            </div>
        </div>
    );
};

export default CourseLessonSidebar;
