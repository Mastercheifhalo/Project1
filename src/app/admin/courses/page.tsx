'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Search, Plus, BookOpen, Trash2, Eye, EyeOff, X, Loader2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    getAdminCourses,
    createCourse,
    deleteCourse,
    toggleCoursePublished,
    generateSlug,
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
    const [customCategory, setCustomCategory] = useState('');
    const [useCustomCategory, setUseCustomCategory] = useState(false);
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
        const finalCategory = useCustomCategory ? customCategory.trim() : form.category;
        if (!finalCategory) { setFormError('Category is required'); return; }
        startTransition(async () => {
            const result = await createCourse({
                title: form.title.trim(),
                description: form.description.trim() || "",
                category: finalCategory,
                level: form.level,
                price: parseFloat(form.price) || 0,
                slug: await generateSlug(form.title.trim())
            });
            if (result && result.success) {
                setShowCreateModal(false);
                setForm({ title: '', description: '', category: 'Development', level: 'Beginner', price: '0' });
                setCustomCategory('');
                setUseCustomCategory(false);
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

            {/* Course List */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <BookOpen className="w-12 h-12 text-slate-200 mb-3" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
                        {courses.length === 0 ? 'No courses yet. Create your first!' : 'No courses match your search.'}
                    </p>
                </div>
            ) : (
                <>
                    {/* ── MOBILE: card list (hidden md+) ── */}
                    <div className="md:hidden space-y-3">
                        {filtered.map(course => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl border border-slate-100 shadow-md shadow-slate-200/30 p-5 space-y-4"
                            >
                                {/* Top row: icon + title + status badge */}
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                                        <BookOpen className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-900 leading-snug truncate">{course.title}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">/{course.slug}</p>
                                    </div>
                                    <span className={`shrink-0 px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-widest ${course.published ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                        {course.published ? 'Live' : 'Draft'}
                                    </span>
                                </div>

                                {/* Meta row: category · level · price · stats */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[9px] font-black rounded-full uppercase tracking-widest">{course.category}</span>
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[9px] font-black rounded-full uppercase tracking-widest">{course.level}</span>
                                    <span className="px-2.5 py-1 bg-violet-50 text-violet-600 text-[9px] font-black rounded-full uppercase tracking-widest">
                                        {course.price === 0 ? 'Free' : `$${course.price}`}
                                    </span>
                                    <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[9px] font-bold rounded-full">{course.lessons} lessons</span>
                                    <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[9px] font-bold rounded-full">{course.enrollments} students</span>
                                </div>

                                {/* Action buttons — full-width tappable row */}
                                <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-50">
                                    <Link
                                        href={`/courses/${course.slug}`}
                                        target="_blank"
                                        className="flex flex-col items-center gap-1 py-2 rounded-2xl text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                                        title="View"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">View</span>
                                    </Link>
                                    <button
                                        onClick={() => handleTogglePublish(course.id, course.published)}
                                        className={`flex flex-col items-center gap-1 py-2 rounded-2xl transition-all ${course.published ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                                        title={course.published ? 'Unpublish' : 'Publish'}
                                    >
                                        {course.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        <span className="text-[8px] font-black uppercase tracking-widest">{course.published ? 'Unpub' : 'Publish'}</span>
                                    </button>
                                    <Link
                                        href={`/admin/courses/${course.id}`}
                                        className="flex flex-col items-center gap-1 py-2 rounded-2xl text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                                        title="Edit"
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Edit</span>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(course.id, course.title)}
                                        className="flex flex-col items-center gap-1 py-2 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Delete</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* ── DESKTOP: full table (hidden below md) ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="hidden md:block bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden"
                    >
                        <table className="w-full border-collapse">
                            <thead className="border-b border-slate-100">
                                <tr>
                                    {['Title', 'Category', 'Level', 'Price', 'Lessons', 'Students', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((course, idx) => (
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
                                                <Link href={`/courses/${course.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all" title="View course">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleTogglePublish(course.id, course.published)} className={`p-2 rounded-xl transition-all ${course.published ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`} title={course.published ? 'Unpublish' : 'Publish'}>
                                                    {course.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-500" />}
                                                </button>
                                                <Link href={`/admin/courses/${course.id}`} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all" title="Edit course">
                                                    <Settings className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(course.id, course.title)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete course">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </>
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
                                    {/* Preset dropdown */}
                                    <select
                                        value={useCustomCategory ? '__custom__' : form.category}
                                        onChange={(e) => {
                                            if (e.target.value === '__custom__') {
                                                setUseCustomCategory(true);
                                            } else {
                                                setUseCustomCategory(false);
                                                setForm(f => ({ ...f, category: e.target.value }));
                                            }
                                        }}
                                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-violet-500 transition-all bg-white"
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        <option value="__custom__">+ Custom...</option>
                                    </select>
                                    {/* Custom text input — shown when '+ Custom...' selected */}
                                    {useCustomCategory && (
                                        <input
                                            autoFocus
                                            type="text"
                                            value={customCategory}
                                            onChange={(e) => setCustomCategory(e.target.value)}
                                            placeholder="e.g. Blockchain, DevOps..."
                                            className="mt-2 w-full border border-violet-300 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all bg-violet-50/40 placeholder:text-slate-400"
                                        />
                                    )}
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
