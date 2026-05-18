"""
LogicBuilder API – FastAPI Entry Point.

This module initializes the FastAPI application, sets up CORS (Cross-Origin Resource Sharing),
configures rate limiting to prevent abuse, and manages the application lifespan (startup/shutdown events).
It also includes the global error handler and imports the routing modules.
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from config import settings
from routes import problems, practice, analytics
from services import rag_service

# ── Logging ────────────────────────────────────────────────────────────
# Configure standard logging for the application console output
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

# ── Rate Limiter ───────────────────────────────────────────────────────
# Initialize slowapi limiter using the client's IP address to prevent brute-force or spam attacks
limiter = Limiter(key_func=get_remote_address)


# ── Lifespan ───────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages the startup and shutdown lifecycle of the FastAPI application.
    
    Startup Actions:
    1. Initializes the SQLite database and creates all tables (if they don't exist).
    2. Seeds the ChromaDB knowledge base with algorithmic patterns for the RAG implementation.
    
    Shutdown Actions:
    Logs a graceful shutdown message.
    """
    from database import init_db
    await init_db()
    logger.info("🗄️ Database initialized")
    
    logger.info("🧠 Seeding RAG knowledge base...")
    count = await rag_service.seed_knowledge_base()
    logger.info(f"✅ Loaded {count} algorithm patterns into knowledge base")
    
    # Control is handed over to the FastAPI app here
    yield
    
    # Cleanup / Shutdown phase
    logger.info("👋 Shutting down LogicBuilder API")


# ── App Initialization ─────────────────────────────────────────────────
app = FastAPI(
    title="LogicBuilder API",
    description="Backend API for the AI Logical Thinking Trainer, providing coaching, practice tracking, and logic evaluation.",
    version="1.0.0",
    lifespan=lifespan,
)

# Attach rate limiter to the app state and register the exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS Configuration ─────────────────────────────────────────────────
# Read CORS_ORIGINS from environment variables, fallback to defaults
cors_origins_env = os.getenv(
    "CORS_ORIGINS", 
    "http://localhost:5173,http://localhost:3000,https://logic-builder-5jzih1rnl-aravinds-projects-522d9a7c.vercel.app"
)

# Allow frontend application to communicate with this backend
origins = [origin.strip().rstrip('/') for origin in cors_origins_env.split(",") if origin.strip()]

# Explicitly allow the deployed Vercel frontend URL
vercel_url = "https://logic-builder-5jzih1rnl-aravinds-projects-522d9a7c.vercel.app"
if vercel_url not in origins:
    origins.append(vercel_url)

if "*" in origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# ── Global Error Handler ──────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches any unhandled exceptions in the application and returns a standardized 500 JSON response,
    preventing raw stack traces from bleeding to the client.
    """
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again."},
    )


# ── Route Registration ─────────────────────────────────────────────────
# Include routers for different feature modules
app.include_router(problems.router)
app.include_router(practice.router)
app.include_router(analytics.router)


@app.get("/")
async def root():
    """Returns basic metadata about the running API."""
    return {
        "app": "LogicBuilder API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs", # Interactive Swagger UI documentation
    }


@app.get("/health")
async def health():
    """
    Health check endpoint. 
    Can be used by orchestrators (like Docker or AWS) to ensure the service is running and the RAG DB is populated.
    """
    return {"status": "healthy", "knowledge_base_size": len(rag_service.KNOWLEDGE_BASE)}
