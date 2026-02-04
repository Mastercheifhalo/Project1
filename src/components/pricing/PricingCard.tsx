"use client";

import React from 'react';
import TiltCard from '@/components/common/TiltCard';
import { useRouter } from 'next/navigation';

interface PricingCardProps {
    tier: string;
    price: string;
    interval: string;
    features: string[];
    isPopular?: boolean;
}

export default function PricingCard({ tier, price, interval, features, isPopular = false }: PricingCardProps) {
    const router = useRouter();

    const handlePurchase = () => {
        router.push(`/checkout/crypto?plan=${encodeURIComponent(tier)}&price=${encodeURIComponent(price)}`);
    };

    return (
        <TiltCard degree={isPopular ? 5 : 10} className="h-full">
            <div className={`relative p-8 rounded-3xl border transition-all duration-300 group h-full ${isPopular ? 'border-violet-500 bg-white shadow-2xl shadow-violet-500/10 scale-105 z-10' : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-slate-200'} flex flex-col`}>
                {isPopular && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-violet-600 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg shadow-violet-600/20">
                        Most Popular
                    </span>
                )}

                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-2 text-slate-500 uppercase tracking-widest">{tier}</h3>
                    <div className="flex items-baseline">
                        <span className="text-5xl font-black text-slate-900">${price}</span>
                        <span className="text-slate-500 ml-2 font-medium">/{interval}</span>
                    </div>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center text-slate-600 text-sm font-medium">
                            <div className="mr-3 p-1 bg-violet-50 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>

                <button
                    onClick={handlePurchase}
                    className={`w-full py-4 rounded-xl font-bold transition-all ${isPopular ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                >
                    Get {tier} Now
                </button>
            </div>
        </TiltCard>
    );
}
