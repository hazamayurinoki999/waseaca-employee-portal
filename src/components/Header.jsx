import React from 'react';
import { motion } from 'framer-motion';
import { Home, Globe } from 'lucide-react';

export default function Header() {
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="fixed top-0 left-0 w-full z-40 px-6 py-4 flex items-center justify-between"
            style={{
                background: 'linear-gradient(to bottom, rgba(122, 227, 255, 0.05), transparent)',
                backdropFilter: 'blur(2px)'
            }}
        >
            {/* Logo / Title */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Globe className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Waseda Academy</h1>
                    <p className="text-xs text-slate-400 font-medium tracking-wider">OVERSEAS PORTAL</p>
                </div>
            </div>

            {/* Homepage Button */}
            <motion.a
                href="https://waseaca-singapore.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Home size={18} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">ホームページ</span>
            </motion.a>
        </motion.header>
    );
}
