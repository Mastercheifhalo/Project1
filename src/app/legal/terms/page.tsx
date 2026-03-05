import React from 'react';

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen pt-32 pb-24 px-4 md:px-6">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[80px] rounded-full pointer-events-none -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-600/5 blur-[80px] rounded-full pointer-events-none -ml-20 -mb-20" />

                <div className="relative z-10">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">Terms of <span className="premium-gradient">Service</span></h1>
                        <p className="text-slate-500 font-bold tracking-tight">Last Updated: March 2026</p>
                    </div>

                    <div className="space-y-8 text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">1. Acceptance of Terms</h2>
                            <p>By accessing and using CoursePro (the "Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and such modifications shall be effective immediately upon posting to the Platform.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">2. Account Registration and Security</h2>
                            <p className="mb-3">To access certain features of the Platform, you must register for an account. By registering, you agree to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Provide accurate, current, and complete information.</li>
                                <li>Maintain the security of your password and identification.</li>
                                <li>Accept all responsibility for any and all activities that occur under your account.</li>
                                <li>Notify us immediately of any unauthorized use of your account or any other breach of security.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">3. Course Access and Licensing</h2>
                            <p>When you purchase a course or a subscription plan, CoursePro grants you a limited, non-exclusive, non-transferable license to access and view the courses and associated content for which you have paid solely for your personal, non-commercial, educational purposes through the Platform. You may not reproduce, redistribute, transmit, assign, sell, broadcast, rent, share, lend, modify, adapt, edit, create derivative works of, sublicense, or otherwise transfer or use any course unless we give you explicit permission to do so in a written agreement signed by an authorized representative of CoursePro.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">4. Payment and Crypto Transactions</h2>
                            <p>The Platform accepts various payment methods, including cryptocurrencies. When making a payment via cryptocurrency, you are responsible for ensuring the correct network and destination address are used. Refunds are handled in accordance with our Refund Policy. Crypto transactions are considered final once confirmed on the respective blockchain. CoursePro is not responsible for funds lost due to user error during transactions.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">5. Intellectual Property</h2>
                            <p>All content on the Platform, including text, graphics, logos, icons, images, audio clips, video clips, and software, is the property of CoursePro or its content suppliers and is protected by international copyright laws.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">6. Limitation of Liability</h2>
                            <p>In no event shall CoursePro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
