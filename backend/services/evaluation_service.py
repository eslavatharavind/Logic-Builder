"""Evaluation Service – Manages problem state and user progress via Persistent Database."""

import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict
from sqlalchemy import select, update, desc
from sqlalchemy.ext.asyncio import AsyncSession
from models.db_models import Problem, Attempt, UserStats
from database import AsyncSessionLocal

async def create_problem(problem_statement: str, analysis: dict, mode: str = "guided") -> str:
    """Create a new problem session and return problem_id."""
    problem_id = str(uuid.uuid4())[:8]
    async with AsyncSessionLocal() as session:
        new_problem = Problem(
            id=problem_id,
            problem_statement=problem_statement,
            analysis=analysis,
            mode=mode,
            created_at=datetime.now(timezone.utc)
        )
        session.add(new_problem)
        
        # Track streak (update stats)
        stats = await get_or_create_stats(session)
        stats.total_problems += 1
        _track_streak(stats)
        
        await session.commit()
    return problem_id

async def get_problem(problem_id: str) -> Optional[dict]:
    """Get a problem by ID (returns as dict for route compatibility)."""
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Problem).where(Problem.id == problem_id))
        problem = result.scalars().first()
        if not problem:
            return None
        return {
            "id": problem.id,
            "problem_statement": problem.problem_statement,
            "analysis": problem.analysis,
            "current_step": problem.current_step,
            "mode": problem.mode,
            "created_at": problem.created_at.isoformat() if problem.created_at else None
        }

async def advance_step(problem_id: str, step: int) -> bool:
    """Advance to the next step."""
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Problem).where(Problem.id == problem_id))
        problem = result.scalars().first()
        if problem and step >= problem.current_step:
            problem.current_step = step
            await session.commit()
            return True
    return False

async def save_evaluation(problem_id: str, evaluation: dict) -> None:
    """Save thinking question evaluation results (Attempt)."""
    async with AsyncSessionLocal() as session:
        # Create an attempt record
        new_attempt = Attempt(
            problem_id=problem_id,
            step=1, # Thinking questions are step 1
            score=evaluation.get("score", 0),
            feedback=evaluation.get("feedback", ""),
            created_at=datetime.now(timezone.utc)
        )
        session.add(new_attempt)
        
        # Update problem state
        result = await session.execute(select(Problem).where(Problem.id == problem_id))
        problem = result.scalars().first()
        
        # Update user stats
        stats = await get_or_create_stats(session)
        score = evaluation.get("score", 0)
        stats.total_score += score
        
        # Update concept performance
        concepts = problem.analysis.get("concepts_used", []) if problem and problem.analysis else []
        concept_stats = stats.concept_stats or {}
        for concept in concepts:
            if concept not in concept_stats:
                concept_stats[concept] = {"attempts": 0, "total_score": 0}
            concept_stats[concept]["attempts"] += 1
            concept_stats[concept]["total_score"] += score
        stats.concept_stats = concept_stats
        
        await session.commit()

async def save_code_evaluation(problem_id: str, evaluation: dict, user_code: str) -> None:
    """Save code evaluation results."""
    async with AsyncSessionLocal() as session:
        new_attempt = Attempt(
            problem_id=problem_id,
            step=8, # Code is step 8
            score=evaluation.get("score", 0),
            feedback=evaluation.get("feedback", ""),
            user_code=user_code,
            created_at=datetime.now(timezone.utc)
        )
        session.add(new_attempt)
        
        stats = await get_or_create_stats(session)
        if evaluation.get("score", 0) >= 70:
            stats.successful += 1
        
        await session.commit()

async def use_hint(problem_id: str) -> None:
    """Record hint usage."""
    async with AsyncSessionLocal() as session:
        stats = await get_or_create_stats(session)
        stats.hints_used += 1
        stats.total_hints_available += 3 # Standard 3 hints per problem
        await session.commit()

async def get_analytics() -> dict:
    """Get user analytics summary from DB."""
    async with AsyncSessionLocal() as session:
        stats = await get_or_create_stats(session)
        
        total = stats.total_problems
        successful = stats.successful
        total_score = stats.total_score
        hints_used = stats.hints_used
        
        concept_scores = {}
        weak_concepts = []
        for concept, data in (stats.concept_stats or {}).items():
            avg = data["total_score"] / max(data["attempts"], 1)
            concept_scores[concept] = round(avg, 1)
            if avg < 60:
                weak_concepts.append(concept)
        
        # History
        result = await session.execute(
            select(Problem)
            .order_by(desc(Problem.created_at))
            .limit(10)
        )
        recent_problems = result.scalars().all()
        
        recent_activity = []
        for p in recent_problems:
            # Get latest attempt score for this problem
            att_res = await session.execute(
                select(Attempt)
                .where(Attempt.problem_id == p.id)
                .order_by(desc(Attempt.created_at))
            )
            latest_att = att_res.scalars().first()
            recent_activity.append({
                "problem_id": p.id,
                "step": p.current_step,
                "score": latest_att.score if latest_att else None,
                "created_at": p.created_at.isoformat() if p.created_at else None
            })

        return {
            "total_problems": total,
            "success_rate": round((successful / max(total, 1)) * 100, 1),
            "hint_dependency": round((hints_used / max(total * 5, 1)) * 100, 1),
            "avg_reasoning_score": round(total_score / max(total, 1), 1),
            "weak_concepts": weak_concepts,
            "daily_streak": _calculate_streak(stats),
            "recent_activity": recent_activity,
            "concept_scores": concept_scores,
        }

async def get_or_create_stats(session: AsyncSession) -> UserStats:
    """Get or create singleton UserStats."""
    result = await session.execute(select(UserStats).where(UserStats.id == 1))
    stats = result.scalars().first()
    if not stats:
        stats = UserStats(id=1)
        session.add(stats)
        await session.flush()
    return stats

def _track_streak(stats: UserStats):
    """Track daily practice streak."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    streak_dates = list(stats.streak_dates or [])
    if today not in streak_dates:
        streak_dates.append(today)
        stats.streak_dates = streak_dates

def _calculate_streak(stats: UserStats) -> int:
    """Calculate current daily streak."""
    dates = sorted(stats.streak_dates or [], reverse=True)
    if not dates:
        return 0
    streak = 1
    for i in range(1, len(dates)):
        from datetime import datetime as dt, timedelta
        current = dt.strptime(dates[i-1], "%Y-%m-%d")
        prev = dt.strptime(dates[i], "%Y-%m-%d")
        if (current - prev).days == 1:
            streak += 1
        else:
            break
    return streak
