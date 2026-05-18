import { create } from 'zustand';

/**
 * Represents the structured AI analysis returned from the backend
 * for a specific coding problem.
 */
interface ProblemAnalysis {
    simple_explanation: string;
    expected_output: string;
    thinking_questions: string[];
    logical_steps: string[];
    code_skeleton: string;
    difficulty: string;
    concepts_used: string[];
}

/**
 * AppState Interface
 * Defines the complete shape of our global application state, handling:
 * 1. Theme (Light/Dark mode)
 * 2. Guided Mode (Strict 8-Step pipeline tracking)
 * 3. Practice Mode (Open sandbox with progressive hints)
 */
interface AppState {
    // ── Theme ─────────────────────────────────────────────────────────
    theme: 'dark' | 'light';
    toggleTheme: () => void;

    // ── Guided Mode State ─────────────────────────────────────────────
    currentStep: number;                // Tracks the user's progress in the 8-step pipeline
    problemId: string | null;           // UUID of the current active problem session
    analysis: ProblemAnalysis | null;   // Full AI breakdown of the problem
    answers: string[];                  // User's answers to the 'thinking questions'
    evaluation: any;                    // AI feedback on the user's thinking reasoning
    runResult: any;                     // Dry-run result for code
    isSolved: boolean;                  // Has the user successfully submitted the code?
    userCode: string;                   // The actual code written in the Monaco editor
    isLoading: boolean;                 // Global loading state for API calls
    error: string | null;               // Global error banner message

    // ── Guided Mode Actions ───────────────────────────────────────────
    setStep: (step: number) => void;
    setProblemId: (id: string) => void;
    setAnalysis: (analysis: ProblemAnalysis) => void;
    setAnswers: (answers: string[]) => void;
    setEvaluation: (evaluation: any) => void;
    setRunResult: (result: any) => void;
    setIsSolved: (solved: boolean) => void;
    setUserCode: (code: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetProblem: () => void;           // Clears the guided mode state entirely

    // ── Practice Mode State & Actions ─────────────────────────────────
    practiceId: string | null;
    practiceExpectedOutput: string | null;
    practiceAnalysis: ProblemAnalysis | null;
    hintsUnlocked: number;              // How many progressive hints (1, 2, or 3) have been revealed
    hintContents: any[];                // Array accumulating the unlocked hint data
    practiceUserCode: string;
    practiceRunResult: any;             // Dry-run result
    practiceIsSolved: boolean;

    setPracticeId: (id: string, expectedOutput?: string) => void;
    setPracticeAnalysis: (analysis: ProblemAnalysis | null) => void;
    unlockHint: (level: number, content: any) => void;
    setPracticeUserCode: (code: string) => void;
    setPracticeRunResult: (result: any) => void;
    setPracticeIsSolved: (solved: boolean) => void;
    resetPractice: () => void;          // Clears the practice mode state entirely
}

/**
 * useStore - Global Zustand Hook
 * Allows any React component in the app to read/write state without prop-drilling.
 */
export const useStore = create<AppState>((set) => ({
    // ── Theme ─────────────────────────────────────────────────────────
    theme: 'dark',
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        // Applying the theme directly to the HTML element allows CSS variable swapping
        document.documentElement.setAttribute('data-theme', newTheme);
        return { theme: newTheme };
    }),

    // ── Guided Mode Default State ─────────────────────────────────────
    currentStep: 1,
    problemId: null,
    analysis: null,
    answers: [],
    evaluation: null,
    runResult: null,
    isSolved: false,
    userCode: '',
    isLoading: false,
    error: null,

    // ── Guided Mode Actions ───────────────────────────────────────────
    setStep: (step) => set({ currentStep: step }),
    setProblemId: (id) => set({ problemId: id }),
    setAnalysis: (analysis) => set({ analysis }),
    setAnswers: (answers) => set({ answers }),
    setEvaluation: (evaluation) => set({ evaluation }),
    setRunResult: (result) => set({ runResult: result }),
    setIsSolved: (solved) => set({ isSolved: solved }),
    setUserCode: (code) => set({ userCode: code }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    resetProblem: () => set({
        currentStep: 1,
        problemId: null,
        analysis: null,
        answers: [],
        evaluation: null,
        runResult: null,
        isSolved: false,
        userCode: '',
        error: null,
    }),

    // ── Practice Mode Default State & Actions ─────────────────────────
    practiceId: null,
    practiceExpectedOutput: null,
    practiceAnalysis: null,
    hintsUnlocked: 0,
    hintContents: [],
    practiceUserCode: '',
    practiceRunResult: null,
    practiceIsSolved: false,

    setPracticeId: (id, expectedOutput) => set({ practiceId: id, practiceExpectedOutput: expectedOutput || null }),
    setPracticeAnalysis: (analysis) => set({ practiceAnalysis: analysis }),

    // Accumulate hints as the user unlocks them
    unlockHint: (level, content) => set((state) => ({
        hintsUnlocked: Math.max(state.hintsUnlocked, level),
        hintContents: [...state.hintContents.slice(0, level - 1), content],
    })),
    setPracticeUserCode: (code) => set({ practiceUserCode: code }),
    setPracticeRunResult: (result) => set({ practiceRunResult: result }),
    setPracticeIsSolved: (solved) => set({ practiceIsSolved: solved }),
    resetPractice: () => set({
        practiceId: null,
        practiceExpectedOutput: null,
        practiceAnalysis: null,
        hintsUnlocked: 0,
        hintContents: [],
        practiceUserCode: '',
        practiceRunResult: null,
        practiceIsSolved: false,
    }),
}));
