#!/usr/bin/env python3#!/usr/bin/env python3

""""""

Clean database initialization script for the AI Automation Platform.Clean database initialization script for the AI Automation Platform.

This script initializes the database schema and creates sample data for testing.This script initializes the database schema and creates sample data for testing.

""""""



import asyncioimport asyncio

import osimport os

import sysimport sys

from pathlib import Pathfrom pathlib import Path

from datetime import datetime, timedeltafrom datetime import datetime, timedelta

import hashlibimport hashlib



# Add the project root to the Python path# Add the project root to the Python path

sys.path.append(str(Path(__file__).parent))sys.path.append(str(Path(__file__).parent))



# Set required environment variables# Set required environment variables

os.environ.setdefault('JWT_SECRET_KEY', 'dev-jwt-secret-key-with-32-chars-minimum-requirement')os.environ.setdefault('JWT_SECRET_KEY', 'dev-jwt-secret-key-with-32-chars-minimum-requirement')



from backend.core.database import init_db, get_db_sessionfrom backend.core.database import init_db, get_db_session

from backend.core.models import (from backend.core.models import (

    User, Workflow, EmailCampaign, ScheduledTask,     User, Workflow, EmailCampaign, ScheduledTask, 

    UserRole, WorkflowStatus, TaskType    UserRole, WorkflowStatus, TaskType

))





async def create_sample_user():async def create_sample_user():

    """Create a sample user for testing"""    """Create a sample user for testing"""

    async with get_db_session() as session:    async with get_db_session() as session:

        # Check if user already exists        # Check if user already exists

        existing_user = await session.get(User, 1)        existing_user = await session.get(User, 1)

        if existing_user:        if existing_user:

            print("Sample user already exists, skipping creation.")            print("Sample user already exists, skipping creation.")

            return            return

                

        # Create sample user        # Create sample user

        user = User(        user = User(

            username="admin",            username="admin",

            email="admin@example.com",            email="admin@example.com",

            password_hash=hashlib.sha256("password123".encode()).hexdigest(),            password_hash=hashlib.sha256("password123".encode()).hexdigest(),

            first_name="Admin",            first_name="Admin",

            last_name="User",            last_name="User",

            role=UserRole.ADMIN,            role=UserRole.ADMIN,

            is_active=True,            is_active=True,

            is_verified=True            is_verified=True

        )        )

                

        session.add(user)        session.add(user)

        await session.commit()        await session.commit()

        print("✅ Sample user created: admin@example.com (password: password123)")        print("✅ Sample user created: admin@example.com (password: password123)")





async def create_sample_workflow():async def create_sample_workflow():

    """Create a sample workflow for testing"""    """Create a sample workflow for testing"""

    async with get_db_session() as session:    async with get_db_session() as session:

        workflow = Workflow(        workflow = Workflow(

            name="Sample Email Workflow",            name="Sample Email Workflow",

            description="A simple workflow that sends welcome emails",            description="A simple workflow that sends welcome emails",

            owner_id=1,            owner_id=1,

            status=WorkflowStatus.ACTIVE,            status=WorkflowStatus.ACTIVE,

            definition={            definition={

                "steps": [                "steps": [

                    {                    {

                        "id": "trigger",                        "id": "trigger",

                        "type": "email_trigger",                        "type": "email_trigger",

                        "name": "Email Trigger"                        "name": "Email Trigger"

                    },                    },

                    {                    {

                        "id": "send_email",                        "id": "send_email",

                        "type": "send_email",                        "type": "send_email",

                        "name": "Send Welcome Email",                        "name": "Send Welcome Email",

                        "config": {                        "config": {

                            "template": "welcome",                            "template": "welcome",

                            "subject": "Welcome to AI Automation Platform!"                            "subject": "Welcome to AI Automation Platform!"

                        }                        }

                    }                    }

                ]                ]

            }            }

        )        )

                

        session.add(workflow)        session.add(workflow)

        await session.commit()        await session.commit()

        print("✅ Sample workflow created")        print("✅ Sample workflow created")





async def main():async def main():

    """Main initialization function"""    """Main initialization function"""

    try:    try:

        print("🚀 Initializing AI Automation Platform Database...")        print("🚀 Initializing AI Automation Platform Database...")

                

        # Initialize database schema        # Initialize database schema

        await init_db()        await init_db()

        print("📊 Database schema initialized")        print("📊 Database schema initialized")

                

        # Create sample data        # Create sample data

        await create_sample_user()        await create_sample_user()

        await create_sample_workflow()        await create_sample_workflow()

                

        print("✅ Database initialization completed successfully!")        print("✅ Database initialization completed successfully!")

        print("\nYou can now:")        print("\nYou can now:")

        print("1. Start the backend: python main.py")        print("1. Start the backend: python main.py")

        print("2. Start the frontend: cd frontend && npm start")        print("2. Start the frontend: cd frontend && npm start")

        print("3. Start Node-RED: cd node-red && node start-nodered.js")        print("3. Start Node-RED: cd node-red && node start-nodered.js")

        print("4. Or use Docker: npm run ddev:start")        print("4. Or use Docker: npm run ddev:start")

                

    except Exception as e:    except Exception as e:

        print(f"❌ Database initialization failed: {e}")        print(f"❌ Database initialization failed: {e}")

        sys.exit(1)        sys.exit(1)





if __name__ == "__main__":if __name__ == "__main__":

    asyncio.run(main())    asyncio.run(main())
from backend.core.config import settings
import hashlib
import uuid
import json

async def create_sample_users():
    """Create sample users with different roles"""
    print("🔐 Creating sample users...")
    
    async with get_db_session() as session:
        # Admin user
        admin_user = User(
            email="admin@automation-platform.com",
            username="admin",
            first_name="System",
            last_name="Administrator",
            hashed_password=hashlib.sha256("admin123!@#".encode()).hexdigest(),
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
            timezone="UTC",
            language="en"
        )
        
        # Regular user
        demo_user = User(
            email="demo@automation-platform.com",
            username="demo_user",
            first_name="Demo",
            last_name="User",
            hashed_password=hashlib.sha256("demo123!@#".encode()).hexdigest(),
            role=UserRole.USER,
            is_active=True,
            is_verified=True,
            timezone="America/New_York",
            language="en"
        )
        
        # Viewer user
        viewer_user = User(
            email="viewer@automation-platform.com",
            username="viewer",
            first_name="View",
            last_name="Only",
            hashed_password=hashlib.sha256("viewer123!@#".encode()).hexdigest(),
            role=UserRole.VIEWER,
            is_active=True,
            is_verified=True,
            timezone="Europe/London",
            language="en"
        )
        
        session.add_all([admin_user, demo_user, viewer_user])
        await session.commit()
        
        # Create user preferences
        for user in [admin_user, demo_user, viewer_user]:
            preferences = UserPreference(
                user_id=user.id,
                theme="dark",
                notifications_enabled=True,
                email_notifications=True,
                workflow_notifications=True,
                security_notifications=True,
                weekly_reports=user.role != UserRole.VIEWER,
                dashboard_layout={
                    "widgets": ["workflows", "analytics", "recent_activity"],
                    "layout": "grid"
                }
            )
            session.add(preferences)
        
        await session.commit()
        print(f"✅ Created 3 sample users: admin, demo_user, viewer")
        return admin_user, demo_user, viewer_user

async def create_sample_api_keys(users):
    """Create sample API keys"""
    print("🔑 Creating sample API keys...")
    
    async with get_db_session() as session:
        admin_user, demo_user, viewer_user = users
        
        # API keys for demo user
        api_keys = [
            APIKey(
                owner_id=demo_user.id,
                name="Production API",
                key_prefix="sk_prod_",
                key_hash=hashlib.sha256("sk_prod_demo_key_123".encode()).hexdigest(),
                is_active=True,
                rate_limit=5000,
                expires_at=datetime.utcnow() + timedelta(days=365)
            ),
            APIKey(
                owner_id=demo_user.id,
                name="Development API",
                key_prefix="sk_dev_",
                key_hash=hashlib.sha256("sk_dev_demo_key_456".encode()).hexdigest(),
                is_active=True,
                rate_limit=1000,
                expires_at=datetime.utcnow() + timedelta(days=90)
            )
        ]
        
        session.add_all(api_keys)
        await session.commit()
        print(f"✅ Created {len(api_keys)} API keys")

async def create_sample_workflows(users):
    """Create sample workflows"""
    print("📋 Creating sample workflows...")
    
    async with get_db_session() as session:
        admin_user, demo_user, viewer_user = users
        
        workflows = [
            Workflow(
                name="Customer Onboarding Process",
                description="Automated workflow for new customer onboarding including welcome emails, account setup, and initial training.",
                nodes=[
                    {"id": "start", "type": "trigger", "label": "New Customer Signup"},
                    {"id": "email1", "type": "email", "label": "Welcome Email"},
                    {"id": "create_account", "type": "api", "label": "Create Account"},
                    {"id": "schedule_training", "type": "schedule", "label": "Schedule Training"}
                ],
                edges=[
                    {"id": "e1", "source": "start", "target": "email1"},
                    {"id": "e2", "source": "email1", "target": "create_account"},
                    {"id": "e3", "source": "create_account", "target": "schedule_training"}
                ],
                status=WorkflowStatus.ACTIVE,
                owner_id=demo_user.id,
                category="Customer Management",
                tags=["onboarding", "automation", "email"],
                execution_count=45,
                success_count=42,
                failure_count=3,
                average_duration=120.5
            ),
            Workflow(
                name="Weekly Report Generation",
                description="Automatically generate and distribute weekly performance reports to stakeholders.",
                nodes=[
                    {"id": "trigger", "type": "schedule", "label": "Weekly Trigger"},
                    {"id": "collect_data", "type": "api", "label": "Collect Analytics Data"},
                    {"id": "generate_report", "type": "transform", "label": "Generate Report"},
                    {"id": "send_email", "type": "email", "label": "Send Report Email"}
                ],
                edges=[
                    {"id": "e1", "source": "trigger", "target": "collect_data"},
                    {"id": "e2", "source": "collect_data", "target": "generate_report"},
                    {"id": "e3", "source": "generate_report", "target": "send_email"}
                ],
                status=WorkflowStatus.ACTIVE,
                owner_id=demo_user.id,
                category="Reporting",
                tags=["reporting", "scheduled", "analytics"],
                execution_count=12,
                success_count=11,
                failure_count=1,
                average_duration=45.2
            ),
            Workflow(
                name="Invoice Processing Automation",
                description="Process incoming invoices, validate data, and route for approval.",
                nodes=[
                    {"id": "receive", "type": "webhook", "label": "Receive Invoice"},
                    {"id": "validate", "type": "validation", "label": "Validate Data"},
                    {"id": "approve", "type": "approval", "label": "Route for Approval"},
                    {"id": "store", "type": "storage", "label": "Store in Database"}
                ],
                edges=[
                    {"id": "e1", "source": "receive", "target": "validate"},
                    {"id": "e2", "source": "validate", "target": "approve"},
                    {"id": "e3", "source": "approve", "target": "store"}
                ],
                status=WorkflowStatus.DRAFT,
                owner_id=admin_user.id,
                category="Finance",
                tags=["invoice", "automation", "approval"],
                execution_count=0,
                success_count=0,
                failure_count=0,
                average_duration=0.0
            )
        ]
        
        session.add_all(workflows)
        await session.commit()
        
        # Create workflow executions
        for workflow in workflows:
            if workflow.execution_count > 0:
                for i in range(min(5, workflow.execution_count)):  # Create up to 5 sample executions
                    execution = WorkflowExecution(
                        workflow_id=workflow.id,
                        execution_id=str(uuid.uuid4()),
                        status=ExecutionStatus.COMPLETED if i < workflow.success_count else ExecutionStatus.FAILED,
                        triggered_by="manual" if i % 2 == 0 else "scheduled",
                        start_time=datetime.utcnow() - timedelta(days=i+1),
                        end_time=datetime.utcnow() - timedelta(days=i+1, seconds=-workflow.average_duration),
                        duration=workflow.average_duration + (i * 10),  # Slight variation
                        execution_data={"nodes_processed": len(workflow.nodes), "data_size": "medium"},
                        nodes_executed=[node["id"] for node in workflow.nodes]
                    )
                    session.add(execution)
        
        await session.commit()
        print(f"✅ Created {len(workflows)} sample workflows with executions")

async def create_sample_email_campaigns(users):
    """Create sample email campaigns"""
    print("📧 Creating sample email campaigns...")
    
    async with get_db_session() as session:
        admin_user, demo_user, viewer_user = users
        
        campaigns = [
            EmailCampaign(
                name="Welcome Series - Week 1",
                subject="Welcome to AI Automation Platform! 🚀",
                content="""
                <html>
                <body>
                    <h1>Welcome to AI Automation Platform!</h1>
                    <p>We're excited to have you on board. This email series will help you get started with our platform.</p>
                    <p>In this week, you'll learn:</p>
                    <ul>
                        <li>How to create your first workflow</li>
                        <li>Setting up integrations</li>
                        <li>Understanding analytics</li>
                    </ul>
                    <p>Best regards,<br>The AI Automation Team</p>
                </body>
                </html>
                """,
                content_type="html",
                recipients=[
                    {"email": "customer1@example.com", "name": "John Doe"},
                    {"email": "customer2@example.com", "name": "Jane Smith"},
                    {"email": "customer3@example.com", "name": "Bob Johnson"}
                ],
                sender_name="AI Automation Platform",
                sender_email="noreply@automation-platform.com",
                reply_to="support@automation-platform.com",
                status="sent",
                owner_id=demo_user.id,
                recipient_count=3,
                delivery_rate=100.0,
                open_rate=85.7,
                click_rate=42.3,
                bounce_rate=0.0,
                unsubscribe_rate=0.0,
                sent_time=datetime.utcnow() - timedelta(days=2),
                tags=["welcome", "onboarding", "series"]
            ),
            EmailCampaign(
                name="Product Update Announcement",
                subject="🎉 New Features Released - Check Them Out!",
                content="""
                <html>
                <body>
                    <h1>Exciting New Features!</h1>
                    <p>We've just released some amazing new features:</p>
                    <ul>
                        <li>Advanced workflow analytics</li>
                        <li>Enhanced API integrations</li>
                        <li>Improved user interface</li>
                    </ul>
                    <p><a href="https://automation-platform.com/features">Learn More</a></p>
                </body>
                </html>
                """,
                content_type="html",
                recipients=[
                    "user1@example.com",
                    "user2@example.com",
                    "user3@example.com",
                    "user4@example.com",
                    "user5@example.com"
                ],
                status="scheduled",
                owner_id=demo_user.id,
                recipient_count=5,
                scheduled_time=datetime.utcnow() + timedelta(hours=2),
                tags=["product", "update", "features"]
            )
        ]
        
        session.add_all(campaigns)
        await session.commit()
        
        # Create analytics for sent campaigns
        for campaign in campaigns:
            if campaign.status == "sent":
                analytics = EmailAnalytics(
                    campaign_id=campaign.id,
                    emails_sent=campaign.recipient_count,
                    emails_delivered=campaign.recipient_count,
                    emails_opened=int(campaign.recipient_count * campaign.open_rate / 100),
                    unique_opens=int(campaign.recipient_count * campaign.open_rate / 100 * 0.9),
                    links_clicked=int(campaign.recipient_count * campaign.click_rate / 100),
                    unique_clicks=int(campaign.recipient_count * campaign.click_rate / 100 * 0.8),
                    bounced=int(campaign.recipient_count * campaign.bounce_rate / 100),
                    unsubscribed=int(campaign.recipient_count * campaign.unsubscribe_rate / 100),
                    click_tracking_data={
                        "https://automation-platform.com/features": 8,
                        "https://automation-platform.com/docs": 3
                    },
                    geographic_data={
                        "US": 60,
                        "EU": 30,
                        "Other": 10
                    },
                    device_data={
                        "desktop": 65,
                        "mobile": 30,
                        "tablet": 5
                    }
                )
                session.add(analytics)
        
        await session.commit()
        print(f"✅ Created {len(campaigns)} sample email campaigns with analytics")

async def create_sample_scheduled_tasks(users):
    """Create sample scheduled tasks"""
    print("⏰ Creating sample scheduled tasks...")
    
    async with get_db_session() as session:
        admin_user, demo_user, viewer_user = users
        
        tasks = [
            ScheduledTask(
                name="Daily Database Backup",
                description="Automated daily backup of the main database",
                task_type=TaskType.DATA_SYNC,
                schedule_expression="0 2 * * *",  # Daily at 2 AM
                timezone="UTC",
                task_data={
                    "backup_type": "full",
                    "retention_days": 30,
                    "compression": True,
                    "notification_email": "admin@automation-platform.com"
                },
                is_active=True,
                owner_id=admin_user.id,
                next_run=datetime.utcnow() + timedelta(hours=8),
                last_run=datetime.utcnow() - timedelta(days=1),
                execution_count=30,
                success_count=29,
                failure_count=1,
                average_duration=450.0,  # 7.5 minutes
                max_retries=3,
                retry_delay=600,
                timeout=3600
            ),
            ScheduledTask(
                name="Weekly Analytics Report",
                description="Generate and send weekly analytics reports",
                task_type=TaskType.SCHEDULED_REPORT,
                schedule_expression="0 9 * * 1",  # Monday at 9 AM
                timezone="America/New_York",
                task_data={
                    "report_type": "analytics",
                    "recipients": ["admin@automation-platform.com", "manager@automation-platform.com"],
                    "include_charts": True,
                    "format": "pdf"
                },
                is_active=True,
                owner_id=demo_user.id,
                next_run=datetime.utcnow() + timedelta(days=3),
                last_run=datetime.utcnow() - timedelta(days=4),
                execution_count=12,
                success_count=12,
                failure_count=0,
                average_duration=180.0,  # 3 minutes
            ),
            ScheduledTask(
                name="API Health Check",
                description="Monitor API endpoints and send alerts if any are down",
                task_type=TaskType.API_CALL,
                schedule_expression="*/5 * * * *",  # Every 5 minutes
                timezone="UTC",
                task_data={
                    "endpoints": [
                        "https://api.automation-platform.com/health",
                        "https://api.automation-platform.com/status"
                    ],
                    "timeout": 30,
                    "alert_threshold": 3,
                    "notification_webhook": "https://hooks.slack.com/services/..."
                },
                is_active=True,
                owner_id=admin_user.id,
                next_run=datetime.utcnow() + timedelta(minutes=5),
                last_run=datetime.utcnow() - timedelta(minutes=5),
                execution_count=2880,  # Lots of executions for a 5-minute interval
                success_count=2875,
                failure_count=5,
                average_duration=2.3
            )
        ]
        
        session.add_all(tasks)
        await session.commit()
        print(f"✅ Created {len(tasks)} sample scheduled tasks")

async def create_sample_api_integrations(users):
    """Create sample API integrations"""
    print("🔗 Creating sample API integrations...")
    
    async with get_db_session() as session:
        admin_user, demo_user, viewer_user = users
        
        integrations = [
            APIIntegration(
                name="Slack Notifications",
                description="Send notifications to Slack channels",
                service_type=IntegrationType.SLACK,
                api_endpoint="https://hooks.slack.com/services/...",
                auth_type="custom",  # Changed from "webhook"
                auth_data={"webhook_url": "https://hooks.slack.com/services/..."},
                configuration={
                    "default_channel": "#automation",
                    "notification_types": ["workflow_success", "workflow_failure", "system_alerts"]
                },
                is_active=True,
                owner_id=demo_user.id,
                last_used=datetime.utcnow() - timedelta(hours=2),
                usage_count=156,
                error_count=3,
                rate_limit=1000
            ),
            APIIntegration(
                name="Google Workspace",
                description="Integration with Google Sheets, Drive, and Gmail",
                service_type=IntegrationType.GOOGLE_WORKSPACE,
                api_endpoint="https://www.googleapis.com",
                auth_type="oauth2",
                auth_data={"client_id": "dummy_client_id", "scopes": ["sheets", "drive", "gmail"]},
                configuration={
                    "default_spreadsheet": "1ABC123...",
                    "drive_folder": "AutomationPlatform",
                    "email_signature": "Sent via AI Automation Platform"
                },
                is_active=True,
                owner_id=demo_user.id,
                last_used=datetime.utcnow() - timedelta(minutes=30),
                usage_count=89,
                error_count=1,
                rate_limit=10000
            ),
            APIIntegration(
                name="SendGrid Email Service",
                description="Email delivery service integration",
                service_type=IntegrationType.SENDGRID,
                api_endpoint="https://api.sendgrid.com/v3",
                auth_type="api_key",
                auth_data={"api_key": "SG.dummy_key_123..."},
                configuration={
                    "default_from_email": "noreply@automation-platform.com",
                    "default_from_name": "AI Automation Platform",
                    "tracking_enabled": True
                },
                is_active=True,
                owner_id=admin_user.id,
                last_used=datetime.utcnow() - timedelta(hours=1),
                usage_count=234,
                error_count=5,
                rate_limit=50000
            ),
            APIIntegration(
                name="Stripe Payment Processing",
                description="Handle payment webhooks and customer data",
                service_type=IntegrationType.STRIPE,
                api_endpoint="https://api.stripe.com/v1",
                auth_type="api_key",
                auth_data={"api_key": "sk_test_dummy_key..."},
                configuration={
                    "webhook_endpoints": [
                        "customer.created",
                        "payment_intent.succeeded",
                        "subscription.updated"
                    ],
                    "currency": "usd"
                },
                is_active=False,  # Disabled for demo
                owner_id=demo_user.id,
                last_used=datetime.utcnow() - timedelta(days=5),
                usage_count=45,
                error_count=2,
                rate_limit=1000
            )
        ]
        
        session.add_all(integrations)
        await session.commit()
        print(f"✅ Created {len(integrations)} sample API integrations")

async def create_sample_workflow_templates():
    """Create sample workflow templates"""
    print("📋 Creating sample workflow templates...")
    
    async with get_db_session() as session:
        templates = [
            WorkflowTemplate(
                name="Customer Feedback Collection",
                description="Automated workflow to collect and process customer feedback via email surveys",
                category="Customer Experience",
                subcategory="Feedback Management",
                complexity_level="beginner",
                estimated_setup_time=15,
                nodes=[
                    {"id": "trigger", "type": "webhook", "label": "Customer Purchase Trigger"},
                    {"id": "delay", "type": "delay", "label": "Wait 24 Hours"},
                    {"id": "survey", "type": "email", "label": "Send Feedback Survey"},
                    {"id": "collect", "type": "form", "label": "Collect Responses"},
                    {"id": "analyze", "type": "ai", "label": "Analyze Sentiment"}
                ],
                edges=[
                    {"source": "trigger", "target": "delay"},
                    {"source": "delay", "target": "survey"},
                    {"source": "survey", "target": "collect"},
                    {"source": "collect", "target": "analyze"}
                ],
                is_public=True,
                is_verified=True,
                usage_count=45,
                rating_average=4.3,
                rating_count=12,
                tags=["feedback", "email", "ai", "sentiment"]
            ),
            WorkflowTemplate(
                name="Lead Nurturing Campaign",
                description="Multi-touch lead nurturing workflow with personalized content",
                category="Marketing",
                subcategory="Lead Generation",
                complexity_level="intermediate",
                estimated_setup_time=45,
                nodes=[
                    {"id": "lead_capture", "type": "form", "label": "Lead Capture Form"},
                    {"id": "segment", "type": "condition", "label": "Segment Leads"},
                    {"id": "email1", "type": "email", "label": "Welcome Email"},
                    {"id": "wait1", "type": "delay", "label": "Wait 3 Days"},
                    {"id": "email2", "type": "email", "label": "Educational Content"},
                    {"id": "wait2", "type": "delay", "label": "Wait 5 Days"},
                    {"id": "email3", "type": "email", "label": "Product Demo Offer"}
                ],
                edges=[
                    {"source": "lead_capture", "target": "segment"},
                    {"source": "segment", "target": "email1"},
                    {"source": "email1", "target": "wait1"},
                    {"source": "wait1", "target": "email2"},
                    {"source": "email2", "target": "wait2"},
                    {"source": "wait2", "target": "email3"}
                ],
                is_public=True,
                is_verified=True,
                usage_count=89,
                rating_average=4.7,
                rating_count=23,
                tags=["marketing", "lead-nurturing", "email-sequence", "automation"]
            ),
            WorkflowTemplate(
                name="Inventory Management Automation",
                description="Advanced workflow for automated inventory tracking and reordering",
                category="Operations",
                subcategory="Inventory",
                complexity_level="advanced",
                estimated_setup_time=120,
                nodes=[
                    {"id": "monitor", "type": "schedule", "label": "Monitor Inventory Levels"},
                    {"id": "check", "type": "condition", "label": "Check Stock Levels"},
                    {"id": "predict", "type": "ai", "label": "Predict Demand"},
                    {"id": "calculate", "type": "transform", "label": "Calculate Reorder Amount"},
                    {"id": "approve", "type": "approval", "label": "Approval Gate"},
                    {"id": "order", "type": "api", "label": "Create Purchase Order"},
                    {"id": "notify", "type": "email", "label": "Notify Stakeholders"}
                ],
                edges=[
                    {"source": "monitor", "target": "check"},
                    {"source": "check", "target": "predict"},
                    {"source": "predict", "target": "calculate"},
                    {"source": "calculate", "target": "approve"},
                    {"source": "approve", "target": "order"},
                    {"source": "order", "target": "notify"}
                ],
                is_public=True,
                is_verified=True,
                usage_count=23,
                rating_average=4.5,
                rating_count=8,
                tags=["inventory", "ai", "prediction", "automation", "operations"]
            )
        ]
        
        session.add_all(templates)
        await session.commit()
        print(f"✅ Created {len(templates)} sample workflow templates")

async def create_audit_logs(users):
    """Create sample audit logs"""
    print("📝 Creating sample audit logs...")
    
    async with get_db_session() as session:
        admin_user, demo_user, viewer_user = users
        
        # Generate various audit log entries
        audit_entries = [
            # User actions
            AuditLog(
                user_id=demo_user.id,
                action="CREATE_WORKFLOW",
                resource_type="workflow",
                resource_id="1",
                details={"workflow_name": "Customer Onboarding Process"},
                ip_address="192.168.1.100",
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                success=True,
                created_at=datetime.utcnow() - timedelta(hours=2)
            ),
            AuditLog(
                user_id=demo_user.id,
                action="EXECUTE_WORKFLOW",
                resource_type="workflow",
                resource_id="1",
                details={"execution_id": str(uuid.uuid4()), "trigger": "manual"},
                ip_address="192.168.1.100",
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                success=True,
                created_at=datetime.utcnow() - timedelta(minutes=30)
            ),
            AuditLog(
                user_id=admin_user.id,
                action="CREATE_API_KEY",
                resource_type="api_key",
                resource_id="1",
                details={"key_name": "Production API", "rate_limit": 5000},
                ip_address="10.0.0.50",
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                success=True,
                created_at=datetime.utcnow() - timedelta(days=1)
            ),
            AuditLog(
                user_id=demo_user.id,
                action="SEND_EMAIL_CAMPAIGN",
                resource_type="email_campaign",
                resource_id="1",
                details={"campaign_name": "Welcome Series - Week 1", "recipient_count": 3},
                ip_address="192.168.1.100",
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                success=True,
                created_at=datetime.utcnow() - timedelta(days=2)
            ),
            # Failed attempt
            AuditLog(
                user_id=None,  # Unknown user
                action="LOGIN_ATTEMPT",
                resource_type="user",
                resource_id="unknown",
                details={"username": "hacker", "reason": "invalid_credentials"},
                ip_address="45.123.45.67",
                user_agent="curl/7.68.0",
                success=False,
                error_message="Invalid username or password",
                created_at=datetime.utcnow() - timedelta(hours=6)
            )
        ]
        
        session.add_all(audit_entries)
        await session.commit()
        print(f"✅ Created {len(audit_entries)} sample audit log entries")

async def verify_database_constraints():
    """Verify that database constraints are working properly"""
    print("🔍 Verifying database constraints...")
    
    # Test email validation constraint
    try:
        async with get_db_session() as session:
            invalid_user = User(
                email="invalid-email",  # This should fail
                username="test_user_invalid",
                hashed_password="test"
            )
            session.add(invalid_user)
            await session.commit()
        print("❌ Email validation constraint failed!")
    except Exception as e:
        print("✅ Email validation constraint working")
    
    # Test username uniqueness constraint  
    try:
        async with get_db_session() as session:
            existing_user = User(
                email="test@example.com",
                username="admin",  # This should fail (already exists)
                hashed_password="test"
            )
            session.add(existing_user)
            await session.commit()
        print("❌ Username uniqueness constraint failed!")
    except Exception as e:
        print("✅ Username uniqueness constraint working")
    
    print("✅ Database constraints verification completed")

async def display_database_summary():
    """Display a summary of the created database content"""
    print("\n" + "="*60)
    print("📊 DATABASE SUMMARY")
    print("="*60)
    
    async with get_db_session() as session:
        from sqlalchemy import text
        
        tables = [
            ("Users", "users"),
            ("Workflows", "workflows"),
            ("Workflow Executions", "workflow_executions"),
            ("Email Campaigns", "email_campaigns"),
            ("Email Analytics", "email_analytics"),
            ("Scheduled Tasks", "scheduled_tasks"),
            ("API Integrations", "api_integrations"),
            ("API Keys", "api_keys"),
            ("Workflow Templates", "workflow_templates"),
            ("Audit Logs", "audit_logs"),
            ("User Preferences", "user_preferences")
        ]
        
        for display_name, table_name in tables:
            result = await session.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
            count = result.scalar()
            print(f"{display_name:<20}: {count:>3} records")
        
    print("="*60)
    print("\n🔐 Sample Login Credentials:")
    print("-" * 30)
    print("Admin User:")
    print("  Email: admin@automation-platform.com")
    print("  Password: admin123!@#")
    print("\nDemo User:")
    print("  Email: demo@automation-platform.com")
    print("  Password: demo123!@#")
    print("\nViewer User:")
    print("  Email: viewer@automation-platform.com")
    print("  Password: viewer123!@#")
    print("="*60)

async def main():
    """Main initialization function"""
    print("🚀 Starting database initialization...")
    print("="*60)
    
    try:
        # Initialize database
        await init_db()
        print("✅ Database initialized successfully")
        
        # Create sample data
        users = await create_sample_users()
        await create_sample_api_keys(users)
        await create_sample_workflows(users)
        await create_sample_email_campaigns(users)
        await create_sample_scheduled_tasks(users)
        await create_sample_api_integrations(users)
        await create_sample_workflow_templates()
        await create_audit_logs(users)
        
        # Verify constraints
        await verify_database_constraints()
        
        # Display summary
        await display_database_summary()
        
        print("\n✅ Database initialization completed successfully!")
        print("🎉 Your AI Automation Platform database is ready to use!")
        
    except Exception as e:
        print(f"\n❌ Database initialization failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())