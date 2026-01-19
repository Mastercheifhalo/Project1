"use client";

import React, { useState } from 'react';

interface TrialVideoProps {
  title: string;
  thumbnail: string;
  isUnlocked?: boolean;
}

export default function TrialVideo({ title, thumbnail, isUnlocked = false }: TrialVideoProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl aspect-video border border-slate-800 bg-slate-900">
      <img 
        src={thumbnail} 
        alt={title} 
        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
      />
      
      {!isUnlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-sm">
          <div className="mb-4 p-3 bg-violet-600 rounded-full shadow-lg shadow-violet-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Unlock this Lesson</h3>
          <p className="text-slate-300 text-sm mb-6 max-w-[250px]">
            Subscribe to one of our premium tiers to gain full access to all course materials.
          </p>
          <a href="#pricing" className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-colors">
            View Plans
          </a>
        </div>
      )}

      {isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4">
        <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10 uppercase tracking-wider">
          {isUnlocked ? "Premium Content" : "Locked Lesson"}
        </span>
      </div>
    </div>
  );
}
