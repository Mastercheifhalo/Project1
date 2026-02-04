'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

export default function NavigationWrapper() {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');
    const isSupport = pathname?.startsWith('/support');

    if (isDashboard || isSupport) return null;

    return <Navbar />;
}
