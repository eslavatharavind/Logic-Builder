"""
Practice Mode API – Progressive hint unlocking.

This module handles the open-ended "Practice Mode" where users submit a problem 
and can progressively unlock hints (explanations, questions, steps) at the cost of score penalties.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import HintRequest, HintResponse, ProblemSubmitRequest, ProblemResponse, CodeSubmitRequest, RunCodeResponse
from services import ai_service, rag_service, evaluation_service

router = APIRouter(prefix="/api/practice", tags=["practice"])

# Points deducted from the user's logic score for using each level of hint
HINT_SCORE_PENALTIES = {1: 5, 2: 10, 3: 15}


@router.post("/start", response_model=ProblemResponse)
async def start_practice(req: ProblemSubmitRequest):
    """
    Start a practice session.
    
    Workflow:
    1. Searches the RAG knowledge base for similar algorithmic patterns.
    2. Sends the problem and similar patterns to the AI coach to generate a structured analysis.
    3. Saves the problem and its full AI analysis to the database.
    4. Returns only the basic problem info to the frontend (hiding the analysis until explicitly requested/unlocked).
    """
    try:
        similar = await rag_service.search_similar(req.problem_statement, top_k=5)
        analysis = await ai_service.analyze_problem(req.problem_statement, similar)

        problem_id = await evaluation_service.create_problem(
            req.problem_statement,
            analysis.model_dump(),
            mode="practice"
        )

        problem = await evaluation_service.get_problem(problem_id)
        problem["mode"] = "practice"

        return ProblemResponse(
            problem_id=problem_id,
            status="practice_started",
            current_step=0,
            expected_output=analysis.expected_output
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{problem_id}/hint", response_model=HintResponse)
async def get_hint(problem_id: str, req: HintRequest):
    """
    Get a progressive hint for a specific problem.
    
    Users must unlock hints sequentially (Level 1 -> 2 -> 3).
    Unlocking a new hint applies a score penalty.
    Requesting an already unlocked hint returns it for free.
    """
    problem = await evaluation_service.get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    analysis = problem["analysis"]
    current_hints = problem.get("hints_used", 0)

    # Enforce sequential unlocking
    if req.hint_level > current_hints + 1:
        raise HTTPException(
            status_code=400,
            detail=f"You must unlock hint {current_hints + 1} first.",
        )

    # Return already unlocked hint without applying a penalty
    if req.hint_level <= current_hints:
        content = _get_hint_content(analysis, req.hint_level)
        return HintResponse(
            hint_level=req.hint_level,
            content=content,
            score_penalty=0,
            remaining_hints=3 - current_hints,
        )

    # Unlock a new hint and apply the score penalty
    await evaluation_service.use_hint(problem_id)
    penalty = HINT_SCORE_PENALTIES.get(req.hint_level, 10)
    content = _get_hint_content(analysis, req.hint_level)

    return HintResponse(
        hint_level=req.hint_level,
        content=content,
        score_penalty=penalty,
        remaining_hints=3 - req.hint_level,
    )


def _get_hint_content(analysis: dict, level: int) -> dict | str | list:
    """
    Helper function to extract the appropriate section of the AI analysis based on the hint level.
    Level 1: Plain English Explanation
    Level 2: Guiding Thinking Questions
    Level 3: Step-by-Step Logical Framework
    """
    if level == 1:
        return {"type": "explanation", "content": analysis["simple_explanation"]}
    elif level == 2:
        return {"type": "questions", "content": analysis["thinking_questions"]}
    elif level == 3:
        return {"type": "steps", "content": analysis["logical_steps"]}
    return "No hint available"


@router.post("/{problem_id}/run", response_model=RunCodeResponse)
async def run_practice_code(problem_id: str, req: CodeSubmitRequest):
    """
    Run user's code to check for basic correctness, syntax, and runtime errors.
    """
    problem = await evaluation_service.get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    try:
        result = await ai_service.run_code_check(problem["problem_statement"], req.user_code)
        return RunCodeResponse(
            success=result.get("success", False),
            error_message=result.get("error_message", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

