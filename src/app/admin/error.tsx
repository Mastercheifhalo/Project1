"use client";

import { useEffect } from "react";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Admin Error]", error);
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
                🛑
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Admin Error</h2>
            <p className="text-gray-400 mb-6 max-w-sm">
                An error occurred in the admin panel. Data may be temporarily unavailable.
            </p>
            {error?.digest && (
                <p className="text-xs text-gray-600 mb-4 font-mono">Error ID: {error.digest}</p>
            )}
            <button
                onClick={() => reset()}
                className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    boxShadow: "0 4px 15px rgba(239,68,68,0.3)",
                }}
            >
                Retry
            </button>
        </div>
    );
}
