"""
Script to delete existing demo users and recreate them with correct roles
"""

import asyncio
import hashlib
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.database import engine, async_session
from backend.core.models import User, UserRole

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

async def recreate_demo_users():
    """Delete and recreate demo users with correct schema"""
    
    async with async_session() as session:
        try:
            from sqlalchemy.future import select
            from sqlalchemy import delete
            
            # Delete existing demo users
            await session.execute(
                delete(User).filter(User.email == "admin@automation-platform.com")
            )
            await session.execute(
                delete(User).filter(User.email == "user@automation-platform.com")
            )
            
            # Create admin user with correct role
            admin_user = User(
                username="admin",
                email="admin@automation-platform.com",
                hashed_password=hash_password("admin123"),
                first_name="Admin",
                last_name="User",
                is_active=True,
                role=UserRole.ADMIN,
                created_at=datetime.utcnow(),
                failed_login_attempts=0
            )
            session.add(admin_user)
            print("✅ Created admin demo user with ADMIN role")
            
            # Create regular user with correct role
            regular_user = User(
                username="user",
                email="user@automation-platform.com",
                hashed_password=hash_password("user123"),
                first_name="Regular",
                last_name="User",
                is_active=True,
                role=UserRole.USER,
                created_at=datetime.utcnow(),
                failed_login_attempts=0
            )
            session.add(regular_user)
            print("✅ Created regular demo user with USER role")
            
            await session.commit()
            print("🎉 Demo users recreated with correct roles!")
            
        except Exception as e:
            await session.rollback()
            print(f"❌ Error recreating demo users: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(recreate_demo_users())