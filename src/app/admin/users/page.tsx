'use client';

import React, { useEffect, useState, useTransition } from 'react';
import {
    Users,
    Search,
    Shield,
    GraduationCap,
    MoreHorizontal,
    Settings2,
    Lock,
    Unlock,
    Activity,
    X,
    Plus,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronDown
} from 'lucide-react';
import {
    getAdminUsers,
    grantUserSubscription,
    grantCourseAccess,
    revokeSubscription,
    revokeCourseAccess,
    updateUserStatus,
    getUserAccessDetails,
    getAllCoursesMinimal
} from '@/app/actions/admin';
import { motion, AnimatePresence } from 'framer-motion';

type UserData = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    plan: string;
    enrollments: number;
    joined: string;
};

type UserAccess = {
    courseId: string;
    courseTitle: string;
};

type CourseMin = {
    id: string;
    title: string;
    slug: string;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();

    // Modal state
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [accessDetails, setAccessDetails] = useState<UserAccess[]>([]);
    const [allCourses, setAllCourses] = useState<CourseMin[]>([]);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState('');

    const loadUsers = () => {
        setLoading(true);
        getAdminUsers()
            .then(data => { setUsers(data); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { loadUsers(); }, []);

    const handleOpenManageAccess = async (user: UserData) => {
        setSelectedUser(user);
        setIsModalLoading(true);
        try {
            const [details, courses] = await Promise.all([
                getUserAccessDetails(user.id),
                getAllCoursesMinimal()
            ]);
            setAccessDetails(details);
            setAllCourses(courses);
        } catch (error) {
            console.error(error);
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleGrantSubscription = (plan: string) => {
        if (!selectedUser) return;
        startTransition(async () => {
            const duration = plan === 'Monthly' ? 30 : plan === 'Quarterly' ? 90 : 365;
            await grantUserSubscription(selectedUser.id, plan, duration);
            loadUsers();
            setSelectedUser(u => u ? { ...u, plan } : null);
        });
    };

    const handleRevokeSubscription = () => {
        if (!selectedUser) return;
        startTransition(async () => {
            await revokeSubscription(selectedUser.id);
            loadUsers();
            setSelectedUser(u => u ? { ...u, plan: 'Free' } : null);
        });
    };

    const handleGrantCourse = () => {
        if (!selectedUser || !selectedCourseId) return;
        startTransition(async () => {
            await grantCourseAccess(selectedUser.id, selectedCourseId);
            const details = await getUserAccessDetails(selectedUser.id);
            setAccessDetails(details);
            loadUsers();
            setSelectedCourseId('');
        });
    };

    const handleRevokeCourse = (courseId: string) => {
        if (!selectedUser) return;
        if (!confirm('Revoke access to this course?')) return;
        startTransition(async () => {
            await revokeCourseAccess(selectedUser.id, courseId);
            const details = await getUserAccessDetails(selectedUser.id);
            setAccessDetails(details);
            loadUsers();
        });
    };

    const handleToggleStatus = () => {
        if (!selectedUser) return;
        const newStatus = selectedUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        startTransition(async () => {
            await updateUserStatus(selectedUser.id, newStatus);
            loadUsers();
            setSelectedUser(u => u ? { ...u, status: newStatus } : null);
        });
    };

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight text-slate-900 uppercase">User <span className="premium-gradient">Management</span></h1>
                    <p className="text-slate-500 font-medium text-sm md:text-base">{users.length} registered users</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-violet-500 transition-all shadow-sm w-full md:w-64"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-4 animate-pulse">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-14 bg-slate-50 rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">User</th>
                                    <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell whitespace-nowrap">Email</th>
                                    <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Tier / Role</th>
                                    <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                    <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell whitespace-nowrap text-center">Enrollments</th>
                                    <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(user => (
                                    <tr key={user.id} className="border-b border-slate-50 hover:bg-violet-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-black text-xs uppercase shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm text-slate-900 leading-none mb-1">{user.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Since {user.joined}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-500 hidden md:table-cell">{user.email}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter rounded-md w-fit ${user.plan !== 'Free'
                                                    ? 'bg-amber-100 text-amber-600 border border-amber-200'
                                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                    }`}>
                                                    {user.plan} Access
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[8px] font-black uppercase tracking-tight rounded-md w-fit ${user.role === 'ADMIN'
                                                    ? 'bg-violet-600 text-white'
                                                    : 'bg-slate-200 text-slate-600'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${user.status === 'ACTIVE'
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-red-50 text-red-600 border border-red-100'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-black text-slate-900 hidden sm:table-cell text-center">
                                            <span className="w-8 h-8 rounded-full bg-slate-100 inline-flex items-center justify-center">
                                                {user.enrollments}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => handleOpenManageAccess(user)}
                                                className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                                                title="Manage Access"
                                            >
                                                <Settings2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="p-20 text-center">
                                <Users className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                                <p className="text-slate-400 font-black uppercase tracking-widest">No matching users</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Manage Access Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-slate-900 p-5 md:p-8 text-white relative">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-3 min-w-0 pr-10">
                                    <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-lg md:text-2xl font-black uppercase shadow-2xl shadow-violet-600/20 shrink-0">
                                        {selectedUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-lg md:text-2xl font-black tracking-tight truncate">{selectedUser.name}</h2>
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 opacity-70">
                                            <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[160px] md:max-w-none">{selectedUser.email}</span>
                                            <span className="w-1 h-1 bg-white rounded-full shrink-0" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider shrink-0">{selectedUser.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 md:p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {isModalLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading access profiles...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Status & Subscription Section */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Account Status */}
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Activity className="w-3 h-3" /> Account Lifecycle
                                                </h3>
                                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">Current Status</p>
                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tight mt-0.5">{selectedUser.status}</p>
                                                    </div>
                                                    <button
                                                        onClick={handleToggleStatus}
                                                        disabled={isPending}
                                                        className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedUser.status === 'ACTIVE'
                                                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                            : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                                                            }`}
                                                    >
                                                        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : selectedUser.status === 'ACTIVE' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                                        {selectedUser.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subscription Plan */}
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <GraduationCap className="w-3 h-3" /> Subscription Tier
                                                </h3>
                                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <p className="text-sm font-black text-slate-900">{selectedUser.plan} Plan</p>
                                                        {selectedUser.plan !== 'Free' && (
                                                            <button
                                                                onClick={handleRevokeSubscription}
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                                title="Revoke subscription"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {['Monthly', 'Annual'].map(tier => (
                                                            <button
                                                                key={tier}
                                                                onClick={() => handleGrantSubscription(tier)}
                                                                disabled={isPending || selectedUser.plan === tier}
                                                                className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${selectedUser.plan === tier
                                                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                                                                    : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'
                                                                    }`}
                                                            >
                                                                {tier}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Course Access Section */}
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Shield className="w-3 h-3" /> Individual Course Access
                                                </h3>
                                                <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest">{accessDetails.length} Enrolled</p>
                                            </div>

                                            {/* Add Enrollment */}
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                {/* Custom Select Dropdown */}
                                                <div className="flex-1 min-w-0 relative group/select">
                                                    <select
                                                        value={selectedCourseId}
                                                        onChange={(e) => setSelectedCourseId(e.target.value)}
                                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 pr-10 text-sm font-semibold text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 hover:border-slate-200 transition-all duration-200 appearance-none cursor-pointer shadow-sm"
                                                    >
                                                        <option value="">Select course to grant access...</option>
                                                        {allCourses
                                                            .filter(c => !accessDetails.find(a => a.courseId === c.id))
                                                            .map(c => <option key={c.id} value={c.id}>{c.title}</option>)
                                                        }
                                                    </select>
                                                    {/* Custom chevron indicator */}
                                                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-100 group-focus-within/select:bg-violet-100 flex items-center justify-center transition-colors duration-200">
                                                        <ChevronDown className="w-4 h-4 text-slate-400 group-focus-within/select:text-violet-500 transition-colors duration-200" />
                                                    </div>
                                                </div>
                                                {/* Grant Access Button */}
                                                <button
                                                    onClick={handleGrantCourse}
                                                    disabled={isPending || !selectedCourseId}
                                                    className="shrink-0 relative overflow-hidden px-5 py-3 bg-gradient-to-br from-slate-800 to-slate-950 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:scale-[1.02] active:scale-[0.97] group/btn"
                                                >
                                                    {/* Shimmer highlight on hover */}
                                                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 ease-in-out" />
                                                    {isPending
                                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        : <Plus className="w-4 h-4 transition-transform duration-200 group-hover/btn:rotate-90" />
                                                    }
                                                    <span>Grant Access</span>
                                                </button>
                                            </div>

                                            {/* Active Enrollments List */}
                                            <div className="space-y-3 pt-2">
                                                {accessDetails.length === 0 ? (
                                                    <div className="py-10 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                                                        <AlertCircle className="w-6 h-6 text-slate-200 mx-auto mb-2" />
                                                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No individual course access</p>
                                                    </div>
                                                ) : (
                                                    accessDetails.map(enrollment => (
                                                        <div key={enrollment.courseId} className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl group/item">
                                                            <div className="flex items-center gap-3">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                <div>
                                                                    <p className="text-sm font-black text-slate-900">{enrollment.courseTitle}</p>
                                                                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">ACTIVE ENROLLMENT</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRevokeCourse(enrollment.courseId)}
                                                                className="opacity-0 group-hover/item:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
                                                                title="Revoke course access"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="bg-slate-50 p-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="px-8 py-3 font-black text-xs uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
