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
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/40 backdrop-blur-md">
          <div className="mb-4 p-3 bg-violet-600 rounded-full shadow-lg shadow-violet-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-black mb-2 text-slate-900">Unlock this Lesson</h3>
          <p className="text-slate-600 text-sm mb-6 max-w-[250px] font-medium leading-relaxed">
            Subscribe to one of our premium tiers to gain full access to all course materials.
          </p>
          <a href="#pricing" className="px-8 py-2.5 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
            View Plans
          </a>
        </div>
      )}

      {isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors">
          <div className="p-4 bg-white/30 backdrop-blur-xl rounded-full border border-white/40 text-white shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 fill-current drop-shadow-lg" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-slate-900 border border-slate-200/50 uppercase tracking-[0.1em] shadow-sm">
          {isUnlocked ? "Premium Content" : "Locked Lesson"}
        </span>
      </div>
    </div>
  );
}
