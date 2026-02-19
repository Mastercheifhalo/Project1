'use client';

import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Shield, User, Mail, Calendar, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const mockUsers = [
    { id: 1, name: "Jay Singh", email: "jay@example.com", role: "Admin", status: "Active", joined: "Jan 12, 2026" },
    { id: 2, name: "Sarah Connor", email: "sarah@example.com", role: "Student", status: "Active", joined: "Feb 01, 2026" },
    { id: 3, name: "Alex Rivera", email: "alex@example.com", role: "Student", status: "Active", joined: "Jan 05, 2026" },
    { id: 4, name: "David Miller", email: "david@example.com", role: "Student", status: "Pending", joined: "Feb 15, 2026" },
    { id: 5, name: "Emma Wilson", email: "emma@example.com", role: "Student", status: "Suspended", joined: "Dec 20, 2025" },
    { id: 6, name: "James Knight", email: "james@example.com", role: "Student", status: "Active", joined: "Jan 28, 2026" },
];

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState(mockUsers);

    const toggleStatus = (id: number) => {
        setUsers(prev => prev.map(user => {
            if (user.id === id) {
                const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
                return { ...user, status: newStatus };
            }
            return user;
        }));
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">User <span className="premium-gradient">Management</span></h1>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">View, manage, and audit all user accounts on the platform.</p>
                </div>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">
                    <Plus className="w-5 h-5" />
                    Add New User
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 outline-none focus:border-violet-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                    <Filter className="w-5 h-5" />
                    Filters
                </button>
            </div>

            {/* Users Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden overflow-x-auto"
            >
                <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-50">
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User</th>
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Role</th>
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                            <th className="text-left px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Joined</th>
                            <th className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Access Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors font-black text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{user.name}</p>
                                            <p className="text-xs font-medium text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${user.role === 'Admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {user.role === 'Admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                        {user.role}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : user.status === 'Suspended' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {user.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        {user.status}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                                        <Calendar className="w-4 h-4 text-slate-300" />
                                        {user.joined}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => toggleStatus(user.id)}
                                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${user.status === 'Active'
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                }`}
                                        >
                                            {user.status === 'Active' ? 'Revoke Access' : 'Grant Access'}
                                        </button>
                                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-all active:scale-95 text-slate-400">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
};

export default UsersPage;
