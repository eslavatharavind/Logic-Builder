import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { useStore } from '../store/useStore';
import { submitProblem, submitAnswers, runCode } from '../services/api';
import {
    Send, ChevronRight, ChevronLeft, Brain, MessageSquare,
    ListChecks, Code2, CheckCircle, Sparkles, Loader2, AlertTriangle, Eye, Play
} from 'lucide-react';

const STEP_LABELS = ['Explanation', 'Questions', 'Feedback', 'Steps', 'Code', 'Completion', 'Solution'];
const STEP_ICONS = [Brain, MessageSquare, Sparkles, ListChecks, Code2, CheckCircle, Eye];

const slide = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.35 } },
    exit: { x: -40, opacity: 0, transition: { duration: 0.2 } },
};

export default function GuidedMode() {
    const store = useStore();
    const [problemText, setProblemText] = useState('');
    const [localAnswers, setLocalAnswers] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);

    async function handleSubmitProblem() {
        if (!problemText.trim()) return;
        store.setLoading(true);
        store.setError(null);
        try {
            const res = await submitProblem(problemText);
            store.setProblemId(res.data.problem_id);
            store.setAnalysis(res.data.analysis);
            setLocalAnswers(new Array(res.data.analysis.thinking_questions.length).fill(''));
            store.setStep(1);
        } catch (err: any) {
            store.setError(err.response?.data?.detail || 'Failed to analyze problem. Make sure the API key is configured.');
        }
        store.setLoading(false);
    }

    async function handleSubmitAnswers() {
        if (!store.problemId) return;
        store.setLoading(true);
        try {
            const res = await submitAnswers(store.problemId, localAnswers);
            store.setEvaluation(res.data);
            store.setAnswers(localAnswers);
            store.setStep(3);
        } catch (err: any) {
            store.setError(err.response?.data?.detail || 'Evaluation failed');
        }
        store.setLoading(false);
    }

    async function handleRunCode() {
        if (!store.userCode.trim() || !store.problemId) return;
        setIsRunning(true);
        store.setError(null);
        try {
            const res = await runCode(store.problemId, store.userCode);
            store.setRunResult(res.data);
            if (!res.data.success) {
                store.setIsSolved(false);
            }
        } catch (err: any) {
            store.setError(err.response?.data?.detail || 'Code run failed');
        }
        setIsRunning(false);
    }

    async function handleSubmitCode() {
        if (!store.runResult?.success) return;
        setIsEvaluating(true);
        // Simulate a smooth loading delay for UI Polish
        await new Promise(r => setTimeout(r, 1000));
        store.setIsSolved(true);
        setIsEvaluating(false);
        store.setStep(6); // Move to Completion from Code
    }

    const scoreClass = (s: number) => s >= 70 ? 'score-high' : s >= 40 ? 'score-medium' : 'score-low';

    return (
        <div style={{ minHeight: '100vh', paddingTop: 64 }}>
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />

            <div className="container-main" style={{ position: 'relative', zIndex: 1, paddingTop: 32, paddingBottom: 48, maxWidth: 900 }}>
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, marginBottom: 8 }}>
                        Guided <span className="gradient-text">Mode</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                        Follow the 8-step pipeline to master computational thinking
                    </p>
                </motion.div>

                {/* Step Indicator */}
                {store.analysis && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 28,
                        overflowX: 'auto',
                        paddingBottom: 8,
                        gap: 2,
                    }}>
                        {STEP_LABELS.map((label, i) => {
                            const stepNum = i + 1;
                            const Icon = STEP_ICONS[i];
                            const isActive = store.currentStep === stepNum;
                            const done = store.currentStep > stepNum;
                            return (
                                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 36 }}>
                                        <div style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.7rem',
                                            background: isActive ? 'var(--accent-gradient)' : done ? 'rgba(64, 232, 160, 0.15)' : 'var(--bg-glass)',
                                            border: `1px solid ${isActive ? 'transparent' : done ? 'var(--success)' : 'var(--border-glass)'}`,
                                            color: isActive ? 'white' : done ? 'var(--success)' : 'var(--text-muted)',
                                            boxShadow: isActive ? '0 0 12px rgba(124,92,252,0.4)' : 'none',
                                            transition: 'all 0.3s',
                                        }}>
                                            {done ? <CheckCircle size={14} /> : <Icon size={14} />}
                                        </div>
                                        <span className="step-label-text" style={{
                                            fontSize: '0.62rem',
                                            marginTop: 4,
                                            color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {label}
                                        </span>
                                    </div>
                                    {i < 7 && <div style={{ width: 16, height: 1, background: done ? 'var(--success)' : 'var(--border-glass)', margin: '0 2px', marginBottom: 16 }} />}
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {/* Error */}
                {store.error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass-card-static"
                        style={{ padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, borderColor: 'rgba(248,80,112,0.3)' }}
                    >
                        <AlertTriangle size={18} style={{ color: 'var(--error)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.88rem', color: 'var(--error)' }}>{store.error}</span>
                    </motion.div>
                )}

                {/* Loading */}
                {store.isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 0' }}
                    >
                        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
                        <p style={{ marginTop: 16, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>AI is analyzing your problem...</p>
                    </motion.div>
                )}

                {/* Steps Content */}
                {!store.isLoading && (
                    <AnimatePresence mode="wait">
                        {/* Input */}
                        {!store.analysis && (
                            <motion.div key="input" variants={slide} initial="enter" animate="center" exit="exit"
                                className="glass-card-static" style={{ padding: 'clamp(24px, 4vw, 40px)' }}
                            >
                                <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Send size={20} style={{ color: 'var(--accent-primary)' }} />
                                    Enter Your Programming Problem
                                </h2>
                                <textarea
                                    className="input-field"
                                    placeholder={"Describe a programming problem you want to solve...\n\nExample: Given an array of integers and a target sum, find two numbers that add up to the target."}
                                    value={problemText}
                                    onChange={(e) => setProblemText(e.target.value)}
                                    rows={5}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                                    <button className="btn-primary" onClick={handleSubmitProblem} disabled={!problemText.trim()}>
                                        Analyze Problem <Send size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 1 */}
                        {store.analysis && store.currentStep === 1 && (
                            <motion.div key="s1" variants={slide} initial="enter" animate="center" exit="exit"
                                className="glass-card-static" style={{ padding: 'clamp(24px, 4vw, 40px)' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <Brain size={20} style={{ color: 'var(--accent-primary)' }} />
                                        Step 1: Simplified Explanation
                                    </h2>
                                    <span className={`badge badge-${store.analysis.difficulty === 'easy' ? 'success' : store.analysis.difficulty === 'medium' ? 'warning' : 'error'}`}>
                                        {store.analysis.difficulty}
                                    </span>
                                </div>
                                <div style={{ padding: 20, borderRadius: 14, background: 'rgba(124,92,252,0.04)', border: '1px solid var(--border-glass)', marginBottom: 16 }}>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.94rem' }}>{store.analysis.simple_explanation}</p>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                                    {store.analysis.concepts_used.map((c) => <span key={c} className="badge badge-primary">{c}</span>)}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn-primary" onClick={() => store.setStep(2)}>
                                        Continue to Questions <ChevronRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2 */}
                        {store.analysis && store.currentStep === 2 && (
                            <motion.div key="s2" variants={slide} initial="enter" animate="center" exit="exit"
                                className="glass-card-static" style={{ padding: 'clamp(24px, 4vw, 40px)' }}
                            >
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <MessageSquare size={20} style={{ color: 'var(--accent-primary)' }} />
                                    Step 2: Thinking Questions
                                </h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                                    Answer each question carefully. These guide your reasoning — don't look at solutions!
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {store.analysis.thinking_questions.map((q, i) => (
                                        <div key={i} style={{ padding: 16, borderRadius: 14, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
                                            <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--accent-primary)', marginBottom: 10 }}>Q{i + 1}: {q}</p>
                                            <textarea
                                                className="input-field"
                                                placeholder="Type your answer..."
                                                value={localAnswers[i] || ''}
                                                onChange={(e) => {
                                                    const a = [...localAnswers];
                                                    a[i] = e.target.value;
                                                    setLocalAnswers(a);
                                                }}
                                                rows={2}
                                                style={{ minHeight: 80 }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Sample Expected Output */}
                                <div style={{ marginTop: 24, padding: 16, borderRadius: 14, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Code2 size={16} /> Sample Expected Output
                                    </h3>
                                    <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Editor
                                            height="120px"
                                            defaultLanguage="python"
                                            value={store.analysis.expected_output}
                                            theme="vs-dark"
                                            options={{
                                                readOnly: true,
                                                minimap: { enabled: false },
                                                fontSize: 14,
                                                scrollBeyondLastLine: false,
                                                wordWrap: 'on',
                                                lineNumbers: 'off',
                                                padding: { top: 12 }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, flexWrap: 'wrap', gap: 12 }}>
                                    <button className="btn-secondary" onClick={() => store.setStep(1)}><ChevronLeft size={16} /> Back</button>
                                    <button className="btn-primary" onClick={handleSubmitAnswers} disabled={localAnswers.some((a) => !a.trim())}>
                                        Submit Answers <Send size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3 */}
                        {store.analysis && store.currentStep === 3 && store.evaluation && (
                            <motion.div key="s3" variants={slide} initial="enter" animate="center" exit="exit"
                                className="glass-card-static" style={{ padding: 'clamp(24px, 4vw, 40px)' }}
                            >
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
                                    Step 3: AI Reasoning Feedback
                                </h2>
                                <div style={{ display: 'flex', gap: 24, flexDirection: 'var(--dir)' as any }} className="feedback-layout">
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                        <div className={`score-circle ${scoreClass(store.evaluation.score)}`}>{store.evaluation.score}</div>
                                        <p style={{ fontSize: '0.72rem', marginTop: 8, color: 'var(--text-muted)' }}>Score</p>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '0.92rem', lineHeight: 1.6 }}>{store.evaluation.feedback}</p>
                                        {store.evaluation.strengths?.length > 0 && (
                                            <div style={{ marginBottom: 14 }}>
                                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)', marginBottom: 6 }}>✓ Strengths</p>
                                                {store.evaluation.strengths.map((s: string, i: number) => (
                                                    <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: 12 }}>• {s}</p>
                                                ))}
                                            </div>
                                        )}
                                        {store.evaluation.missing_concepts?.length > 0 && (
                                            <div style={{ marginBottom: 14 }}>
                                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--warning)', marginBottom: 6 }}>⚠ Gaps</p>
                                                {store.evaluation.missing_concepts.map((s: string, i: number) => (
                                                    <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: 12 }}>• {s}</p>
                                                ))}
                                            </div>
                                        )}
                                        {store.evaluation.suggestions?.length > 0 && (
                                            <div>
                                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 6 }}>💡 Tips</p>
                                                {store.evaluation.suggestions.map((s: string, i: number) => (
                                                    <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: 12 }}>• {s}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
                                    <button className="btn-secondary" onClick={() => store.setStep(2)}><ChevronLeft size={16} /> Revise</button>
                                    <button className="btn-primary" onClick={() => store.setStep(4)}>See Logical Steps <ChevronRight size={16} /></button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4 */}
                        {store.analysis && store.currentStep === 4 && (
                            <motion.div key="s4" variants={slide} initial="enter" animate="center" exit="exit"
                                className="glass-card-static" style={{ padding: 'clamp(24px, 4vw, 40px)' }}
                            >
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <ListChecks size={20} style={{ color: 'var(--accent-primary)' }} />
                                    Step 4: Logical Steps
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {store.analysis.logical_steps.map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                            style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16, borderRadius: 14, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
                                        >
                                            <div style={{
                                                width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-gradient)', color: 'white',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0
                                            }}>{i + 1}</div>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step}</p>
                                        </motion.div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
                                    <button className="btn-secondary" onClick={() => store.setStep(3)}><ChevronLeft size={16} /> Back</button>
                                    <button className="btn-primary" onClick={() => store.setStep(5)}>Open Editor <Code2 size={16} /></button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Editor */}
                        {store.analysis && store.currentStep === 5 && (
                            <motion.div key="s5" variants={slide} initial="enter" animate="center" exit="exit"
                                className="glass-card-static" style={{ padding: 'clamp(20px, 4vw, 36px)' }}
                            >
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Code2 size={20} style={{ color: 'var(--accent-primary)' }} />
                                    Step 5: Write Your Code from Scratch
                                </h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                                    You must build your solution entirely on your own without any pre-filled logic templates. Apply the logical steps you just learned.
                                </p>
                                <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-glass)', marginBottom: 16 }}>
                                    <Editor
                                        height="350px"
                                        defaultLanguage="python"
                                        defaultValue=""
                                        theme="vs-dark"
                                        onChange={(v) => {
                                            store.setUserCode(v || '');
                                            if (store.runResult) store.setRunResult(null);
                                            if (store.isSolved) store.setIsSolved(false);
                                        }}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            fontFamily: "'JetBrains Mono', monospace",
                                            padding: { top: 16 },
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            wordWrap: 'on',
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                    <button className="btn-secondary" onClick={() => store.setStep(4)}><ChevronLeft size={16} /> Steps</button>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button className="btn-secondary" onClick={handleRunCode} disabled={isRunning || isEvaluating || !store.userCode.trim()}>
                                            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                                            Run Code
                                        </button>
                                        <button 
                                            className="btn-primary" 
                                            onClick={handleSubmitCode} 
                                            disabled={isEvaluating || isRunning || !store.runResult?.success}
                                            style={{ opacity: store.runResult?.success ? 1 : 0.5 }}
                                        >
                                            {isEvaluating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                            Submit Solution
                                        </button>
                                    </div>
                                </div>
                                
                                <AnimatePresence>
                                    {store.runResult && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ marginTop: 16, overflow: 'hidden' }}
                                        >
                                            <div style={{
                                                padding: 16,
                                                borderRadius: 12,
                                                background: store.runResult.success ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                                                border: `1px solid ${store.runResult.success ? 'var(--success)' : 'var(--error)'}`,
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 12
                                            }}>
                                                {store.runResult.success ? (
                                                    <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                                                ) : (
                                                    <AlertTriangle size={20} style={{ color: 'var(--error)', flexShrink: 0, marginTop: 2 }} />
                                                )}
                                                <div>
                                                    <h4 style={{ 
                                                        fontSize: '0.95rem', 
                                                        fontWeight: 600, 
                                                        color: store.runResult.success ? 'var(--success)' : 'var(--error)',
                                                        marginBottom: 4
                                                    }}>
                                                        {store.runResult.success ? 'Code executed successfully' : 'Your code is incorrect. Try again.'}
                                                    </h4>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                        {store.runResult.success 
                                                            ? 'You can now submit your solution to complete this step.'
                                                            : store.runResult.error_message || 'Syntax or runtime error occurred.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* Step 6 */}
                        {store.analysis && store.currentStep === 6 && store.isSolved && (
                            <motion.div key="s6" variants={slide} initial="enter" animate="center" exit="exit"
                                className="glass-card-static" style={{ padding: 'clamp(24px, 4vw, 40px)', textAlign: 'center' }}
                            >
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }} 
                                    animate={{ scale: 1, opacity: 1 }} 
                                    transition={{ type: 'spring', bounce: 0.5 }}
                                    style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}
                                >
                                    <div style={{ background: 'rgba(46, 213, 115, 0.1)', padding: 20, borderRadius: '50%' }}>
                                        <CheckCircle size={48} style={{ color: 'var(--success)' }} />
                                    </div>
                                </motion.div>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12, color: 'var(--success)' }}>
                                    Problem Solved Successfully!
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1rem' }}>
                                    Excellent work! You've successfully implemented the logic and completed all the necessary checks.
                                </p>
                                
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                                    <button className="btn-secondary" onClick={() => store.setStep(5)}><ChevronLeft size={16} /> Edit Code</button>
                                    <button className="btn-primary" onClick={() => store.setStep(7)} style={{ background: 'var(--accent-primary)', padding: '12px 24px', fontSize: '1rem' }}>
                                        View Overview <Eye size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 7 */}
                        {store.analysis && store.currentStep === 7 && (
                            <motion.div key="s7" variants={slide} initial="enter" animate="center" exit="exit"
                                className="glass-card-static" style={{ padding: 'clamp(24px, 4vw, 40px)' }}
                            >
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Eye size={20} style={{ color: 'var(--accent-primary)' }} /> Step 7: Final Overview
                                </h2>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                                    No full solution code is provided to encourage independent problem-solving. Review your steps here:
                                </p>
                                <div style={{ marginBottom: 24 }}>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: 10 }}>Logical Steps:</h3>
                                    <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        {store.analysis.logical_steps.map((s, i) => (
                                            <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{s}</li>
                                        ))}
                                    </ol>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
                                    <button className="btn-secondary" onClick={() => store.setStep(6)}><ChevronLeft size={16} /> Back</button>
                                    <button className="btn-primary" onClick={() => { store.resetProblem(); setProblemText(''); }}>
                                        Solve Another <Sparkles size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                <style>{`
          .feedback-layout { flex-direction: row; }
          @media (max-width: 640px) {
            .feedback-layout { flex-direction: column !important; align-items: center; }
            .step-label-text { display: none; }
          }
        `}</style>
            </div>
        </div>
    );
}
