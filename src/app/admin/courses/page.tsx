'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical, BookOpen, Star, Clock, Trash2, Edit3, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const mockCourses = [
    { id: 1, title: "Mastering Next.js 14 & React 19", category: "Development", level: "Advanced", students: 1240, rating: 4.9, status: "Published" },
    { id: 2, title: "UI/UX Design Systems with Figma", category: "Design", level: "Intermediate", students: 856, rating: 4.8, status: "Published" },
    { id: 3, title: "Fullstack Architecture Patterns", category: "Architecture", level: "Expert", students: 432, rating: 5.0, status: "Draft" },
    { id: 4, title: "Modern CSS: From Grid to Animation", category: "Design", level: "Beginner", students: 2104, rating: 4.7, status: "Published" },
    { id: 5, title: "AI-Powered App Development", category: "AI", level: "Intermediate", students: 760, rating: 4.9, status: "Published" },
];

const CoursesAdminPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Course <span className="premium-gradient">Manager</span></h1>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">Curate, update, and manage the platform's course library.</p>
                </div>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-600/10 hover:bg-violet-700 transition-all active:scale-95">
                    <Plus className="w-5 h-5" />
                    Create New Course
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search courses by title or category..."
                    className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 outline-none focus:border-violet-500 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Courses Table */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden overflow-x-auto"
            >
                <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Course Information</th>
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Enrollment</th>
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Level</th>
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                            <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Management</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                        {mockCourses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.category.toLowerCase().includes(searchTerm.toLowerCase())).map((course) => (
                            <tr key={course.id} className="hover:bg-violet-50/20 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-violet-600 group-hover:border-violet-200 transition-all shadow-sm">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 leading-tight mb-0.5">{course.title}</p>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{course.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-left">
                                            <p className="font-bold text-slate-900">{course.students.toLocaleString()}</p>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                <span className="text-[10px] font-bold text-slate-400">{course.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200/50">
                                        {course.level}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${course.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${course.status === 'Published' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                        {course.status}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right space-x-1">
                                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all">
                                        <Edit3 className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
};

export default CoursesAdminPage;
