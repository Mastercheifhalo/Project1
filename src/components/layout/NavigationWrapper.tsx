'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

export default function NavigationWrapper() {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');
    const isSupport = pathname?.startsWith('/support');
    const isAdmin = pathname?.startsWith('/admin');
    const isCoursePlayer = pathname?.includes('/lessons/');

    if (isDashboard || isSupport || isAdmin || isCoursePlayer) return null;

    return <Navbar />;
}
