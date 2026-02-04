"use client";

import React, { useState, useEffect } from 'react';
import {
    Send,
    Image as ImageIcon,
    CheckCheck,
    ArrowLeft,
    ShieldCheck,
    Lock
} from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function TelegramMockPage() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! Please send a screenshot of your payment confirmation (USDT/BTC/USDC) and your registered email address.",
            isBot: true,
            time: "22:00"
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newUserMsg = {
            id: messages.length + 1,
            text: message,
            isBot: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newUserMsg]);
        setMessage("");

        // Simulate Bot Reply
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: "Thank you. Our team has been notified. We will verify your transaction and unlock your courses within 1-6 hours.",
                isBot: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#8ea8bd]/20 flex flex-col items-center justify-center p-4 md:p-8">
            <ScrollReveal direction="up">
                <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[600px] relative">
                    {/* Header */}
                    <div className="bg-[#24A1DE] p-6 text-white flex items-center gap-4 shadow-lg z-10">
                        <Link href="/checkout/crypto" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#24A1DE] font-black text-xl shadow-inner">
                            CP
                        </div>
                        <div>
                            <h2 className="font-black text-lg leading-none">CoursePro Support</h2>
                            <p className="text-white/70 text-sm font-medium">Verification Center • Online</p>
                        </div>
                        <ShieldCheck className="ml-auto w-6 h-6 opacity-80" />
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#e7ebf0]">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm relative group
                                    ${msg.isBot
                                        ? 'bg-white text-slate-900 rounded-tl-none'
                                        : 'bg-[#eeffde] text-slate-900 rounded-tr-none border border-[#d6eeba]'
                                    }`}>
                                    {msg.text}
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className="text-[10px] text-slate-400 font-bold">{msg.time}</span>
                                        {!msg.isBot && <CheckCheck className="w-3 h-3 text-[#40a7e3]" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Input */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <form onSubmit={handleSend} className="flex gap-2 items-center">
                            <button type="button" className="p-3 text-slate-400 hover:text-violet-600 transition-colors">
                                <ImageIcon className="w-6 h-6" />
                            </button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write a message..."
                                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-all"
                            />
                            <button
                                type="submit"
                                className="p-3 bg-[#24A1DE] text-white rounded-xl hover:bg-[#1c86b9] transition-all shadow-lg"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                        <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
                            <Lock className="w-3 h-3" />
                            Messages are end-to-end encrypted
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            <Link href="/dashboard" className="mt-8 text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2 group transition-all">
                Maybe later, take me to Dashboard
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
