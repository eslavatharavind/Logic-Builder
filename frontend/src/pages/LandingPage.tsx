import { motion } from 'framer-motion';
import {
    Brain, Sparkles, Code2, Target,
    Lightbulb, BarChart3, Shield,
    ChevronRight
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6 },
    }),
};

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: 64 }}>
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />

            {/* ── Hero ────────────────────────────────────────── */}
            <section className="section-spacing" style={{ position: 'relative', zIndex: 1 }}>
                <div className="container-main" style={{ textAlign: 'center' }}>
                    <motion.div initial="hidden" animate="visible">
                        <motion.div variants={fadeUp} custom={0} style={{ marginBottom: 20 }}>
                            <span className="badge badge-primary" style={{ fontSize: '0.78rem', padding: '6px 18px' }}>
                                <Sparkles size={13} /> AI-Powered Thinking Trainer
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            custom={1}
                            style={{
                                fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
                                fontWeight: 800,
                                lineHeight: 1.1,
                                marginBottom: 20,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Think Before You{' '}
                            <span className="gradient-text">Code</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeUp}
                            custom={2}
                            style={{
                                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                                color: 'var(--text-secondary)',
                                maxWidth: 600,
                                margin: '0 auto 36px',
                                lineHeight: 1.65,
                            }}
                        >
                            LogicBuilder trains you to decompose problems, build logical frameworks,
                            and develop computational thinking — before writing a single line of code.
                        </motion.p>



                        {/* Pipeline Visual */}
                        <motion.div
                            variants={fadeUp}
                            custom={4}
                            className="glass-card-static"
                            style={{ marginTop: 48, padding: '20px 24px', maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}
                        >
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                            }}>
                                {['Problem', 'Simplify', 'Think', 'Steps', 'Skeleton', 'Code', 'Evaluate', 'Solution'].map((step, i) => (
                                    <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{
                                            padding: '4px 10px',
                                            borderRadius: 8,
                                            fontSize: 'clamp(0.6rem, 2vw, 0.75rem)',
                                            fontWeight: 600,
                                            background: `rgba(124, 92, 252, ${0.08 + i * 0.04})`,
                                            color: i < 4 ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                            border: '1px solid var(--border-glass)',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {step}
                                        </div>
                                        {i < 7 && <ChevronRight size={14} style={{ color: 'var(--text-muted)', margin: '0 2px', flexShrink: 0 }} />}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── Features ────────────────────────────────────── */}
            <section className="section-spacing" style={{ position: 'relative', zIndex: 1 }}>
                <div className="container-main">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} style={{ textAlign: 'center', marginBottom: 48 }}>
                        <motion.h2 variants={fadeUp} custom={0} style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, marginBottom: 12 }}>
                            Why <span className="gradient-text">LogicBuilder</span>?
                        </motion.h2>
                        <motion.p variants={fadeUp} custom={1} style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                            Stop copy-pasting solutions. Start building real problem-solving skills.
                        </motion.p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 20,
                    }}>
                        {[
                            { icon: <Brain size={22} />, title: 'Structured Thinking', desc: 'Break down every problem into simplified explanations, thinking questions, and logical steps.' },
                            { icon: <Code2 size={22} />, title: 'Code with Purpose', desc: 'Write code only after understanding the logic. No more blindfolded coding.' },
                            { icon: <Target size={22} />, title: 'AI Evaluation', desc: 'Get evaluated on your reasoning quality, not just code correctness.' },
                            { icon: <Lightbulb size={22} />, title: 'Guided Pipeline', desc: '8-step pipeline forces you to think before coding. No shortcuts allowed.' },
                            { icon: <BarChart3 size={22} />, title: 'Analytics', desc: 'Track your reasoning score, weak concepts, and daily practice streaks.' },
                            { icon: <Shield size={22} />, title: 'RAG-Powered', desc: 'Retrieval-Augmented Generation finds similar algorithm patterns for better context.' },
                        ].map((f, i) => (
                            <motion.div
                                key={f.title}
                                variants={fadeUp}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="glass-card"
                                style={{ padding: 28 }}
                            >
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 14,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(124, 92, 252, 0.12)',
                                    color: 'var(--accent-primary)',
                                    marginBottom: 16,
                                }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Pipeline Steps ──────────────────────────────── */}
            <section className="section-spacing" style={{ position: 'relative', zIndex: 1 }}>
                <div className="container-main">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
                        <motion.h2 variants={fadeUp} custom={0} style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, marginBottom: 12 }}>
                            The <span className="gradient-text">8-Step Pipeline</span>
                        </motion.h2>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 'clamp(12px, 3vw, 20px)',
                    }}>
                        {[
                            { step: 1, title: 'Simplified Explanation', desc: 'Understand the problem in plain English' },
                            { step: 2, title: 'Thinking Questions', desc: 'Answer guiding questions about the approach' },
                            { step: 3, title: 'AI Feedback', desc: 'Get your reasoning evaluated without spoilers' },
                            { step: 4, title: 'Logical Steps', desc: 'See the step-by-step algorithmic approach' },
                            { step: 5, title: 'Code Skeleton', desc: 'Get the structure without the solution' },
                            { step: 6, title: 'Write Code', desc: 'Implement your solution using the skeleton' },
                            { step: 7, title: 'Code Evaluation', desc: 'AI evaluates your implementation logic' },
                            { step: 8, title: 'Full Solution', desc: 'Optionally reveal the complete solution' },
                        ].map((s, i) => (
                            <motion.div
                                key={s.step}
                                variants={fadeUp}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="glass-card"
                                style={{ padding: 24, textAlign: 'center' }}
                            >
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: 'var(--accent-gradient)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 14px',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                }}>
                                    {s.step}
                                </div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>{s.title}</h4>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>





            {/* ── Footer ──────────────────────────────────────── */}
            <footer style={{
                position: 'relative',
                zIndex: 1,
                padding: '32px 24px',
                textAlign: 'center',
                borderTop: '1px solid var(--border-glass)',
            }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    © 2026 LogicBuilder. Built to make you think.
                </p>
            </footer>
        </div>
    );
}
