#!/usr/bin/env python3

"""
Clean database initialization script for the AI Automation Platform.

This script initializes the database schema and creates sample data for testing.
"""

import asyncio
import logging
from pathlib import Path
import sys

# Add the project root to the Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from backend.core.database import init_db, test_connection
from backend.core.config import settings

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def main():
    """Main initialization function"""
    logger.info("🚀 Starting database initialization...")
    
    try:
        # Initialize database
        await init_db()
        logger.info("✅ Database initialized successfully")
        
        # Test connection
        result = await test_connection()
        if result:
            logger.info("✅ Database connection test passed")
        else:
            logger.error("❌ Database connection test failed")
            return False
            
        logger.info("🎉 Database initialization completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    if success:
        logger.info("✅ Database is ready for use!")
        logger.info("You can now start the application with: python main.py")
    else:
        logger.error("❌ Database initialization failed")
        sys.exit(1)