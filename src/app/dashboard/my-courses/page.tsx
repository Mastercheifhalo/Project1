'use client';

import React, { useEffect, useState } from 'react';
import {
    Play,
    Clock,
    BookOpen,
    Search,
    GraduationCap
} from 'lucide-react';
import { getMyCoursesData } from '@/app/actions/dashboard';
import Link from 'next/link';

type CourseData = {
    id: string;
    slug: string;
    title: string;
    thumbnail: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
    lessons: string;
    duration: string;
    status: string;
    resumeLessonId: string | null;
};

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        getMyCoursesData().then((data) => {
            setCourses(data);
            setLoading(false);
        });
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            activeFilter === 'all' ||
            (activeFilter === 'in-progress' && course.status === 'ACTIVE' && course.progress < 100) ||
            (activeFilter === 'completed' && (course.status === 'COMPLETED' || course.progress === 100));
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight text-slate-900 uppercase">My <span className="premium-gradient">Courses</span></h1>
                    <p className="text-slate-500 font-medium text-sm md:text-base">Continue your learning and track your progress.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search your courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-violet-500 transition-all shadow-sm w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-2 pb-2 overflow-x-auto text-sm font-bold no-scrollbar">
                {[
                    { key: 'all', label: 'All Courses' },
                    { key: 'in-progress', label: 'In Progress' },
                    { key: 'completed', label: 'Completed' },
                ].map(filter => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={`px-6 py-2.5 rounded-full transition-all whitespace-nowrap ${activeFilter === filter.key
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 overflow-hidden animate-pulse">
                            <div className="h-48 bg-slate-100" />
                            <div className="p-5 md:p-8 space-y-4">
                                <div className="h-5 bg-slate-100 rounded-lg w-3/4" />
                                <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
                                <div className="h-2 bg-slate-50 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredCourses.length === 0 && (
                <div className="bg-white/70 backdrop-blur-md p-12 md:p-20 rounded-[2.5rem] border border-white/50 shadow-sm text-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-violet-50 flex items-center justify-center mx-auto mb-6">
                        <GraduationCap className="w-10 h-10 text-violet-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">
                        {searchTerm ? 'No Courses Found' : 'No Enrolled Courses Yet'}
                    </h3>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto mb-8">
                        {searchTerm
                            ? 'Try adjusting your search terms.'
                            : 'Browse our catalog and enroll in your first course to get started.'
                        }
                    </p>
                    {!searchTerm && (
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
                        >
                            Browse Courses
                        </Link>
                    )}
                </div>
            )}

            {/* Course Grid */}
            {!loading && filteredCourses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                    {filteredCourses.map((course) => (
                        <Link
                            key={course.id}
                            href={course.resumeLessonId
                                ? `/courses/${course.slug}/lessons/${course.resumeLessonId}`
                                : `/courses/${course.slug}`}
                            className="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col hover:border-violet-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group"
                        >
                            {/* Thumbnail */}
                            <div className="relative h-48 w-full overflow-hidden">
                                <img
                                    src={course.thumbnail}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    alt={course.title}
                                />
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <Play className="text-violet-600 w-5 h-5 fill-current" />
                                    </div>
                                </div>
                                {course.progress === 100 && (
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">Completed</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5 md:p-8 flex-1 flex flex-col">
                                <h3 className="text-base md:text-xl font-black mb-3 md:mb-4 text-slate-900 leading-tight group-hover:text-violet-600 transition-colors uppercase tracking-tight line-clamp-2">
                                    {course.title}
                                </h3>

                                <div className="mt-auto space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Progress</span>
                                            <span className="text-xs font-black text-slate-900">{course.progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${course.progress === 100 ? 'bg-emerald-500' : 'bg-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.3)]'}`}
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                {course.lessons} lessons
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {course.duration}
                                            </span>
                                        </div>
                                        <span className="text-xs font-black text-violet-600 group-hover:underline">
                                            Continue &rarr;
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
