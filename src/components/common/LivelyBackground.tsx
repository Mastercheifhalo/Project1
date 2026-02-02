import React from 'react';

const LivelyBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-white">
            {/* Animated Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-200/20 rounded-full blur-[120px] animate-blob" />
            <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-sky-200/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-200/10 rounded-full blur-[150px] animate-blob animation-delay-4000" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-pattern-dots opacity-[0.4]" />
        </div>
    );
};

export default LivelyBackground;
