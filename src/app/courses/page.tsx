'use client';

import React, { useState } from 'react';
import { Search, Filter, Star, Clock, BookOpen, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const courses = [
    {
        id: 1,
        title: "Mastering Next.js 14 & React 19",
        category: "Development",
        level: "Advanced",
        duration: "12h 45m",
        lessons: 48,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
        instructor: "Alex Rivera"
    },
    {
        id: 2,
        title: "UI/UX Design Systems with Figma",
        category: "Design",
        level: "Intermediate",
        duration: "8h 20m",
        lessons: 32,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80&w=800",
        instructor: "Sarah Chen"
    },
    {
        id: 3,
        title: "Fullstack Architecture Patterns",
        category: "Development",
        level: "Expert",
        duration: "15h 30m",
        lessons: 56,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
        instructor: "David Miller"
    },
    {
        id: 4,
        title: "Modern CSS: From Grid to Animation",
        category: "Design",
        level: "Beginner",
        duration: "6h 15m",
        lessons: 24,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800",
        instructor: "Emma Wilson"
    },
    {
        id: 5,
        title: "AI-Powered App Development",
        category: "Development",
        level: "Intermediate",
        duration: "10h 00m",
        lessons: 40,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
        instructor: "James Knight"
    },
    {
        id: 6,
        title: "Database Optimization Techniques",
        category: "Development",
        level: "Advanced",
        duration: "9h 45m",
        lessons: 35,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800",
        instructor: "Maria Garcia"
    }
];

const CoursesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Development', 'Design', 'Business', 'Marketing'];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="min-h-screen pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-5xl font-black mb-4 tracking-tight">Explore <span className="premium-gradient">Courses</span></h1>
                <p className="text-slate-600 max-w-2xl text-lg font-medium">
                    Level up your skills with our expert-led courses. High-quality video lessons,
                    hands-on projects, and community support.
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

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map(course => (
                    <div key={course.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden flex flex-col hover:border-violet-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                        {/* Thumbnail */}
                        <div className="relative h-56 w-full overflow-hidden">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black rounded-full uppercase tracking-widest border border-slate-200/30 shadow-sm">
                                    {course.category}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-1">
                            <div className="flex items-center gap-1 mb-4">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-black text-slate-900">{course.rating}</span>
                                <span className="text-slate-400 text-[10px] ml-auto uppercase font-black tracking-widest bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">{course.level}</span>
                            </div>
                            <h3 className="text-xl font-black mb-6 text-slate-900 leading-tight group-hover:text-violet-600 transition-colors uppercase tracking-tight">{course.title}</h3>

                            <div className="mt-auto space-y-6">
                                <div className="flex items-center gap-6 text-sm text-slate-500 font-bold">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                        <Clock className="w-4 h-4" />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{course.lessons} lessons</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 font-black text-xs uppercase">
                                            {course.instructor.charAt(0)}
                                        </div>
                                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{course.instructor}</span>
                                    </div>
                                    <button className="p-2.5 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-600/10 group-hover:scale-110 transition-all">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredCourses.length === 0 && (
                <div className="text-center py-24">
                    <p className="text-slate-500 text-xl font-medium">No courses found matching your criteria.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                        className="mt-4 text-violet-400 font-bold hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </main>
    );
};

export default CoursesPage;
