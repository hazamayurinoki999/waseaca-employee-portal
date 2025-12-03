import React from 'react';
import { motion } from 'framer-motion';
import { Flower2, Sun, Leaf, Snowflake } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const seasons = [
    { id: 'spring', label: '春', icon: Flower2, color: '#ffc0cb' },
    { id: 'summer', label: '夏', icon: Sun, color: '#fbbf24' },
    { id: 'autumn', label: '秋', icon: Leaf, color: '#fb923c' },
    { id: 'winter', label: '冬', icon: Snowflake, color: '#06b6d4' },
];

export default function SeasonSelector() {
    const { season, setSeason } = useTheme();

    return (
        <motion.div
            className="glass-panel"
            style={{
                position: 'fixed',
                top: '92px',
                right: '24px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        >
            {seasons.map((s) => {
                const Icon = s.icon;
                const isSelected = season === s.id;

                return (
                    <motion.button
                        key={s.id}
                        onClick={() => setSeason(s.id)}
                        style={{
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '2px',
                            border: isSelected ? `2px solid ${s.color}` : '1px solid var(--glass-border)',
                            background: isSelected ? 'var(--glass-bg)' : 'transparent',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            padding: '4px',
                            transition: 'all 0.3s ease',
                            boxShadow: isSelected ? `0 0 12px ${s.color}50` : 'none',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Icon
                            size={20}
                            color={isSelected ? s.color : 'var(--color-text)'}
                            strokeWidth={isSelected ? 2.5 : 2}
                        />
                        <span
                            style={{
                                fontSize: '10px',
                                fontWeight: isSelected ? 600 : 400,
                                color: isSelected ? s.color : 'var(--color-text)',
                            }}
                        >
                            {s.label}
                        </span>
                    </motion.button>
                );
            })}
        </motion.div>
    );
}
