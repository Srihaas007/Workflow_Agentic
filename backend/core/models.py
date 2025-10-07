"""
Database models for the AI-Powered Automation Platform.
Enhanced with comprehensive validations and constraints.
"""

from sqlalchemy import (
    Column, Integer, String, DateTime, Text, Boolean, ForeignKey, JSON, 
    Float, CheckConstraint, UniqueConstraint, Index, Enum as SQLEnum
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import re
import json
import enum
from email_validator import validate_email, EmailNotValidError

Base = declarative_base()

# Enums for better type safety
class UserRole(enum.Enum):
    ADMIN = "admin"
    USER = "user"
    VIEWER = "viewer"

class WorkflowStatus(enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"

class ExecutionStatus(enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class TaskType(enum.Enum):
    WORKFLOW = "workflow"
    EMAIL = "email"
    API_CALL = "api_call"
    SCHEDULED_REPORT = "scheduled_report"
    DATA_SYNC = "data_sync"

class IntegrationType(enum.Enum):
    SLACK = "slack"
    GOOGLE_WORKSPACE = "google_workspace"
    MICROSOFT_365 = "microsoft_365"
    SALESFORCE = "salesforce"
    STRIPE = "stripe"
    TWILIO = "twilio"
    SENDGRID = "sendgrid"
    WEBHOOKS = "webhooks"

class User(Base):
    """User model with comprehensive validation for authentication and user management"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(320), unique=True, index=True, nullable=False)  # RFC 5322 max length
    username = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(150), nullable=True)
    last_name = Column(String(150), nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    last_login = Column(DateTime, nullable=True)
    failed_login_attempts = Column(Integer, default=0, nullable=False)
    locked_until = Column(DateTime, nullable=True)
    timezone = Column(String(50), default='UTC', nullable=False)
    language = Column(String(10), default='en', nullable=False)
    profile_picture_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('failed_login_attempts >= 0', name='check_failed_attempts_positive'),
        CheckConstraint("email LIKE '%_@_%.__%'", name='check_email_format'),
        CheckConstraint('LENGTH(username) >= 3', name='check_username_min_length'),
        CheckConstraint('LENGTH(first_name) <= 150', name='check_first_name_max_length'),
        CheckConstraint('LENGTH(last_name) <= 150', name='check_last_name_max_length'),
    )
    
    # Relationships
    workflows = relationship("Workflow", back_populates="owner", cascade="all, delete-orphan")
    email_campaigns = relationship("EmailCampaign", back_populates="owner", cascade="all, delete-orphan")
    scheduled_tasks = relationship("ScheduledTask", back_populates="owner", cascade="all, delete-orphan")
    api_integrations = relationship("APIIntegration", back_populates="owner", cascade="all, delete-orphan")
    api_keys = relationship("APIKey", back_populates="owner", cascade="all, delete-orphan")
    user_preferences = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")
    
    @validates('email')
    def validate_email_field(self, _key, email):
        """Validate email format"""
        if not email:
            raise ValueError("Email is required")
        email = email.lower().strip()
        # Basic email format validation (less strict for demo)
        if '@' not in email or '.' not in email.split('@')[1]:
            raise ValueError("Invalid email format")
        return email
    
    @validates('username')
    def validate_username(self, _key, username):
        """Validate username format and length"""
        if not username:
            raise ValueError("Username is required")
        username = username.strip().lower()
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters long")
        if len(username) > 150:
            raise ValueError("Username must be at most 150 characters long")
        if not re.match(r'^[a-zA-Z0-9_-]+$', username):
            raise ValueError("Username can only contain letters, numbers, underscores, and hyphens")
        return username
    
    @validates('timezone')
    def validate_timezone(self, _key, timezone):
        """Validate timezone format"""
        import pytz
        if timezone not in pytz.all_timezones:
            raise ValueError(f"Invalid timezone: {timezone}")
        return timezone
    
    def is_locked(self) -> bool:
        """Check if user account is locked"""
        return self.locked_until and self.locked_until > datetime.utcnow()
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"

class UserPreference(Base):
    """User preferences and settings"""
    __tablename__ = "user_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    theme = Column(String(20), default='dark', nullable=False)
    notifications_enabled = Column(Boolean, default=True, nullable=False)
    email_notifications = Column(Boolean, default=True, nullable=False)
    workflow_notifications = Column(Boolean, default=True, nullable=False)
    security_notifications = Column(Boolean, default=True, nullable=False)
    weekly_reports = Column(Boolean, default=False, nullable=False)
    dashboard_layout = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint("theme IN ('light', 'dark', 'auto')", name='check_valid_theme'),
    )
    
    # Relationships
    user = relationship("User", back_populates="user_preferences")

class APIKey(Base):
    """API keys for programmatic access"""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    key_prefix = Column(String(10), nullable=False)  # First few chars for identification
    key_hash = Column(String(255), nullable=False)  # Hashed full key
    is_active = Column(Boolean, default=True, nullable=False)
    last_used = Column(DateTime, nullable=True)
    usage_count = Column(Integer, default=0, nullable=False)
    rate_limit = Column(Integer, default=1000, nullable=False)  # Requests per hour
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('usage_count >= 0', name='check_usage_count_positive'),
        CheckConstraint('rate_limit > 0', name='check_rate_limit_positive'),
        UniqueConstraint('owner_id', 'name', name='unique_api_key_name_per_user'),
    )
    
    # Relationships
    owner = relationship("User", back_populates="api_keys")
    
    @validates('name')
    def validate_name(self, _key, name):
        """Validate API key name"""
        if not name or not name.strip():
            raise ValueError("API key name is required")
        name = name.strip()
        if len(name) > 255:
            raise ValueError("API key name must be at most 255 characters long")
        return name

class Workflow(Base):
    """Workflow model with enhanced validation for storing workflow definitions"""
    __tablename__ = "workflows"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    nodes = Column(JSON, nullable=False, default=list)  # Store workflow nodes as JSON
    edges = Column(JSON, nullable=False, default=list)  # Store workflow edges as JSON
    version = Column(Integer, default=1, nullable=False)
    status = Column(SQLEnum(WorkflowStatus), default=WorkflowStatus.DRAFT, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(100), nullable=True)
    tags = Column(JSON, default=list, nullable=True)  # Array of tags
    execution_count = Column(Integer, default=0, nullable=False)
    success_count = Column(Integer, default=0, nullable=False)
    failure_count = Column(Integer, default=0, nullable=False)
    average_duration = Column(Float, default=0.0, nullable=False)  # In seconds
    last_executed = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('version > 0', name='check_version_positive'),
        CheckConstraint('execution_count >= 0', name='check_execution_count_positive'),
        CheckConstraint('success_count >= 0', name='check_success_count_positive'),
        CheckConstraint('failure_count >= 0', name='check_failure_count_positive'),
        CheckConstraint('average_duration >= 0', name='check_average_duration_positive'),
        CheckConstraint('LENGTH(name) >= 1', name='check_name_not_empty'),
        Index('idx_workflow_owner_status', 'owner_id', 'status'),
        Index('idx_workflow_category', 'category'),
    )
    
    # Relationships
    owner = relationship("User", back_populates="workflows")
    executions = relationship("WorkflowExecution", back_populates="workflow", cascade="all, delete-orphan")
    
    @validates('name')
    def validate_name(self, _key, name):
        """Validate workflow name"""
        if not name or not name.strip():
            raise ValueError("Workflow name is required")
        name = name.strip()
        if len(name) > 255:
            raise ValueError("Workflow name must be at most 255 characters long")
        return name
    
    @validates('nodes', 'edges')
    def validate_json_fields(self, _key, value):
        """Validate JSON fields"""
        if value is None:
            return [] if key in ['nodes', 'edges', 'tags'] else {}
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                raise ValueError(f"Invalid JSON format for {_key}") from None
        return value
    
    @property
    def success_rate(self) -> float:
        """Calculate success rate percentage"""
        if self.execution_count == 0:
            return 0.0
        return (self.success_count / self.execution_count) * 100
    
    def __repr__(self):
        return f"<Workflow(id={self.id}, name='{self.name}', status='{self.status.value}')>"

class WorkflowExecution(Base):
    """Enhanced workflow execution tracking with detailed metrics"""
    __tablename__ = "workflow_executions"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    execution_id = Column(String(100), unique=True, nullable=False)  # UUID for tracking
    status = Column(SQLEnum(ExecutionStatus), default=ExecutionStatus.PENDING, nullable=False)
    triggered_by = Column(String(50), default='manual', nullable=False)  # manual, scheduled, api, webhook
    start_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    end_time = Column(DateTime, nullable=True)
    duration = Column(Float, nullable=True)  # Duration in seconds
    execution_data = Column(JSON, nullable=True)  # Store execution results
    error_message = Column(Text, nullable=True)
    error_type = Column(String(100), nullable=True)
    stack_trace = Column(Text, nullable=True)
    nodes_executed = Column(JSON, default=list, nullable=True)  # Track which nodes executed
    resources_used = Column(JSON, nullable=True)  # CPU, memory, etc.
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('duration >= 0', name='check_duration_positive'),
        CheckConstraint("triggered_by IN ('manual', 'scheduled', 'api', 'webhook')", name='check_valid_trigger'),
        Index('idx_execution_workflow_status', 'workflow_id', 'status'),
        Index('idx_execution_start_time', 'start_time'),
    )
    
    # Relationships
    workflow = relationship("Workflow", back_populates="executions")
    
    @validates('execution_id')
    def validate_execution_id(self, _key, execution_id):
        """Validate execution ID format"""
        if not execution_id:
            raise ValueError("Execution ID is required")
        # Should be UUID format
        import uuid
        try:
            uuid.UUID(execution_id)
            return execution_id
        except ValueError:
            raise ValueError("Execution ID must be a valid UUID") from None
    
    def __repr__(self):
        return f"<WorkflowExecution(id={self.id}, workflow_id={self.workflow_id}, status='{self.status.value}')>"
class EmailCampaign(Base):
    """Enhanced email campaign model with comprehensive validation"""
    __tablename__ = "email_campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    subject = Column(String(998), nullable=False)  # RFC 5322 subject line limit
    content = Column(Text, nullable=False)
    content_type = Column(String(20), default='html', nullable=False)  # html, text
    recipients = Column(JSON, nullable=False, default=list)  # Store recipient list as JSON
    sender_name = Column(String(255), nullable=True)
    sender_email = Column(String(320), nullable=True)
    reply_to = Column(String(320), nullable=True)
    status = Column(String(20), default="draft", nullable=False)  # draft, scheduled, sending, sent, failed
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scheduled_time = Column(DateTime, nullable=True)
    sent_time = Column(DateTime, nullable=True)
    recipient_count = Column(Integer, default=0, nullable=False)
    delivery_rate = Column(Float, default=0.0, nullable=False)  # Percentage
    open_rate = Column(Float, default=0.0, nullable=False)  # Percentage
    click_rate = Column(Float, default=0.0, nullable=False)  # Percentage
    bounce_rate = Column(Float, default=0.0, nullable=False)  # Percentage
    unsubscribe_rate = Column(Float, default=0.0, nullable=False)  # Percentage
    tags = Column(JSON, default=list, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint("status IN ('draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled')", name='check_valid_status'),
        CheckConstraint("content_type IN ('html', 'text')", name='check_valid_content_type'),
        CheckConstraint('recipient_count >= 0', name='check_recipient_count_positive'),
        CheckConstraint('delivery_rate >= 0 AND delivery_rate <= 100', name='check_delivery_rate_range'),
        CheckConstraint('open_rate >= 0 AND open_rate <= 100', name='check_open_rate_range'),
        CheckConstraint('click_rate >= 0 AND click_rate <= 100', name='check_click_rate_range'),
        CheckConstraint('bounce_rate >= 0 AND bounce_rate <= 100', name='check_bounce_rate_range'),
        CheckConstraint('unsubscribe_rate >= 0 AND unsubscribe_rate <= 100', name='check_unsubscribe_rate_range'),
        CheckConstraint('LENGTH(name) >= 1', name='check_name_not_empty'),
        CheckConstraint('LENGTH(subject) >= 1', name='check_subject_not_empty'),
        Index('idx_campaign_owner_status', 'owner_id', 'status'),
        Index('idx_campaign_scheduled_time', 'scheduled_time'),
    )
    
    # Relationships
    owner = relationship("User", back_populates="email_campaigns")
    analytics = relationship("EmailAnalytics", back_populates="campaign", cascade="all, delete-orphan")
    
    @validates('name')
    def validate_name(self, _key, name):
        if not name or not name.strip():
            raise ValueError("Campaign name is required")
        return name.strip()
    
    @validates('subject')
    def validate_subject(self, _key, subject):
        if not subject or not subject.strip():
            raise ValueError("Email subject is required")
        subject = subject.strip()
        if len(subject) > 998:
            raise ValueError("Email subject is too long (max 998 characters)")
        return subject
    
    @validates('sender_email', 'reply_to')
    def validate_email_addresses(self, _key, email):
        if email:
            email = email.lower().strip()
            # Basic email format validation (less strict for demo)
            if '@' not in email or '.' not in email.split('@')[1]:
                raise ValueError(f"Invalid email format for {key}")
            return email
        return email
    
    @validates('recipients')
    def validate_recipients(self, _key, recipients):
        if not recipients:
            return []
        if isinstance(recipients, str):
            try:
                recipients = json.loads(recipients)
            except json.JSONDecodeError:
                raise ValueError("Invalid JSON format for recipients")
        
        if not isinstance(recipients, list):
            raise ValueError("Recipients must be a list")
        
        # Validate each email in the list
        validated_recipients = []
        for recipient in recipients:
            if isinstance(recipient, dict) and 'email' in recipient:
                email = recipient['email']
            elif isinstance(recipient, str):
                email = recipient
            else:
                raise ValueError("Invalid recipient format")
            
            # Basic email format validation (less strict for demo)
            email = email.lower().strip()
            if '@' not in email or '.' not in email.split('@')[1]:
                raise ValueError(f"Invalid email format: {email}")
            
            if isinstance(recipient, dict):
                recipient['email'] = email
                validated_recipients.append(recipient)
            else:
                validated_recipients.append(email)
        
        return validated_recipients

class EmailAnalytics(Base):
    """Enhanced email analytics tracking with detailed metrics"""
    __tablename__ = "email_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("email_campaigns.id", ondelete="CASCADE"), nullable=False)
    emails_sent = Column(Integer, default=0, nullable=False)
    emails_delivered = Column(Integer, default=0, nullable=False)
    emails_opened = Column(Integer, default=0, nullable=False)
    unique_opens = Column(Integer, default=0, nullable=False)
    links_clicked = Column(Integer, default=0, nullable=False)
    unique_clicks = Column(Integer, default=0, nullable=False)
    bounced = Column(Integer, default=0, nullable=False)
    soft_bounces = Column(Integer, default=0, nullable=False)
    hard_bounces = Column(Integer, default=0, nullable=False)
    unsubscribed = Column(Integer, default=0, nullable=False)
    spam_complaints = Column(Integer, default=0, nullable=False)
    forwarded = Column(Integer, default=0, nullable=False)
    click_tracking_data = Column(JSON, nullable=True)  # URL click details
    geographic_data = Column(JSON, nullable=True)  # Geographic distribution
    device_data = Column(JSON, nullable=True)  # Device/client analytics
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('emails_sent >= 0', name='check_emails_sent_positive'),
        CheckConstraint('emails_delivered >= 0', name='check_emails_delivered_positive'),
        CheckConstraint('emails_opened >= 0', name='check_emails_opened_positive'),
        CheckConstraint('unique_opens >= 0', name='check_unique_opens_positive'),
        CheckConstraint('links_clicked >= 0', name='check_links_clicked_positive'),
        CheckConstraint('unique_clicks >= 0', name='check_unique_clicks_positive'),
        CheckConstraint('bounced >= 0', name='check_bounced_positive'),
        CheckConstraint('soft_bounces >= 0', name='check_soft_bounces_positive'),
        CheckConstraint('hard_bounces >= 0', name='check_hard_bounces_positive'),
        CheckConstraint('unsubscribed >= 0', name='check_unsubscribed_positive'),
        CheckConstraint('spam_complaints >= 0', name='check_spam_complaints_positive'),
        CheckConstraint('emails_delivered <= emails_sent', name='check_delivered_not_exceed_sent'),
        CheckConstraint('unique_opens <= emails_opened', name='check_unique_opens_logical'),
        CheckConstraint('unique_clicks <= links_clicked', name='check_unique_clicks_logical'),
        CheckConstraint('soft_bounces + hard_bounces = bounced', name='check_bounces_consistency'),
    )
    
    # Relationships
    campaign = relationship("EmailCampaign", back_populates="analytics")
    
    @property
    def delivery_rate(self) -> float:
        if self.emails_sent == 0:
            return 0.0
        return (self.emails_delivered / self.emails_sent) * 100
    
    @property
    def open_rate(self) -> float:
        if self.emails_delivered == 0:
            return 0.0
        return (self.unique_opens / self.emails_delivered) * 100
    
    @property
    def click_rate(self) -> float:
        if self.emails_delivered == 0:
            return 0.0
        return (self.unique_clicks / self.emails_delivered) * 100

class ScheduledTask(Base):
    """Enhanced scheduled task model with comprehensive validation"""
    __tablename__ = "scheduled_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    task_type = Column(SQLEnum(TaskType), nullable=False)
    schedule_expression = Column(String(255), nullable=False)  # Cron expression
    timezone = Column(String(50), default='UTC', nullable=False)
    task_data = Column(JSON, nullable=False, default=dict)  # Task configuration
    is_active = Column(Boolean, default=True, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    next_run = Column(DateTime, nullable=True)
    last_run = Column(DateTime, nullable=True)
    last_status = Column(SQLEnum(ExecutionStatus), nullable=True)
    execution_count = Column(Integer, default=0, nullable=False)
    success_count = Column(Integer, default=0, nullable=False)
    failure_count = Column(Integer, default=0, nullable=False)
    average_duration = Column(Float, default=0.0, nullable=False)  # In seconds
    max_retries = Column(Integer, default=3, nullable=False)
    retry_delay = Column(Integer, default=300, nullable=False)  # Seconds
    timeout = Column(Integer, default=3600, nullable=False)  # Seconds
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('execution_count >= 0', name='check_execution_count_positive'),
        CheckConstraint('success_count >= 0', name='check_success_count_positive'),
        CheckConstraint('failure_count >= 0', name='check_failure_count_positive'),
        CheckConstraint('average_duration >= 0', name='check_average_duration_positive'),
        CheckConstraint('max_retries >= 0', name='check_max_retries_positive'),
        CheckConstraint('retry_delay > 0', name='check_retry_delay_positive'),
        CheckConstraint('timeout > 0', name='check_timeout_positive'),
        CheckConstraint('LENGTH(name) >= 1', name='check_name_not_empty'),
        CheckConstraint('LENGTH(schedule_expression) >= 5', name='check_cron_expression_not_empty'),
        Index('idx_scheduled_task_owner_active', 'owner_id', 'is_active'),
        Index('idx_scheduled_task_next_run', 'next_run'),
    )
    
    # Relationships
    owner = relationship("User", back_populates="scheduled_tasks")
    task_executions = relationship("TaskExecution", back_populates="scheduled_task", cascade="all, delete-orphan")
    
    @validates('name')
    def validate_name(self, _key, name):
        if not name or not name.strip():
            raise ValueError("Task name is required")
        return name.strip()
    
    @validates('schedule_expression')
    def validate_cron_expression(self, _key, expression):
        """Validate cron expression format"""
        if not expression:
            raise ValueError("Schedule expression is required")
        
        # Basic cron validation (5 or 6 fields)
        parts = expression.strip().split()
        if len(parts) not in [5, 6]:
            raise ValueError("Cron expression must have 5 or 6 fields")
        
        return expression.strip()
    
    @validates('timezone')
    def validate_timezone(self, _key, timezone):
        """Validate timezone"""
        import pytz
        if timezone not in pytz.all_timezones:
            raise ValueError(f"Invalid timezone: {timezone}")
        return timezone
    
    @property
    def success_rate(self) -> float:
        if self.execution_count == 0:
            return 0.0
        return (self.success_count / self.execution_count) * 100

class TaskExecution(Base):
    """Task execution tracking"""
    __tablename__ = "task_executions"
    
    id = Column(Integer, primary_key=True, index=True)
    scheduled_task_id = Column(Integer, ForeignKey("scheduled_tasks.id", ondelete="CASCADE"), nullable=False)
    execution_id = Column(String(100), unique=True, nullable=False)
    status = Column(SQLEnum(ExecutionStatus), default=ExecutionStatus.PENDING, nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    end_time = Column(DateTime, nullable=True)
    duration = Column(Float, nullable=True)
    result_data = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('duration >= 0', name='check_duration_positive'),
        CheckConstraint('retry_count >= 0', name='check_retry_count_positive'),
        Index('idx_task_execution_scheduled_task', 'scheduled_task_id'),
        Index('idx_task_execution_status', 'status'),
    )
    
    # Relationships
    scheduled_task = relationship("ScheduledTask", back_populates="task_executions")

class APIIntegration(Base):
    """Enhanced API integration configurations with security and validation"""
    __tablename__ = "api_integrations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    service_type = Column(SQLEnum(IntegrationType), nullable=False)
    api_endpoint = Column(String(2048), nullable=True)  # URLs can be long
    auth_type = Column(String(50), default='api_key', nullable=False)  # api_key, oauth2, basic, bearer
    auth_data = Column(JSON, nullable=True)  # Store encrypted auth tokens
    configuration = Column(JSON, nullable=True)  # Service-specific config
    is_active = Column(Boolean, default=True, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    last_used = Column(DateTime, nullable=True)
    usage_count = Column(Integer, default=0, nullable=False)
    error_count = Column(Integer, default=0, nullable=False)
    rate_limit = Column(Integer, nullable=True)  # Requests per hour
    rate_limit_remaining = Column(Integer, nullable=True)
    rate_limit_reset = Column(DateTime, nullable=True)
    webhook_url = Column(String(2048), nullable=True)
    webhook_secret = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint("auth_type IN ('api_key', 'oauth2', 'basic', 'bearer', 'custom')", name='check_valid_auth_type'),
        CheckConstraint('usage_count >= 0', name='check_usage_count_positive'),
        CheckConstraint('error_count >= 0', name='check_error_count_positive'),
        CheckConstraint('rate_limit > 0', name='check_rate_limit_positive'),
        CheckConstraint('rate_limit_remaining >= 0', name='check_rate_limit_remaining_positive'),
        CheckConstraint('LENGTH(name) >= 1', name='check_name_not_empty'),
        UniqueConstraint('owner_id', 'name', name='unique_integration_name_per_user'),
        Index('idx_integration_owner_service_type', 'owner_id', 'service_type'),
        Index('idx_integration_active', 'is_active'),
    )
    
    # Relationships
    owner = relationship("User", back_populates="api_integrations")
    integration_logs = relationship("IntegrationLog", back_populates="integration", cascade="all, delete-orphan")
    
    @validates('name')
    def validate_name(self, _key, name):
        if not name or not name.strip():
            raise ValueError("Integration name is required")
        return name.strip()
    
    @validates('api_endpoint', 'webhook_url')
    def validate_urls(self, _key, url):
        if url and url.strip():
            import re
            url_pattern = re.compile(
                r'^https?://'  # http:// or https://
                r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
                r'localhost|'  # localhost...
                r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
                r'(?::\d+)?'  # optional port
                r'(?:/?|[/?]\S+)$', re.IGNORECASE)
            
            if not url_pattern.match(url.strip()):
                raise ValueError(f"Invalid URL format for {key}")
            return url.strip()
        return url

class IntegrationLog(Base):
    """API integration usage and error logs"""
    __tablename__ = "integration_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    integration_id = Column(Integer, ForeignKey("api_integrations.id", ondelete="CASCADE"), nullable=False)
    request_method = Column(String(10), nullable=False)
    request_url = Column(String(2048), nullable=False)
    request_headers = Column(JSON, nullable=True)
    request_body = Column(Text, nullable=True)
    response_status = Column(Integer, nullable=True)
    response_headers = Column(JSON, nullable=True)
    response_body = Column(Text, nullable=True)
    response_time = Column(Float, nullable=True)  # In milliseconds
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint("request_method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS')", 
                       name='check_valid_http_method'),
        CheckConstraint('response_status >= 100 AND response_status < 600', name='check_valid_http_status'),
        CheckConstraint('response_time >= 0', name='check_response_time_positive'),
        Index('idx_integration_log_integration_id', 'integration_id'),
        Index('idx_integration_log_created_at', 'created_at'),
        Index('idx_integration_log_status', 'response_status'),
    )
    
    # Relationships
    integration = relationship("APIIntegration", back_populates="integration_logs")

class AuditLog(Base):
    """System audit log for security and compliance"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(String(100), nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 compatible
    user_agent = Column(String(500), nullable=True)
    success = Column(Boolean, nullable=False)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('LENGTH(action) >= 1', name='check_action_not_empty'),
        CheckConstraint('LENGTH(resource_type) >= 1', name='check_resource_type_not_empty'),
        Index('idx_audit_log_user_id', 'user_id'),
        Index('idx_audit_log_action', 'action'),
        Index('idx_audit_log_resource_type', 'resource_type'),
        Index('idx_audit_log_created_at', 'created_at'),
        Index('idx_audit_log_success', 'success'),
    )
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")

class WorkflowTemplate(Base):
    """Enhanced pre-built workflow templates"""
    __tablename__ = "workflow_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)  # marketing, sales, support, finance, hr, etc.
    subcategory = Column(String(100), nullable=True)
    nodes = Column(JSON, nullable=False, default=list)
    edges = Column(JSON, nullable=False, default=list)
    is_public = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)  # Verified by admin
    usage_count = Column(Integer, default=0, nullable=False)
    rating_average = Column(Float, default=0.0, nullable=False)  # 0-5 stars
    rating_count = Column(Integer, default=0, nullable=False)
    complexity_level = Column(String(20), default='beginner', nullable=False)  # beginner, intermediate, advanced
    estimated_setup_time = Column(Integer, nullable=True)  # Minutes
    tags = Column(JSON, default=list, nullable=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    version = Column(String(20), default='1.0.0', nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('usage_count >= 0', name='check_usage_count_positive'),
        CheckConstraint('rating_average >= 0 AND rating_average <= 5', name='check_rating_average_range'),
        CheckConstraint('rating_count >= 0', name='check_rating_count_positive'),
        CheckConstraint("complexity_level IN ('beginner', 'intermediate', 'advanced')", name='check_valid_complexity'),
        CheckConstraint('estimated_setup_time > 0', name='check_setup_time_positive'),
        CheckConstraint('LENGTH(name) >= 1', name='check_name_not_empty'),
        CheckConstraint('LENGTH(category) >= 1', name='check_category_not_empty'),
        Index('idx_template_category', 'category'),
        Index('idx_template_public_verified', 'is_public', 'is_verified'),
        Index('idx_template_usage_count', 'usage_count'),
    )
    
    # Relationships
    author = relationship("User")
    template_ratings = relationship("TemplateRating", back_populates="template", cascade="all, delete-orphan")
    
    @validates('name')
    def validate_name(self, _key, name):
        if not name or not name.strip():
            raise ValueError("Template name is required")
        return name.strip()

class TemplateRating(Base):
    """User ratings for workflow templates"""
    __tablename__ = "template_ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(Integer, ForeignKey("workflow_templates.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    review = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
        UniqueConstraint('template_id', 'user_id', name='unique_rating_per_user_template'),
    )
    
    # Relationships
    template = relationship("WorkflowTemplate", back_populates="template_ratings")
    user = relationship("User")