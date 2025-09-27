"""
API v1 Router - Main router for version 1 of the API
"""

from fastapi import APIRouter

# Import specific routers
# from .workflows import router as workflows_router
# from .email import router as email_router
# from .scheduler import router as scheduler_router

# Create main API router
api_router = APIRouter()

# Include sub-routers when they're available
# api_router.include_router(workflows_router, prefix="/workflows", tags=["workflows"])
# api_router.include_router(email_router, prefix="/email", tags=["email"])
# api_router.include_router(scheduler_router, prefix="/scheduler", tags=["scheduler"])

# Basic health endpoint for v1 API
@api_router.get("/health")
async def api_health():
    """API v1 Health check"""
    return {
        "status": "healthy",
        "api_version": "v1",
        "message": "AI Automation Platform API v1 is operational"
    }