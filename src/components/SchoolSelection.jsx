import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe } from 'lucide-react';
import { schools } from '../data/schools';
import ThemeToggle from './ThemeToggle';
import SeasonSelector from './SeasonSelector';

import Header from './Header';

const regionIcons = {
    singapore: '🇸🇬',
    inter: '🌐',
    kl: '🇲🇾',
    hcm: '🇻🇳',
    d7: '🇻🇳',
    taipei: '🇹🇼',
    london: '🇬🇧',
    la: '🇺🇸',
};

const gradients = {
    singapore: 'from-blue-500 via-cyan-500 to-teal-400',
    inter: 'from-purple-500 via-pink-500 to-rose-400',
    kl: 'from-green-500 via-emerald-500 to-teal-400',
    hcm: 'from-orange-500 via-amber-500 to-yellow-400',
    d7: 'from-red-500 via-rose-500 to-pink-400',
    taipei: 'from-indigo-500 via-purple-500 to-violet-400',
    london: 'from-slate-600 via-gray-500 to-zinc-400',
    la: 'from-pink-500 via-rose-500 to-red-400',
};

const schoolColors = {
    singapore: '#3b82f6',
    inter: '#a855f7',
    kl: '#10b981',
    hcm: '#f59e0b',
    d7: '#ef4444',
    taipei: '#6366f1',
    london: '#64748b',
    la: '#ec4899',
};

export default function SchoolSelection({ onSelect }) {
    const [hoveredSchool, setHoveredSchool] = useState(null);
    const [selectedSchool, setSelectedSchool] = useState(null);

    const handleSchoolClick = (school) => {
        setSelectedSchool(school);
        // Delay the actual selection callback to allow animation to play
        // But the user wants the login screen to appear top-left.
        // If we call onSelect immediately, the parent might show the login overlay.
        // Let's call onSelect immediately, and let the parent handle the overlay.
        // The Earth3D will receive the selectedSchool prop and zoom in.
        onSelect(school);
    };

    return (
        <>
            <Header />
            <ThemeToggle />
            <SeasonSelector />

            {/* Earth components removed as per user request */}

            <div className="absolute-full flex flex-col items-center justify-center p-4 md:p-10" style={{ zIndex: 10, paddingTop: '80px' }}>
                <motion.div
                    className="text-center mb-8 md:mb-12"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{
                            color: 'var(--color-text)',
                            textShadow: '0 2px 10px var(--season-glow, rgba(0,0,0,0.2))'
                        }}
                    >
                        校舎を選択してください
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--color-text-secondary, var(--color-text))',
                        opacity: 0.7
                    }}>
                        Select Your Campus
                    </p>
                </motion.div>

                {/* Grid Layout - 7 items */}
                <div className="w-full max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4">
                    {schools.map((school, index) => {
                        const positionDelay = index * 0.05;

                        return (
                            <motion.div
                                key={school.id}
                                className="relative group cursor-pointer"
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    delay: positionDelay,
                                    duration: 0.4,
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20
                                }}
                                whileHover={{
                                    y: -12,
                                    scale: 1.05,
                                    transition: { type: "spring", stiffness: 400, damping: 15 }
                                }}
                                onClick={() => handleSchoolClick(school)}
                                onMouseEnter={() => setHoveredSchool(school)}
                                onMouseLeave={() => setHoveredSchool(null)}
                                style={{
                                    perspective: '1000px'
                                }}
                            >
                                {/* Gradient border effect */}
                                <motion.div
                                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradients[school.id]} opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}
                                    style={{ zIndex: -1 }}
                                    whileHover={{ scale: 1.1 }}
                                />

                                {/* Card */}
                                <motion.div
                                    className="glass-panel rounded-2xl transition-all duration-300 relative overflow-hidden"
                                    style={{
                                        padding: '2rem',
                                        background: 'rgba(122, 227, 255, 0.05)', // Transparent light blue
                                        backdropFilter: 'blur(2px)',
                                        minHeight: '200px',
                                        border: 'none',
                                        boxShadow: 'none',
                                    }}
                                    whileHover={{
                                        background: 'rgba(15, 23, 42, 0.2)',
                                    }}
                                >
                                    {/* Shimmer effect */}
                                    <motion.div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100"
                                        style={{
                                            background: `linear-gradient(45deg, transparent 30%, ${schoolColors[school.id]}20 50%, transparent 70%)`,
                                            backgroundSize: '200% 200%',
                                        }}
                                        animate={{
                                            backgroundPosition: ['0% 0%', '100% 100%'],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: 'reverse',
                                        }}
                                    />

                                    {/* Icon and region */}
                                    <div className="flex items-center justify-between mb-5 relative z-10">
                                        <motion.span
                                            className="text-4xl"
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {regionIcons[school.id]}
                                        </motion.span>
                                        <Globe size={20} style={{ opacity: 0.5, color: 'var(--color-text)' }} />
                                    </div>

                                    {/* School name */}
                                    <h3
                                        className="text-2xl font-bold mb-3 relative z-10 transition-colors duration-300"
                                        style={{
                                            color: 'var(--color-text)',
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        <span className="group-hover:opacity-0 transition-opacity duration-300">
                                            {school.label}
                                        </span>
                                        <span
                                            className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            style={{ color: schoolColors[school.id] }}
                                        >
                                            {school.label}
                                        </span>
                                    </h3>

                                    {/* English name */}
                                    <p
                                        className="text-base mb-5 relative z-10"
                                        style={{
                                            color: 'var(--color-text-secondary, var(--color-text))',
                                            opacity: 0.7,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {school.name}
                                    </p>

                                    {/* Decorative line */}
                                    <motion.div
                                        className={`h-1 rounded-full bg-gradient-to-r ${gradients[school.id]} relative z-10`}
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                    />

                                    {/* Hover indicator */}
                                    <motion.div
                                        className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10"
                                        style={{ color: schoolColors[school.id] }}
                                    >
                                        <MapPin size={16} />
                                        <span className="text-sm font-bold">ログインする</span>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
