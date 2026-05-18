import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { useStore } from '../store/useStore';
import { startPractice, getHint, runCode } from '../services/api';
import {
    Send, Lightbulb, Loader2, Brain,
    MessageSquare, ListChecks, Star, Lock, Unlock, AlertTriangle, RotateCcw, BookOpen,
    Code2, CheckCircle, Play, ChevronRight
} from 'lucide-react';
import topicsData from '../data/topics.json';

const HINTS = [
    { label: 'Simplified Explanation', icon: Brain, penalty: 5, color: 'var(--accent-primary)' },
    { label: 'Thinking Questions', icon: MessageSquare, penalty: 10, color: 'var(--accent-secondary)' },
    { label: 'Logical Steps', icon: ListChecks, penalty: 15, color: 'var(--warning)' },
];


export default function PracticeMode() {
    const store = useStore();
    const [problemText, setProblemText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPenalty, setTotalPenalty] = useState(0);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const [selectedTopicId, setSelectedTopicId] = useState<string>('T1');

    const currentTopicData = topicsData.find((d: any) => d.topicId === selectedTopicId) || topicsData[0];
    const displayProblems = currentTopicData.problems;

    async function handleStart() {
        if (!problemText.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await startPractice(problemText);
            store.setPracticeId(res.data.problem_id, res.data.expected_output);
            setTotalPenalty(0);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to start. Is the API key configured?');
        }
        setLoading(false);
    }

    async function handleUnlock(level: number) {
        if (!store.practiceId) return;
        setLoading(true);
        try {
            const res = await getHint(store.practiceId, level);
            store.unlockHint(level, res.data.content);
            setTotalPenalty((p) => p + res.data.score_penalty);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to get hint');
        }
        setLoading(false);
    }

    async function handleCodeSubmit() {
        if (!store.practiceRunResult?.success) return;
        setIsEvaluating(true);
        // Simulate a smooth loading delay for UI Polish
        await new Promise(r => setTimeout(r, 1000));
        store.setPracticeIsSolved(true);
        setIsEvaluating(false);
    }

    async function handleRunCode() {
        if (!store.practiceUserCode.trim() || !store.practiceId) return;
        setIsRunning(true);
        setError(null);
        try {
            const res = await runCode(store.practiceId, store.practiceUserCode);
            store.setPracticeRunResult(res.data);
            if (!res.data.success) {
                store.setPracticeIsSolved(false);
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Code run failed');
        }
        setIsRunning(false);
    }

    function handleNextQuestion() {
        const currentIndex = displayProblems.findIndex((p: any) => p.desc === problemText);
        if (currentIndex >= 0 && currentIndex < displayProblems.length - 1) {
            const nextProblem = displayProblems[currentIndex + 1].desc;
            setProblemText(nextProblem);
            store.resetPractice();
            setTotalPenalty(0);
        } else {
            store.resetPractice();
            setProblemText('');
            setTotalPenalty(0);
        }
    }

    const score = Math.max(0, 100 - totalPenalty);

    return (
        <div style={{ minHeight: '100vh', paddingTop: 64 }}>
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />

            <div className="container-main" style={{ position: 'relative', zIndex: 1, paddingTop: 32, paddingBottom: 48, maxWidth: 900 }}>
                <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, marginBottom: 8 }}>
                        Practice <span className="gradient-text">Mode</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                        Progressive hints — each one costs you logic points
                    </p>
                </motion.div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass-card-static"
                        style={{ padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, borderColor: 'rgba(248,80,112,0.3)' }}
                    >
                        <AlertTriangle size={18} style={{ color: 'var(--error)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.88rem', color: 'var(--error)' }}>{error}</span>
                    </motion.div>
                )}

                {/* Problem Input */}
                {!store.practiceId && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass-card-static" style={{ padding: 'clamp(24px, 4vw, 40px)' }}
                    >
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Send size={20} style={{ color: 'var(--accent-primary)' }} />
                            Enter Problem
                        </h2>

                        <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, background: 'var(--bg-glass)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-glass)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <BookOpen size={18} style={{ color: 'var(--accent-primary)' }} />
                                    <div>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Topic-Wise Logic Curriculum</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Focus: {currentTopicData.focus}</p>
                                    </div>
                                </div>
                                <select
                                    value={selectedTopicId}
                                    onChange={(e) => setSelectedTopicId(e.target.value)}
                                    style={{
                                        background: 'var(--bg-card)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-glass)',
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        fontSize: '0.85rem',
                                        maxWidth: 200,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {topicsData.map((d: any) => (
                                        <option key={d.topicId} value={d.topicId}>{d.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
                                {displayProblems.map((p: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setProblemText(p.desc)}
                                        style={{
                                            padding: '10px 12px',
                                            borderRadius: 8,
                                            background: 'var(--bg-glass)',
                                            border: '1px solid var(--border-glass)',
                                            fontSize: '0.8rem',
                                            color: 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 8,
                                            transition: 'all 0.2s ease',
                                            textAlign: 'left'
                                        }}
                                        className="hover:border-[var(--accent-primary)] hover:text-white"
                                    >
                                        <span className={`badge badge-success`} style={{ padding: '2px 6px', fontSize: '0.65rem', whiteSpace: 'nowrap', marginTop: 2 }}>
                                            {p.id}
                                        </span>
                                        <span style={{ lineHeight: 1.4 }}>{p.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea
                            className="input-field"
                            placeholder="Describe a programming problem to practice..."
                            value={problemText}
                            onChange={(e) => setProblemText(e.target.value)}
                            rows={5}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                            <button className="btn-primary" onClick={handleStart} disabled={!problemText.trim()}>
                                Start Practice <Send size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 0' }}>
                        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
                        <p style={{ marginTop: 16, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Processing...</p>
                    </div>
                )}

                {/* Practice Session */}
                {store.practiceId && !loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Score Bar */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-static" style={{ padding: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Star size={18} style={{ color: 'var(--warning)' }} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Logic Score</span>
                                </div>
                                <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{score}</span>
                            </div>
                            <div style={{ height: 8, borderRadius: 8, background: 'var(--bg-glass)', overflow: 'hidden' }}>
                                <motion.div
                                    style={{
                                        height: '100%',
                                        borderRadius: 8,
                                        background: score > 60 ? 'var(--success)' : score > 30 ? 'var(--warning)' : 'var(--error)',
                                    }}
                                    initial={{ width: '100%' }}
                                    animate={{ width: `${score}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </motion.div>

                        {/* Problem */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="glass-card-static" style={{ padding: 20 }}
                        >
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 10 }}>📋 Problem Statement</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>{problemText}</p>
                        </motion.div>

                        {/* Hint Buttons */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: 12,
                        }}>
                            {HINTS.map((hint, i) => {
                                const level = i + 1;
                                const unlocked = store.hintsUnlocked >= level;
                                const canUnlock = store.hintsUnlocked >= level - 1;
                                return (
                                    <motion.button
                                        key={level}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        onClick={() => !unlocked && canUnlock && handleUnlock(level)}
                                        disabled={!canUnlock || unlocked}
                                        className="glass-card"
                                        style={{
                                            padding: 16,
                                            textAlign: 'center',
                                            cursor: canUnlock && !unlocked ? 'pointer' : 'default',
                                            border: unlocked ? `1px solid ${hint.color}` : undefined,
                                            opacity: canUnlock ? 1 : 0.4,
                                            background: 'var(--bg-card)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                                            {unlocked ? <Unlock size={18} style={{ color: hint.color }} /> : <Lock size={18} style={{ color: 'var(--text-muted)' }} />}
                                        </div>
                                        <p style={{ fontSize: '0.72rem', fontWeight: 600, marginBottom: 4 }}>{hint.label}</p>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                            {unlocked ? '✓ Open' : `-${hint.penalty} pts`}
                                        </p>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Hint Content */}
                        <AnimatePresence>
                            {store.hintContents.map((hint, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="glass-card-static"
                                    style={{ padding: 20, overflow: 'hidden' }}
                                >
                                    <h3 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, color: HINTS[i].color }}>
                                        <Lightbulb size={16} />
                                        Hint {i + 1}: {HINTS[i].label}
                                    </h3>
                                    {hint.type === 'explanation' && (
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>{hint.content}</p>
                                    )}
                                    {hint.type === 'questions' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {hint.content.map((q: string, j: number) => (
                                                <div key={j} style={{ padding: 12, borderRadius: 10, background: 'var(--bg-glass)', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                                                    Q{j + 1}: {q}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {hint.type === 'steps' && (
                                        <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            {hint.content.map((s: string, j: number) => (
                                                <li key={j} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{s}</li>
                                            ))}
                                        </ol>
                                    )}
                                    {(hint.type === 'skeleton' || hint.type === 'solution') && (
                                        <div>
                                            {hint.type === 'solution' && hint.steps && (
                                                <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
                                                    {hint.steps.map((s: string, j: number) => (
                                                        <li key={j} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s}</li>
                                                    ))}
                                                </ol>
                                            )}
                                            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                                                <Editor
                                                    height="200px"
                                                    defaultLanguage="python"
                                                    value={hint.content}
                                                    theme="vs-dark"
                                                    options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false, wordWrap: 'on' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Sample Expected Output */}
                        {store.practiceExpectedOutput && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-static" style={{ padding: 20, marginTop: 12 }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-secondary)' }}>
                                    <Code2 size={16} />
                                    Sample Expected Output
                                </h3>
                                <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                                    <Editor
                                        height="150px"
                                        defaultLanguage="python"
                                        value={store.practiceExpectedOutput}
                                        theme="vs-dark"
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            scrollBeyondLastLine: false,
                                            wordWrap: 'on',
                                            lineNumbers: 'off',
                                            padding: { top: 16 }
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Code Editor Section */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-static" style={{ padding: 20, marginTop: 12 }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Code2 size={18} style={{ color: 'var(--accent-primary)' }} />
                                Write Your Solution
                            </h3>

                            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-glass)', marginBottom: 16 }}>
                                <Editor
                                    height="300px"
                                    defaultLanguage="python"
                                    value={store.practiceUserCode}
                                    onChange={(v) => {
                                        store.setPracticeUserCode(v || '');
                                        if (store.practiceRunResult) store.setPracticeRunResult(null);
                                        if (store.practiceIsSolved) store.setPracticeIsSolved(false);
                                    }}
                                    theme="vs-dark"
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        fontFamily: "'JetBrains Mono', monospace",
                                        padding: { top: 16 },
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <button className="btn-secondary" onClick={handleRunCode} disabled={isRunning || isEvaluating || !store.practiceUserCode.trim()}>
                                    {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                                    Run Code
                                </button>
                                <button 
                                    className="btn-primary" 
                                    onClick={handleCodeSubmit} 
                                    disabled={isEvaluating || isRunning || !store.practiceRunResult?.success}
                                    style={{ opacity: store.practiceRunResult?.success ? 1 : 0.5 }}
                                >
                                    {isEvaluating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                    Submit Solution
                                </button>
                            </div>
                            
                            <AnimatePresence>
                                {store.practiceRunResult && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{ marginTop: 16, overflow: 'hidden' }}
                                    >
                                        <div style={{
                                            padding: 16,
                                            borderRadius: 12,
                                            background: store.practiceRunResult.success ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                                            border: `1px solid ${store.practiceRunResult.success ? 'var(--success)' : 'var(--error)'}`,
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 12
                                        }}>
                                            {store.practiceRunResult.success ? (
                                                <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                                            ) : (
                                                <AlertTriangle size={20} style={{ color: 'var(--error)', flexShrink: 0, marginTop: 2 }} />
                                            )}
                                            <div>
                                                <h4 style={{ 
                                                    fontSize: '0.95rem', 
                                                    fontWeight: 600, 
                                                    color: store.practiceRunResult.success ? 'var(--success)' : 'var(--error)',
                                                    marginBottom: 4
                                                }}>
                                                    {store.practiceRunResult.success ? 'Code executed successfully' : 'Your code is incorrect. Try again.'}
                                                </h4>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {store.practiceRunResult.success 
                                                        ? 'You can now submit your solution for detailed logical evaluation.'
                                                        : store.practiceRunResult.error_message || 'Syntax or runtime error occurred.'}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Completion Result */}
                        {store.practiceIsSolved && (
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ padding: 32, marginTop: 12, textAlign: 'center' }}>
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }} 
                                    animate={{ scale: 1, opacity: 1 }} 
                                    transition={{ type: 'spring', bounce: 0.5 }}
                                    style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}
                                >
                                    <div style={{ background: 'rgba(46, 213, 115, 0.1)', padding: 16, borderRadius: '50%' }}>
                                        <CheckCircle size={40} style={{ color: 'var(--success)' }} />
                                    </div>
                                </motion.div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8, color: 'var(--success)' }}>
                                    Problem Solved Successfully!
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
                                    Great job! You've passed all the necessary checks. Ready for the next challenge?
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button className="btn-primary" onClick={handleNextQuestion} style={{ background: 'var(--accent-primary)', fontSize: '1rem', padding: '12px 24px' }}>
                                        Move to Next Problem <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Reset Button */}
                        <div style={{ textAlign: 'center', paddingTop: 8 }}>
                            <button className="btn-secondary" onClick={() => { store.resetPractice(); setProblemText(''); setTotalPenalty(0); }}>
                                <RotateCcw size={16} /> Select Different Problem
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
