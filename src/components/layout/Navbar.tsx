'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, GraduationCap, PlayCircle, CreditCard, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Courses', href: '/courses', icon: <PlayCircle className="w-4 h-4" /> },
    { name: 'Pricing', href: '/#pricing', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className={`flex items-center justify-between px-6 py-3 transition-all duration-500 ${isScrolled ? 'glass' : 'bg-transparent'
          }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              COURSE<span className="premium-gradient">PRO</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 transition-colors"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link
              href="/login"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/10 transition-all active:scale-95"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-slate-900 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden fixed inset-0 top-[72px] bg-white/95 backdrop-blur-2xl z-[100] p-6 flex flex-col items-center justify-start gap-8 shadow-2xl overflow-y-auto"
            >
              <div className="w-full max-w-sm flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 hover:bg-violet-50 transition-all border border-slate-100 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-500 group-hover:text-violet-600 shadow-sm transition-colors">
                        {link.icon}
                      </div>
                      <span className="text-xl font-black text-slate-900">{link.name}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-violet-600 transition-colors" />
                  </Link>
                ))}

                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full mt-4 py-5 bg-slate-900 text-white text-center text-xl font-black rounded-2xl shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-transform"
                >
                  Sign In
                </Link>

                <div className="mt-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                  © 2026 CoursePro Platform
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
