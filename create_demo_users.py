"""
Script to create demo users in the database
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

async def create_demo_users():
    """Create demo users in the database"""
    
    async with async_session() as session:
        try:
            # Check if demo users already exist
            from sqlalchemy.future import select
            
            admin_result = await session.execute(
                select(User).filter(User.email == "admin@automation-platform.com")
            )
            admin_user = admin_result.scalar_one_or_none()
            
            if not admin_user:
                # Create admin user
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
                print("✅ Created admin demo user")
            else:
                print("ℹ️ Admin demo user already exists")
            
            user_result = await session.execute(
                select(User).filter(User.email == "user@automation-platform.com")
            )
            regular_user = user_result.scalar_one_or_none()
            
            if not regular_user:
                # Create regular user
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
                print("✅ Created regular demo user")
            else:
                print("ℹ️ Regular demo user already exists")
            
            await session.commit()
            print("🎉 Demo users are ready!")
            
        except Exception as e:
            await session.rollback()
            print(f"❌ Error creating demo users: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(create_demo_users())