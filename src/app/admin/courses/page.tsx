'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Search, Plus, BookOpen, Trash2, Eye, EyeOff, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    getAdminCourses,
    createCourse,
    deleteCourse,
    toggleCoursePublished,
} from '@/app/actions/admin';

type CourseRow = {
    id: string;
    title: string;
    slug: string;
    category: string;
    level: string;
    published: boolean;
    price: number;
    enrollments: number;
    lessons: number;
    createdBy: string;
};

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const CATEGORIES = ['Development', 'Design', 'Architecture', 'AI', 'Business', 'Marketing'];

export default function CoursesAdminPage() {
    const [courses, setCourses] = useState<CourseRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Create form state
    const [form, setForm] = useState({
        title: '', description: '', category: 'Development', level: 'Beginner', price: '0',
    });
    const [formError, setFormError] = useState('');

    const loadCourses = () => {
        setLoading(true);
        getAdminCourses().then(data => { setCourses(data); setLoading(false); });
    };

    useEffect(() => { loadCourses(); }, []);

    const filtered = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setFormError('');
        if (!form.title.trim()) { setFormError('Title is required'); return; }
        startTransition(async () => {
            const result = await createCourse({
                title: form.title.trim(),
                description: form.description.trim() || undefined,
                category: form.category,
                level: form.level,
                price: parseFloat(form.price) || 0,
            });
            if (result.success) {
                setShowCreateModal(false);
                setForm({ title: '', description: '', category: 'Development', level: 'Beginner', price: '0' });
                loadCourses();
            }
        });
    };

    const handleDelete = (courseId: string, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        startTransition(async () => {
            await deleteCourse(courseId);
            loadCourses();
        });
    };

    const handleTogglePublish = (courseId: string, current: boolean) => {
        startTransition(async () => {
            await toggleCoursePublished(courseId, !current);
            loadCourses();
        });
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Course <span className="premium-gradient">Manager</span></h1>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">{courses.length} courses total · {courses.filter(c => c.published).length} published</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-600/10 hover:bg-violet-700 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Create New Course
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 outline-none focus:border-violet-500 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden overflow-x-auto"
                >
                    <table className="w-full border-collapse min-w-[800px]">
                        <thead className="border-b border-slate-100">
                            <tr>
                                {['Title', 'Category', 'Level', 'Price', 'Lessons', 'Students', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-16 text-slate-400 font-medium">
                                        <BookOpen className="w-12 h-12 text-slate-100 mx-auto mb-3" />
                                        {courses.length === 0 ? 'No courses yet. Create your first course!' : 'No courses match your search.'}
                                    </td>
                                </tr>
                            ) : filtered.map((course, idx) => (
                                <tr key={course.id} className={`border-b border-slate-50 last:border-0 hover:bg-violet-50/50 transition-colors ${idx % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                                                <BookOpen className="w-5 h-5 text-violet-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 leading-snug max-w-[220px] truncate">{course.title}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">/{course.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-widest whitespace-nowrap">{course.category}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold text-slate-500">{course.level}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-slate-900">
                                            {course.price === 0 ? <span className="text-emerald-600">Free</span> : `$${course.price}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-slate-700">{course.lessons}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-slate-700">{course.enrollments}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${course.published ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                            {course.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/courses/${course.slug}`}
                                                target="_blank"
                                                className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                                                title="View course"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleTogglePublish(course.id, course.published)}
                                                className={`p-2 rounded-xl transition-all ${course.published ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                                                title={course.published ? 'Unpublish' : 'Publish'}
                                            >
                                                {course.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-500" />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id, course.title)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete course"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}

            {/* Create Course Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl space-y-6 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">New Course</h2>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-violet-500 transition-all"
                                    placeholder="e.g. Mastering React Hooks"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-violet-500 transition-all resize-none"
                                    rows={3}
                                    placeholder="Brief course description..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-violet-500 transition-all bg-white"
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Level</label>
                                    <select
                                        value={form.level}
                                        onChange={(e) => setForm(f => ({ ...f, level: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-violet-500 transition-all bg-white"
                                    >
                                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Price (USD) — 0 for free</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-violet-500 transition-all"
                                />
                            </div>
                            {formError && <p className="text-red-500 text-xs font-bold">{formError}</p>}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 py-3 border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={isPending}
                                className="flex-1 py-3 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Create Course
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
