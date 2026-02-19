"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Settings,
    SkipBack,
    SkipForward,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MasterCoursePlayerProps {
    videoUrl: string;
    thumbnail: string;
    onComplete?: () => void;
}

const MasterCoursePlayer = ({ videoUrl, thumbnail, onComplete }: MasterCoursePlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isHovering, setIsHovering] = useState(false);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(currentProgress);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = parseFloat(e.target.value);
        if (videoRef.current) {
            const newTime = (newProgress / 100) * videoRef.current.duration;
            videoRef.current.currentTime = newTime;
            setProgress(newProgress);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    };

    const handlePlaybackRateChange = () => {
        const rates = [1, 1.25, 1.5, 2];
        const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
        setPlaybackRate(nextRate);
        if (videoRef.current) {
            videoRef.current.playbackRate = nextRate;
        }
    };

    const toggleFullscreen = () => {
        const container = videoRef.current?.parentElement;
        if (!container) return;

        if (!document.fullscreenElement) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if ((container as any).webkitRequestFullscreen) {
                (container as any).webkitRequestFullscreen();
            } else if ((container as any).msRequestFullscreen) {
                (container as any).msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen();
            } else if ((document as any).msExitFullscreen) {
                (document as any).msExitFullscreen();
            }
        }
    };

    // Anti-download: Disable right-click
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => {
                if (isPlaying) setShowControls(false);
            }, 3000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isPlaying]);

    return (
        <div
            className={`master-player-container relative group w-full aspect-video bg-black shadow-2xl border transition-all duration-300 ${document.fullscreenElement ? 'rounded-none border-none' : 'rounded-xl border-white/10'
                }`}
            onContextMenu={handleContextMenu}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <style jsx global>{`
                .master-player-container:fullscreen {
                    border-radius: 0 !important;
                    border: none !important;
                }
                .master-player-container:-webkit-full-screen {
                    border-radius: 0 !important;
                    border: none !important;
                }
            `}</style>

            {/* The actual video element */}
            <video
                ref={videoRef}
                src={videoUrl}
                poster={thumbnail}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                playsInline
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
            />

            {/* Transparent Overlay */}
            <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={togglePlay}
            />

            {/* Premium Controls Overlay */}
            <AnimatePresence>
                {(showControls || !isPlaying) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-transparent to-transparent p-4 md:p-8"
                    >
                        {/* Play Pause Center Icon (Refined) */}
                        {!isPlaying && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-violet-600/20 backdrop-blur-3xl border border-white/20 rounded-full flex items-center justify-center cursor-pointer z-30 shadow-[0_0_50px_rgba(139,92,246,0.3)] group/play"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePlay();
                                }}
                            >
                                <div className="absolute inset-0 rounded-full bg-violet-600/20 animate-ping opacity-20" />
                                <div className="w-20 h-20 bg-violet-600 rounded-full flex items-center justify-center shadow-xl shadow-violet-600/40 relative">
                                    <Play className="w-10 h-10 text-white fill-current translate-x-1" />
                                </div>
                            </motion.div>
                        )}

                        {/* Top Info Banner */}
                        <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="px-5 py-2.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center gap-3 shadow-2xl"
                            >
                                <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                                <span className="text-[10px] font-black text-white/90 uppercase tracking-widest leading-none">Session Active</span>
                            </motion.div>
                        </div>

                        {/* Bottom Controls Bar */}
                        <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
                            {/* Progress Slider */}
                            <div className="relative group/progress px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={progress}
                                    onChange={handleProgressChange}
                                    className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-violet-600 outline-none transition-all group-hover/progress:h-2"
                                />
                                <div
                                    className="absolute top-0 left-2 right-2 h-full bg-violet-600 rounded-full pointer-events-none shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                                    style={{ width: `calc(${progress}% - 16px)` }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-8">
                                    <button
                                        onClick={togglePlay}
                                        className="text-white hover:text-violet-400 transition-all hover:scale-110 active:scale-90"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-7 h-7 fill-current" />
                                        ) : (
                                            <Play className="w-7 h-7 fill-current" />
                                        )}
                                    </button>

                                    <div className="flex items-center gap-4 group/volume">
                                        <button onClick={toggleMute} className="text-white hover:text-violet-400 transition-colors">
                                            {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                        </button>
                                        <div className="w-24 relative flex items-center">
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={isMuted ? 0 : volume}
                                                onChange={handleVolumeChange}
                                                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-[12px] font-black text-white/40 font-mono tracking-tighter">
                                        <span className="text-white/90">{videoRef.current ? formatTime(videoRef.current.currentTime) : '00:00'}</span>
                                        <span className="mx-2 text-white/20">/</span>
                                        <span className="text-white/60">{videoRef.current ? formatTime(videoRef.current.duration) : '00:00'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={handlePlaybackRateChange}
                                        className="text-[10px] font-black text-white hover:text-violet-900 hover:bg-white transition-all uppercase tracking-widest px-4 py-2 bg-white/10 rounded-xl border border-white/10"
                                    >
                                        {playbackRate}x Speed
                                    </button>

                                    <button
                                        onClick={toggleFullscreen}
                                        className="text-white hover:text-violet-400 transition-all hover:rotate-12 active:scale-90"
                                    >
                                        <Maximize className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Helper: Format time in MM:SS
const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default MasterCoursePlayer;
