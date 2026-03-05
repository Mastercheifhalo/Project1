import React from 'react';

export default function RefundPolicyPage() {
    return (
        <main className="min-h-screen pt-32 pb-24 px-4 md:px-6">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[80px] rounded-full pointer-events-none -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-600/5 blur-[80px] rounded-full pointer-events-none -ml-20 -mb-20" />

                <div className="relative z-10">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">Refund <span className="premium-gradient">Policy</span></h1>
                        <p className="text-slate-500 font-bold tracking-tight">Last Updated: March 2026</p>
                    </div>

                    <div className="space-y-8 text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl mb-8">
                            <h3 className="text-amber-800 font-black uppercase tracking-tight text-sm mb-2">Important Notice for Digital Products</h3>
                            <p className="text-amber-700 text-sm">Due to the nature of digital educational content and immediate unhindered access to our platform's resources, our refund policies are strictly enforced. Please read carefully before making a purchase.</p>
                        </div>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">1. 14-Day Money-Back Guarantee (Fiat Payments)</h2>
                            <p>For purchases made using traditional payment methods (credit/debit cards), we offer a 14-day money-back guarantee. If you are unsatisfied with your course or subscription, you may request a full refund within 14 days of your initial purchase provided that you have completed less than 20% of the course content. Refund requests exceeding the 14-day window or the 20% completion threshold will be denied.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">2. Cryptocurrency Payments</h2>
                            <p><strong>Please note:</strong> Due to the volatile nature of cryptocurrencies, network fees, and the anonymity of wallets, <strong>all purchases made via cryptocurrency (BTC, ETH, USDC, USDT, etc.) are strictly non-refundable once confirmed on the blockchain.</strong> We strongly advise utilizing our free lesson previews to evaluate course quality before committing to a purchase using cryptocurrency.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">3. Subscription Cancellations</h2>
                            <p>You may cancel your monthly, quarterly, or annual subscription at any time. Cancellation will prevent future billings, but it does not automatically trigger a refund for the current billing cycle. You will retain access to the platform until the end of your currently paid cycle.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">4. How to Request a Refund</h2>
                            <p>To request a refund for eligible fiat purchases, please email our support team at <a href="mailto:support@coursepro.com" className="text-violet-600 font-bold hover:underline">support@coursepro.com</a> from the email address associated with your account. Please include your order number and a brief explanation of why you are requesting a refund.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">5. Abuse of Policy</h2>
                            <p>CoursePro reserves the right to deny refund requests if we detect abuse of our policy, such as significant content consumption followed by a refund request, or repeated refund requests across multiple products. Users found abusing the refund policy may be banned from the platform.</p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
