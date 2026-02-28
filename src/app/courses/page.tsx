'use client';

import React, { useState, useEffect } from 'react';
import { Search, Star, Clock, BookOpen, ChevronRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { getAllPublishedCourses } from '@/app/actions/courses';

type Course = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
    category: string;
    level: string;
    price: number;
    lessonCount: number;
    totalDuration: number;
    hasFreeLesson: boolean;
    enrollmentCount: number;
    isEnrolled: boolean;
    progress: number | null;
};

const LEVEL_ORDER: Record<string, number> = {
    Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4,
};

const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        getAllPublishedCourses()
            .then(data => { setCourses(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    // Derive categories dynamically from DB data
    const categories = ['All', ...Array.from(new Set(courses.map(c => c.category))).sort()];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="min-h-screen pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-5xl font-black mb-4 tracking-tight">Explore <span className="premium-gradient">Courses</span></h1>
                <p className="text-slate-600 max-w-2xl text-lg font-medium">
                    Level up your skills with our expert-led courses. Watch free previews, subscribe for full access, or buy individual courses.
                </p>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-6 mb-12">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all shadow-sm focus:shadow-md"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${activeCategory === cat
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading Skeleton */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden animate-pulse">
                            <div className="h-56 bg-slate-100" />
                            <div className="p-8 space-y-4">
                                <div className="h-4 w-2/3 bg-slate-100 rounded-lg" />
                                <div className="h-6 w-full bg-slate-100 rounded-lg" />
                                <div className="h-4 w-1/2 bg-slate-50 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Course Grid */}
            {!loading && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map(course => (
                            <Link
                                key={course.id}
                                href={`/courses/${course.slug}`}
                                className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden flex flex-col hover:border-violet-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-violet-50 to-violet-100">
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <GraduationCap className="w-16 h-16 text-violet-300" />
                                        </div>
                                    )}
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black rounded-full uppercase tracking-widest border border-slate-200/30 shadow-sm">
                                            {course.category}
                                        </span>
                                        {course.price === 0 ? (
                                            <span className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">
                                                Free
                                            </span>
                                        ) : course.hasFreeLesson ? (
                                            <span className="px-3 py-1.5 bg-violet-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">
                                                Preview Available
                                            </span>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-1 mb-4">
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span className="text-sm font-black text-slate-900">New</span>
                                        <span className="text-slate-400 text-[10px] ml-auto uppercase font-black tracking-widest bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">{course.level}</span>
                                    </div>
                                    <h3 className="text-xl font-black mb-6 text-slate-900 leading-tight group-hover:text-violet-600 transition-colors uppercase tracking-tight">{course.title}</h3>

                                    <div className="mt-auto space-y-6">
                                            <div className="flex items-center gap-6 text-sm text-slate-500 font-bold">
                                                {course.totalDuration > 0 && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{formatDuration(course.totalDuration)}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                                    <BookOpen className="w-4 h-4" />
                                                    <span>{course.lessonCount} lessons</span>
                                                </div>
                                            </div>

                                            {/* Progress Bar for Enrolled Users */}
                                            {course.isEnrolled && course.progress !== null && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Progress</span>
                                                        <span className="text-[10px] font-black text-violet-600">{course.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-violet-600 transition-all duration-1000"
                                                            style={{ width: `${course.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                            <div>
                                                {course.price === 0 ? (
                                                    <span className="text-lg font-black text-emerald-600">Free</span>
                                                ) : (
                                                    <span className="text-lg font-black text-slate-900">${course.price}</span>
                                                )}
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                    {course.price === 0 ? 'Free access' : 'Lifetime access'}
                                                </p>
                                            </div>
                                            <div className="p-2.5 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-600/10 group-hover:scale-110 transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {!loading && filteredCourses.length === 0 && (
                        <div className="text-center py-24">
                            <GraduationCap className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-500 text-xl font-medium">
                                {courses.length === 0 ? 'No courses have been published yet.' : 'No courses found matching your criteria.'}
                            </p>
                            {courses.length > 0 && (
                                <button
                                    onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                                    className="mt-4 text-violet-400 font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
