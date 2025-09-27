"""
API v1 Router - Main router for version 1 of the API
"""

from fastapi import APIRouter

# Import specific routers
from backend.api.workflows import router as workflows_router
from backend.api.email import router as email_router

# Create main API router
api_router = APIRouter(prefix="/api/v1")

# Include sub-routers (remove their internal prefixes since we handle it here)
api_router.include_router(workflows_router, prefix="/workflows", tags=["workflows"])
api_router.include_router(email_router, prefix="/email", tags=["email"])

# Basic health endpoint for v1 API
@api_router.get("/health")
async def api_health():
    """API v1 Health check"""
    return {
        "status": "healthy",
        "api_version": "v1",
        "message": "AI Automation Platform API v1 is operational",
        "endpoints": {
            "workflows": "/api/v1/workflows",
            "email": "/api/v1/email", 
            "health": "/api/v1/health"
        }
    }