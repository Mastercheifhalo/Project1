'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Delay slightly so it doesn't pop immediately on load
            const t = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(t);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[9999] animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-2xl shadow-black/30 border border-white/10">
                <div className="flex items-start gap-4 mb-5">
                    <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-black text-sm uppercase tracking-tight mb-1">Cookie Notice</p>
                        <p className="text-white/60 text-xs font-medium leading-relaxed">
                            We use cookies to improve your experience and analyze site usage.{' '}
                            <Link href="/support" className="text-violet-400 hover:underline">Learn more</Link>.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={accept}
                        className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-black rounded-xl transition-all"
                    >
                        Accept
                    </button>
                    <button
                        onClick={decline}
                        className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white/70 text-sm font-bold rounded-xl transition-all"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
}
