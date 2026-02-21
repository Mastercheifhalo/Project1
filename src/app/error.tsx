"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Global Error]", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-lg mx-auto">
                {/* Icon */}
                <div className="flex justify-center mb-8">
                    <div
                        className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
                        style={{
                            background: "rgba(239,68,68,0.15)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        ⚠️
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-3">Something Went Wrong</h1>
                <p className="text-gray-400 mb-2 leading-relaxed">
                    An unexpected error occurred. Don&apos;t worry — your progress is saved.
                </p>
                {error?.digest && (
                    <p className="text-xs text-gray-600 mb-6 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 cursor-pointer"
                        style={{
                            background: "linear-gradient(135deg, #a855f7, #6366f1)",
                            boxShadow: "0 4px 20px rgba(168,85,247,0.35)",
                        }}
                    >
                        Try Again
                    </button>
                    <a
                        href="/"
                        className="px-6 py-3 rounded-xl text-gray-300 font-semibold transition-all duration-200 hover:scale-105 hover:text-white"
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
