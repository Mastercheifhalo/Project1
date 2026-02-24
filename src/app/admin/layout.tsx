import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // SERVER-SIDE GATE: If not admin, go to login
    if (!session || (session.user as any)?.role !== 'ADMIN') {
        redirect('/login');
    }

    // Delegate UI to Client component
    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    );
}
