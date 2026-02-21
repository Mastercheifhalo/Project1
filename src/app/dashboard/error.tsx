"use client";

import { useEffect } from "react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Dashboard Error]", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
                style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                }}
            >
                ⚠️
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Dashboard Error</h2>
            <p className="text-gray-400 mb-6 max-w-sm">
                We couldn&apos;t load this section. Please try refreshing or come back later.
            </p>
            {error?.digest && (
                <p className="text-xs text-gray-600 mb-4 font-mono">Error ID: {error.digest}</p>
            )}
            <button
                onClick={() => reset()}
                className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{
                    background: "linear-gradient(135deg, #a855f7, #6366f1)",
                    boxShadow: "0 4px 15px rgba(168,85,247,0.3)",
                }}
            >
                Try Again
            </button>
        </div>
    );
}
