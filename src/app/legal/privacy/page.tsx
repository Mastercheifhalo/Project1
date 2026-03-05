import React from 'react';

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen pt-32 pb-24 px-4 md:px-6">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[80px] rounded-full pointer-events-none -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-600/5 blur-[80px] rounded-full pointer-events-none -ml-20 -mb-20" />

                <div className="relative z-10">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">Privacy <span className="premium-gradient">Policy</span></h1>
                        <p className="text-slate-500 font-bold tracking-tight">Last Updated: March 2026</p>
                    </div>

                    <div className="space-y-8 text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">1. Introduction</h2>
                            <p>Welcome to CoursePro. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">2. The Data We Collect</h2>
                            <p className="mb-3">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data</strong> includes email address.</li>
                                <li><strong>Financial Data</strong> includes payment processing details (note: we do not store full credit card numbers; crypto payments are processed via secure wallets).</li>
                                <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products or services you have purchased from us.</li>
                                <li><strong>Profile Data</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">3. How We Use Your Data</h2>
                            <p className="mb-3">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., providing access to courses).</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal obligation.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">4. Data Security</h2>
                            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">5. Contact Us</h2>
                            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:privacy@coursepro.com" className="text-violet-600 font-bold hover:underline">privacy@coursepro.com</a>.</p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
