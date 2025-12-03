import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
    const { mode, toggleMode } = useTheme();

    return (
        <motion.button
            onClick={toggleMode}
            className="glass-panel"
            style={{
                position: 'fixed',
                top: '24px',
                right: '24px',
                zIndex: 1000,
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                cursor: 'pointer',
                padding: 0,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                key={mode}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {mode === 'dark' ? (
                    <Sun size={24} color="var(--color-text)" />
                ) : (
                    <Moon size={24} color="var(--color-text)" />
                )}
            </motion.div>
        </motion.button>
    );
}
