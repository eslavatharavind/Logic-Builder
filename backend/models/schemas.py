"""Pydantic models for request/response schemas."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


# ── Enums ──────────────────────────────────────────────────────────────
class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


# ── AI Structured Output ──────────────────────────────────────────────
class ProblemAnalysis(BaseModel):
    simple_explanation: str
    expected_output: str
    thinking_questions: list[str]
    logical_steps: list[str]
    code_skeleton: Optional[str] = None
    difficulty: Difficulty
    concepts_used: list[str]


# ── Request Models ────────────────────────────────────────────────────
class ProblemSubmitRequest(BaseModel):
    problem_statement: str = Field(..., min_length=10, max_length=5000)
    language: str = Field(default="python", pattern="^(python|javascript|java|cpp|typescript)$")


class AnswerSubmitRequest(BaseModel):
    problem_id: str
    answers: list[str]


class CodeSubmitRequest(BaseModel):
    problem_id: str
    user_code: str
    language: str = "python"


class HintRequest(BaseModel):
    problem_id: str
    hint_level: int = Field(..., ge=1, le=3)


# ── Response Models ───────────────────────────────────────────────────
class StepResponse(BaseModel):
    step: int
    content: dict
    can_proceed: bool = True
    message: str = ""


class EvaluationResponse(BaseModel):
    score: int = Field(..., ge=0, le=100)
    feedback: str
    missing_concepts: list[str] = []
    strengths: list[str] = []
    suggestions: list[str] = []
    reveal_solution: bool = False

class RunCodeResponse(BaseModel):
    success: bool
    error_message: str = ""


class HintResponse(BaseModel):
    hint_level: int
    content: str | dict | list
    score_penalty: int
    remaining_hints: int


class ProblemResponse(BaseModel):
    problem_id: str
    status: str
    analysis: Optional[ProblemAnalysis] = None
    expected_output: Optional[str] = None
    current_step: int = 1


class AnalyticsResponse(BaseModel):
    total_problems: int = 0
    success_rate: float = 0.0
    hint_dependency: float = 0.0
    avg_reasoning_score: float = 0.0
    weak_concepts: list[str] = []
    daily_streak: int = 0
    recent_activity: list[dict] = []
    concept_scores: dict[str, float] = {}


# ── Knowledge Base Models ─────────────────────────────────────────────
class KnowledgePattern(BaseModel):
    pattern_name: str
    description: str
    step_breakdown: list[str]
    code_template: str
    tags: list[str]
    embedding: Optional[list[float]] = None
