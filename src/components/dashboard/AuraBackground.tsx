'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface AuraBackgroundProps {
    progress?: number; // 0 to 100
}

const AuraBackground: React.FC<AuraBackgroundProps> = ({ progress = 0 }) => {
    // Calculate hues based on progress
    // 0% -> Violet/Indigo
    // 50% -> Sky/Cyan
    // 100% -> Emerald/Teal
    const colors = useMemo(() => {
        if (progress < 50) {
            return {
                primary: 'rgba(139, 92, 246, 0.15)', // Violet
                secondary: 'rgba(99, 102, 241, 0.1)', // Indigo
                accent: 'rgba(216, 180, 254, 0.05)',
            };
        } else if (progress < 90) {
            return {
                primary: 'rgba(14, 165, 233, 0.15)', // Sky
                secondary: 'rgba(6, 182, 212, 0.1)', // Cyan
                accent: 'rgba(186, 230, 253, 0.05)',
            };
        } else {
            return {
                primary: 'rgba(16, 185, 129, 0.15)', // Emerald
                secondary: 'rgba(20, 184, 166, 0.1)', // Teal
                accent: 'rgba(167, 243, 208, 0.05)',
            };
        }
    }, [progress]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-slate-50/50">
            {/* Main Aura Blob */}
            <motion.div
                animate={{
                    backgroundColor: colors.primary,
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    backgroundColor: { duration: 2 },
                    scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                }}
                className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]"
            />

            {/* Secondary Aura Blob */}
            <motion.div
                animate={{
                    backgroundColor: colors.secondary,
                    scale: [1, 1.3, 1],
                    x: [0, -40, 0],
                    y: [0, 60, 0],
                }}
                transition={{
                    backgroundColor: { duration: 2 },
                    scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                    x: { duration: 15, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 13, repeat: Infinity, ease: "easeInOut" },
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px]"
            />

            {/* Accent Highlight */}
            <motion.div
                animate={{
                    backgroundColor: colors.accent,
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    backgroundColor: { duration: 2 },
                    opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full blur-[150px]"
            />

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
        </div>
    );
};

export default AuraBackground;
