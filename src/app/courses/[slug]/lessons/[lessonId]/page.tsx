"use client";

import React, { useEffect, useState, use } from 'react';
import MasterCoursePlayer from '@/components/video/MasterCoursePlayer';
import {
    ArrowRight,
    ArrowLeft,
    Lock,
    GraduationCap,
    BookOpen,
    ChevronRight,
    Play,
} from 'lucide-react';
import Link from 'next/link';
import { getLessonById, canAccessLesson } from '@/app/actions/courses';
import { getLessonProgress, saveProgress, completeLesson } from '@/app/actions/progress';
import { useRef } from 'react';

type AccessLevel = 'free' | 'subscribed' | 'purchased' | 'locked';

type LessonData = {
    id: string;
    title: string;
    content: string | null;
    videoUrl: string | null;
    duration: number | null;
    order: number;
    isFree: boolean;
    course: { id: string; title: string; slug: string };
    prevLesson: { id: string; title: string; order: number } | null;
    nextLesson: { id: string; title: string; order: number } | null;
};

export default function LessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
    const { slug, lessonId } = use(params);
    const [lesson, setLesson] = useState<LessonData | null>(null);
    const [access, setAccess] = useState<AccessLevel | null>(null);
    const [loading, setLoading] = useState(true);
    const [initialTime, setInitialTime] = useState(0);
    const lastSavedTimeRef = useRef(0);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getLessonById(lessonId),
            canAccessLesson(lessonId),
            getLessonProgress(lessonId)
        ]).then(([lessonData, accessLevel, progressData]) => {
            setLesson(lessonData);
            setAccess(accessLevel);
            if (progressData) {
                setInitialTime(progressData.watchedSecs);
                lastSavedTimeRef.current = progressData.watchedSecs;
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [lessonId]);

    const handleProgressUpdate = (currentTime: number, duration: number) => {
        // Save every 10 seconds of playback or when significant jump happens
        if (Math.abs(currentTime - lastSavedTimeRef.current) > 10) {
            lastSavedTimeRef.current = currentTime;
            saveProgress(lessonId, Math.floor(currentTime));
        }
    };

    const handleLessonComplete = () => {
        completeLesson(lessonId);
    };

    if (loading) {
        return (
            <div className="p-6 md:p-12 max-w-[1200px] mx-auto animate-pulse space-y-8">
                <div className="h-6 w-48 bg-slate-100 rounded-lg" />
                <div className="aspect-video w-full bg-slate-100 rounded-[2rem]" />
                <div className="h-10 w-3/4 bg-slate-100 rounded-xl" />
                <div className="h-5 w-1/2 bg-slate-50 rounded-lg" />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <GraduationCap className="w-16 h-16 text-slate-200 mx-auto" />
                    <h1 className="text-2xl font-black text-slate-900">Lesson Not Found</h1>
                    <Link href={`/courses/${slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back to Course
                    </Link>
                </div>
            </div>
        );
    }

    const isLocked = access === 'locked';
    const fallbackVideo = "https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190828_27_Super_Slow_Motion_1080p_001_preview.mp4";

    return (
        <div className="p-6 md:p-12 space-y-12 max-w-[1200px] mx-auto pb-24">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                <Link href="/courses" className="hover:text-violet-600 transition-colors">Courses</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/courses/${lesson.course.slug}`} className="hover:text-violet-600 transition-colors truncate max-w-[200px]">
                    {lesson.course.title}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-600 truncate max-w-[200px]">Lesson {String(lesson.order).padStart(2, '0')}</span>
            </div>

            {/* Player or Paywall */}
            <section className="space-y-8">
                {isLocked ? (
                    /* ── PAYWALL ─────────────────────────────────── */
                    <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-900 to-violet-900 flex items-center justify-center shadow-2xl">
                        {/* Blurred thumbnail */}
                        {lesson.course && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        )}
                        <div className="relative z-10 text-center px-8 space-y-6 max-w-lg">
                            <div className="w-20 h-20 rounded-[2rem] bg-white/10 border border-white/20 flex items-center justify-center mx-auto backdrop-blur-xl">
                                <Lock className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">This lesson is locked</h2>
                                <p className="text-slate-300 font-medium">Subscribe for full catalog access, or purchase this course for lifetime access.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/pricing"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-violet-500/20"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                    View Plans
                                </Link>
                                <Link
                                    href={`/courses/${lesson.course.slug}`}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold rounded-2xl transition-all backdrop-blur-xl"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Course Detail
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── VIDEO PLAYER ────────────────────────────── */
                    <MasterCoursePlayer
                        videoUrl={lesson.videoUrl || fallbackVideo}
                        initialTime={initialTime}
                        onTimeUpdate={handleProgressUpdate}
                        onComplete={handleLessonComplete}
                    />
                )}

                {/* Lesson Title & Nav Row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-violet-100">
                                {lesson.course.title}
                            </div>
                            {lesson.isFree && (
                                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    Free
                                </div>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight uppercase">
                            {String(lesson.order).padStart(2, '0')}. {lesson.title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Description */}
            {lesson.content && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-slate-100">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Lesson Overview</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">{lesson.content}</p>
                    </div>
                </div>
            )}

            {/* Prev / Next Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                {lesson.prevLesson ? (
                    <Link
                        href={`/courses/${lesson.course.slug}/lessons/${lesson.prevLesson.id}`}
                        className="group flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-violet-200 hover:shadow-lg transition-all"
                    >
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-violet-50 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Previous</p>
                            <p className="font-bold text-sm text-slate-900 truncate">{lesson.prevLesson.title}</p>
                        </div>
                    </Link>
                ) : <div />}

                {lesson.nextLesson ? (
                    <Link
                        href={`/courses/${lesson.course.slug}/lessons/${lesson.nextLesson.id}`}
                        className="group flex items-center gap-4 p-5 bg-violet-600 rounded-[1.5rem] hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20 sm:justify-end"
                    >
                        <div className="min-w-0 text-right">
                            <p className="text-[10px] font-black text-violet-200 uppercase tracking-widest mb-0.5">Next Lesson</p>
                            <p className="font-bold text-sm text-white truncate">{lesson.nextLesson.title}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                            <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                    </Link>
                ) : (
                    <div className="flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-[1.5rem]">
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">You've reached the end!</p>
                            <p className="font-bold text-sm text-emerald-700">Go back and rewatch any lesson anytime.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
