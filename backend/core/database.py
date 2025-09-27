"""
Database configuration and initialization.
"""

from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
import asyncio
from typing import AsyncGenerator

from .config import settings

# Create async engine
# Support both SQLite and PostgreSQL
if settings.DATABASE_URL.startswith('sqlite'):
    database_url = settings.DATABASE_URL.replace('sqlite://', 'sqlite+aiosqlite://')
else:
    database_url = settings.DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://')

engine = create_async_engine(
    database_url,
    echo=settings.DEBUG,
    future=True
)

# Create async session
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Create declarative base
Base = declarative_base()

# Metadata for migrations
metadata = MetaData()

async def init_db():
    """Initialize the database"""
    try:
        async with engine.begin() as conn:
            # Create all tables
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """Get async database session"""
    async with async_session() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# Dependency for FastAPI
async def get_db():
    """Database dependency for FastAPI"""
    async for session in get_async_session():
        yield session