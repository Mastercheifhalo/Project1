"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, GraduationCap, CheckCircle2 } from "lucide-react";
import AuraBackground from "@/components/dashboard/AuraBackground";
import Link from "next/link";

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get("registered") === "true";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password. Please try again.");
            } else {
                // Determine redirect based on role
                const res = await fetch('/api/auth/session');
                const session = await res.json();

                if (session?.user?.role === 'ADMIN') {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6">
            <AuraBackground progress={20} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/40 backdrop-blur-2xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Logo & Header */}
                        <motion.div variants={itemVariants} className="mb-8 sm:mb-10 text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-violet-600 rounded-2xl shadow-lg shadow-violet-600/20 mb-5">
                                <GraduationCap className="text-white w-7 h-7" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 mb-2 tracking-tight">
                                Welcome Back
                            </h1>
                            <p className="text-slate-500 font-medium text-sm sm:text-base">Continue your learning journey</p>
                        </motion.div>

                        {/* Registration Success Banner */}
                        {justRegistered && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-bold text-center border border-emerald-200 mb-6 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Registration successful! Please sign in.
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                            <div className="space-y-4">
                                {/* Email */}
                                <motion.div variants={itemVariants} className="relative group/input">
                                    <label htmlFor="login-email" className="sr-only">Email Address</label>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-violet-500 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="login-email"
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                    />
                                </motion.div>

                                {/* Password */}
                                <motion.div variants={itemVariants} className="relative group/input">
                                    <label htmlFor="login-password" className="sr-only">Password</label>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-violet-500 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                        className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-500 transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </motion.div>
                            </div>

                            {/* Forgot Password */}
                            <motion.div variants={itemVariants} className="text-right">
                                <Link
                                    href="#"
                                    className="text-sm text-violet-600 font-bold hover:underline underline-offset-4 transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </motion.div>

                            {/* Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold text-center border border-red-100"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Submit */}
                            <motion.div variants={itemVariants}>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 group hover:shadow-xl shadow-slate-900/10"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </form>

                        {/* Footer Links */}
                        <motion.div variants={itemVariants} className="mt-8 sm:mt-10 text-center space-y-3">
                            <p className="text-slate-500 font-medium text-sm sm:text-base">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="text-violet-600 font-black hover:underline underline-offset-4">
                                    Register
                                </Link>
                            </p>
                            <Link href="/" className="block text-sm text-slate-400 font-bold hover:text-slate-600 transition-colors">
                                ← Back to Home
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
