"""
Enhanced database configuration and initialization with proper error handling and connection pooling.
"""

from sqlalchemy import create_engine, MetaData, event, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool
import asyncio
import logging
from typing import AsyncGenerator, Optional
from contextlib import asynccontextmanager

from .config import settings

# Setup logging
logger = logging.getLogger(__name__)

# Import models to ensure they're registered
from .models import Base

# Create async engine with proper configuration
def get_database_url() -> str:
    """Get the appropriate database URL for async operations"""
    if settings.DATABASE_URL.startswith('sqlite'):
        # For SQLite, use aiosqlite
        return settings.DATABASE_URL.replace('sqlite://', 'sqlite+aiosqlite://')
    elif settings.DATABASE_URL.startswith('postgresql'):
        # For PostgreSQL, use asyncpg
        return settings.DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://')
    else:
        # Default fallback
        return settings.DATABASE_URL

# Database URL for async operations
DATABASE_URL = get_database_url()

# Engine configuration
engine_kwargs = {
    "echo": settings.DEBUG,
    "future": True,
    "pool_pre_ping": True,  # Verify connections before use
}

# SQLite-specific configuration
if DATABASE_URL.startswith('sqlite'):
    engine_kwargs.update({
        "poolclass": StaticPool,
        "connect_args": {
            "check_same_thread": False,
            "timeout": 20,
            "isolation_level": None,
        }
    })
else:
    # PostgreSQL configuration
    engine_kwargs.update({
        "pool_size": 20,
        "max_overflow": 30,
        "pool_timeout": 30,
        "pool_recycle": 3600,
    })

# Create async engine
engine = create_async_engine(DATABASE_URL, **engine_kwargs)

# Create async session factory
async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=True,
    autocommit=False
)

# Metadata for migrations
metadata = MetaData()

# Enable foreign key constraints for SQLite
@event.listens_for(engine.sync_engine if hasattr(engine, 'sync_engine') else engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Enable foreign key constraints for SQLite"""
    if 'sqlite' in str(dbapi_connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA journal_mode=WAL")  # Enable WAL mode for better concurrency
        cursor.execute("PRAGMA synchronous=NORMAL")  # Balance between performance and safety
        cursor.execute("PRAGMA cache_size=10000")  # Increase cache size
        cursor.execute("PRAGMA temp_store=MEMORY")  # Store temp tables in memory
        cursor.close()

async def init_db() -> None:
    """
    Initialize the database with all tables and constraints.
    This function is idempotent and safe to run multiple times.
    """
    try:
        logger.info("🚀 Starting database initialization...")
        
        async with engine.begin() as conn:
            # Create all tables
            await conn.run_sync(Base.metadata.create_all)
            
            # Create indexes if they don't exist (handled by SQLAlchemy)
            logger.info("📊 Database tables and indexes created successfully")
            
        logger.info("✅ Database initialization completed successfully")
        
        # Test the connection
        await test_connection()
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        raise

async def test_connection() -> bool:
    """Test database connection"""
    try:
        async with async_session() as session:
            # Test query
            if DATABASE_URL.startswith('sqlite'):
                result = await session.execute(text("SELECT 1"))
            else:
                result = await session.execute(text("SELECT 1"))
            
            result.scalar()
            logger.info("✅ Database connection test successful")
            return True
            
    except Exception as e:
        logger.error(f"❌ Database connection test failed: {e}")
        return False

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Get async database session with proper error handling and cleanup.
    This is the main session generator for database operations.
    """
    session = async_session()
    try:
        yield session
        await session.commit()
    except Exception as e:
        await session.rollback()
        logger.error(f"Database session error: {e}")
        raise
    finally:
        await session.close()

@asynccontextmanager
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Context manager for database sessions.
    Preferred for manual session management.
    """
    session = async_session()
    try:
        yield session
        await session.commit()
    except Exception as e:
        await session.rollback()
        logger.error(f"Database session error: {e}")
        raise
    finally:
        await session.close()

# Dependency for FastAPI
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency for database sessions.
    Use this in your FastAPI route dependencies.
    """
    async for session in get_async_session():
        yield session

async def close_db() -> None:
    """Close database connections"""
    try:
        await engine.dispose()
        logger.info("✅ Database connections closed successfully")
    except Exception as e:
        logger.error(f"❌ Error closing database connections: {e}")

# Health check function
async def health_check() -> dict:
    """
    Database health check for monitoring.
    Returns status and connection information.
    """
    try:
        start_time = asyncio.get_event_loop().time()
        
        async with async_session() as session:
            await session.execute(text("SELECT 1"))
            
        end_time = asyncio.get_event_loop().time()
        response_time = (end_time - start_time) * 1000  # Convert to milliseconds
        
        return {
            "status": "healthy",
            "database_type": "sqlite" if "sqlite" in DATABASE_URL else "postgresql",
            "response_time_ms": round(response_time, 2),
            "pool_status": {
                "size": engine.pool.size() if hasattr(engine.pool, 'size') else None,
                "checked_in": engine.pool.checkedin() if hasattr(engine.pool, 'checkedin') else None,
                "checked_out": engine.pool.checkedout() if hasattr(engine.pool, 'checkedout') else None,
            }
        }
        
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "database_type": "unknown"
        }

# Database statistics
async def get_db_stats() -> dict:
    """Get database statistics for monitoring and analytics"""
    try:
        async with async_session() as session:
            stats = {}
            
            # Get table counts
            tables = [
                "users", "workflows", "workflow_executions", "email_campaigns", 
                "email_analytics", "scheduled_tasks", "api_integrations", 
                "audit_logs", "workflow_templates"
            ]
            
            for table in tables:
                try:
                    result = await session.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    stats[f"{table}_count"] = result.scalar()
                except Exception:
                    stats[f"{table}_count"] = 0
            
            return stats
            
    except Exception as e:
        logger.error(f"Error getting database statistics: {e}")
        return {"error": str(e)}

# Cleanup function for application shutdown
async def cleanup_database():
    """Cleanup database resources on application shutdown"""
    try:
        await close_db()
        logger.info("🧹 Database cleanup completed")
    except Exception as e:
        logger.error(f"❌ Database cleanup error: {e}")