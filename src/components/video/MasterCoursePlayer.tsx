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
    thumbnail?: string;
    initialTime?: number;
    onComplete?: () => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
}

const MasterCoursePlayer = ({ videoUrl, thumbnail, initialTime = 0, onComplete, onTimeUpdate }: MasterCoursePlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
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
            if (onTimeUpdate) {
                onTimeUpdate(videoRef.current.currentTime, videoRef.current.duration);
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current && initialTime > 0 && !isLoaded) {
            videoRef.current.currentTime = initialTime;
            setIsLoaded(true);
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
        const showControlsTemporarily = () => {
            setShowControls(true);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => {
                if (isPlaying) setShowControls(false);
            }, 3000);
        };

        // Support both mouse (desktop) and touch (mobile)
        window.addEventListener('mousemove', showControlsTemporarily);
        window.addEventListener('touchstart', showControlsTemporarily, { passive: true });
        return () => {
            window.removeEventListener('mousemove', showControlsTemporarily);
            window.removeEventListener('touchstart', showControlsTemporarily);
        };
    }, [isPlaying]);

    return (
        <div
            className={`master-player-container relative group w-full aspect-video bg-black shadow-2xl border transition-all duration-300 ${(typeof document !== 'undefined' && document.fullscreenElement) ? 'rounded-none border-none' : 'rounded-xl border-white/10'
                }`}
            onContextMenu={handleContextMenu}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <style>{`
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
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={onComplete}
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
                        className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-transparent to-transparent p-3 md:p-8"
                    >
                        {/* Play Pause Center Icon (Refined) */}
                        {!isPlaying && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 bg-violet-600/20 backdrop-blur-3xl border border-white/20 rounded-full flex items-center justify-center cursor-pointer z-30 shadow-[0_0_50px_rgba(139,92,246,0.3)] group/play"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePlay();
                                }}
                            >
                                <div className="absolute inset-0 rounded-full bg-violet-600/20 animate-ping opacity-20" />
                                <div className="w-12 h-12 md:w-20 md:h-20 bg-violet-600 rounded-full flex items-center justify-center shadow-xl shadow-violet-600/40 relative">
                                    <Play className="w-6 h-6 md:w-10 md:h-10 text-white fill-current translate-x-0.5" />
                                </div>
                            </motion.div>
                        )}

                        {/* Top Info Banner — hidden on very small screens to save space */}
                        <div className="absolute top-2 md:top-8 left-3 md:left-8 right-3 md:right-8 flex justify-between items-start pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="hidden sm:flex px-3 md:px-5 py-1.5 md:py-2.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl items-center gap-2 md:gap-3 shadow-2xl"
                            >
                                <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                                <span className="text-[9px] md:text-[10px] font-black text-white/90 uppercase tracking-widest leading-none">Session Active</span>
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

                            {/* Controls Row — responsive layout */}
                            <div className="flex items-center justify-between gap-2">
                                {/* Left: play + volume */}
                                <div className="flex items-center gap-3 md:gap-8">
                                    <button
                                        onClick={togglePlay}
                                        className="text-white hover:text-violet-400 transition-all hover:scale-110 active:scale-90"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-5 h-5 md:w-7 md:h-7 fill-current" />
                                        ) : (
                                            <Play className="w-5 h-5 md:w-7 md:h-7 fill-current" />
                                        )}
                                    </button>

                                    {/* Mute only on mobile, full volume slider on md+ */}
                                    <button onClick={toggleMute} className="text-white hover:text-violet-400 transition-colors">
                                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 md:w-6 md:h-6" /> : <Volume2 className="w-4 h-4 md:w-6 md:h-6" />}
                                    </button>
                                    <div className="hidden md:flex w-24 items-center">
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

                                    <div className="text-[10px] md:text-[12px] font-black text-white/40 font-mono tracking-tighter">
                                        <span className="text-white/90">{videoRef.current ? formatTime(videoRef.current.currentTime) : '00:00'}</span>
                                        <span className="mx-1 md:mx-2 text-white/20">/</span>
                                        <span className="text-white/60">{videoRef.current ? formatTime(videoRef.current.duration) : '00:00'}</span>
                                    </div>
                                </div>

                                {/* Right: speed + fullscreen */}
                                <div className="flex items-center gap-2 md:gap-6">
                                    <button
                                        onClick={handlePlaybackRateChange}
                                        className="text-[9px] md:text-[10px] font-black text-white hover:text-violet-900 hover:bg-white transition-all uppercase tracking-widest px-2 md:px-4 py-1 md:py-2 bg-white/10 rounded-xl border border-white/10"
                                    >
                                        {playbackRate}x
                                    </button>

                                    <button
                                        onClick={toggleFullscreen}
                                        className="text-white hover:text-violet-400 transition-all active:scale-90"
                                    >
                                        <Maximize className="w-4 h-4 md:w-6 md:h-6" />
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
