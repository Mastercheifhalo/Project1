'use client';

import React, { useEffect, useState } from 'react';
import { ClipboardList, Search, User, Clock, Info, ShieldAlert } from 'lucide-react';
import { getAuditLogs } from '@/app/actions/admin';

type AuditLogData = {
    id: string;
    adminName: string;
    adminEmail: string;
    action: string;
    details: string | null;
    date: string;
};

export default function AdminAuditPage() {
    const [logs, setLogs] = useState<AuditLogData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('ALL');

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data = await getAuditLogs();
            setLogs(data);
        } catch (error) {
            console.error('Failed to load audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    const filtered = logs.filter(log => {
        const matchesSearch =
            log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilter = filterAction === 'ALL' || log.action === filterAction;

        return matchesSearch && matchesFilter;
    });

    const actionTypes = Array.from(new Set(logs.map(l => l.action)));

    const getActionColor = (action: string) => {
        if (action.includes('DELETED')) return 'bg-red-50 text-red-600 border-red-100';
        if (action.includes('GRANTED')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (action.includes('CONFIRMED')) return 'bg-blue-50 text-blue-600 border-blue-100';
        if (action.includes('UPDATED')) return 'bg-amber-50 text-amber-600 border-amber-100';
        return 'bg-slate-50 text-slate-600 border-slate-100';
    };

    return (
        <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-2xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight text-slate-900 uppercase tracking-tight">Audit <span className="premium-gradient">Logs</span></h1>
                <p className="text-slate-500 font-medium text-sm md:text-base italic">Security trail: tracking every administrative action for accountability.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search logs by admin, action, or details..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-violet-500 transition-all shadow-sm w-full"
                    />
                </div>
                <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-violet-500 transition-all shadow-sm"
                >
                    <option value="ALL">All Actions</option>
                    {actionTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-4 animate-pulse">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-16 bg-slate-50 rounded-xl" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-lg font-black text-slate-400 uppercase tracking-tight">No logs found</p>
                        <p className="text-sm font-medium text-slate-300 mt-1">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrator</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{log.adminName}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 tracking-tight">{log.adminEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="max-w-xs md:max-w-md">
                                                <div className="flex items-start gap-2 group">
                                                    <Info className="w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0" />
                                                    <p className="text-xs font-medium text-slate-600 leading-relaxed font-mono truncate hover:whitespace-normal transition-all cursor-default">
                                                        {log.details || '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-slate-400 group">
                                                <Clock className="w-3.5 h-3.5 group-hover:text-violet-400 transition-colors" />
                                                <span className="text-[11px] font-bold group-hover:text-slate-600 transition-colors">{log.date}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
