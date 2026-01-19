"use client";

import React from 'react';

interface PricingCardProps {
    tier: string;
    price: string;
    interval: string;
    features: string[];
    isPopular?: boolean;
}

export default function PricingCard({ tier, price, interval, features, isPopular = false }: PricingCardProps) {
    return (
        <div className={`relative p-8 rounded-3xl border ${isPopular ? 'border-violet-500 bg-slate-900 shadow-2xl shadow-violet-500/10' : 'border-slate-800 bg-slate-900/50'} flex flex-col`}>
            {isPopular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                    Most Popular
                </span>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2 text-slate-400">{tier}</h3>
                <div className="flex items-baseline">
                    <span className="text-5xl font-black">${price}</span>
                    <span className="text-slate-500 ml-2">/{interval}</span>
                </div>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-slate-300 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                    </li>
                ))}
            </ul>

            <button className={`w-full py-4 rounded-xl font-bold transition-all ${isPopular ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20' : 'bg-white hover:bg-slate-100 text-black'}`}>
                Choose {tier} Plan
            </button>
        </div>
    );
}
