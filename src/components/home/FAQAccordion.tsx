'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQAccordion = () => {
    const faqs = [
        {
            q: "Can I cancel my subscription any time?",
            a: "Absolutely. You have full control over your subscription through your dashboard. No hidden fees, no questions asked."
        },
        {
            q: "Are there any prerequisites for the courses?",
            a: "We offer courses for all levels. Each course landing page clearly states whether it's for beginners, intermediate, or advanced learners."
        },
        {
            q: "Do I get a certificate upon completion?",
            a: "Yes! Every course on our platform comes with a professional digital certificate that you can share on your LinkedIn profile."
        },
        {
            q: "How often is new content added?",
            a: "We add at least 2 new premium masterclasses every month to ensure you're always learning the latest industry standards."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 max-w-3xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
                <div className="inline-flex p-3 bg-violet-50 rounded-2xl text-violet-600 mb-6">
                    <HelpCircle className="w-6 h-6" />
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-tight uppercase">Common <span className="premium-gradient">Questions</span></h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Everything you need to know about our platform.</p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm transition-all">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                        >
                            <span className="font-black text-slate-800 uppercase tracking-tight">{faq.q}</span>
                            {openIndex === index ? <ChevronUp className="w-5 h-5 text-violet-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </button>
                        {openIndex === index && (
                            <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                                <p className="text-slate-600 font-medium leading-relaxed">{faq.a}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQAccordion;
