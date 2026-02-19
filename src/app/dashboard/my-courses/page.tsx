import React from 'react';
import {
    Play,
    MoreVertical,
    Clock,
    BookOpen,
    Filter,
    Search
} from 'lucide-react';

export default function MyCoursesPage() {
    const courses = [
        {
            id: 1,
            title: 'Mastering Advanced React Hooks & Design Patterns',
            progress: 65,
            image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop',
            lessons: '24/36',
            duration: '12h 45m left'
        },
        {
            id: 2,
            title: 'Full-Stack Web Development with Next.js 14',
            progress: 30,
            image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2834&auto=format&fit=crop',
            lessons: '12/40',
            duration: '28h left'
        },
        {
            id: 3,
            title: 'UI/UX Design Systems for Modern Apps',
            progress: 100,
            image: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=2940&auto=format&fit=crop',
            lessons: '20/20',
            duration: 'Completed'
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight text-slate-900 uppercase">My <span className="premium-gradient">Courses</span></h1>
                    <p className="text-slate-500 font-medium">Continue your learning and track your progress.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search your courses..."
                            className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-violet-500 transition-all shadow-sm w-full md:w-64"
                        />
                    </div>
                    <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Categories Toggle (Simplified) */}
            <div className="flex gap-2 pb-2 overflow-x-auto text-sm font-bold no-scrollbar">
                <button className="px-6 py-2.5 bg-slate-900 text-white rounded-full transition-all whitespace-nowrap">All Courses</button>
                <button className="px-6 py-2.5 bg-white text-slate-500 border border-slate-100 rounded-full hover:bg-slate-50 transition-all whitespace-nowrap">In Progress</button>
                <button className="px-6 py-2.5 bg-white text-slate-500 border border-slate-100 rounded-full hover:bg-slate-50 transition-all whitespace-nowrap">Completed</button>
                <button className="px-6 py-2.5 bg-white text-slate-500 border border-slate-100 rounded-full hover:bg-slate-50 transition-all whitespace-nowrap">Wishlist</button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col hover:border-violet-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                        {/* Thumbnail */}
                        <div className="relative h-48 w-full overflow-hidden">
                            <img
                                src={course.image}
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
                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="text-xl font-black mb-4 text-slate-900 leading-tight group-hover:text-violet-600 transition-colors uppercase tracking-tight line-clamp-2">
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
                                            className={`h-full rounded-full transition-all duration-1000 ${course.progress === 100 ? 'bg-emerald-500' : 'bg-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.3)]'
                                                }`}
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
                                    <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
