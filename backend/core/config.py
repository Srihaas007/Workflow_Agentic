"""
Enhanced configuration settings for the AI-Powered Automation Platform.
Includes comprehensive validation and security settings.
"""

from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
import os
from pathlib import Path


class Settings(BaseSettings):
    """Application settings with comprehensive validation"""
    
    # Basic Settings
    DEBUG: bool = Field(default=True, description="Enable debug mode")
    SECRET_KEY: str = Field(
        default="dev-secret-key-change-in-production-use-strong-random-key",
        description="Secret key for cryptographic operations",
        min_length=32
    )
    ENVIRONMENT: str = Field(
        default="development",
        description="Application environment"
    )
    
    # Database Settings
    DATABASE_URL: str = Field(
        default="sqlite:///./automation_platform.db",
        description="Database connection URL"
    )
    DATABASE_ECHO: bool = Field(
        default=False,
        description="Enable SQL query logging"
    )
    DATABASE_POOL_SIZE: int = Field(
        default=20,
        description="Database connection pool size",
        ge=1,
        le=100
    )
    DATABASE_MAX_OVERFLOW: int = Field(
        default=30,
        description="Maximum database connection overflow",
        ge=0,
        le=50
    )
    
    # Redis Settings
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URL"
    )
    REDIS_PASSWORD: Optional[str] = Field(
        default=None,
        description="Redis password"
    )
    
    # Security Settings
    JWT_SECRET_KEY: str = Field(
        default="dev-jwt-secret-key-with-32-chars-minimum-requirement",
        description="JWT secret key",
        min_length=32
    )
    JWT_ALGORITHM: str = Field(
        default="HS256",
        description="JWT signing algorithm"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30,
        description="Access token expiration time in minutes",
        ge=1,
        le=10080  # 1 week max
    )
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7,
        description="Refresh token expiration time in days",
        ge=1,
        le=30
    )
    PASSWORD_MIN_LENGTH: int = Field(
        default=8,
        description="Minimum password length",
        ge=6,
        le=128
    )
    MAX_LOGIN_ATTEMPTS: int = Field(
        default=5,
        description="Maximum failed login attempts before lockout",
        ge=3,
        le=10
    )
    ACCOUNT_LOCKOUT_DURATION: int = Field(
        default=900,  # 15 minutes
        description="Account lockout duration in seconds",
        ge=300,  # 5 minutes minimum
        le=3600  # 1 hour maximum
    )
    
    # CORS Settings
    ALLOWED_HOSTS: List[str] = Field(
        default=["*"],
        description="Allowed hosts for CORS"
    )
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001", "http://localhost:8000"],
        description="Allowed origins for CORS"
    )
    
    # AI Services
    OPENAI_API_KEY: Optional[str] = Field(
        default=None,
        description="OpenAI API key"
    )
    OPENAI_MODEL: str = Field(
        default="gpt-3.5-turbo",
        description="OpenAI model to use"
    )
    OPENAI_MAX_TOKENS: int = Field(
        default=2048,
        description="Maximum tokens for OpenAI requests",
        ge=1,
        le=8192
    )
    OPENAI_TEMPERATURE: float = Field(
        default=0.7,
        description="Temperature for OpenAI requests",
        ge=0.0,
        le=2.0
    )
    
    # Email Services
    SENDGRID_API_KEY: Optional[str] = Field(
        default=None,
        description="SendGrid API key"
    )
    SMTP_HOST: str = Field(
        default="smtp.gmail.com",
        description="SMTP server host"
    )
    SMTP_PORT: int = Field(
        default=587,
        description="SMTP server port",
        ge=1,
        le=65535
    )
    SMTP_USERNAME: Optional[str] = Field(
        default=None,
        description="SMTP username"
    )
    SMTP_PASSWORD: Optional[str] = Field(
        default=None,
        description="SMTP password"
    )
    SMTP_USE_TLS: bool = Field(
        default=True,
        description="Use TLS for SMTP connection"
    )
    DEFAULT_FROM_EMAIL: str = Field(
        default="noreply@automation-platform.com",
        description="Default from email address"
    )
    DEFAULT_FROM_NAME: str = Field(
        default="AI Automation Platform",
        description="Default from name"
    )
    
    # Notification Services
    SLACK_BOT_TOKEN: Optional[str] = Field(
        default=None,
        description="Slack bot token"
    )
    TWILIO_ACCOUNT_SID: Optional[str] = Field(
        default=None,
        description="Twilio account SID"
    )
    TWILIO_AUTH_TOKEN: Optional[str] = Field(
        default=None,
        description="Twilio auth token"
    )
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = Field(
        default=100,
        description="API rate limit per minute",
        ge=1,
        le=10000
    )
    RATE_LIMIT_PER_HOUR: int = Field(
        default=1000,
        description="API rate limit per hour",
        ge=1,
        le=100000
    )
    RATE_LIMIT_PER_DAY: int = Field(
        default=10000,
        description="API rate limit per day",
        ge=1,
        le=1000000
    )
    
    # File Upload Settings
    MAX_FILE_SIZE: int = Field(
        default=10 * 1024 * 1024,  # 10MB
        description="Maximum file upload size in bytes",
        ge=1024,  # 1KB minimum
        le=100 * 1024 * 1024  # 100MB maximum
    )
    ALLOWED_FILE_TYPES: List[str] = Field(
        default=["image/jpeg", "image/png", "image/gif", "application/pdf", "text/csv"],
        description="Allowed file MIME types"
    )
    UPLOAD_FOLDER: str = Field(
        default="./uploads",
        description="File upload directory"
    )
    
    # Celery Settings
    CELERY_BROKER_URL: str = Field(
        default="redis://localhost:6379/1",
        description="Celery broker URL"
    )
    CELERY_RESULT_BACKEND: str = Field(
        default="redis://localhost:6379/2",
        description="Celery result backend URL"
    )
    CELERY_TASK_SERIALIZER: str = Field(
        default="json",
        description="Celery task serializer"
    )
    
    # Logging Settings
    LOG_LEVEL: str = Field(
        default="INFO",
        description="Logging level"
    )
    LOG_FORMAT: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Log message format"
    )
    LOG_FILE: Optional[str] = Field(
        default=None,
        description="Log file path"
    )
    
    # Monitoring Settings
    ENABLE_METRICS: bool = Field(
        default=True,
        description="Enable metrics collection"
    )
    METRICS_PORT: int = Field(
        default=9090,
        description="Metrics server port",
        ge=1024,
        le=65535
    )
    
    # Backup Settings
    BACKUP_ENABLED: bool = Field(
        default=True,
        description="Enable automatic backups"
    )
    BACKUP_INTERVAL_HOURS: int = Field(
        default=24,
        description="Backup interval in hours",
        ge=1,
        le=168  # 1 week max
    )
    BACKUP_RETENTION_DAYS: int = Field(
        default=30,
        description="Backup retention period in days",
        ge=1,
        le=365
    )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
    
    @field_validator('DATABASE_URL')
    @classmethod
    def validate_database_url(cls, v):
        """Validate database URL format"""
        if not v:
            raise ValueError("Database URL is required")
        
        # Expand relative paths for SQLite
        if v.startswith('sqlite:///'):
            db_path = v.replace('sqlite:///', '')
            if not os.path.isabs(db_path):
                # Make path absolute relative to project root
                abs_path = os.path.abspath(db_path)
                return f"sqlite:///{abs_path}"
        
        return v
    
    @field_validator('ALLOWED_ORIGINS')
    @classmethod
    def validate_origins(cls, v):
        """Validate CORS origins"""
        if not v:
            return ["*"]
        
        validated_origins = []
        for origin in v:
            if origin == "*":
                validated_origins.append(origin)
            else:
                # Basic URL validation
                if not (origin.startswith('http://') or origin.startswith('https://')):
                    raise ValueError(f"Invalid origin URL: {origin}")
                validated_origins.append(origin)
        
        return validated_origins
    
    @field_validator('SECRET_KEY', 'JWT_SECRET_KEY')
    @classmethod
    def validate_secret_keys(cls, v, info):
        """Validate secret keys strength"""
        if len(v) < 32:
            raise ValueError(f"{info.field_name} must be at least 32 characters long")
        
        # In production, warn about default keys
        if 'dev-secret' in v or 'change-in-production' in v:
            if os.getenv('ENVIRONMENT') == 'production':
                raise ValueError(f"Default {info.field_name} detected in production environment")
        
        return v
    
    @field_validator('UPLOAD_FOLDER')
    @classmethod
    def validate_upload_folder(cls, v):
        """Ensure upload folder exists"""
        upload_path = Path(v)
        upload_path.mkdir(parents=True, exist_ok=True)
        return str(upload_path.absolute())
    
    def is_production(self) -> bool:
        """Check if running in production environment"""
        return str(self.ENVIRONMENT).lower() == 'production'
    
    def is_development(self) -> bool:
        """Check if running in development environment"""
        return str(self.ENVIRONMENT).lower() == 'development'
    
    def get_database_config(self) -> dict:
        """Get database configuration parameters"""
        return {
            'url': self.DATABASE_URL,
            'echo': self.DATABASE_ECHO if self.is_development() else False,
            'pool_size': self.DATABASE_POOL_SIZE,
            'max_overflow': self.DATABASE_MAX_OVERFLOW,
        }


# Create settings instance
settings = Settings()

# Create upload directories
Path(settings.UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)