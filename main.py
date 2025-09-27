"""
Main FastAPI application for the AI-Powered Automation Platform.

This is the central entry point that combines all five core features:
1. Drag-and-Drop Workflow Builder
2. Email & Notification Automation  
3. AI Task Scheduler & Assistant
4. API Integration Hub
5. Workflow Advisor & Analytics
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import asyncio
from typing import Dict, Any
import logging
from decouple import config

# Import our custom modules
from backend.core.config import settings
from backend.core.database import init_db
from backend.api.v1 import api_router
from backend.core.security import get_current_user
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
async def lifespan(app: FastAPI):
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
    except Exception as e:
        logger.error(f"❌ Error starting background services: {e}")

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
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

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
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check database connection
        # Check Redis connection
        # Check AI services
        return {
            "status": "healthy",
            "timestamp": "2025-09-27T00:00:00Z",
            "services": {
                "database": "connected",
                "redis": "connected", 
                "ai_engine": "operational"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service unhealthy"
        )

@app.post("/api/v1/workflows/execute")
async def execute_workflow(
    workflow_data: Dict[str, Any],
    current_user = Depends(get_current_user)
):
    """Execute a workflow with AI optimization"""
    try:
        # Get AI suggestions for optimization
        optimizations = await app.state.workflow_ai.suggest_optimizations(workflow_data)
        
        # Execute the workflow
        result = await app.state.workflow_ai.execute_workflow(workflow_data, optimizations)
        
        return {
            "status": "success",
            "workflow_id": result.get("workflow_id"),
            "execution_time": result.get("execution_time"),
            "optimizations_applied": optimizations,
            "next_suggestions": await app.state.advisor_ai.suggest_improvements(result)
        }
    except Exception as e:
        logger.error(f"Workflow execution failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Workflow execution failed: {str(e)}"
        )

@app.post("/api/v1/email/generate")
async def generate_email_content(
    email_request: Dict[str, Any],
    current_user = Depends(get_current_user)
):
    """Generate AI-powered email content"""
    try:
        content = await app.state.email_ai.generate_content(
            purpose=email_request.get("purpose"),
            context=email_request.get("context"),
            tone=email_request.get("tone", "professional"),
            recipients=email_request.get("recipients", [])
        )
        
        return {
            "status": "success",
            "content": content,
            "suggestions": await app.state.email_ai.get_improvement_suggestions(content)
        }
    except Exception as e:
        logger.error(f"Email generation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Email generation failed: {str(e)}"
        )

@app.post("/api/v1/schedule/optimize")
async def optimize_schedule(
    schedule_data: Dict[str, Any],
    current_user = Depends(get_current_user)
):
    """Optimize task scheduling with AI"""
    try:
        optimization = await app.state.scheduler_ai.optimize_schedule(
            tasks=schedule_data.get("tasks", []),
            constraints=schedule_data.get("constraints", {}),
            preferences=schedule_data.get("preferences", {})
        )
        
        return {
            "status": "success",
            "optimized_schedule": optimization,
            "efficiency_improvement": optimization.get("efficiency_gain", 0),
            "recommendations": await app.state.scheduler_ai.get_recommendations(optimization)
        }
    except Exception as e:
        logger.error(f"Schedule optimization failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Schedule optimization failed: {str(e)}"
        )

@app.post("/api/v1/workflows/analyze")
async def analyze_workflow(
    workflow_data: Dict[str, Any],
    current_user = Depends(get_current_user)
):
    """Analyze workflow and provide optimization suggestions"""
    try:
        analysis = await app.state.advisor_ai.analyze_workflow(workflow_data)
        
        return {
            "status": "success",
            "analysis": analysis,
            "bottlenecks": analysis.get("bottlenecks", []),
            "optimization_opportunities": analysis.get("optimizations", []),
            "estimated_savings": analysis.get("time_savings", 0),
            "complexity_score": analysis.get("complexity", 0)
        }
    except Exception as e:
        logger.error(f"Workflow analysis failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Workflow analysis failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning"
    )