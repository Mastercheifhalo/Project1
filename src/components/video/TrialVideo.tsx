"use client";

import React, { useState } from 'react';

interface TrialVideoProps {
  title: string;
  thumbnail: string;
  isUnlocked?: boolean;
}

export default function TrialVideo({ title, thumbnail, isUnlocked = false }: TrialVideoProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl aspect-video border border-slate-100 bg-slate-50 shadow-sm transition-all hover:shadow-xl hover:border-slate-200">
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
      />

      {!isUnlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 backdrop-blur-lg z-10 transition-all duration-500 group-hover:bg-slate-900/85">
          <div className="mb-6 p-5 bg-violet-600 rounded-full shadow-[0_0_40px_rgba(139,92,246,0.5)] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black mb-3 text-white tracking-tight leading-none uppercase italic">Premium Lesson</h3>
          <p className="text-slate-400 text-sm mb-8 max-w-[240px] font-bold uppercase tracking-widest leading-relaxed">
            Unlock Full Access
          </p>
          <a href="#pricing" className="px-12 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 text-lg">
            VIEW PLANS
          </a>
        </div>
      )}

      {isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors z-10">
          <div className="p-6 bg-white/20 backdrop-blur-3xl rounded-full border border-white/40 text-white shadow-2xl scale-90 group-hover:scale-110 transition-all duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 fill-current drop-shadow-2xl" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 z-20">
        <span className={`px-5 py-2 backdrop-blur-2xl rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border
          ${isUnlocked
            ? "bg-emerald-500/90 text-white border-emerald-400/30"
            : "bg-violet-600/90 text-white border-violet-400/30"
          }`}>
          {isUnlocked ? "Free Access" : "Gold Tier"}
        </span>
      </div>
    </div>
  );
}
