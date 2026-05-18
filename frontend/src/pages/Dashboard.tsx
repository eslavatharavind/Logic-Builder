import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDashboard } from '../services/api';
import { Flame, Loader2, Rocket, Brain } from 'lucide-react';

interface DashboardData {
    daily_streak: number;
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboard()
            .then((res) => setData(res.data))
            .catch(() => setData({ daily_streak: 0 }))
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

    return (
        <div style={{ minHeight: '100vh', paddingTop: 64, paddingBottom: 60 }}>
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />

            <div className="container-main" style={{
                position: 'relative', zIndex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 'calc(100vh - 124px)',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', maxWidth: 600 }}
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        style={{
                            width: 72, height: 72, borderRadius: 20,
                            background: 'var(--accent-gradient)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 28px',
                            boxShadow: '0 12px 40px rgba(124, 92, 252, 0.35)',
                        }}
                    >
                        <Brain size={36} color="white" />
                    </motion.div>

                    {/* Heading */}
                    <h1 style={{
                        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
                        fontWeight: 800,
                        marginBottom: 16,
                        lineHeight: 1.15,
                    }}>
                        Welcome to <span className="gradient-text">LogicBuilder</span>
                    </h1>

                    {/* Motivational Message */}
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.15rem',
                        lineHeight: 1.7,
                        marginBottom: 28,
                    }}>
                        Sharpen your logical thinking, master problem decomposition,
                        and become a better programmer — one step at a time.
                    </p>

                    {/* Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                        {data.daily_streak > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '8px 18px', borderRadius: 24,
                                    background: 'rgba(248, 80, 112, 0.1)',
                                    border: '1px solid rgba(248, 80, 112, 0.2)',
                                    color: 'var(--error)', fontSize: '0.9rem', fontWeight: 600,
                                }}
                            >
                                <Flame size={16} /> {data.daily_streak} Day Streak
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '8px 18px', borderRadius: 24,
                                background: 'rgba(124, 92, 252, 0.08)',
                                border: '1px solid rgba(124, 92, 252, 0.2)',
                                color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 600,
                            }}
                        >
                            <Rocket size={16} /> Use the navbar to get started
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
