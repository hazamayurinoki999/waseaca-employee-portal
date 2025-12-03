import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, School, Bus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import SeasonSelector from './SeasonSelector';

const courses = [
    { id: 'math', name: '算数', nameEn: 'Mathematics', hasImage: true },
    { id: 'english', name: '英語', nameEn: 'English', hasImage: true },
    { id: 'japanese', name: '国語', nameEn: 'Japanese', hasImage: true },
    { id: 'science', name: '理科', nameEn: 'Science', hasImage: true },
    { id: 'social', name: '社会', nameEn: 'Social Studies', hasImage: true },
    { id: 'essay', name: '作文', nameEn: 'Essay Writing', hasImage: false },
];

const busRoutes = [
    { id: 'route-a', name: 'ルートA - オーチャード経由' },
    { id: 'route-b', name: 'ルートB - マリーナ経由' },
    { id: 'route-c', name: 'ルートC - イーストコースト経由' },
];

export default function FeeCheckPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        grade: '',
        courses: [],
        siblings: false,
        busRoute: '',
        transfer: false
    });

    const handleCourseToggle = (courseId) => {
        setFormData(prev => ({
            ...prev,
            courses: prev.courses.includes(courseId)
                ? prev.courses.filter(id => id !== courseId)
                : [...prev.courses, courseId]
        }));
    };

    return (
        <>
            <ThemeToggle />
            <SeasonSelector />
            <div className="absolute-full p-8 overflow-y-auto" style={{ zIndex: 10 }}>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-8 opacity-70 hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--color-text)' }}
                >
                    <ArrowLeft size={20} />
                    <span>戻る</span>
                </button>

                <motion.div
                    className="max-w-5xl mx-auto glass-panel"
                    style={{ padding: '4rem' }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-5" style={{ color: 'var(--color-text)', lineHeight: 1.3 }}>
                            料金見積もり
                        </h1>
                        <p style={{
                            color: 'var(--color-text-secondary, var(--color-text))',
                            opacity: 0.7,
                            fontSize: '1.2rem',
                            lineHeight: 1.6
                        }}>
                            Fee Estimator
                        </p>
                    </div>

                    <div className="space-y-16">
                        {/* Grade Selection */}
                        <div>
                            <label className="block text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>
                                <School size={28} />
                                1. 学年を選択
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                {['年少', '年中', '年長', '小1', '小2', '小3', '小4', '小5', '小6', '中学'].map((g, idx) => (
                                    <button
                                        key={g}
                                        onClick={() => setFormData({ ...formData, grade: g })}
                                        className={`rounded-xl border-2 transition-all font-bold ${formData.grade === g
                                            ? 'border-blue-500 shadow-lg'
                                            : 'border-white/10 hover:border-white/30'
                                            }`}
                                        style={{
                                            padding: '1.25rem',
                                            background: formData.grade === g
                                                ? 'var(--season-primary, #3b82f6)'
                                                : 'var(--glass-bg)',
                                            color: 'var(--color-text)',
                                            fontSize: '1.1rem',
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Course Selection with Checkboxes */}
                        {/* Course Selection with Checkboxes */}
                        <div>
                            <label className="block text-2xl font-bold mb-6" style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>
                                2. コースを選択
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {courses.map((course) => (
                                    <div
                                        key={course.id}
                                        onClick={() => handleCourseToggle(course.id)}
                                        className={`rounded-xl border-2 cursor-pointer flex items-center gap-5 transition-all ${formData.courses.includes(course.id)
                                            ? 'border-purple-500 shadow-lg'
                                            : 'border-white/10 hover:border-white/30'
                                            }`}
                                        style={{
                                            padding: '1.5rem',
                                            background: formData.courses.includes(course.id)
                                                ? 'rgba(168, 85, 247, 0.2)'
                                                : 'var(--glass-bg)',
                                        }}
                                    >
                                        {/* Checkbox */}
                                        <div
                                            className={`w-7 h-7 rounded border-2 flex-center flex-shrink-0 transition-all ${formData.courses.includes(course.id)
                                                ? 'bg-purple-600 border-purple-600'
                                                : 'border-white/30'
                                                }`}
                                        >
                                            {formData.courses.includes(course.id) && (
                                                <Check size={18} color="white" strokeWidth={3} />
                                            )}
                                        </div>

                                        {/* Course info */}
                                        <div className="flex-1">
                                            <div className="font-bold text-xl mb-1" style={{ color: 'var(--color-text)' }}>
                                                {course.name}
                                            </div>
                                            <div className="text-base opacity-70" style={{ color: 'var(--color-text-secondary, var(--color-text))' }}>
                                                {course.nameEn}
                                            </div>
                                        </div>

                                        {/* Course image placeholder */}
                                        {course.hasImage && formData.courses.includes(course.id) && (
                                            <div
                                                className="w-20 h-20 rounded-xl flex-center flex-shrink-0"
                                                style={{
                                                    background: 'linear-gradient(135deg, var(--season-primary, #8b5cf6), var(--season-secondary, #a855f7))',
                                                    fontSize: '2.5rem'
                                                }}
                                            >
                                                📚
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Options with Checkboxes */}
                        {/* Options with Checkboxes */}
                        <div>
                            <label className="block text-2xl font-bold mb-6" style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>
                                3. オプション
                            </label>
                            <div className="space-y-6">
                                {/* Siblings */}
                                <CheckboxOption
                                    label="兄弟割引を適用"
                                    sublabel="Sibling Discount"
                                    checked={formData.siblings}
                                    onChange={(checked) => setFormData({ ...formData, siblings: checked })}
                                />

                                {/* Bus Service */}
                                <div>
                                    <CheckboxOption
                                        label="バス送迎サービスを利用"
                                        sublabel="Bus Service"
                                        checked={formData.busRoute !== ''}
                                        onChange={(checked) => {
                                            if (!checked) {
                                                setFormData({ ...formData, busRoute: '' });
                                            }
                                        }}
                                    />

                                    {/* Bus route selection */}
                                    {formData.busRoute !== '' && (
                                        <motion.div
                                            className="mt-4 ml-12 space-y-3"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            {busRoutes.map((route) => (
                                                <label
                                                    key={route.id}
                                                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="busRoute"
                                                        value={route.id}
                                                        checked={formData.busRoute === route.id}
                                                        onChange={(e) => setFormData({ ...formData, busRoute: e.target.value })}
                                                        className="w-5 h-5"
                                                    />
                                                    <span className="text-lg" style={{ color: 'var(--color-text)' }}>{route.name}</span>
                                                </label>
                                            ))}

                                            {/* Bus route image */}
                                            {formData.busRoute && (
                                                <div
                                                    className="mt-4 p-6 rounded-xl flex-center"
                                                    style={{
                                                        background: 'linear-gradient(135deg, var(--season-primary, #3b82f6), var(--season-secondary, #8b5cf6))',
                                                    }}
                                                >
                                                    <Bus size={56} color="white" />
                                                    <span className="ml-4 text-white font-bold text-xl">路線図</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>

                                {/* Transfer Student */}
                                <CheckboxOption
                                    label="転入生です"
                                    sublabel="Transfer Student"
                                    checked={formData.transfer}
                                    onChange={(checked) => setFormData({ ...formData, transfer: checked })}
                                />
                            </div>
                        </div>

                        {/* Calculate Button */}
                        <div className="pt-8 border-t flex justify-center" style={{ borderColor: 'var(--glass-border)' }}>
                            <motion.button
                                className="py-4 px-12 rounded-full font-bold text-lg text-white shadow-lg transition-all"
                                style={{
                                    background: 'linear-gradient(to right, var(--season-primary, #3b82f6), var(--season-secondary, #8b5cf6))',
                                }}
                                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px var(--season-glow, rgba(59, 130, 246, 0.4))' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                料金を計算する
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

function CheckboxOption({ label, sublabel, checked, onChange }) {
    return (
        <div
            onClick={() => onChange(!checked)}
            className={`rounded-xl border-2 cursor-pointer flex items-center gap-5 transition-all ${checked
                ? 'border-green-500 shadow-lg'
                : 'border-white/10 hover:border-white/30'
                }`}
            style={{
                padding: '1.5rem',
                background: checked ? 'rgba(34, 197, 94, 0.15)' : 'var(--glass-bg)',
            }}
        >
            {/* Checkbox */}
            <div
                className={`w-7 h-7 rounded border-2 flex-center flex-shrink-0 transition-all ${checked
                    ? 'bg-green-600 border-green-600'
                    : 'border-white/30'
                    }`}
            >
                {checked && <Check size={18} color="white" strokeWidth={3} />}
            </div>

            {/* Label */}
            <div className="flex-1">
                <div className="font-bold text-xl mb-1" style={{ color: 'var(--color-text)' }}>
                    {label}
                </div>
                <div className="text-base opacity-70" style={{ color: 'var(--color-text-secondary, var(--color-text))' }}>
                    {sublabel}
                </div>
            </div>
        </div>
    );
}
