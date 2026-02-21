import React from 'react';
import {
    Mail,
    MessageSquare,
    BookOpen,
    ChevronRight,
    HelpCircle,
    LifeBuoy,
    Zap,
    Shield
} from 'lucide-react';
import Link from 'next/link';

const faqs = [
    {
        q: 'How do I access my purchased courses?',
        a: 'After purchase, your course is immediately available. Go to Dashboard → My Courses and click on any course to start watching.',
    },
    {
        q: 'Do I get lifetime access after purchase?',
        a: 'Yes! Both one-time course purchases and active subscriptions grant you unlimited access with no expiry date.',
    },
    {
        q: 'Which cryptocurrency payments do you accept?',
        a: 'We currently accept BTC (Bitcoin), USDT (TRC-20), and USDC (TRC-20). After making a transfer, submit your confirmation on the checkout page.',
    },
    {
        q: 'How long does payment confirmation take?',
        a: "Crypto payments are typically confirmed within 10-30 minutes depending on network congestion. You'll gain access as soon as your payment is verified.",
    },
    {
        q: 'What if I forget my password?',
        a: 'Click "Forgot password?" on the login page. An email with a reset link will be sent to your registered address.',
    },
    {
        q: 'Can I watch courses on mobile?',
        a: 'Absolutely. Our platform is fully responsive and works smoothly on any device — phone, tablet, or desktop.',
    },
];

const contactOptions = [
    {
        icon: <Mail className="w-7 h-7" />,
        title: 'Email Support',
        description: 'Get a response within 24 hours',
        action: 'Send Email',
        href: 'mailto:support@yourplatform.com',
        color: 'from-violet-500 to-violet-700',
    },
    {
        icon: <MessageSquare className="w-7 h-7" />,
        title: 'Live Chat',
        description: 'Chat with us during business hours',
        action: 'Start Chat',
        href: '#chat',
        color: 'from-emerald-500 to-emerald-700',
    },
    {
        icon: <BookOpen className="w-7 h-7" />,
        title: 'Knowledge Base',
        description: 'Browse our help documentation',
        action: 'Browse Docs',
        href: '#docs',
        color: 'from-amber-500 to-amber-700',
    },
];

export default function SupportPage() {
    return (
        <main className="min-h-screen pt-32 pb-24 px-4 md:px-6 max-w-5xl mx-auto">

            {/* Hero */}
            <div className="mb-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-full text-violet-600 text-xs font-black uppercase tracking-widest mb-6">
                    <LifeBuoy className="w-4 h-4" />
                    Support Center
                </div>
                <h1 className="text-5xl font-black tracking-tight mb-4">How can we <span className="premium-gradient">help you?</span></h1>
                <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
                    Find answers to common questions or reach out to our team directly.
                </p>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                {contactOptions.map(opt => (
                    <a
                        key={opt.title}
                        href={opt.href}
                        className="group relative overflow-hidden bg-white border border-slate-100 rounded-[2rem] p-8 hover:border-violet-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col gap-6"
                    >
                        <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${opt.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                            {opt.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-1">{opt.title}</h3>
                            <p className="text-slate-500 text-sm font-medium">{opt.description}</p>
                        </div>
                        <div className="mt-auto flex items-center gap-2 text-violet-600 font-bold text-sm group-hover:gap-3 transition-all">
                            {opt.action} <ChevronRight className="w-4 h-4" />
                        </div>
                    </a>
                ))}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                {[
                    { icon: <Zap className="w-5 h-5" />, label: 'Getting Started', href: '/courses' },
                    { icon: <Shield className="w-5 h-5" />, label: 'Account & Security', href: '/dashboard/settings' },
                    { icon: <BookOpen className="w-5 h-5" />, label: 'My Courses', href: '/dashboard/my-courses' },
                    { icon: <HelpCircle className="w-5 h-5" />, label: 'Billing & Plans', href: '/pricing' },
                ].map(link => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-100 rounded-[1.5rem] text-center hover:border-violet-200 hover:shadow-lg transition-all group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-all">
                            {link.icon}
                        </div>
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{link.label}</span>
                    </Link>
                ))}
            </div>

            {/* FAQs */}
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <HelpCircle className="w-6 h-6 text-violet-500" />
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white border border-slate-100 rounded-[1.5rem] p-8 hover:border-violet-100 transition-all">
                            <h3 className="text-base font-black text-slate-900 mb-3">{faq.q}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed text-sm">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-100 rounded-[2rem] p-12">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Still need help?</h3>
                <p className="text-slate-500 font-medium mb-6">Our team is available Monday – Friday, 9am – 6pm UTC.</p>
                <a
                    href="mailto:support@yourplatform.com"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all shadow-lg"
                >
                    <Mail className="w-5 h-5" />
                    Contact Support
                </a>
            </div>
        </main>
    );
}
