"""Analytics API – User progress and insights."""

from fastapi import APIRouter
from models.schemas import AnalyticsResponse
from services import evaluation_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard", response_model=AnalyticsResponse)
async def get_dashboard():
    """Get the user analytics dashboard data."""
    data = await evaluation_service.get_analytics()
    return AnalyticsResponse(**data)
