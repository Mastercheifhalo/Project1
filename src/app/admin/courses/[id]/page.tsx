'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    getAdminCourseById,
    updateCourse,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    toggleCoursePublished
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
    Unlock,
    ArrowUp,
    ArrowDown,
    Eye,
    EyeOff,
    Upload,
    CloudUpload,
    CheckCircle2
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

    const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const CATEGORIES = ['Development', 'Design', 'Architecture', 'AI', 'Business', 'Marketing'];

    // Lesson edit state
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [lessonForm, setLessonForm] = useState({
        title: '', content: '', videoUrl: '', isFree: false
    });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleMoveLesson = (index: number, direction: 'up' | 'down') => {
        if (!course?.lessons) return;
        const newLessons = [...course.lessons];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newLessons.length) return;

        // Swap
        [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]];

        // Update local state immediately for snappy UI
        setCourse((prev: any) => ({ ...prev, lessons: newLessons }));

        // Persist to DB
        startTransition(async () => {
            await reorderLessons(newLessons.map(l => l.id));
        });
    };

    const handleTogglePublish = () => {
        if (!course) return;
        const newStatus = !course.published;
        startTransition(async () => {
            await toggleCoursePublished(courseId, newStatus);
            setCourse((prev: any) => ({ ...prev, published: newStatus }));
        });
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/admin/videos/upload', true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(progress);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                setLessonForm(prev => ({ ...prev, videoUrl: result.url }));
            } else {
                alert('Upload failed: ' + xhr.statusText);
            }
            setUploading(false);
            setUploadProgress(0);
        };

        xhr.onerror = () => {
            alert('Upload error occurred');
            setUploading(false);
            setUploadProgress(0);
        };

        xhr.send(formData);
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
                    <button
                        onClick={handleTogglePublish}
                        disabled={isPending}
                        className={`flex items-center gap-2 px-4 py-2 font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 ${course.published ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (course.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />)}
                        {course.published ? 'Unpublish' : 'Publish Course'}
                    </button>
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
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    value={courseForm.description}
                                    onChange={(e) => setCourseForm(c => ({ ...c, description: e.target.value }))}
                                    rows={3}
                                    placeholder="Brief course description..."
                                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                    <select
                                        value={courseForm.category}
                                        onChange={(e) => setCourseForm(c => ({ ...c, category: e.target.value }))}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                                    >
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Level</label>
                                    <select
                                        value={courseForm.level}
                                        onChange={(e) => setCourseForm(c => ({ ...c, level: e.target.value }))}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                                    >
                                        {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                    </select>
                                </div>
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
                                                <div className="col-span-2">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Video Source (URL or Upload)</label>
                                                    <div className="space-y-3">
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="https://... or /uploads/..."
                                                                value={lessonForm.videoUrl}
                                                                onChange={(e) => setLessonForm(l => ({ ...l, videoUrl: e.target.value }))}
                                                                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-violet-500 transition-all"
                                                            />
                                                            <input
                                                                type="file"
                                                                accept="video/*"
                                                                ref={fileInputRef}
                                                                onChange={handleVideoUpload}
                                                                className="hidden"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => fileInputRef.current?.click()}
                                                                disabled={uploading}
                                                                className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 font-bold rounded-xl hover:bg-violet-100 transition-all disabled:opacity-50 text-xs"
                                                            >
                                                                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudUpload className="w-3.5 h-3.5" />}
                                                                {uploading ? 'Uploading...' : 'Upload'}
                                                            </button>
                                                        </div>

                                                        {uploading && (
                                                            <div className="space-y-1 pt-1">
                                                                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                                    <span>Uploading...</span>
                                                                    <span>{uploadProgress}%</span>
                                                                </div>
                                                                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${uploadProgress}%` }}
                                                                        className="h-full bg-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {lessonForm.videoUrl && !uploading && (
                                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 text-[9px] font-black uppercase tracking-tight">
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                Linked: {lessonForm.videoUrl.split('/').pop()}
                                                            </div>
                                                        )}
                                                    </div>
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
                                                <div className="flex items-center gap-1 mr-2 border-r border-slate-100 pr-2">
                                                    <button
                                                        onClick={() => handleMoveLesson(index, 'up')}
                                                        disabled={index === 0 || isPending}
                                                        className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                                        title="Move Up"
                                                    >
                                                        <ArrowUp className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleMoveLesson(index, 'down')}
                                                        disabled={index === (course.lessons?.length || 0) - 1 || isPending}
                                                        className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                                        title="Move Down"
                                                    >
                                                        <ArrowDown className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
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
                                                    className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                                                    title="Edit Lesson"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Lesson"
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
