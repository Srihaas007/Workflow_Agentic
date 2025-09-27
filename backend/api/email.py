"""
API routes for email automation endpoints.

This module provides REST API endpoints for the EmailAI engine,
enabling intelligent email content generation and automation.
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, EmailStr
import logging

from backend.ai_engine.email_ai import EmailAI
from backend.core.database import get_db
from backend.core.security import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(tags=["email"])

# Initialize AI engine
email_ai = EmailAI()

# Pydantic models for request/response
class EmailContentRequest(BaseModel):
    purpose: str = Field(..., description="Purpose of the email")
    context: Dict[str, Any] = Field(default_factory=dict, description="Email context")
    tone: str = Field(default="professional", description="Email tone")
    recipients: Optional[List[EmailStr]] = Field(default=None, description="Recipient email addresses")

class EmailTemplate(BaseModel):
    name: str
    purpose: str
    tone: str
    template_content: str
    variables: List[str] = []

class EmailCampaign(BaseModel):
    name: str
    purpose: str
    recipients: List[EmailStr]
    context: Dict[str, Any] = {}
    schedule_time: Optional[str] = None
    tone: str = "professional"

@router.post("/generate")
async def generate_email_content(
    request: EmailContentRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate AI-powered email content"""
    try:
        # Generate content using EmailAI
        generated_content = await email_ai.generate_content(
            purpose=request.purpose,
            context=request.context,
            tone=request.tone,
            recipients=request.recipients
        )
        
        # Get improvement suggestions
        suggestions = await email_ai.get_improvement_suggestions(generated_content)
        
        return {
            "request_id": f"req_{hash(request.purpose) % 100000}",
            "purpose": request.purpose,
            "tone": request.tone,
            "generated_content": generated_content,
            "improvement_suggestions": suggestions,
            "metadata": {
                "generated_at": generated_content.get("generated_at"),
                "content_score": generated_content.get("content_score", 0),
                "estimated_engagement": generated_content.get("estimated_engagement"),
                "optimal_send_time": generated_content.get("send_time_analysis", {}).get("recommendation")
            }
        }
        
    except Exception as e:
        logger.error("Email content generation failed: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.post("/templates")
async def create_email_template(
    template: EmailTemplate,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Create a new email template"""
    try:
        # Mock template creation (would store in database)
        template_id = f"tpl_{hash(template.name) % 100000}"
        
        # Analyze template with AI
        template_analysis = {
            "readability_score": 85,
            "engagement_potential": "high",
            "personalization_opportunities": len(template.variables),
            "tone_consistency": "good"
        }
        
        return {
            "template_id": template_id,
            "name": template.name,
            "purpose": template.purpose,
            "tone": template.tone,
            "variables": template.variables,
            "analysis": template_analysis,
            "status": "created",
            "created_at": "2025-09-27T10:00:00Z"
        }
        
    except Exception as e:
        logger.error("Email template creation failed: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.post("/campaigns")
async def create_email_campaign(
    campaign: EmailCampaign,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """Create and optionally schedule an email campaign"""
    try:
        campaign_id = f"camp_{hash(campaign.name) % 100000}"
        
        # Generate content for the campaign
        campaign_content = await email_ai.generate_content(
            purpose=campaign.purpose,
            context=campaign.context,
            tone=campaign.tone,
            recipients=campaign.recipients
        )
        
        # Analyze campaign potential
        campaign_analysis = {
            "estimated_open_rate": campaign_content.get("estimated_engagement", {}).get("predicted_open_rate", "65%"),
            "estimated_click_rate": campaign_content.get("estimated_engagement", {}).get("predicted_click_rate", "25%"),
            "estimated_response_rate": campaign_content.get("estimated_engagement", {}).get("predicted_response_rate", "15%"),
            "audience_size": len(campaign.recipients),
            "optimal_send_time": campaign_content.get("send_time_analysis", {}).get("recommendation", "Tuesday 10:00 AM")
        }
        
        # Schedule campaign if time specified
        status = "scheduled" if campaign.schedule_time else "draft"
        
        return {
            "campaign_id": campaign_id,
            "name": campaign.name,
            "status": status,
            "audience_size": len(campaign.recipients),
            "content": campaign_content,
            "analysis": campaign_analysis,
            "schedule_time": campaign.schedule_time,
            "created_at": "2025-09-27T10:00:00Z",
            "tracking_enabled": True
        }
        
    except Exception as e:
        logger.error("Email campaign creation failed: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/campaigns/{campaign_id}/analytics")
async def get_campaign_analytics(
    campaign_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get analytics for an email campaign"""
    try:
        # Mock campaign analytics (would come from database and tracking)
        analytics = {
            "campaign_id": campaign_id,
            "sent_at": "2025-09-27T10:00:00Z",
            "audience_size": 150,
            "delivery_stats": {
                "delivered": 147,
                "bounced": 2,
                "failed": 1,
                "delivery_rate": "98.0%"
            },
            "engagement_stats": {
                "opened": 95,
                "clicked": 38,
                "replied": 12,
                "unsubscribed": 1,
                "open_rate": "64.6%",
                "click_rate": "25.9%",
                "response_rate": "8.2%"
            },
            "performance_comparison": {
                "vs_industry_average": {
                    "open_rate": "+12.6%",
                    "click_rate": "+3.9%",
                    "response_rate": "+1.2%"
                },
                "vs_your_average": {
                    "open_rate": "+2.1%",
                    "click_rate": "-0.5%",
                    "response_rate": "+0.8%"
                }
            },
            "ai_insights": [
                "Strong subject line performance - 12% above industry average",
                "Peak engagement occurred 2-4 hours after send",
                "Mobile open rate (72%) higher than desktop (28%)",
                "Consider A/B testing call-to-action buttons for higher click rates"
            ]
        }
        
        return analytics
        
    except Exception as e:
        logger.error("Failed to get campaign analytics: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.post("/optimize")
async def optimize_email_content(
    content: Dict[str, Any],
    optimization_goals: List[str] = ["engagement", "deliverability"],
    current_user: dict = Depends(get_current_user)
):
    """Optimize email content using AI recommendations"""
    try:
        # Get improvement suggestions
        suggestions = await email_ai.get_improvement_suggestions(content)
        
        # Mock optimization results
        optimization_results = {
            "original_content": content,
            "optimization_goals": optimization_goals,
            "suggestions": suggestions,
            "optimized_versions": [
                {
                    "version": "engagement_optimized",
                    "changes": [
                        "Added more compelling subject line",
                        "Improved call-to-action placement",
                        "Enhanced personalization"
                    ],
                    "predicted_improvement": {
                        "open_rate": "+8-12%",
                        "click_rate": "+15-20%",
                        "engagement_score": "+25%"
                    }
                },
                {
                    "version": "deliverability_optimized", 
                    "changes": [
                        "Reduced promotional language",
                        "Balanced text-to-image ratio",
                        "Improved sender reputation signals"
                    ],
                    "predicted_improvement": {
                        "delivery_rate": "+3-5%",
                        "spam_score": "-40%",
                        "reputation_score": "+15%"
                    }
                }
            ],
            "testing_recommendations": [
                "A/B test subject lines with 10% audience split",
                "Test send times: Tuesday 10 AM vs Thursday 2 PM",
                "Compare personalized vs non-personalized versions"
            ]
        }
        
        return optimization_results
        
    except Exception as e:
        logger.error("Email optimization failed: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/templates")
async def list_email_templates(
    purpose: Optional[str] = None,
    tone: Optional[str] = None,
    limit: int = 20,
    current_user: dict = Depends(get_current_user)
):
    """List email templates with filtering"""
    try:
        # Mock template list (would come from database)
        templates = [
            {
                "template_id": "tpl_12345",
                "name": "Welcome Email",
                "purpose": "onboarding", 
                "tone": "friendly",
                "usage_count": 45,
                "avg_engagement": "72%",
                "created_at": "2025-09-20T08:00:00Z"
            },
            {
                "template_id": "tpl_12346",
                "name": "Follow-up Email",
                "purpose": "follow_up",
                "tone": "professional", 
                "usage_count": 32,
                "avg_engagement": "68%",
                "created_at": "2025-09-18T14:30:00Z"
            },
            {
                "template_id": "tpl_12347",
                "name": "Urgent Request",
                "purpose": "request",
                "tone": "urgent",
                "usage_count": 18,
                "avg_engagement": "85%",
                "created_at": "2025-09-15T09:15:00Z"
            }
        ]
        
        # Apply filters
        if purpose:
            templates = [t for t in templates if t["purpose"] == purpose]
        if tone:
            templates = [t for t in templates if t["tone"] == tone]
            
        # Apply limit
        templates = templates[:limit]
        
        return {
            "templates": templates,
            "total": len(templates),
            "filters_applied": {
                "purpose": purpose,
                "tone": tone,
                "limit": limit
            }
        }
        
    except Exception as e:
        logger.error("Failed to list templates: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/insights")
async def get_email_insights(
    time_period: str = "30d",
    current_user: dict = Depends(get_current_user)
):
    """Get AI-powered email marketing insights"""
    try:
        # Mock insights data (would come from analytics database)
        insights = {
            "time_period": time_period,
            "summary": {
                "total_campaigns": 12,
                "total_emails_sent": 1856,
                "avg_open_rate": "66.2%",
                "avg_click_rate": "24.8%",
                "avg_response_rate": "7.9%"
            },
            "trends": {
                "open_rate_trend": "+5.2% vs previous period",
                "engagement_trend": "improving",
                "best_performing_tone": "friendly",
                "optimal_send_times": ["Tuesday 10:00 AM", "Thursday 2:00 PM"]
            },
            "ai_recommendations": [
                "Your friendly tone emails perform 15% better than professional",
                "Consider increasing email frequency - engagement drops after 5+ days",
                "Subject lines with questions improve open rates by 8%",
                "Personalized greetings increase click rates by 12%"
            ],
            "content_analysis": {
                "most_effective_keywords": ["exclusive", "limited time", "personalized"],
                "optimal_email_length": "150-250 words",
                "best_call_to_action": "Get Started Now",
                "mobile_optimization_score": "88%"
            },
            "audience_insights": {
                "most_engaged_segment": "New customers (first 30 days)",
                "peak_engagement_hours": ["10:00-11:00", "14:00-15:00"],
                "device_preference": "Mobile (68%), Desktop (32%)",
                "geographic_performance": "North America: +12%, Europe: +8%"
            }
        }
        
        return insights
        
    except Exception as e:
        logger.error("Failed to get email insights: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e