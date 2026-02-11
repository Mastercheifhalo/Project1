'use client';

import React from 'react';
import { Quote, Star } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';
import TiltCard from '@/components/common/TiltCard';

const Testimonials = () => {
    const reviews = [
        {
            name: 'Alex Rivera',
            role: 'Senior Frontend Dev',
            content: 'The depth of the React masterclass is insane. I went from casual dev to architectural expert in just two months.',
            avatar: 'AR'
        },
        {
            name: 'Priya Sharma',
            role: 'UI/UX Designer',
            content: 'The design systems course literally doubled my freelance rate. The community support is the best I have ever seen.',
            avatar: 'PS'
        },
        {
            name: 'James Wilson',
            role: 'Mobile Developer',
            content: 'Stop watching YouTube tutorials and start building real products. CoursePro is the only platform you need.',
            avatar: 'JW'
        }
    ];

    return (
        <section className="py-24 max-w-7xl mx-auto px-4 md:px-6 bg-slate-50/50 rounded-[3rem] border border-slate-100 mb-24">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 tracking-tight uppercase">Student <span className="premium-gradient">Stories</span></h2>
                <p className="text-slate-600 font-medium text-lg italic max-w-xl mx-auto">
                    "Curiosity leads to career breakthroughs. See how our students transformed their lives."
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review, index) => (
                    <ScrollReveal key={index} delay={index * 0.1}>
                        <TiltCard degree={5} className="h-full">
                            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-xl transition-all h-full">
                                <Quote className="absolute top-8 right-8 w-12 h-12 text-slate-50 group-hover:text-violet-50 transition-colors" />
                                <div className="relative z-10">
                                    <p className="text-slate-600 font-medium mb-8 leading-relaxed">"{review.content}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white font-black">
                                            {review.avatar}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{review.name}</p>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{review.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
