"""
API routes for workflow automation endpoints.

This module provides REST API endpoints for the WorkflowAI engine,
enabling workflow creation, optimization, and execution management.
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import logging

from backend.ai_engine.workflow_ai import WorkflowAI
from backend.core.database import get_db
from backend.core.security import get_current_user
from backend.core.models import Workflow, WorkflowStatus
from sqlalchemy import select
import httpx

logger = logging.getLogger(__name__)

router = APIRouter(tags=["workflows"])

# Initialize AI engine
workflow_ai = WorkflowAI()

# Pydantic models for request/response
class WorkflowStep(BaseModel):
    id: str
    name: str
    type: str
    parameters: Dict[str, Any] = {}
    position: Dict[str, float] = Field(default_factory=dict)
    dependencies: List[str] = []

class WorkflowCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    steps: List[WorkflowStep]
    triggers: List[Dict[str, Any]] = []
    metadata: Dict[str, Any] = {}

class WorkflowOptimizeRequest(BaseModel):
    workflow_id: str
    optimization_goals: List[str] = ["efficiency", "reliability"]
    constraints: Optional[Dict[str, Any]] = None

class WorkflowExecuteRequest(BaseModel):
    workflow_id: str
    input_data: Dict[str, Any] = {}
    execution_mode: str = "async"  # "sync" or "async"


# === N8N-style builder contracts (React Flow) ===
class RFNode(BaseModel):
    id: str
    type: str
    label: Optional[str] = None
    data: Dict[str, Any] = Field(default_factory=dict)
    position: Dict[str, float] = Field(default_factory=dict)


class RFEdge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None
    label: Optional[str] = None


class SaveFlowRequest(BaseModel):
    id: Optional[int] = None
    name: str
    version: Optional[int] = 1
    nodes: List[RFNode]
    edges: List[RFEdge]
    metadata: Dict[str, Any] = Field(default_factory=dict)


class PublishFlowRequest(BaseModel):
    workflow_id: int


def _translate_to_nodered_flow(name: str, nodes: List[RFNode], edges: List[RFEdge]) -> List[Dict[str, Any]]:
    """Very small translator: maps 'api' → http request node; others become comment placeholders.
    Produces a single tab with nodes laid out; wires from edges.
    """
    tab_id = "tab_main"
    nr_flow = [
        {"id": tab_id, "type": "tab", "label": name, "disabled": False, "info": "Generated from React Flow"}
    ]

    id_map: Dict[str, str] = {}
    for n in nodes:
        nr_id = f"nr_{n.id}"
        id_map[n.id] = nr_id
        x = int(n.position.get("x", 100))
        y = int(n.position.get("y", 100))
        if n.type == "api":
            nr_flow.append({
                "id": nr_id,
                "type": "http request",
                "z": tab_id,
                "name": n.label or n.data.get("label", "API Call"),
                "method": n.data.get("method", "GET"),
                "ret": "txt",
                "url": n.data.get("url", "https://httpbin.org/get"),
                "headers": n.data.get("headers", []),
                "x": x,
                "y": y,
                "wires": [[]]
            })
        else:
            # Fallback comment node as placeholder for unsupported types
            nr_flow.append({
                "id": nr_id,
                "type": "comment",
                "z": tab_id,
                "name": n.label or n.type,
                "info": str(n.data)[:500],
                "x": x,
                "y": y,
                "wires": []
            })

    # Wires: create link nodes to simulate edges
    for e in edges:
        src = id_map.get(e.source)
        tgt = id_map.get(e.target)
        if src and tgt:
            # Add a wire by appending target id to the first output of source node
            for nd in nr_flow:
                if nd.get("id") == src:
                    if nd.get("wires") is None:
                        nd["wires"] = [[]]
                    if not nd["wires"]:
                        nd["wires"].append([])
                    if tgt not in nd["wires"][0]:
                        nd["wires"][0].append(tgt)
                    break

    return nr_flow


@router.post("/save")
async def save_flow(
    req: SaveFlowRequest,
    db = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create or update a workflow definition persisted in DB (React Flow JSON)."""
    try:
        owner_id = current_user.get("user_id") or 1  # dev fallback
        if req.id:
            result = await db.execute(select(Workflow).where(Workflow.id == req.id))
            wf = result.scalar_one_or_none()
            if not wf:
                raise HTTPException(status_code=404, detail="Workflow not found")
            wf.name = req.name
            wf.nodes = [n.dict() for n in req.nodes]
            wf.edges = [e.dict() for e in req.edges]
            wf.version = (req.version or wf.version)
            wf.status = WorkflowStatus.DRAFT
        else:
            wf = Workflow(
                name=req.name,
                description=req.metadata.get("description"),
                nodes=[n.dict() for n in req.nodes],
                edges=[e.dict() for e in req.edges],
                version=req.version or 1,
                status=WorkflowStatus.DRAFT,
                owner_id=owner_id,
                tags=req.metadata.get("tags", []),
            )
            db.add(wf)
        await db.flush()
        await db.commit()
        return {"workflow_id": wf.id, "status": "saved", "version": wf.version}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to save flow")
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/publish")
async def publish_flow(
    req: PublishFlowRequest,
    db = Depends(get_db),
    _current_user: dict = Depends(get_current_user)
):
    """Translate a saved React Flow into a Node-RED flow and import via Admin API."""
    try:
        result = await db.execute(select(Workflow).where(Workflow.id == req.workflow_id))
        wf = result.scalar_one_or_none()
        if not wf:
            raise HTTPException(status_code=404, detail="Workflow not found")

        nr_flow = _translate_to_nodered_flow(wf.name, [RFNode(**n) for n in wf.nodes], [RFEdge(**e) for e in wf.edges])

        admin_url = "http://localhost:1880/node-red/flows"
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(admin_url, json=nr_flow)
            if resp.status_code >= 300:
                raise HTTPException(status_code=502, detail=f"Node-RED publish failed: {resp.text}")

        wf.status = WorkflowStatus.ACTIVE
        await db.flush()
        await db.commit()
        return {"workflow_id": wf.id, "status": "published", "node_red": resp.json() if resp.text else {}}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to publish flow")
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.post("/create")
async def create_workflow(
    request: WorkflowCreateRequest,
    _background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    _db = Depends(get_db)
):
    """Create a new workflow with AI optimization"""
    try:
        # Convert request to workflow format
        workflow_data = {
            "name": request.name,
            "description": request.description,
            "steps": [step.dict() for step in request.steps],
            "triggers": request.triggers,
            "metadata": request.metadata,
            "created_by": current_user.get("user_id"),
            "created_at": "2025-09-27T10:00:00Z"
        }
        
        # Analyze workflow complexity
        analysis = await workflow_ai.analyze_workflow_complexity(workflow_data)
        
        # Get optimization suggestions
        suggestions = await workflow_ai.suggest_optimizations(workflow_data)
        
        # Store in database (mock implementation)
        workflow_id = f"wf_{hash(request.name) % 100000}"
        
        return {
            "workflow_id": workflow_id,
            "name": request.name,
            "complexity_analysis": analysis,
            "optimization_suggestions": suggestions[:5],  # Top 5 suggestions
            "status": "created",
            "message": "Workflow created successfully with AI optimization analysis"
        }
        
    except Exception as e:
        logger.error("Workflow creation failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.post("/optimize")
async def optimize_workflow(
    request: WorkflowOptimizeRequest,
    _current_user: dict = Depends(get_current_user)
):
    """Optimize an existing workflow using AI"""
    try:
        # Mock workflow data retrieval (would come from database)
        workflow_data = {
            "id": request.workflow_id,
            "name": f"Workflow {request.workflow_id}",
            "steps": [
                {"id": "step1", "name": "Data Collection", "type": "api_call", "estimated_time": 30},
                {"id": "step2", "name": "Data Processing", "type": "transform", "estimated_time": 120},
                {"id": "step3", "name": "Send Notification", "type": "email", "estimated_time": 15}
            ],
            "current_performance": {
                "avg_execution_time": 180,
                "success_rate": 85,
                "bottlenecks": ["step2"]
            }
        }
        
        # Generate optimizations
        optimizations = await workflow_ai.suggest_optimizations(
            workflow_data,
            goals=request.optimization_goals
        )
        
        # Apply optimization simulation
        optimization_result = await workflow_ai.optimize_workflow_execution(
            workflow_data,
            request.constraints or {}
        )
        
        return {
            "workflow_id": request.workflow_id,
            "optimization_goals": request.optimization_goals,
            "suggested_optimizations": optimizations,
            "simulation_results": optimization_result,
            "estimated_improvements": {
                "execution_time_reduction": "25-35%",
                "success_rate_improvement": "10-15%",
                "resource_efficiency_gain": "20%"
            },
            "next_steps": [
                "Review suggested optimizations",
                "Test optimization in staging environment",
                "Monitor performance after implementation"
            ]
        }
        
    except (KeyError, ValueError, TypeError, RuntimeError) as e:
        logger.error("Workflow optimization failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.post("/execute")
async def execute_workflow(
    request: WorkflowExecuteRequest,
    _background_tasks: BackgroundTasks,
    _current_user: dict = Depends(get_current_user)
):
    """Execute a workflow with AI monitoring"""
    try:
        # Mock workflow data
        workflow_data = {
            "id": request.workflow_id,
            "steps": [
                {"id": "step1", "name": "Initialize", "type": "setup"},
                {"id": "step2", "name": "Process Data", "type": "transform"},
                {"id": "step3", "name": "Complete", "type": "cleanup"}
            ]
        }
        
        if request.execution_mode == "async":
            # Start background execution
            execution_id = f"exec_{hash(str(request.input_data)) % 100000}"
            
            # Simulate execution with AI monitoring
            execution_result = await workflow_ai.execute_workflow(
                workflow_data,
                inputs=request.input_data
            )
            
            return {
                "execution_id": execution_id,
                "workflow_id": request.workflow_id,
                "status": "started",
                "mode": "async",
                "estimated_completion": "2025-09-27T10:15:00Z",
                "monitoring_enabled": True,
                "execution_plan": execution_result.get("execution_plan"),
                "tracking_url": f"/api/v1/workflows/executions/{execution_id}/status"
            }
        else:
            # Synchronous execution
            result = await workflow_ai.execute_workflow(
                workflow_data,
                inputs=request.input_data
            )
            
            return {
                "workflow_id": request.workflow_id,
                "status": "completed",
                "mode": "sync",
                "execution_time": result.get("total_execution_time", 0),
                "success": result.get("success", True),
                "results": result.get("results", {}),
                "performance_metrics": result.get("metrics")
            }
            
    except Exception as e:
        logger.error("Workflow execution failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/executions/{execution_id}/status")
async def get_execution_status(
    execution_id: str,
    _current_user: dict = Depends(get_current_user)
):
    """Get the status of a workflow execution"""
    try:
        # Mock execution status (would come from database/cache)
        status_data = {
            "execution_id": execution_id,
            "status": "in_progress",
            "progress": 65,
            "current_step": "step2",
            "steps_completed": 2,
            "total_steps": 3,
            "started_at": "2025-09-27T10:00:00Z",
            "estimated_completion": "2025-09-27T10:15:00Z",
            "performance_metrics": {
                "steps_per_minute": 0.8,
                "success_rate": 100,
                "avg_step_duration": 75
            },
            "issues": [],
            "warnings": ["Step2 taking longer than expected"]
        }
        
        return status_data
        
    except Exception as e:
        logger.error("Failed to get execution status: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/{workflow_id}/insights")
async def get_workflow_insights(
    workflow_id: str,
    time_period: Optional[str] = "7d",
    _current_user: dict = Depends(get_current_user)
):
    """Get AI-powered insights for a workflow"""
    try:
        # Mock workflow performance data
        performance_data = {
            "total_executions": 156,
            "successful_executions": 142,
            "avg_execution_time": 165,
            "execution_times": [120, 180, 145, 200, 130, 175, 155],
            "resource_usage": {"cpu": 45, "memory": 60, "network": 30},
            "user_satisfaction": 78,
            "peak_usage_hours": [9, 10, 14, 15, 16]
        }
        
        # Get insights from WorkflowAI
        insights = await workflow_ai.get_performance_insights(workflow_id, performance_data)
        
        # Get improvement suggestions
        suggestions = await workflow_ai.get_improvement_suggestions(performance_data)
        
        return {
            "workflow_id": workflow_id,
            "time_period": time_period,
            "performance_summary": {
                "total_executions": performance_data["total_executions"],
                "success_rate": f"{(performance_data['successful_executions']/performance_data['total_executions']*100):.1f}%",
                "avg_execution_time": f"{performance_data['avg_execution_time']}s",
                "reliability_score": insights.get("reliability_score", 85)
            },
            "insights": insights,
            "improvement_suggestions": suggestions,
            "trends": {
                "execution_time": "stable",
                "success_rate": "improving",
                "usage_volume": "increasing"
            },
            "next_review": "2025-10-04T10:00:00Z"
        }
        
    except Exception as e:
        logger.error("Failed to get workflow insights: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/")
async def list_workflows(
    limit: int = 20,
    offset: int = 0,
    status: Optional[str] = None,
    _current_user: dict = Depends(get_current_user)
):
    """List workflows with filtering options"""
    try:
        # Mock workflow list (would come from database)
        workflows = [
            {
                "id": "wf_12345",
                "name": "Customer Onboarding",
                "description": "Automated customer onboarding process",
                "status": "active",
                "created_at": "2025-09-20T08:00:00Z",
                "last_execution": "2025-09-27T09:30:00Z",
                "success_rate": 94.5,
                "avg_execution_time": 145
            },
            {
                "id": "wf_12346", 
                "name": "Data Backup",
                "description": "Daily data backup automation",
                "status": "active",
                "created_at": "2025-09-15T12:00:00Z",
                "last_execution": "2025-09-27T02:00:00Z",
                "success_rate": 99.2,
                "avg_execution_time": 320
            },
            {
                "id": "wf_12347",
                "name": "Report Generation",
                "description": "Weekly performance report generation",
                "status": "paused",
                "created_at": "2025-09-10T15:30:00Z",
                "last_execution": "2025-09-25T17:00:00Z",
                "success_rate": 87.3,
                "avg_execution_time": 275
            }
        ]
        
        # Apply status filter if provided
        if status:
            workflows = [wf for wf in workflows if wf["status"] == status]
        
        # Apply pagination
        total_count = len(workflows)
        workflows = workflows[offset:offset + limit]
        
        return {
            "workflows": workflows,
            "pagination": {
                "total": total_count,
                "limit": limit,
                "offset": offset,
                "has_more": offset + limit < total_count
            },
            "summary": {
                "total_workflows": total_count,
                "active_workflows": len([wf for wf in workflows if wf["status"] == "active"]),
                "avg_success_rate": sum(wf["success_rate"] for wf in workflows) / len(workflows) if workflows else 0
            }
        }
        
    except Exception as e:
        logger.error("Failed to list workflows: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e