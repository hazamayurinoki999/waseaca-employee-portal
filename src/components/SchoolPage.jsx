import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, HelpCircle, Bell, Calculator, ExternalLink, Calendar } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SeasonSelector from './SeasonSelector';
import { useNavigate } from 'react-router-dom';

export default function SchoolPage({ school, onBack }) {
    const navigate = useNavigate();

    return (
        <>
            <ThemeToggle />
            <SeasonSelector />
            <div className="absolute-full p-6 md:p-10 overflow-y-auto" style={{ zIndex: 10 }}>
                {/* Header Section */}
                <div className="max-w-7xl mx-auto mb-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 mb-6 opacity-70 hover:opacity-100 transition-opacity"
                        style={{ color: 'var(--color-text)' }}
                    >
                        <ArrowLeft size={20} />
                        <span>校舎選択に戻る</span>
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
                    >
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                                {school.label} Portal
                            </h1>
                            <p className="text-xl opacity-80" style={{ color: 'var(--color-text-secondary, var(--color-text))' }}>
                                おかえりなさい。最新の更新情報とスケジュールをご確認ください。
                            </p>
                        </div>
                        <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2">
                            <Calendar size={18} style={{ color: 'var(--color-text)' }} />
                            <span style={{ color: 'var(--color-text)' }}>2025.12.03</span>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                    {/* Left Column: Main Actions */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Fee Check Card */}
                        <motion.div
                            className="glass-panel rounded-2xl p-8 relative overflow-hidden group cursor-pointer border-2 transition-all"
                            style={{
                                borderColor: 'var(--glass-border)',
                                background: 'var(--glass-bg)'
                            }}
                            whileHover={{ scale: 1.01, borderColor: 'var(--season-primary, #3b82f6)' }}
                            onClick={() => navigate('/fee-check')}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Calculator size={120} />
                            </div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl flex-center mb-4" style={{ background: 'var(--season-primary, #3b82f6)' }}>
                                    <FileText size={24} color="white" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>料金チェック</h2>
                                <p className="mb-6 opacity-70" style={{ color: 'var(--color-text-secondary, var(--color-text))' }}>
                                    授業料を計算するシミュレーションツールです。
                                </p>
                                <span className="inline-flex items-center gap-2 font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                                    計算する <ArrowLeft className="rotate-180" size={16} />
                                </span>
                            </div>
                        </motion.div>

                        {/* FAQ Card */}
                        <motion.div
                            className="glass-panel rounded-2xl p-8 relative overflow-hidden group cursor-pointer border-2 transition-all"
                            style={{
                                borderColor: 'var(--glass-border)',
                                background: 'var(--glass-bg)'
                            }}
                            whileHover={{ scale: 1.01, borderColor: 'var(--season-secondary, #8b5cf6)' }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <HelpCircle size={120} />
                            </div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl flex-center mb-4" style={{ background: 'var(--season-secondary, #8b5cf6)' }}>
                                    <HelpCircle size={24} color="white" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>よくある質問</h2>
                                <p className="mb-6 opacity-70" style={{ color: 'var(--color-text-secondary, var(--color-text))' }}>
                                    ポータルの使い方や、よくある質問への回答をまとめています。
                                </p>
                                <span className="inline-flex items-center gap-2 font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                                    確認する <ArrowLeft className="rotate-180" size={16} />
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: News & Updates */}
                    <div className="md:col-span-1">
                        <motion.div
                            className="glass-panel rounded-2xl p-6 h-full border-2"
                            style={{
                                borderColor: 'var(--glass-border)',
                                background: 'var(--glass-bg)'
                            }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Bell size={24} style={{ color: 'var(--season-primary, #3b82f6)' }} />
                                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>最新ニュース</h2>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { date: '2025.12.01', title: '次学期のスケジュール変更に関する重要なお知らせ', tag: '重要' },
                                    { date: '2025.12.02', title: '冬期講習の申し込み受付を開始しました', tag: 'お知らせ' },
                                    { date: '2025.12.03', title: 'システムメンテナンスのお知らせ', tag: 'メンテ' }
                                ].map((news, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm opacity-60" style={{ color: 'var(--color-text)' }}>{news.date}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${news.tag === '重要' ? 'bg-red-500/20 text-red-300' :
                                                    news.tag === 'メンテ' ? 'bg-yellow-500/20 text-yellow-300' :
                                                        'bg-blue-500/20 text-blue-300'
                                                }`}>
                                                {news.tag}
                                            </span>
                                        </div>
                                        <p className="font-medium group-hover:text-blue-400 transition-colors line-clamp-2" style={{ color: 'var(--color-text)' }}>
                                            {news.title}
                                        </p>
                                        <div className="h-px w-full bg-white/10 mt-4 group-last:hidden" />
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-8 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm flex-center gap-2" style={{ color: 'var(--color-text)' }}>
                                <span>すべてのお知らせを見る</span>
                                <ExternalLink size={14} />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
