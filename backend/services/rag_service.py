"""RAG Service – Vector knowledge base operations with in-memory fallback."""

import json
import hashlib
from typing import Optional
from config import settings

# ── In-Memory Knowledge Base (fallback when Supabase is not configured) ──
KNOWLEDGE_BASE: list[dict] = []


def _simple_embedding(text: str) -> list[float]:
    """Generate a deterministic pseudo-embedding for similarity matching.
    Uses character frequency analysis for a lightweight vector representation.
    For production, replace with OpenAI/Gemini embeddings.
    """
    text = text.lower().strip()
    # Create a 64-dimensional vector from text features
    vec = [0.0] * 64
    for i, ch in enumerate(text):
        idx = ord(ch) % 64
        vec[idx] += 1.0 / (1 + i * 0.01)
    # Normalize
    magnitude = sum(v * v for v in vec) ** 0.5
    if magnitude > 0:
        vec = [v / magnitude for v in vec]
    return vec


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    """Compute cosine similarity between two vectors."""
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = sum(x * x for x in a) ** 0.5
    mag_b = sum(x * x for x in b) ** 0.5
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)


async def generate_embedding(text: str) -> list[float]:
    """Generate embedding for text. Uses simple embedding by default."""
    if settings.ai_provider == "openai" and settings.openai_api_key:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=settings.openai_api_key)
            response = await client.embeddings.create(
                model="text-embedding-3-small",
                input=text,
            )
            return response.data[0].embedding
        except Exception:
            pass
    return _simple_embedding(text)


async def add_pattern(pattern: dict) -> None:
    """Add a knowledge pattern to the vector store."""
    text = f"{pattern['pattern_name']} {pattern['description']} {' '.join(pattern.get('tags', []))}"
    embedding = await generate_embedding(text)
    pattern['embedding'] = embedding
    KNOWLEDGE_BASE.append(pattern)

    # Also try storing in Supabase if configured
    if settings.supabase_url and settings.supabase_key:
        try:
            from supabase import create_client
            client = create_client(settings.supabase_url, settings.supabase_key)
            client.table("vector_knowledge_base").insert({
                "pattern_name": pattern["pattern_name"],
                "description": pattern["description"],
                "step_breakdown": json.dumps(pattern.get("step_breakdown", [])),
                "code_template": pattern.get("code_template", ""),
                "tags": json.dumps(pattern.get("tags", [])),
                "embedding": json.dumps(embedding),
            }).execute()
        except Exception:
            pass  # Fallback to in-memory


async def search_similar(query: str, top_k: int = 5) -> list[dict]:
    """Search for similar patterns using vector similarity."""
    query_embedding = await generate_embedding(query)

    # In-memory search
    results = []
    for pattern in KNOWLEDGE_BASE:
        if pattern.get('embedding'):
            sim = _cosine_similarity(query_embedding, pattern['embedding'])
            results.append((sim, pattern))

    results.sort(key=lambda x: x[0], reverse=True)
    return [
        {k: v for k, v in p.items() if k != 'embedding'}
        for _, p in results[:top_k]
    ]


async def seed_knowledge_base() -> int:
    """Seed the knowledge base with algorithm patterns. Returns count."""
    patterns = _get_seed_patterns()
    for pattern in patterns:
        await add_pattern(pattern)
    return len(patterns)


def _get_seed_patterns() -> list[dict]:
    """Return seed algorithm patterns for the knowledge base."""
    return [
        {
            "pattern_name": "Linear Search",
            "description": "Iterate through each element to find a target value",
            "step_breakdown": [
                "Start from the first element",
                "Compare current element with target",
                "If match found, return index",
                "If not, move to next element",
                "If end reached, target not found",
            ],
            "code_template": "def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1",
            "tags": ["search", "array", "linear", "beginner"],
        },
        {
            "pattern_name": "Binary Search",
            "description": "Efficiently search a sorted array by repeatedly dividing the search interval in half",
            "step_breakdown": [
                "Ensure the array is sorted",
                "Set low and high pointers",
                "Calculate mid point",
                "Compare mid element with target",
                "Narrow search to left or right half",
                "Repeat until found or low > high",
            ],
            "code_template": "def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1",
            "tags": ["search", "binary", "sorted", "divide-conquer", "intermediate"],
        },
        {
            "pattern_name": "Bubble Sort",
            "description": "Repeatedly swap adjacent elements if they are in the wrong order",
            "step_breakdown": [
                "Start from the first pair",
                "Compare adjacent elements",
                "Swap if left > right",
                "Move to next pair",
                "Repeat passes until no swaps needed",
                "Array is sorted",
            ],
            "code_template": "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr",
            "tags": ["sort", "bubble", "comparison", "beginner"],
        },
        {
            "pattern_name": "Two Pointer Technique",
            "description": "Use two pointers moving toward each other or in the same direction to solve array problems",
            "step_breakdown": [
                "Initialize two pointers (start and end, or both at start)",
                "Define the condition for moving each pointer",
                "Process elements at pointer positions",
                "Move pointers based on the condition",
                "Continue until pointers meet or cross",
            ],
            "code_template": "def two_pointer(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        current_sum = arr[left] + arr[right]\n        if current_sum == target:\n            return [left, right]\n        elif current_sum < target:\n            left += 1\n        else:\n            right -= 1\n    return []",
            "tags": ["two-pointer", "array", "sorted", "intermediate"],
        },
        {
            "pattern_name": "Sliding Window",
            "description": "Maintain a window of elements that slides across the array to find optimal subarrays",
            "step_breakdown": [
                "Define window size or condition",
                "Initialize window with first elements",
                "Track window state (sum, count, etc.)",
                "Slide window right by adding new element",
                "Remove leftmost element from window",
                "Update result if current window is better",
            ],
            "code_template": "def sliding_window(arr, k):\n    window_sum = sum(arr[:k])\n    max_sum = window_sum\n    for i in range(k, len(arr)):\n        window_sum += arr[i] - arr[i-k]\n        max_sum = max(max_sum, window_sum)\n    return max_sum",
            "tags": ["sliding-window", "array", "subarray", "intermediate"],
        },
        {
            "pattern_name": "Hash Map / Frequency Counter",
            "description": "Use a hash map to count occurrences or store seen elements for O(1) lookups",
            "step_breakdown": [
                "Initialize an empty hash map",
                "Iterate through elements",
                "For each element, check map or update count",
                "Use map lookups to find patterns",
                "Return result based on map state",
            ],
            "code_template": "def frequency_counter(arr):\n    freq = {}\n    for item in arr:\n        freq[item] = freq.get(item, 0) + 1\n    return freq",
            "tags": ["hash", "dictionary", "frequency", "lookup", "intermediate"],
        },
        {
            "pattern_name": "Simple Recursion",
            "description": "Solve a problem by breaking it into smaller instances of itself with a base case",
            "step_breakdown": [
                "Identify the base case (smallest problem)",
                "Identify the recursive case",
                "Determine how the problem reduces each call",
                "Ensure progress toward base case",
                "Combine results from recursive calls",
            ],
            "code_template": "def recursive_func(n):\n    # Base case\n    if n <= 1:\n        return n\n    # Recursive case\n    return recursive_func(n - 1) + recursive_func(n - 2)",
            "tags": ["recursion", "base-case", "divide-conquer", "intermediate"],
        },
        {
            "pattern_name": "Dynamic Programming - Memoization",
            "description": "Optimize recursion by caching previously computed results",
            "step_breakdown": [
                "Identify overlapping subproblems",
                "Define the state (what changes between calls)",
                "Create a memo table / cache",
                "Before computing, check if result exists in cache",
                "Store computed results in cache",
                "Return cached result",
            ],
            "code_template": "def dp_memo(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = dp_memo(n-1, memo) + dp_memo(n-2, memo)\n    return memo[n]",
            "tags": ["dynamic-programming", "memoization", "optimization", "advanced"],
        },
        {
            "pattern_name": "Stack-Based Processing",
            "description": "Use a stack (LIFO) to process elements that need to be matched or tracked in reverse order",
            "step_breakdown": [
                "Initialize an empty stack",
                "Iterate through elements",
                "Push elements that need tracking",
                "Pop when a matching condition is met",
                "Process popped elements as needed",
                "Check stack state for final result",
            ],
            "code_template": "def is_valid_parentheses(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack",
            "tags": ["stack", "lifo", "matching", "parsing", "intermediate"],
        },
        {
            "pattern_name": "Merge Sort",
            "description": "Divide array into halves, sort each half, then merge sorted halves",
            "step_breakdown": [
                "If array has 0 or 1 elements, it's sorted (base case)",
                "Find the middle point",
                "Recursively sort left half",
                "Recursively sort right half",
                "Merge two sorted halves",
                "Compare elements from both halves and place in order",
            ],
            "code_template": "def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)",
            "tags": ["sort", "merge", "divide-conquer", "recursion", "intermediate"],
        },
        {
            "pattern_name": "Greedy Algorithm",
            "description": "Make the locally optimal choice at each step to find a global optimum",
            "step_breakdown": [
                "Sort or organize data by the greedy criterion",
                "Initialize result tracking variables",
                "Iterate through choices",
                "At each step, pick the best available option",
                "Update result and constraints",
                "Verify solution meets all conditions",
            ],
            "code_template": "def greedy_activity_selection(activities):\n    # Sort by end time\n    activities.sort(key=lambda x: x[1])\n    selected = [activities[0]]\n    for i in range(1, len(activities)):\n        if activities[i][0] >= selected[-1][1]:\n            selected.append(activities[i])\n    return selected",
            "tags": ["greedy", "optimization", "sorting", "intermediate"],
        },
        {
            "pattern_name": "BFS - Breadth First Search",
            "description": "Explore nodes level by level using a queue",
            "step_breakdown": [
                "Start from the source node",
                "Add source to queue and mark visited",
                "While queue is not empty, dequeue front",
                "Process the dequeued node",
                "Add all unvisited neighbors to queue",
                "Mark neighbors as visited",
            ],
            "code_template": "from collections import deque\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return visited",
            "tags": ["graph", "bfs", "queue", "traversal", "intermediate"],
        },
    ]
