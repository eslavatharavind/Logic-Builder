import axios from 'axios';

/**
 * Axios instance configured to point to the FastAPI backend.
 * Uses Vite's proxy in development (see vite.config.ts) to route `/api` requests to `http://localhost:8000`.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 60000, // 60s timeout to allow time for the LLM to process and return analysis
});

// ── Guided Mode (8-Step Pipeline) ─────────────────────────────────

/**
 * Submits a new problem to start the Guided Pipeline.
 * Triggers backend RAG search and initial LLM analysis.
 */
export const submitProblem = (problem_statement: string, language = 'python') =>
    api.post('/problems/submit', { problem_statement, language });

/**
 * Fetches the specific content for the current step in the pipeline.
 * The backend enforces locks, preventing users from viewing future steps early.
 */
export const getStep = (problemId: string, step: number) =>
    api.get(`/problems/${problemId}/step/${step}`);

/**
 * Submits the user's answers to the thinking questions for AI evaluation.
 */
export const submitAnswers = (problemId: string, answers: string[]) =>
    api.post(`/problems/${problemId}/answers`, { problem_id: problemId, answers });

/**
 * Submits the user's final code for AI structural evaluation.
 */
export const submitCode = (problemId: string, userCode: string, language = 'python') =>
    api.post(`/problems/${problemId}/code`, { problem_id: problemId, user_code: userCode, language });


// ── Practice Mode (Open Sandbox) ──────────────────────────────────

/**
 * Starts an open-ended practice session. Analyzes the problem but hides the analysis initially.
 */
export const startPractice = (problem_statement: string, language = 'python') =>
    api.post('/practice/start', { problem_statement, language });

/**
 * Requests a progressive hint (1=Explanation, 2=Questions, 3=Steps).
 * Cost logic (score penalties) is handled entirely by the backend.
 */
export const getHint = (problemId: string, hintLevel: number) =>
    api.post(`/practice/${problemId}/hint`, { problem_id: problemId, hint_level: hintLevel });

/**
 * Runs the user's code for a dry-run check (syntax, runtime, basic output).
 */
export const runCode = (problemId: string, userCode: string, language = 'python') =>
    api.post(`/practice/${problemId}/run`, { problem_id: problemId, user_code: userCode, language });


// ── Analytics ─────────────────────────────────────────────────────

/**
 * Fetches the user's dashboard statistics (total logic score, attempts, streaks).
 */
export const getDashboard = () =>
    api.get('/analytics/dashboard');

export default api;
