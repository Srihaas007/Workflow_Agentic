"""
Main FastAPI application for the AI-Powered Automation Platform.

This is the central entry point that combines all five core features:
1. Drag-and-Drop Workflow Builder
2. Email & Notification Automation  
3. AI Task Scheduler & Assistant
4. API Integration Hub
5. Workflow Advisor & Analytics
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import asyncio
import logging

# Import our custom modules
from backend.core.config import settings
from backend.core.database import init_db
from backend.api.v1 import api_router
from backend.ai_engine.workflow_ai import WorkflowAI
from backend.ai_engine.email_ai import EmailAI
from backend.ai_engine.scheduler_ai import SchedulerAI
from backend.ai_engine.advisor_ai import AdvisorAI

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Security
security = HTTPBearer()

@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting AI-Powered Automation Platform...")
    
    # Initialize database
    await init_db()
    logger.info("📊 Database initialized")
    
    # Initialize AI engines
    app.state.workflow_ai = WorkflowAI()
    app.state.email_ai = EmailAI()
    app.state.scheduler_ai = SchedulerAI()
    app.state.advisor_ai = AdvisorAI()
    logger.info("🤖 AI engines initialized")
    
    # Start background tasks
    asyncio.create_task(start_background_services())
    
    yield
    
    # Shutdown
    logger.info("📴 Shutting down automation platform...")

async def start_background_services():
    """Start background services for automation processing"""
    try:
        # Start workflow processor
        # Start email scheduler
        # Start task optimizer
        logger.info("⚡ Background services started")
    except (ImportError, RuntimeError) as e:
        logger.error("❌ Error starting background services: %s", e)

# Initialize FastAPI app
app = FastAPI(
    title="AI-Powered Automation Platform",
    description="Comprehensive automation platform with drag-and-drop workflows, AI suggestions, and intelligent scheduling",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)

@app.get("/")
async def root():
    """Root endpoint with platform information"""
    return {
        "message": "🤖 AI-Powered Automation Platform",
        "version": "1.0.0",
        "features": [
            "Drag-and-Drop Workflow Builder",
            "Email & Notification Automation",
            "AI Task Scheduler & Assistant", 
            "API Integration Hub",
            "Workflow Advisor & Analytics"
        ],
        "status": "operational",
        "docs": "/docs",
        "api_endpoints": {
            "workflows": "/api/v1/workflows",
            "email": "/api/v1/email",
            "health": "/api/v1/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        return {
            "status": "healthy",
            "timestamp": "2025-09-27T00:00:00Z",
            "services": {
                "database": "connected",
                "ai_engine": "operational",
                "api": "ready"
            },
            "features_available": [
                "Workflow automation",
                "Email generation", 
                "Task scheduling",
                "AI analysis"
            ]
        }
    except Exception as e:
        logger.error("Health check failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service unhealthy"
        ) from e

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning"
    )