import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDashboard } from '../services/api';
import {
    BarChart3, Target, Lightbulb, Brain,
    AlertTriangle, Loader2, TrendingUp
} from 'lucide-react';

interface AnalyticsData {
    total_problems: number;
    success_rate: number;
    hint_dependency: number;
    avg_reasoning_score: number;
    weak_concepts: string[];
    daily_streak: number;
    recent_activity: any[];
    concept_scores: Record<string, number>;
}

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45 } }),
};

export default function Analytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboard()
            .then((res) => setData(res.data))
            .catch(() => setData({
                total_problems: 0, success_rate: 0, hint_dependency: 0,
                avg_reasoning_score: 0, weak_concepts: [], daily_streak: 0,
                recent_activity: [], concept_scores: {},
            }))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
            </div>
        );
    }

    if (!data) return null;

    const stats = [
        { label: 'Total Problems', value: data.total_problems, icon: <Target size={18} />, color: 'var(--accent-primary)', bg: 'rgba(124, 92, 252, 0.1)' },
        { label: 'Success Rate', value: `${data.success_rate}%`, icon: <TrendingUp size={18} />, color: 'var(--success)', bg: 'rgba(64, 232, 160, 0.1)' },
        { label: 'Avg Reasoning', value: data.avg_reasoning_score, icon: <Brain size={18} />, color: 'var(--accent-secondary)', bg: 'rgba(92, 160, 252, 0.1)' },
        { label: 'Hint Dependency', value: `${data.hint_dependency}%`, icon: <Lightbulb size={18} />, color: 'var(--warning)', bg: 'rgba(248, 200, 71, 0.1)' },
    ];

    return (
        <div style={{ minHeight: '100vh', paddingTop: 64, paddingBottom: 60 }}>
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />

            <div className="container-main" style={{ position: 'relative', zIndex: 1, paddingTop: 32 }}>
                <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, marginBottom: 8 }}>
                        Analytics <span className="gradient-text">Insights</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                        Track your reasoning progress and identify areas for improvement
                    </p>
                </motion.div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 16,
                    marginBottom: 28,
                }}>
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={i}
                            className="glass-card"
                            style={{ padding: 20, textAlign: 'center' }}
                        >
                            <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: stat.bg, color: stat.color,
                                margin: '0 auto 12px',
                            }}>
                                {stat.icon}
                            </div>
                            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.value}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Two Column */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 20,
                }}>
                    {/* Concept Performance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card-static"
                        style={{ padding: 24 }}
                    >
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <BarChart3 size={18} style={{ color: 'var(--accent-primary)' }} />
                            Concept Performance
                        </h3>
                        {Object.entries(data.concept_scores).length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>Solve problems to see your scores here</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {Object.entries(data.concept_scores).map(([concept, score]) => (
                                    <div key={concept}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{concept}</span>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: score >= 70 ? 'var(--success)' : score >= 40 ? 'var(--warning)' : 'var(--error)' }}>{score}%</span>
                                        </div>
                                        <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-glass)', overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${score}%` }}
                                                transition={{ duration: 0.8, delay: 0.2 }}
                                                style={{
                                                    height: '100%', borderRadius: 3,
                                                    background: score >= 70 ? 'var(--success)' : score >= 40 ? 'var(--warning)' : 'var(--error)',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Weak Concepts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card-static"
                        style={{ padding: 24 }}
                    >
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
                            Areas to Improve
                        </h3>
                        {data.weak_concepts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <p style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {data.total_problems === 0 ? 'Start solving to identify weak areas!' : 'No weak concepts! Keep going!'}
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                {data.weak_concepts.map(concept => (
                                    <div key={concept} style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '8px 16px', borderRadius: 10,
                                        background: 'rgba(248, 200, 71, 0.06)',
                                        border: '1px solid rgba(248, 200, 71, 0.15)',
                                        color: 'var(--warning)', fontSize: '0.88rem', textTransform: 'capitalize',
                                    }}>
                                        <AlertTriangle size={14} />
                                        {concept}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
