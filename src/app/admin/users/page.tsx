'use client';

import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, GraduationCap } from 'lucide-react';
import { getAdminUsers } from '@/app/actions/admin';

type UserData = {
    id: string;
    name: string;
    email: string;
    role: string;
    enrollments: number;
    joined: string;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getAdminUsers()
            .then(data => { setUsers(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

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
            <div className="bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
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
                                <tr className="border-b border-slate-100">
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Email</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Enrollments</th>
                                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(user => (
                                    <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 font-black text-xs uppercase shrink-0">
                                                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <span className="font-bold text-sm text-slate-900 truncate max-w-[160px]">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-500 hidden md:table-cell">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${user.role === 'ADMIN'
                                                ? 'bg-violet-50 text-violet-600 border border-violet-100'
                                                : 'bg-slate-50 text-slate-600 border border-slate-100'
                                                }`}>
                                                {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-black text-slate-900 hidden sm:table-cell">{user.enrollments}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-400 hidden lg:table-cell">{user.joined}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="p-12 text-center">
                                <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 font-bold">No users found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
