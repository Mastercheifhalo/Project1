'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    getAdminCourseById,
    updateCourse,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons
} from '@/app/actions/admin';
import {
    ArrowLeft,
    Save,
    Plus,
    GripVertical,
    Trash2,
    Video,
    ChevronRight,
    Loader2,
    Lock,
    Unlock
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseEditorPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    // Course form state
    const [courseForm, setCourseForm] = useState({
        title: '', slug: '', description: '', category: '', level: '', price: 0
    });

    // Lesson edit state
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [lessonForm, setLessonForm] = useState({
        title: '', content: '', videoUrl: '', isFree: false
    });

    useEffect(() => {
        if (courseId) {
            getAdminCourseById(courseId).then(data => {
                if (data) {
                    setCourse(data);
                    setCourseForm({
                        title: data.title,
                        slug: data.slug,
                        description: data.description || '',
                        category: data.category,
                        level: data.level,
                        price: data.price
                    });
                }
                setLoading(false);
            });
        }
    }, [courseId]);

    const handleSaveCourse = () => {
        startTransition(async () => {
            await updateCourse(courseId, courseForm);
            // Refresh local data if needed
            const updated = await getAdminCourseById(courseId);
            setCourse(updated);
        });
    };

    const handleAddLesson = () => {
        const nextOrder = (course?.lessons?.length || 0) + 1;
        startTransition(async () => {
            const newLesson = await createLesson(courseId, {
                title: 'New Lesson',
                content: '',
                videoUrl: '',
                order: nextOrder,
                isFree: false
            });
            setCourse((prev: any) => ({
                ...prev,
                lessons: [...(prev.lessons || []), newLesson]
            }));
            setEditingLessonId(newLesson.id);
            setLessonForm({ title: newLesson.title, content: '', videoUrl: '', isFree: false });
        });
    };

    const handleUpdateLesson = (lessonId: string) => {
        startTransition(async () => {
            await updateLesson(lessonId, lessonForm);
            setEditingLessonId(null);
            const updated = await getAdminCourseById(courseId);
            setCourse(updated);
        });
    };

    const handleDeleteLesson = (lessonId: string, title: string) => {
        if (!confirm(`Delete lesson "${title}"?`)) return;
        startTransition(async () => {
            await deleteLesson(lessonId);
            setCourse((prev: any) => ({
                ...prev,
                lessons: prev.lessons.filter((l: any) => l.id !== lessonId)
            }));
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
    );

    if (!course) return <div>Course not found.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
            {/* Nav */}
            <div className="flex items-center justify-between">
                <Link href="/admin/courses" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Courses
                </Link>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${course.published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {course.published ? 'Live' : 'Draft'}
                    </span>
                    <button
                        onClick={handleSaveCourse}
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Course Details Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">Course <span className="premium-gradient">Settings</span></h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Title</label>
                                <input
                                    type="text"
                                    value={courseForm.title}
                                    onChange={(e) => setCourseForm(c => ({ ...c, title: e.target.value }))}
                                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Slug</label>
                                <input
                                    type="text"
                                    value={courseForm.slug}
                                    disabled
                                    className="w-full bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-400 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    value={courseForm.price}
                                    onChange={(e) => setCourseForm(c => ({ ...c, price: parseFloat(e.target.value) }))}
                                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curriculum / Lessons */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Curriculum <span className="premium-gradient">Builder</span></h2>
                            <button
                                onClick={handleAddLesson}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 font-bold rounded-xl hover:bg-violet-100 transition-all text-xs"
                            >
                                <Plus className="w-4 h-4" />
                                Add Lesson
                            </button>
                        </div>

                        <div className="space-y-3">
                            {course.lessons?.map((lesson: any, index: number) => (
                                <div key={lesson.id} className="group">
                                    {editingLessonId === lesson.id ? (
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-violet-100 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lesson Title</label>
                                                    <input
                                                        type="text"
                                                        value={lessonForm.title}
                                                        onChange={(e) => setLessonForm(l => ({ ...l, title: e.target.value }))}
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-violet-500 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Video URL</label>
                                                    <input
                                                        type="text"
                                                        value={lessonForm.videoUrl}
                                                        onChange={(e) => setLessonForm(l => ({ ...l, videoUrl: e.target.value }))}
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-violet-500 transition-all"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3 pt-6">
                                                    <button
                                                        onClick={() => setLessonForm(l => ({ ...l, isFree: !l.isFree }))}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${lessonForm.isFree ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}
                                                    >
                                                        {lessonForm.isFree ? <Unlock className="w-3.4 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                                        {lessonForm.isFree ? 'Free Preview' : 'Locked'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setEditingLessonId(null)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                                                <button
                                                    onClick={() => handleUpdateLesson(lesson.id)}
                                                    className="px-6 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition-all"
                                                >
                                                    Save Lesson
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-violet-200 hover:shadow-lg hover:shadow-violet-600/5 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="text-[10px] font-black text-slate-300 w-4">0{index + 1}</div>
                                                <GripVertical className="w-4 h-4 text-slate-200 cursor-grab active:cursor-grabbing" />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                        {lesson.title}
                                                        {lesson.isFree && <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded uppercase">Free</span>}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5">
                                                        <Video className="w-3 h-3" />
                                                        {lesson.videoUrl ? 'Video linked' : 'No video'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingLessonId(lesson.id);
                                                        setLessonForm({
                                                            title: lesson.title,
                                                            content: lesson.content || '',
                                                            videoUrl: lesson.videoUrl || '',
                                                            isFree: lesson.isFree
                                                        });
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-violet-600 transition-colors"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
