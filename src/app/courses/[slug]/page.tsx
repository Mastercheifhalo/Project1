'use client';

import React, { useEffect, useState, use } from 'react';
import {
    Clock,
    BookOpen,
    Users,
    ChevronRight,
    Play,
    CheckCircle2,
    ArrowLeft,
    BarChart3,
    GraduationCap,
    Lock
} from 'lucide-react';
import Link from 'next/link';
import { getCourseBySlug, enrollInCourse } from '@/app/actions/courses';

type CourseDetail = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
    category: string;
    level: string;
    price: number;
    published: boolean;
    createdBy: { name: string | null; image: string | null };
    enrollmentCount: number;
    isEnrolled: boolean;
    lessons: { id: string; title: string; duration: number | null; order: number }[];
};

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [enrolled, setEnrolled] = useState(false);

    useEffect(() => {
        getCourseBySlug(resolvedParams.slug).then(data => {
            setCourse(data);
            setEnrolled(data?.isEnrolled || false);
            setLoading(false);
        });
    }, [resolvedParams.slug]);

    const handleEnroll = async () => {
        if (!course) return;
        setEnrolling(true);
        const result = await enrollInCourse(course.id);
        if (result.success) {
            setEnrolled(true);
        }
        setEnrolling(false);
    };

    const formatDuration = (secs: number | null) => {
        if (!secs) return '—';
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return `${mins}:${String(s).padStart(2, '0')}`;
    };

    const totalDuration = course?.lessons.reduce((sum, l) => sum + (l.duration || 0), 0) || 0;
    const totalHours = Math.floor(totalDuration / 3600);
    const totalMins = Math.floor((totalDuration % 3600) / 60);
    const durationStr = totalHours > 0 ? `${totalHours}h ${totalMins}m` : `${totalMins}m`;

    if (loading) {
        return (
            <main className="min-h-screen pt-32 pb-24 px-4 md:px-6 max-w-5xl mx-auto">
                <div className="animate-pulse space-y-8">
                    <div className="h-6 w-32 bg-slate-100 rounded-lg" />
                    <div className="h-64 bg-slate-100 rounded-[2.5rem]" />
                    <div className="h-10 w-3/4 bg-slate-100 rounded-xl" />
                    <div className="h-4 w-1/2 bg-slate-50 rounded-lg" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-16 bg-slate-50 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (!course) {
        return (
            <main className="min-h-screen pt-32 pb-24 px-4 md:px-6 max-w-5xl mx-auto text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="w-10 h-10 text-slate-300" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-3">Course Not Found</h1>
                <p className="text-slate-500 font-medium mb-8">This course doesn&apos;t exist or hasn&apos;t been published yet.</p>
                <Link href="/courses" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">
                    <ArrowLeft className="w-4 h-4" />
                    Browse Courses
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-28 pb-24 px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-8">
                    <Link href="/courses" className="hover:text-violet-600 transition-colors">Courses</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-600 truncate">{course.title}</span>
                </div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
                    {/* Left — Info */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex flex-wrap gap-2">
                            <span className="px-4 py-1.5 bg-violet-50 text-violet-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-violet-100">
                                {course.category}
                            </span>
                            <span className="px-4 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-slate-100">
                                {course.level}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                            {course.title}
                        </h1>

                        {course.description && (
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                {course.description}
                            </p>
                        )}

                        {/* Meta Stats */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <BookOpen className="w-4 h-4 text-violet-500" />
                                <span className="text-sm font-bold text-slate-700">{course.lessons.length} Lessons</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <Clock className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-bold text-slate-700">{durationStr}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <Users className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-bold text-slate-700">{course.enrollmentCount} Students</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <BarChart3 className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-bold text-slate-700">{course.level}</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-4">
                            {enrolled ? (
                                <Link
                                    href={course.lessons.length > 0 ? `/courses/${course.slug}/lessons/${course.lessons[0].id}` : '#'}
                                    className="inline-flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all group"
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    Continue Learning
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : course.price > 0 ? (
                                <Link
                                    href={`/checkout/crypto?type=course&courseId=${course.id}&price=${course.price}&courseTitle=${encodeURIComponent(course.title)}`}
                                    className="inline-flex items-center gap-3 px-10 py-4 bg-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-600/20 hover:bg-violet-700 transition-all group"
                                >
                                    Enroll — ${course.price}
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="inline-flex items-center gap-3 px-10 py-4 bg-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-600/20 hover:bg-violet-700 transition-all disabled:opacity-50 group"
                                >
                                    {enrolling ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Enrolling...
                                        </>
                                    ) : (
                                        <>
                                            <GraduationCap className="w-5 h-5" />
                                            Enroll Free
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right — Thumbnail */}
                    <div className="lg:col-span-2">
                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 bg-slate-100">
                            {course.thumbnail ? (
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-violet-100">
                                    <GraduationCap className="w-20 h-20 text-violet-300" />
                                </div>
                            )}
                            {!enrolled && (
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl">
                                        <Play className="w-8 h-8 text-violet-600 fill-current translate-x-0.5" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Curriculum */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Course <span className="premium-gradient">Curriculum</span></h2>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{course.lessons.length} Lessons • {durationStr}</span>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden divide-y divide-slate-50">
                        {course.lessons.map((lesson, idx) => {
                            const isAccessible = enrolled || idx === 0; // First lesson always free
                            return (
                                <div
                                    key={lesson.id}
                                    className={`flex items-center gap-4 p-5 md:p-6 transition-colors ${isAccessible ? 'hover:bg-slate-50 cursor-pointer' : 'opacity-60'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${isAccessible
                                        ? 'bg-violet-50 text-violet-600'
                                        : 'bg-slate-50 text-slate-400'
                                        }`}>
                                        {isAccessible ? (
                                            <span>{String(idx + 1).padStart(2, '0')}</span>
                                        ) : (
                                            <Lock className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-bold text-sm truncate ${isAccessible ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {lesson.title}
                                        </p>
                                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                                            {formatDuration(lesson.duration)}
                                        </p>
                                    </div>
                                    {isAccessible && enrolled && (
                                        <Link
                                            href={`/courses/${course.slug}/lessons/${lesson.id}`}
                                            className="p-2 bg-violet-50 text-violet-600 rounded-xl hover:bg-violet-100 transition-colors shrink-0"
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {course.lessons.length === 0 && (
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-12 text-center">
                            <p className="text-slate-400 font-bold">No lessons have been added to this course yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
