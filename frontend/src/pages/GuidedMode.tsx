import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { useStore } from '../store/useStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitProblem, submitAnswers, runCode } from '../services/api';
import {
    Send, ChevronRight, ChevronLeft, Brain, MessageSquare,
    ListChecks, Code2, CheckCircle, Sparkles, Loader2, AlertTriangle, Eye, EyeOff, Play, ChevronDown, ChevronUp
} from 'lucide-react';

// Step 4 (Logical Steps) is now a collapsible panel inside the coding step
const STEP_DISPLAY = [
    { label: 'Explain',   stepNum: 1, Icon: Brain },
    { label: 'Questions', stepNum: 2, Icon: MessageSquare },
    { label: 'Feedback',  stepNum: 3, Icon: Sparkles },
    { label: 'Code',      stepNum: 5, Icon: Code2 },
    { label: 'Complete',  stepNum: 6, Icon: CheckCircle },
    { label: 'Overview',  stepNum: 7, Icon: Eye },
];

const slide = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.35 } },
    exit: { x: -40, opacity: 0, transition: { duration: 0.2 } },
};

export default function GuidedMode() {
    const store = useStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [localAnswers, setLocalAnswers] = useState<string[]>([]);
    const [answerVisible, setAnswerVisible] = useState<boolean[]>([]);
    const [stepsOpen, setStepsOpen] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);

    // Auto-analyze when coming from Home page, or redirect to home if no problem is provided
    useEffect(() => {
        const passedText = (location.state as any)?.problemText;
        if (passedText) {
            (async () => {
                store.setLoading(true);
                store.setError(null);
                try {
                    const res = await submitProblem(passedText);
                    store.setProblemId(res.data.problem_id);
                    store.setAnalysis(res.data.analysis);
                    setLocalAnswers(new Array(res.data.analysis.thinking_questions.length).fill(''));
                    store.setStep(1);
                } catch (err: any) {
                    store.setError(err.response?.data?.detail || 'Failed to analyze problem. Make sure the API key is configured.');
                }
                store.setLoading(false);
            })();
        } else if (!store.analysis) {
            // No active problem and none passed in state -> redirect to home
            navigate('/dashboard');
        } else {
            // Restore active session details from store
            const questionsLength = store.analysis.thinking_questions.length;
            const restoredAnswers = store.answers.length > 0
                ? store.answers
                : new Array(questionsLength).fill('');
            setLocalAnswers(restoredAnswers);
        }
    }, [location.state]);

    // Init answer-reveal toggles when analysis loads
    useEffect(() => {
        if (store.analysis) {
            setAnswerVisible(new Array(store.analysis.thinking_questions.length).fill(false));
        }
    }, [store.analysis]);


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

    const toggleAnswer = (i: number) =>
        setAnswerVisible(prev => { const n = [...prev]; n[i] = !n[i]; return n; });

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
                        {STEP_DISPLAY.map(({ label, stepNum, Icon }, i) => {
                            const isActive = store.currentStep === stepNum;
                            const done = store.currentStep > stepNum;
                            return (
                                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 36 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                                            fontSize: '0.62rem', marginTop: 4,
                                            color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                                            whiteSpace: 'nowrap',
                                        }}>{label}</span>
                                    </div>
                                    {i < STEP_DISPLAY.length - 1 && <div style={{ width: 16, height: 1, background: done ? 'var(--success)' : 'var(--border-glass)', margin: '0 2px', marginBottom: 16 }} />}
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
                        {/* Removed duplicate input area to ensure only one Guide Mode search section exists on the home page */}


                        {/* Step 1 */}
                        {store.analysis && store.currentStep === 1 && (
                            <motion.div key="s1" variants={slide} initial="enter" animate="center" exit="exit"
                                className="glass-card-static" style={{ padding: 'clamp(24px, 4vw, 40px)' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <Brain size={20} style={{ color: 'var(--accent-primary)' }} />
                                        Step 1: What is this problem asking?
                                    </h2>
                                    <span className={`badge badge-${store.analysis.difficulty === 'easy' ? 'success' : store.analysis.difficulty === 'medium' ? 'warning' : 'error'}`}>
                                        {store.analysis.difficulty}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                                    Read this carefully. Make sure you understand what the problem wants before moving on.
                                </p>
                                <div style={{ padding: 20, borderRadius: 14, background: 'rgba(124,92,252,0.04)', border: '1px solid var(--border-glass)', marginBottom: 16 }}>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.94rem' }}>{store.analysis.simple_explanation}</p>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                                    {store.analysis.concepts_used.map((c) => <span key={c} className="badge badge-primary">{c}</span>)}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 16 }}>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => navigate('/dashboard')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '10px 20px',
                                            fontSize: '0.88rem',
                                        }}
                                    >
                                        <ChevronLeft size={16} /> Back to Dashboard
                                    </button>
                                    <button className="btn-primary" onClick={() => store.setStep(2)}>
                                        Next: Answer Questions <ChevronRight size={16} />
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
                                    Step 2: Think It Through
                                </h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                                    Answer each question in your own words. Don't look up answers — just think!
                                </p>

                                {/* Expected Output — shown FIRST */}
                                <div style={{ marginBottom: 20, padding: 16, borderRadius: 14, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Code2 size={16} /> What the output should look like
                                    </h3>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                                        This is the exact output your code needs to produce.
                                    </p>
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

                                {/* Questions with eye-icon reveal */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {store.analysis.thinking_questions.map((q, i) => (
                                        <div key={i} style={{ padding: 16, borderRadius: 14, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                                                <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--accent-primary)', flex: 1 }}>Q{i + 1}: {q}</p>
                                                <button
                                                    onClick={() => toggleAnswer(i)}
                                                    title={answerVisible[i] ? 'Hide hint' : 'Show hint'}
                                                    style={{
                                                        background: 'rgba(124,92,252,0.08)',
                                                        border: '1px solid var(--border-glass)',
                                                        borderRadius: 8,
                                                        padding: '4px 8px',
                                                        cursor: 'pointer',
                                                        color: 'var(--accent-primary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 4,
                                                        fontSize: '0.75rem',
                                                        flexShrink: 0,
                                                        transition: 'all 0.2s',
                                                    }}
                                                >
                                                    {answerVisible[i] ? <EyeOff size={13} /> : <Eye size={13} />}
                                                    {answerVisible[i] ? 'Hide' : 'Hint'}
                                                </button>
                                            </div>
                                            <textarea
                                                className="input-field"
                                                placeholder="Write your answer here..."
                                                value={localAnswers[i] || ''}
                                                onChange={(e) => {
                                                    const a = [...localAnswers];
                                                    a[i] = e.target.value;
                                                    setLocalAnswers(a);
                                                    store.setAnswers(a);
                                                }}
                                                rows={2}
                                                style={{ minHeight: 80 }}
                                            />
                                            <AnimatePresence>
                                                {answerVisible[i] && store.analysis && store.analysis.logical_steps[i] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        style={{ overflow: 'hidden', marginTop: 10 }}
                                                    >
                                                        <div style={{
                                                            padding: '10px 14px',
                                                            borderRadius: 10,
                                                            background: 'rgba(124,92,252,0.07)',
                                                            border: '1px solid rgba(124,92,252,0.2)',
                                                        }}>
                                                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>💡 Hint:</p>
                                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                                                {store.analysis.logical_steps[i]}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
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
                                    <button className="btn-primary" onClick={() => store.setStep(5)}>Start Coding <ChevronRight size={16} /></button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4 removed — logical steps are now inside the coding panel below */}


                        {/* Step 5: Editor */}
                        {store.analysis && store.currentStep === 5 && (
                            <motion.div key="s5" variants={slide} initial="enter" animate="center" exit="exit"
                                className="glass-card-static" style={{ padding: 'clamp(20px, 4vw, 36px)' }}
                            >
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Code2 size={20} style={{ color: 'var(--accent-primary)' }} />
                                    Write Your Code
                                </h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                                    Write your solution from scratch. Use the steps below if you need a reminder.
                                </p>
                                <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-glass)', marginBottom: 16 }}>
                                    <Editor
                                        height="350px"
                                        defaultLanguage="python"
                                        value={store.userCode}
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

                                {/* Run & Submit buttons */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                    <button className="btn-secondary" onClick={() => store.setStep(3)}><ChevronLeft size={16} /> Back</button>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button className="btn-secondary" onClick={handleRunCode} disabled={isRunning || isEvaluating || !store.userCode.trim()}>
                                            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                                            Run
                                        </button>
                                        <button
                                            className="btn-primary"
                                            onClick={handleSubmitCode}
                                            disabled={isEvaluating || isRunning || !store.runResult?.success}
                                            style={{ opacity: store.runResult?.success ? 1 : 0.5 }}
                                        >
                                            {isEvaluating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                            Submit
                                        </button>
                                    </div>
                                </div>

                                {/* Run result feedback */}
                                <AnimatePresence>
                                    {store.runResult && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ marginTop: 16, overflow: 'hidden' }}
                                        >
                                            <div style={{
                                                padding: 16, borderRadius: 12,
                                                background: store.runResult.success ? 'rgba(46, 213, 115, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                                                border: `1px solid ${store.runResult.success ? 'var(--success)' : 'var(--error)'}`,
                                                display: 'flex', alignItems: 'flex-start', gap: 12
                                            }}>
                                                {store.runResult.success ? (
                                                    <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                                                ) : (
                                                    <AlertTriangle size={20} style={{ color: 'var(--error)', flexShrink: 0, marginTop: 2 }} />
                                                )}
                                                <div>
                                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: store.runResult.success ? 'var(--success)' : 'var(--error)', marginBottom: 4 }}>
                                                        {store.runResult.success ? '✓ Looks good! Now hit Submit.' : 'Not quite right. Check your code.'}
                                                    </h4>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                        {store.runResult.success
                                                            ? 'Your code produced the correct output.'
                                                            : store.runResult.error_message || 'There is a syntax or logic error.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Collapsible: View Logical Steps */}
                                <div style={{ marginTop: 20 }}>
                                    <button
                                        onClick={() => setStepsOpen(o => !o)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '12px 16px',
                                            borderRadius: 12,
                                            background: 'var(--bg-glass)',
                                            border: '1px solid var(--border-glass)',
                                            cursor: 'pointer',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.88rem',
                                            fontWeight: 500,
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <ListChecks size={16} style={{ color: 'var(--accent-primary)' }} />
                                            {stepsOpen ? 'Hide' : 'Show'} step-by-step guide
                                        </span>
                                        {stepsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    <AnimatePresence>
                                        {stepsOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                    {store.analysis.logical_steps.map((step, i) => (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 12, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
                                                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                                                            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
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
                                    <button className="btn-primary" onClick={() => { store.resetProblem(); }}>
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
