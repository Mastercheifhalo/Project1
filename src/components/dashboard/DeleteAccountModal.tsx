'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm, loading }: DeleteAccountModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-6">
                                <AlertTriangle className="w-10 h-10 text-red-600" />
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Delete Account?</h2>
                            <p className="text-slate-500 font-medium mb-8">
                                This action is permanent and cannot be undone. You will lose access to all your courses and learning progress.
                            </p>

                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                                >
                                    {loading ? 'Deleting...' : 'Yes, Delete Everything'}
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={loading}
                                    className="w-full py-4 bg-slate-100 text-slate-900 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
