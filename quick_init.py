"""
Quick database initialization script with sample data.
"""

import asyncio
import sys
from pathlib import Path
from datetime import datetime, timedelta
import hashlib

# Add the project root to the Python path
sys.path.append(str(Path(__file__).parent))

from backend.core.database import get_db_session
from backend.core.models import (
    User, UserPreference, APIKey, Workflow, WorkflowExecution, 
    EmailCampaign, EmailAnalytics, ScheduledTask, APIIntegration, 
    WorkflowTemplate, AuditLog, UserRole, WorkflowStatus, 
    ExecutionStatus, TaskType, IntegrationType
)
import uuid
import json

async def create_sample_data():
    """Create all sample data in one function"""
    print("🚀 Creating sample data...")
    
    async with get_db_session() as session:
        # Create users
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
        
        session.add_all([admin_user, demo_user])
        await session.commit()
        print("✅ Created users")
        
        # Create user preferences
        for user in [admin_user, demo_user]:
            preferences = UserPreference(
                user_id=user.id,
                theme="dark",
                notifications_enabled=True,
                email_notifications=True,
                workflow_notifications=True,
                security_notifications=True,
                weekly_reports=True,
                dashboard_layout={"widgets": ["workflows", "analytics"], "layout": "grid"}
            )
            session.add(preferences)
        
        await session.commit()
        print("✅ Created user preferences")
        
        # Create API keys
        api_key = APIKey(
            owner_id=demo_user.id,
            name="Demo API Key",
            key_prefix="sk_demo_",
            key_hash=hashlib.sha256("demo_key_123".encode()).hexdigest(),
            is_active=True,
            rate_limit=1000,
            expires_at=datetime.utcnow() + timedelta(days=365)
        )
        session.add(api_key)
        await session.commit()
        print("✅ Created API keys")
        
        # Create workflow
        workflow = Workflow(
            name="Sample Workflow",
            description="A sample automated workflow",
            nodes=[
                {"id": "start", "type": "trigger", "label": "Start"},
                {"id": "email", "type": "email", "label": "Send Email"}
            ],
            edges=[{"id": "e1", "source": "start", "target": "email"}],
            status=WorkflowStatus.ACTIVE,
            owner_id=demo_user.id,
            category="Demo",
            tags=["sample", "demo"],
            execution_count=5,
            success_count=4,
            failure_count=1,
            average_duration=30.5
        )
        session.add(workflow)
        await session.commit()
        print("✅ Created workflows")
        
        # Create workflow execution
        execution = WorkflowExecution(
            workflow_id=workflow.id,
            execution_id=str(uuid.uuid4()),
            status=ExecutionStatus.COMPLETED,
            triggered_by="manual",
            start_time=datetime.utcnow() - timedelta(minutes=5),
            end_time=datetime.utcnow() - timedelta(minutes=4),
            duration=30.5,
            execution_data={"status": "success"},
            nodes_executed=["start", "email"]
        )
        session.add(execution)
        await session.commit()
        print("✅ Created workflow executions")
        
        # Create email campaign
        campaign = EmailCampaign(
            name="Welcome Campaign",
            subject="Welcome to AI Automation!",
            content="<h1>Welcome!</h1><p>Thank you for joining us.</p>",
            content_type="html",
            recipients=["user1@example.com", "user2@example.com"],
            sender_name="AI Automation Platform",
            sender_email="noreply@automation-platform.com",
            status="sent",
            owner_id=demo_user.id,
            recipient_count=2,
            delivery_rate=100.0,
            open_rate=85.0,
            click_rate=40.0,
            bounce_rate=0.0,
            unsubscribe_rate=0.0,
            sent_time=datetime.utcnow() - timedelta(days=1),
            tags=["welcome"]
        )
        session.add(campaign)
        await session.commit()
        print("✅ Created email campaigns")
        
        # Create email analytics
        analytics = EmailAnalytics(
            campaign_id=campaign.id,
            emails_sent=2,
            emails_delivered=2,
            emails_opened=2,
            unique_opens=2,
            links_clicked=1,
            unique_clicks=1,
            bounced=0,
            soft_bounces=0,
            hard_bounces=0,
            unsubscribed=0,
            spam_complaints=0,
            forwarded=0,
            click_tracking_data={"link1": 1},
            geographic_data={"US": 100},
            device_data={"desktop": 100}
        )
        session.add(analytics)
        await session.commit()
        print("✅ Created email analytics")
        
        # Create scheduled task
        task = ScheduledTask(
            name="Daily Backup",
            description="Daily database backup",
            task_type=TaskType.DATA_SYNC,
            schedule_expression="0 2 * * *",
            timezone="UTC",
            task_data={"backup_type": "full"},
            is_active=True,
            owner_id=admin_user.id,
            next_run=datetime.utcnow() + timedelta(days=1),
            execution_count=10,
            success_count=10,
            failure_count=0,
            average_duration=120.0,
            max_retries=3,
            retry_delay=300,
            timeout=3600
        )
        session.add(task)
        await session.commit()
        print("✅ Created scheduled tasks")
        
        # Create API integration
        integration = APIIntegration(
            name="Slack Integration",
            description="Send notifications to Slack",
            service_type=IntegrationType.SLACK,
            api_endpoint="https://hooks.slack.com/services/...",
            auth_type="custom",
            auth_data={"webhook_url": "https://hooks.slack.com/services/..."},
            configuration={"channel": "#automation"},
            is_active=True,
            owner_id=demo_user.id,
            usage_count=25,
            error_count=0,
            rate_limit=1000
        )
        session.add(integration)
        await session.commit()
        print("✅ Created API integrations")
        
        # Create workflow template
        template = WorkflowTemplate(
            name="Basic Email Workflow",
            description="A simple email workflow template",
            category="Email",
            nodes=[
                {"id": "trigger", "type": "trigger", "label": "Trigger"},
                {"id": "email", "type": "email", "label": "Send Email"}
            ],
            edges=[{"source": "trigger", "target": "email"}],
            is_public=True,
            is_verified=True,
            usage_count=10,
            rating_average=4.5,
            rating_count=5,
            complexity_level="beginner",
            estimated_setup_time=10,
            tags=["email", "simple"],
            version="1.0.0"
        )
        session.add(template)
        await session.commit()
        print("✅ Created workflow templates")
        
        # Create audit log
        audit_log = AuditLog(
            user_id=demo_user.id,
            action="CREATE_WORKFLOW",
            resource_type="workflow",
            resource_id=str(workflow.id),
            details={"workflow_name": "Sample Workflow"},
            ip_address="192.168.1.1",
            user_agent="Mozilla/5.0...",
            success=True,
            created_at=datetime.utcnow()
        )
        session.add(audit_log)
        await session.commit()
        print("✅ Created audit logs")

async def show_summary():
    """Display database summary"""
    async with get_db_session() as session:
        from sqlalchemy import text
        
        tables = [
            ("Users", "users"),
            ("Workflows", "workflows"),
            ("Email Campaigns", "email_campaigns"),
            ("Scheduled Tasks", "scheduled_tasks"),
            ("API Integrations", "api_integrations"),
            ("API Keys", "api_keys"),
            ("Workflow Templates", "workflow_templates"),
            ("Audit Logs", "audit_logs"),
            ("User Preferences", "user_preferences")
        ]
        
        print("\n" + "="*60)
        print("📊 DATABASE SUMMARY")
        print("="*60)
        
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
        print("="*60)

async def main():
    """Main function"""
    try:
        await create_sample_data()
        await show_summary()
        print("\n✅ Database initialization completed successfully!")
        print("🎉 Your AI Automation Platform database is ready to use!")
    except Exception as e:
        print(f"\n❌ Database initialization failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())