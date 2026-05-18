"""
Problems API – Guided mode endpoints.

This module handles the core "Guided Mode" workflow (The 8-Step Pipeline).
It manages the step-by-step progression of a user from initial problem submission,
through reasoning evaluation, step generation, and final code evaluation.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import (
    ProblemSubmitRequest, AnswerSubmitRequest, CodeSubmitRequest,
    StepResponse, EvaluationResponse, ProblemResponse,
)
from services import ai_service, rag_service, evaluation_service

router = APIRouter(prefix="/api/problems", tags=["problems"])


@router.post("/submit", response_model=ProblemResponse)
async def submit_problem(req: ProblemSubmitRequest):
    """
    Submit a new problem to start the Guided Mode pipeline (Step 1).
    
    Workflow:
    1. Searches the RAG knowledge base for similar algorithmic patterns.
    2. Sends the problem and similar patterns to the AI coach to generate a fully structured 8-step analysis.
    3. Saves the problem and its full AI analysis to the database.
    4. Returns the initial step data to the frontend.
    """
    try:
        # 1. Generate embedding and search for similar patterns
        similar = await rag_service.search_similar(req.problem_statement, top_k=5)

        # 2. Pass to LLM with RAG context
        analysis = await ai_service.analyze_problem(req.problem_statement, similar)

        # 3. Create problem session
        problem_id = await evaluation_service.create_problem(
            req.problem_statement,
            analysis.model_dump(),
        )

        return ProblemResponse(
            problem_id=problem_id,
            status="analyzed",
            analysis=analysis,
            current_step=1,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/{problem_id}/step/{step}", response_model=StepResponse)
async def get_step(problem_id: str, step: int):
    """
    Retrieve specifically locked/unlocked content for a given step in the 8-step pipeline.
    
    This endpoint enforces the "Think Before You Code" philosophy by withholding
    subsequent steps (like the code skeleton or full solution) until the user has
    completed prerequisites (like submitting their thinking answers or code).
    """
    problem = await evaluation_service.get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    analysis = problem["analysis"]

    # Step 1: Show the plain-English problem explanation
    if step == 1:
        return StepResponse(
            step=1,
            content={"simple_explanation": analysis["simple_explanation"]},
            can_proceed=True,
            message="Read the simplified explanation carefully before proceeding.",
        )
    # Step 2: Show guiding questions that the user must answer
    elif step == 2:
        await evaluation_service.advance_step(problem_id, 2)
        return StepResponse(
            step=2,
            content={"thinking_questions": analysis["thinking_questions"]},
            can_proceed=False, # User must submit answers to proceed
            message="Answer ALL thinking questions before you can proceed.",
        )
    # Step 3: Show AI feedback on the submitted answers
    elif step == 3:
        if not problem.get("answers_submitted"):
            return StepResponse(
                step=3,
                content={},
                can_proceed=False,
                message="Please submit your answers to thinking questions first.",
            )
        return StepResponse(
            step=3,
            content={"evaluation": problem["evaluation"]},
            can_proceed=True,
            message="Review the feedback on your reasoning.",
        )
    # Step 4: Show the logical step-by-step algorithmic breakdown
    elif step == 4:
        await evaluation_service.advance_step(problem_id, 4)
        return StepResponse(
            step=4,
            content={"logical_steps": analysis["logical_steps"]},
            can_proceed=True,
            message="Study these logical steps carefully.",
        )
    # Step 5: Provide a syntax skeleton without the actual logic implementation
    elif step == 5:
        await evaluation_service.advance_step(problem_id, 5)
        return StepResponse(
            step=5,
            content={
                "code_skeleton": analysis["code_skeleton"],
                "language": "python",
            },
            can_proceed=True,
            message="Write your implementation using this skeleton.",
        )
    # Step 6: Present the code editor for the user to write their solution
    elif step == 6:
        return StepResponse(
            step=6,
            content={"code_skeleton": analysis["code_skeleton"]},
            can_proceed=False, # User must submit code to proceed
            message="Submit your code when ready.",
        )
    # Step 7: Show AI feedback specifically evaluating the user's code structure
    elif step == 7:
        if not problem.get("code_submitted"):
            return StepResponse(
                step=7,
                content={},
                can_proceed=False,
                message="Please submit your code first.",
            )
        return StepResponse(
            step=7,
            content={"code_evaluation": problem["code_evaluation"]},
            can_proceed=True,
            message="Review your code evaluation.",
        )
    # Step 8: Reveal the ultimate, idealized solution
    elif step == 8:
        await evaluation_service.advance_step(problem_id, 8)
        return StepResponse(
            step=8,
            content={
                "solution": analysis.get("code_skeleton", ""),
                "logical_steps": analysis["logical_steps"],
                "concepts": analysis["concepts_used"],
            },
            can_proceed=True,
            message="Here is the complete solution for reference.",
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid step number")


@router.post("/{problem_id}/answers", response_model=EvaluationResponse)
async def submit_answers(problem_id: str, req: AnswerSubmitRequest):
    """
    Submit textual answers to the thinking questions for AI evaluation (Step 3).
    The AI scores the reasoning and flags missing edge cases.
    """
    problem = await evaluation_service.get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    analysis = problem["analysis"]

    try:
        # Ask Gemini to score the user's reasoning against the known problem requirements
        evaluation = await ai_service.evaluate_answers(
            problem["problem_statement"],
            analysis["thinking_questions"],
            req.answers,
        )

        await evaluation_service.save_evaluation(problem_id, evaluation)
        await evaluation_service.advance_step(problem_id, 3)

        return EvaluationResponse(**evaluation)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")


@router.post("/{problem_id}/code", response_model=EvaluationResponse)
async def submit_code(problem_id: str, req: CodeSubmitRequest):
    """
    Submit user-written code for structural evaluation (Step 7).
    The AI checks if the code follows the agreed-upon logical steps, rather than just compiling it.
    """
    problem = await evaluation_service.get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    analysis = problem["analysis"]

    try:
        # Ask Gemini to verify the code logic matches the optimal structural breakdown
        evaluation = await ai_service.evaluate_code(
            problem["problem_statement"],
            analysis["logical_steps"],
            req.user_code,
        )

        await evaluation_service.save_code_evaluation(problem_id, evaluation, req.user_code)
        await evaluation_service.advance_step(problem_id, 7)

        return EvaluationResponse(**evaluation)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code evaluation failed: {str(e)}")
