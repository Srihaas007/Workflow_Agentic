"""
Simple database initialization script that creates schema and adds sample data
"""
import asyncio
import os
from pathlib import Path
from backend.core.database import engine, async_session
from backend.core.models import Base, User, Workflow, EmailCampaign
import hashlib


async def init_database():
    """Initialize database with schema and sample data."""
    print("🚀 Initializing database...")
    
    # Set JWT secret for config validation
    os.environ['JWT_SECRET_KEY'] = 'dev-jwt-secret-key-with-32-chars-minimum-requirement'
    
    # Create database file path
    db_file = Path("automation_platform.db")
    if db_file.exists():
        db_file.unlink()
        print("📝 Removed existing database")
    
    # Create all tables using the existing engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database schema created")
    
    # Create sample data using the existing session factory
    async with async_session() as session:
        try:
            # Create admin user
            admin_password = hashlib.sha256("admin123".encode()).hexdigest()
            admin_user = User(
                email="admin@automation-platform.com",
                username="admin",
                hashed_password=admin_password,
                first_name="System",
                last_name="Administrator",
                role="ADMIN",
                is_active=True,
                is_verified=True,
                timezone="UTC",
                language="en"
            )
            session.add(admin_user)
            
            # Create regular user
            user_password = hashlib.sha256("user123".encode()).hexdigest()
            regular_user = User(
                email="user@automation-platform.com",
                username="user",
                hashed_password=user_password,
                first_name="Regular",
                last_name="User",
                role="USER",
                is_active=True,
                is_verified=True,
                timezone="UTC",
                language="en"
            )
            session.add(regular_user)
            
            await session.commit()
            print("✅ Sample users created")
            
            # Create sample workflow
            sample_workflow = Workflow(
                name="Welcome Email Workflow",
                description="Automated welcome email for new users",
                nodes=[{"id": "start", "type": "trigger", "data": {"event": "user_registration"}}],
                edges=[],
                status="ACTIVE",
                owner_id=admin_user.id,
                category="Email Automation"
            )
            session.add(sample_workflow)
            
            # Create sample email campaign
            sample_campaign = EmailCampaign(
                name="Monthly Newsletter",
                subject="Our Monthly Update",
                content="Welcome to our newsletter!",
                content_type="html",
                recipients=[],
                sender_email="newsletter@automation-platform.com",
                sender_name="Automation Platform",
                status="draft",
                owner_id=admin_user.id
            )
            session.add(sample_campaign)
            
            await session.commit()
            print("✅ Sample workflows and campaigns created")
            
        except Exception as e:
            await session.rollback()
            raise e
    
    # Close engine
    await engine.dispose()
    
    print("🎉 Database initialization completed successfully!")
    print("\nAdmin User:")
    print("  Email: admin@automation-platform.com")
    print("  Password: admin123")
    print("\nRegular User:")
    print("  Email: user@automation-platform.com") 
    print("  Password: user123")


if __name__ == "__main__":
    asyncio.run(init_database())