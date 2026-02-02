'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Maximize2, Minimize2, Volume2, RotateCcw, SkipForward, Settings, EyeOff } from 'lucide-react';

interface CoursePlayerProps {
    thumbnail: string;
    title: string;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ thumbnail, title }) => {
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Escape key to exit focus mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFocusMode) {
                setIsFocusMode(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocusMode]);

    return (
        <div className={`relative transition-all duration-700 ${isFocusMode ? 'z-[100]' : 'z-10'}`}>
            {/* Focus Mode Overlay */}
            <AnimatePresence>
                {isFocusMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[-1]"
                        onClick={() => setIsFocusMode(false)}
                    />
                )}
            </AnimatePresence>

            <motion.div
                layout
                className={`relative bg-black rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 ${isFocusMode
                        ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[80vh] max-w-6xl'
                        : 'w-full aspect-video'
                    }`}
            >
                {/* Video Thumbnail/Placeholder */}
                <div className="absolute inset-0 group">
                    <img
                        src={thumbnail}
                        alt={title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105 opacity-40' : 'group-hover:scale-110'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                </div>

                {/* Player Controls */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                    <div className="flex justify-between items-start">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                        >
                            <span className="text-sm font-bold tracking-tight opacity-80">{title}</span>
                        </motion.div>

                        <button
                            onClick={() => setIsFocusMode(!isFocusMode)}
                            className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transition-all group"
                        >
                            {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative group">
                            <div className="absolute top-0 left-0 h-full bg-violet-500 w-[45%] rounded-full shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
                            <div className="absolute top-1/2 left-[45%] -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                    {isPlaying ? <span className="text-2xl font-black">||</span> : <Play className="w-8 h-8 fill-current translate-x-1" />}
                                </button>
                                <div className="flex items-center gap-4 text-white/70">
                                    <RotateCcw className="w-5 h-5 hover:text-white cursor-pointer" />
                                    <SkipForward className="w-5 h-5 hover:text-white cursor-pointer" />
                                    <div className="flex items-center gap-2 ml-4">
                                        <Volume2 className="w-5 h-5" />
                                        <div className="w-20 h-1 bg-white/20 rounded-full">
                                            <div className="w-2/3 h-full bg-white rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsFocusMode(!isFocusMode)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${isFocusMode ? 'bg-violet-600' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
                                >
                                    <EyeOff className="w-4 h-4" />
                                    {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
                                </button>
                                <Settings className="w-5 h-5 text-white/50 hover:text-white cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CoursePlayer;
