'use client';

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminProvider, useAdmin } from '@/context/AdminContext';

const AdminLayoutContent = ({ children }: { children: React.ReactNode }) => {
    const { isCollapsed } = useAdmin();

    return (
        <div className="min-h-screen bg-slate-50/50">
            <AdminSidebar />
            <main className={`transition-all duration-500 ease-in-out ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
                } pl-0 pt-20 lg:pt-0`}>
                <div className="max-w-7xl mx-auto p-6 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminProvider>
    );
}
