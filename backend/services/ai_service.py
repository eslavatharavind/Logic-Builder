"""AI Service – LLM integration for structured problem analysis."""

import json
import re
from config import settings
from models.schemas import ProblemAnalysis


SYSTEM_PROMPT = """You are LogicBuilder AI – a structured thinking trainer for programmers.
You MUST return ONLY valid JSON. No markdown, no code fences, no explanation outside JSON.

Given a programming problem and relevant algorithm patterns, analyze the problem and return:
{
  "simple_explanation": "A VERY SIMPLE, plain-English explanation of what the problem asks. Explain it like the user is a beginner. Use short sentences and easy words.",
  "expected_output": "Provide an example input and the expected output for the problem.",
  "thinking_questions": [
    "What information do I have at the start?",
    "What result should I show at the end?",
    "Do I need to repeat any steps (loops)?",
    "Do I need to make any choices (if-statement)?",
    "What are the main things I need to remember (variables)?"
  ],
  "logical_steps": ["Take 3 numbers", "Compare first number with others", "Compare second number", "Else third number is largest", "Print result"],
  "difficulty": "easy|medium|hard",
  "concepts_used": ["arrays", "loops", ...]
}

Rules:
- simple_explanation MUST be extremely easy to read. AVOID heavy technical jargon.
- expected_output MUST clearly show an example input and the resulting expected output.
- thinking_questions MUST EXACTLY be the 5 questions listed above. DO NOT CHANGE THEM.
- logical_steps MUST be ultra-simple, beginner-friendly instructions, acting as a guide section according to the question. Do NOT prefix with 'Step 1:' etc., just the action (e.g. "Take 3 numbers", "Compare first number with others").
- NEVER reveal the solution directly
- ALWAYS return valid JSON only
"""

EVALUATION_PROMPT = """You are a reasoning evaluation agent for LogicBuilder.
Evaluate the user's answers to thinking questions about a programming problem.

You MUST return ONLY valid JSON:
{
  "score": 0-100,
  "feedback": "Overall simple feedback string",
  "missing_concepts": ["concept1", ...],
  "strengths": ["strength1", ...],
  "suggestions": ["Easy to understand suggestion1", ...]
}

Rules:
- Use VERY SIMPLE, encouraging, and beginner-friendly language
- Avoid heavy technical jargon. Explain things simply.
- Identify gaps in reasoning without revealing the solution
- Give specific, actionable, and easy-to-understand feedback
- NEVER reveal the solution approach
"""

CODE_EVAL_PROMPT = """You are a code structure evaluation agent for LogicBuilder.
Compare the user's code structure against the expected logical steps.

You MUST return ONLY valid JSON:
{
  "score": 0-100,
  "feedback": "Overall feedback",
  "missing_concepts": ["missed pattern/step"],
  "strengths": ["what user did well"],
  "suggestions": ["improvement suggestion"],
  "reveal_solution": false
}

Rules:
- Evaluate code STRUCTURE and LOGIC, not syntax
- Check if logical steps are reflected in the code
- Don't penalize for different but valid approaches
- Only set reveal_solution to true if score >= 80
"""

RUN_CODE_PROMPT = """You are a code execution engine for LogicBuilder.
Check the user's code for syntax errors, runtime errors, and basic output correctness based on the problem.

You MUST return ONLY valid JSON:
{
  "success": true,
  "error_message": "A simple string explaining the syntax/runtime/logic error if success is false. If success is true, leave empty."
}

Rules:
- If there are syntax errors, point them out simply.
- If it would fail at runtime, explain why simply.
- If the logic/output is fundamentally wrong for the given problem, fail it and explain simply.
- DO NOT reveal the solution. Just point out the error in the code.
- If the code seems generally correct and runnable, set success: true.
"""


def _extract_json(text: str) -> dict:
    """Extract JSON from LLM response, handling markdown fences."""
    text = text.strip()
    # Remove markdown code fences
    fence_match = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', text, re.DOTALL)
    if fence_match:
        text = fence_match.group(1).strip()
    # Try parsing
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find JSON object in text
        obj_match = re.search(r'\{.*\}', text, re.DOTALL)
        if obj_match:
            return json.loads(obj_match.group(0))
        raise ValueError(f"Could not extract JSON from LLM response: {text[:200]}")


async def _call_gemini(system: str, user_prompt: str) -> dict:
    """Call Google Gemini API."""
    import google.generativeai as genai
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(
        "gemini-1.5-flash",
        system_instruction=system,
    )
    response = model.generate_content(user_prompt)
    return _extract_json(response.text)


async def _call_openai(system: str, user_prompt: str) -> dict:
    """Call OpenAI API."""
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=settings.openai_api_key)
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )
    return json.loads(response.choices[0].message.content)


async def _call_groq(system: str, user_prompt: str) -> dict:
    """Call Groq API."""
    from openai import AsyncOpenAI
    client = AsyncOpenAI(
        api_key=settings.groq_api_key,
        base_url="https://api.groq.com/openai/v1",
    )
    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )
    return json.loads(response.choices[0].message.content)


async def _call_llm(system: str, user_prompt: str) -> dict:
    """Route to the configured AI provider."""
    provider = settings.ai_provider.lower()
    if provider == "gemini":
        return await _call_gemini(system, user_prompt)
    elif provider == "openai":
        return await _call_openai(system, user_prompt)
    elif provider == "groq":
        return await _call_groq(system, user_prompt)
    else:
        raise ValueError(f"Unknown AI provider: {provider}")


async def analyze_problem(problem: str, context: list[dict] = None) -> ProblemAnalysis:
    """Analyze a programming problem and return structured breakdown."""
    context_str = ""
    if context:
        context_str = "\n\nRelevant Algorithm Patterns:\n"
        for c in context:
            context_str += f"\n- {c.get('pattern_name', '')}: {c.get('description', '')}"
            if c.get('step_breakdown'):
                context_str += f"\n  Steps: {', '.join(c['step_breakdown'])}"

    prompt = f"Problem:\n{problem}{context_str}"
    result = await _call_llm(SYSTEM_PROMPT, prompt)
    return ProblemAnalysis(**result)


async def evaluate_answers(problem: str, questions: list[str], answers: list[str]) -> dict:
    """Evaluate user's answers to thinking questions."""
    prompt = f"""Problem: {problem}

Thinking Questions and User Answers:
"""
    for i, (q, a) in enumerate(zip(questions, answers), 1):
        prompt += f"\nQ{i}: {q}\nA{i}: {a}\n"

    return await _call_llm(EVALUATION_PROMPT, prompt)


async def evaluate_code(problem: str, logical_steps: list[str], user_code: str) -> dict:
    """Evaluate user's code against expected logical steps."""
    steps_str = "\n".join(f"{i+1}. {s}" for i, s in enumerate(logical_steps))
    prompt = f"""Problem: {problem}

Expected Logical Steps:
{steps_str}

User's Code:
```
{user_code}
```
"""
    return await _call_llm(CODE_EVAL_PROMPT, prompt)


async def run_code_check(problem: str, user_code: str) -> dict:
    """Perform a dry-run check of the user's code for basic correctness."""
    prompt = f"Problem: {problem}\n\nUser's Code:\n```\n{user_code}\n```"
    return await _call_llm(RUN_CODE_PROMPT, prompt)
