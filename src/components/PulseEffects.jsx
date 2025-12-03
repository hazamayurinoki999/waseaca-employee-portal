import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

// Different pulse effect types
const PULSE_EFFECTS = [
    'wave',
    'zoom',
    'color-shift',
    'particle-burst',
    'ripple'
];

export default function PulseEffects() {
    const [activeEffect, setActiveEffect] = useState(null);
    const { season } = useTheme();

    useEffect(() => {
        const interval = setInterval(() => {
            // Trigger random effect every 10 seconds
            const randomEffect = PULSE_EFFECTS[Math.floor(Math.random() * PULSE_EFFECTS.length)];
            setActiveEffect(randomEffect);

            // Clear effect after 2 seconds
            setTimeout(() => {
                setActiveEffect(null);
            }, 2000);
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <AnimatePresence>
                {activeEffect === 'wave' && <WaveEffect />}
                {activeEffect === 'zoom' && <ZoomEffect />}
                {activeEffect === 'color-shift' && <ColorShiftEffect season={season} />}
                {activeEffect === 'particle-burst' && <ParticleBurstEffect season={season} />}
                {activeEffect === 'ripple' && <RippleEffect season={season} />}
            </AnimatePresence>
        </>
    );
}

// Wave effect - Light wave crossing the screen
function WaveEffect() {
    return (
        <motion.div
            className="absolute-full"
            style={{
                zIndex: 100,
                pointerEvents: 'none',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
    );
}

// Zoom effect - Screen zoom pulse
function ZoomEffect() {
    return (
        <motion.div
            className="absolute-full flex-center"
            style={{
                zIndex: 100,
                pointerEvents: 'none',
            }}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
            <div className="absolute-full" style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
            }} />
        </motion.div>
    );
}

// Color shift - Season color flash
function ColorShiftEffect({ season }) {
    const seasonColors = {
        spring: 'rgba(255, 192, 203, 0.15)',
        summer: 'rgba(251, 191, 36, 0.15)',
        autumn: 'rgba(251, 146, 60, 0.15)',
        winter: 'rgba(6, 182, 212, 0.15)',
    };

    return (
        <motion.div
            className="absolute-full"
            style={{
                zIndex: 100,
                pointerEvents: 'none',
                background: seasonColors[season],
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
    );
}

// Particle burst - Particles from center
function ParticleBurstEffect({ season }) {
    const seasonColors = {
        spring: '#ffc0cb',
        summer: '#fbbf24',
        autumn: '#fb923c',
        winter: '#06b6d4',
    };

    return (
        <div className="absolute-full flex-center" style={{ zIndex: 100, pointerEvents: 'none' }}>
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                return (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: seasonColors[season],
                            boxShadow: `0 0 10px ${seasonColors[season]}`,
                        }}
                        initial={{
                            x: 0,
                            y: 0,
                            opacity: 1,
                            scale: 1
                        }}
                        animate={{
                            x: Math.cos(angle) * 300,
                            y: Math.sin(angle) * 300,
                            opacity: 0,
                            scale: 0
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                );
            })}
        </div>
    );
}

// Ripple effect - Expanding ripples
function RippleEffect({ season }) {
    const seasonColors = {
        spring: '#ffc0cb',
        summer: '#fbbf24',
        autumn: '#fb923c',
        winter: '#06b6d4',
    };

    return (
        <div className="absolute-full flex-center" style={{ zIndex: 100, pointerEvents: 'none' }}>
            {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        border: `2px solid ${seasonColors[season]}`,
                        borderRadius: '50%',
                        boxShadow: `0 0 20px ${seasonColors[season]}`,
                    }}
                    initial={{
                        width: 0,
                        height: 0,
                        opacity: 0.8
                    }}
                    animate={{
                        width: 1000,
                        height: 1000,
                        opacity: 0
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: 'easeOut', delay: i * 0.2 }}
                />
            ))}
        </div>
    );
}
