"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, GraduationCap, ShieldCheck } from "lucide-react";
import AuraBackground from "@/components/dashboard/AuraBackground";
import Link from "next/link";

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 2) return { score, label: "Fair", color: "bg-orange-500" };
    if (score <= 3) return { score, label: "Good", color: "bg-yellow-500" };
    if (score <= 4) return { score, label: "Strong", color: "bg-emerald-500" };
    return { score, label: "Excellent", color: "bg-emerald-600" };
}

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
    const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Client-side validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                router.push("/login?registered=true");
            } else {
                const data = await response.text();
                if (data.includes("already exists")) {
                    setError("An account with this email already exists. Try signing in instead.");
                } else {
                    setError(data || "Registration failed. Please try again.");
                }
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
            transition: { staggerChildren: 0.07, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6">
            <AuraBackground progress={95} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/40 backdrop-blur-2xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Logo & Header */}
                        <motion.div variants={itemVariants} className="mb-8 sm:mb-10 text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/20 mb-5">
                                <GraduationCap className="text-white w-7 h-7" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 mb-2 tracking-tight">
                                Join CoursePro
                            </h1>
                            <p className="text-slate-500 font-medium text-sm sm:text-base">Start your learning experience today</p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                            <div className="space-y-4">
                                {/* Full Name */}
                                <motion.div variants={itemVariants} className="relative group/input">
                                    <label htmlFor="register-name" className="sr-only">Full Name</label>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="register-name"
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        autoComplete="name"
                                        className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                    />
                                </motion.div>

                                {/* Email */}
                                <motion.div variants={itemVariants} className="relative group/input">
                                    <label htmlFor="register-email" className="sr-only">Email Address</label>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="register-email"
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                    />
                                </motion.div>

                                {/* Password */}
                                <motion.div variants={itemVariants}>
                                    <div className="relative group/input">
                                        <label htmlFor="register-password" className="sr-only">Password</label>
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="register-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password (min. 6 characters)"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            autoComplete="new-password"
                                            className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {/* Password Strength Meter */}
                                    {password.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-3 px-1"
                                        >
                                            <div className="flex gap-1.5 mb-1.5">
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.score
                                                            ? passwordStrength.color
                                                            : "bg-slate-200"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-slate-400 tracking-wide">
                                                    {passwordStrength.label}
                                                </span>
                                                {passwordStrength.score >= 4 && (
                                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Confirm Password */}
                                <motion.div variants={itemVariants} className="relative group/input">
                                    <label htmlFor="register-confirm-password" className="sr-only">Confirm Password</label>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="register-confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                        className={`w-full bg-white/50 border rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-4 transition-all font-medium text-slate-700 placeholder:text-slate-400 ${!passwordsMatch
                                            ? "border-red-300 focus:border-red-500/50 focus:ring-red-500/5"
                                            : "border-slate-200 focus:border-emerald-500/50 focus:ring-emerald-500/5"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    {!passwordsMatch && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-2 text-xs font-bold text-red-500 pl-1"
                                        >
                                            Passwords do not match
                                        </motion.p>
                                    )}
                                </motion.div>
                            </div>

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
                                    disabled={isLoading || !passwordsMatch}
                                    className="w-full bg-emerald-600 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 group hover:shadow-xl shadow-emerald-500/10"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </form>

                        {/* Footer Links */}
                        <motion.div variants={itemVariants} className="mt-8 sm:mt-10 text-center space-y-3">
                            <p className="text-slate-500 font-medium text-sm sm:text-base">
                                Already have an account?{" "}
                                <Link href="/login" className="text-emerald-600 font-black hover:underline underline-offset-4">
                                    Sign In
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
