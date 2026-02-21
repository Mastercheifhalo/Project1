'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Maximize2, Volume2, RotateCcw, SkipForward } from 'lucide-react';

interface CoursePlayerProps {
    thumbnail: string;
    title: string;
    videoUrl?: string;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ thumbnail, title, videoUrl }) => {
    const defaultVideo = "https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190828_27_Super_Slow_Motion_1080p_001_preview.mp4";
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(currentProgress);
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        const newProgress = parseFloat(e.target.value);
        const newTime = (newProgress / 100) * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
        setProgress(newProgress);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const skipForward = () => {
        if (videoRef.current) videoRef.current.currentTime += 10;
    };

    const rewind = () => {
        if (videoRef.current) videoRef.current.currentTime -= 10;
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative z-10"
        >
            <motion.div
                layout
                className={`relative bg-black transition-all duration-700 shadow-2xl overflow-hidden w-full aspect-video rounded-xl ${(typeof document !== 'undefined' && document.fullscreenElement) ? 'rounded-none border-none' : ''}`}
            >
                {/* Video Element */}
                <video
                    ref={videoRef}
                    src={videoUrl || defaultVideo}
                    poster={thumbnail}
                    className="w-full h-full object-cover"
                    onTimeUpdate={handleTimeUpdate}
                    onClick={togglePlay}
                    playsInline
                />

                {/* Player Controls */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 text-white z-10 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none">
                    <div className="flex justify-between items-start pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                        >
                            <span className="text-[10px] md:text-sm font-bold tracking-tight opacity-80 uppercase tracking-widest">{title}</span>
                        </motion.div>
                    </div>

                    <div className="flex flex-col gap-6 pointer-events-auto">
                        {/* Progress Bar */}
                        <div className="relative group/progress px-2 h-1.5 flex items-center">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value={progress}
                                onChange={handleProgressChange}
                                className="w-full bg-white/20 rounded-full appearance-none cursor-pointer accent-violet-600 outline-none h-1 group-hover/progress:h-2 transition-all"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={togglePlay}
                                    className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
                                >
                                    {isPlaying ? <span className="text-2xl font-black">||</span> : <Play className="w-8 h-8 fill-current translate-x-1" />}
                                </button>
                                <div className="flex items-center gap-6 text-white/70">
                                    <RotateCcw onClick={rewind} className="w-6 h-6 hover:text-white cursor-pointer transition-all active:scale-90" />
                                    <SkipForward onClick={skipForward} className="w-6 h-6 hover:text-white cursor-pointer transition-all active:scale-110" />
                                    <div className="hidden md:flex items-center gap-4 ml-4 group/vol">
                                        <Volume2 className="w-5 h-5" />
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={toggleFullscreen}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all"
                            >
                                <Maximize2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CoursePlayer;
