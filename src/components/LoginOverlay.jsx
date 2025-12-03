import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, LogIn, Lock, User, Check, ArrowRight } from 'lucide-react';

export default function LoginOverlay({ school, onClose, onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('入力してください');
            return;
        }
        onLogin();
    };

    if (!school) return null;

    return (
        <AnimatePresence>
            <div className="fixed top-24 left-8 z-50 w-[340px]">
                <motion.div
                    initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/40"
                >
                    {/* Decorative gradient orb */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="p-6 relative z-10">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">{school.label}</h2>
                                <p className="text-xs text-slate-400 mt-1">Employee Portal Login</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Input */}
                            <div className="space-y-1.5">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={16} className="text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                        placeholder="ID / Email"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={16} className="text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                        placeholder="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-400 text-xs text-center font-medium bg-red-500/10 py-1 rounded-lg">{error}</p>
                            )}

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-300 transition-colors">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="peer sr-only" />
                                        <div className="w-3.5 h-3.5 border border-slate-600 rounded bg-slate-800/50 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all"></div>
                                        <Check size={8} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span>Keep me logged in</span>
                                </label>
                                <a href="#" className="hover:text-blue-400 transition-colors">Forgot password?</a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                            >
                                <div className="relative bg-slate-900/50 group-hover:bg-transparent transition-colors rounded-[11px] px-4 py-2.5 flex items-center justify-center gap-2">
                                    <span className="text-sm font-bold text-white">Login</span>
                                    <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
