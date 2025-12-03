import React from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import SeasonSelector from './SeasonSelector';

export default function LandingPage({ onEnter }) {
    return (
        <>
            <ThemeToggle />
            <SeasonSelector />
            <motion.div
                className="absolute-full flex-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onEnter}
                style={{ cursor: 'pointer', zIndex: 10 }}
            >
                <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    animate={{
                        opacity: [0.7, 1, 0.7],
                        scale: [1, 1.02, 1]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <motion.h1
                        style={{
                            fontSize: '4rem',
                            fontWeight: 800,
                            color: 'var(--color-text)',
                            textShadow: '0 0 20px var(--season-glow, rgba(255, 255, 255, 0.3))',
                            letterSpacing: '0.1em',
                            marginBottom: '1rem'
                        }}
                    >
                        タップしてスタート
                    </motion.h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--color-text-secondary, var(--color-text))',
                        opacity: 0.7
                    }}>
                        Tap to Start
                    </p>
                </motion.div>
            </motion.div>
        </>
    );
}
