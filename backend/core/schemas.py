"""
Pydantic schemas for API request/response validation.
Enhanced with comprehensive validation rules and error messages.
"""

from pydantic import BaseModel, Field, validator, EmailStr, ConfigDict
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum
import re
import json

# Base configuration for all schemas
class BaseSchema(BaseModel):
    """Base schema with common configuration"""
    model_config = ConfigDict(
        from_attributes=True,
        validate_assignment=True,
        str_strip_whitespace=True,
        json_encoders={
            datetime: lambda v: v.isoformat(),
        }
    )

# Enums for validation
class UserRoleEnum(str, Enum):
    ADMIN = "admin"
    USER = "user"
    VIEWER = "viewer"

class WorkflowStatusEnum(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"

class ExecutionStatusEnum(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class TaskTypeEnum(str, Enum):
    WORKFLOW = "workflow"
    EMAIL = "email"
    API_CALL = "api_call"
    SCHEDULED_REPORT = "scheduled_report"
    DATA_SYNC = "data_sync"

# User Schemas
class UserBase(BaseSchema):
    """Base user schema"""
    email: EmailStr = Field(..., description="User email address")
    username: str = Field(
        ..., 
        min_length=3, 
        max_length=150, 
        description="Unique username",
        pattern=r'^[a-zA-Z0-9_-]+$'
    )
    first_name: Optional[str] = Field(None, max_length=150, description="First name")
    last_name: Optional[str] = Field(None, max_length=150, description="Last name")
    role: Optional[UserRoleEnum] = Field(UserRoleEnum.USER, description="User role")
    timezone: str = Field("UTC", description="User timezone")
    language: str = Field("en", max_length=10, description="Preferred language")

class UserCreate(UserBase):
    """Schema for creating a new user"""
    password: str = Field(
        ..., 
        min_length=8, 
        max_length=128, 
        description="Password (min 8 characters)"
    )
    confirm_password: str = Field(..., description="Password confirmation")
    
    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v
    
    @validator('password')
    def validate_password_strength(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        
        # Check for at least one uppercase, lowercase, digit, and special character
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        
        return v

class UserUpdate(BaseSchema):
    """Schema for updating user information"""
    first_name: Optional[str] = Field(None, max_length=150)
    last_name: Optional[str] = Field(None, max_length=150)
    timezone: Optional[str] = None
    language: Optional[str] = Field(None, max_length=10)
    profile_picture_url: Optional[str] = Field(None, max_length=500)

class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    is_active: bool
    is_verified: bool
    last_login: Optional[datetime]
    created_at: datetime
    updated_at: datetime

class UserPreferenceUpdate(BaseSchema):
    """Schema for updating user preferences"""
    theme: Optional[str] = Field(None, pattern=r'^(light|dark|auto)$')
    notifications_enabled: Optional[bool] = None
    email_notifications: Optional[bool] = None
    workflow_notifications: Optional[bool] = None
    security_notifications: Optional[bool] = None
    weekly_reports: Optional[bool] = None
    dashboard_layout: Optional[Dict[str, Any]] = None

# Authentication Schemas
class UserLogin(BaseSchema):
    """Schema for user login"""
    email_or_username: str = Field(..., description="Email or username")
    password: str = Field(..., description="Password")
    remember_me: bool = Field(False, description="Remember login session")

class Token(BaseSchema):
    """Schema for authentication token"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class PasswordResetRequest(BaseSchema):
    """Schema for password reset request"""
    email: EmailStr = Field(..., description="Email address for password reset")

class PasswordReset(BaseSchema):
    """Schema for password reset"""
    token: str = Field(..., description="Password reset token")
    new_password: str = Field(..., min_length=8, description="New password")
    confirm_password: str = Field(..., description="Confirm new password")
    
    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v

class LoginRequest(BaseSchema):
    """Schema for login request"""
    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="Password")
    remember_me: bool = Field(False, description="Remember login session")

class TokenResponse(BaseSchema):
    """Schema for token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class PasswordChangeRequest(BaseSchema):
    """Schema for password change"""
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, description="New password")
    confirm_password: str = Field(..., description="Confirm new password")
    
    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('New passwords do not match')
        return v

class PasswordResetRequest(BaseSchema):
    """Schema for password reset request"""
    email: EmailStr = Field(..., description="Email address")

class PasswordResetConfirm(BaseSchema):
    """Schema for password reset confirmation"""
    token: str = Field(..., description="Reset token")
    new_password: str = Field(..., min_length=8, description="New password")
    confirm_password: str = Field(..., description="Confirm new password")
    
    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v

# Workflow Schemas
class WorkflowBase(BaseSchema):
    """Base workflow schema"""
    name: str = Field(..., min_length=1, max_length=255, description="Workflow name")
    description: Optional[str] = Field(None, description="Workflow description")
    category: Optional[str] = Field(None, max_length=100, description="Workflow category")
    tags: Optional[List[str]] = Field(None, description="Workflow tags")

class WorkflowCreate(WorkflowBase):
    """Schema for creating a workflow"""
    nodes: List[Dict[str, Any]] = Field(default_factory=list, description="Workflow nodes")
    edges: List[Dict[str, Any]] = Field(default_factory=list, description="Workflow edges")
    
    @validator('nodes', 'edges')
    def validate_workflow_structure(cls, v):
        """Validate workflow structure"""
        if not isinstance(v, list):
            raise ValueError('Must be a list')
        return v

class WorkflowUpdate(BaseSchema):
    """Schema for updating a workflow"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    nodes: Optional[List[Dict[str, Any]]] = None
    edges: Optional[List[Dict[str, Any]]] = None
    status: Optional[WorkflowStatusEnum] = None
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[List[str]] = None

class WorkflowResponse(WorkflowBase):
    """Schema for workflow response"""
    id: int
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    version: int
    status: WorkflowStatusEnum
    owner_id: int
    execution_count: int
    success_count: int
    failure_count: int
    average_duration: float
    last_executed: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    @property
    def success_rate(self) -> float:
        """Calculate success rate"""
        if self.execution_count == 0:
            return 0.0
        return (self.success_count / self.execution_count) * 100

# Email Campaign Schemas
class EmailCampaignBase(BaseSchema):
    """Base email campaign schema"""
    name: str = Field(..., min_length=1, max_length=255, description="Campaign name")
    subject: str = Field(..., min_length=1, max_length=998, description="Email subject")
    content: str = Field(..., min_length=1, description="Email content")
    content_type: str = Field("html", pattern=r'^(html|text)$', description="Content type")
    sender_name: Optional[str] = Field(None, max_length=255, description="Sender name")
    sender_email: Optional[EmailStr] = Field(None, description="Sender email")
    reply_to: Optional[EmailStr] = Field(None, description="Reply-to email")

class EmailCampaignCreate(EmailCampaignBase):
    """Schema for creating an email campaign"""
    recipients: List[Union[EmailStr, Dict[str, str]]] = Field(
        ..., 
        min_items=1, 
        description="List of recipients"
    )
    scheduled_time: Optional[datetime] = Field(None, description="Scheduled send time")
    tags: Optional[List[str]] = Field(None, description="Campaign tags")
    
    @validator('recipients')
    def validate_recipients(cls, v):
        """Validate recipient list"""
        validated = []
        for recipient in v:
            if isinstance(recipient, str):
                # Simple email validation is handled by EmailStr
                validated.append(recipient)
            elif isinstance(recipient, dict) and 'email' in recipient:
                # Validate email in dict format
                validated.append(recipient)
            else:
                raise ValueError('Invalid recipient format')
        return validated

class EmailCampaignResponse(EmailCampaignBase):
    """Schema for email campaign response"""
    id: int
    recipients: List[Union[str, Dict[str, str]]]
    status: str
    owner_id: int
    scheduled_time: Optional[datetime]
    sent_time: Optional[datetime]
    recipient_count: int
    delivery_rate: float
    open_rate: float
    click_rate: float
    bounce_rate: float
    unsubscribe_rate: float
    tags: Optional[List[str]]
    created_at: datetime
    updated_at: datetime

# Scheduled Task Schemas
class ScheduledTaskBase(BaseSchema):
    """Base scheduled task schema"""
    name: str = Field(..., min_length=1, max_length=255, description="Task name")
    description: Optional[str] = Field(None, description="Task description")
    task_type: TaskTypeEnum = Field(..., description="Task type")
    schedule_expression: str = Field(
        ..., 
        min_length=5, 
        max_length=255, 
        description="Cron expression"
    )
    timezone: str = Field("UTC", description="Task timezone")
    max_retries: int = Field(3, ge=0, le=10, description="Maximum retry attempts")
    retry_delay: int = Field(300, ge=60, description="Retry delay in seconds")
    timeout: int = Field(3600, ge=60, description="Task timeout in seconds")

class ScheduledTaskCreate(ScheduledTaskBase):
    """Schema for creating a scheduled task"""
    task_data: Dict[str, Any] = Field(default_factory=dict, description="Task configuration")
    
    @validator('schedule_expression')
    def validate_cron_expression(cls, v):
        """Basic cron expression validation"""
        parts = v.strip().split()
        if len(parts) not in [5, 6]:
            raise ValueError('Cron expression must have 5 or 6 fields')
        return v

class ScheduledTaskResponse(ScheduledTaskBase):
    """Schema for scheduled task response"""
    id: int
    task_data: Dict[str, Any]
    is_active: bool
    owner_id: int
    next_run: Optional[datetime]
    last_run: Optional[datetime]
    last_status: Optional[ExecutionStatusEnum]
    execution_count: int
    success_count: int
    failure_count: int
    average_duration: float
    created_at: datetime
    updated_at: datetime
    
    @property
    def success_rate(self) -> float:
        """Calculate success rate"""
        if self.execution_count == 0:
            return 0.0
        return (self.success_count / self.execution_count) * 100

# API Integration Schemas
class APIIntegrationBase(BaseSchema):
    """Base API integration schema"""
    name: str = Field(..., min_length=1, max_length=255, description="Integration name")
    description: Optional[str] = Field(None, description="Integration description")
    service_type: str = Field(..., description="Service type")
    api_endpoint: Optional[str] = Field(None, max_length=2048, description="API endpoint URL")
    auth_type: str = Field("api_key", description="Authentication type")
    webhook_url: Optional[str] = Field(None, max_length=2048, description="Webhook URL")

class APIIntegrationCreate(APIIntegrationBase):
    """Schema for creating an API integration"""
    auth_data: Optional[Dict[str, Any]] = Field(None, description="Authentication data")
    configuration: Optional[Dict[str, Any]] = Field(None, description="Service configuration")
    
    @validator('api_endpoint', 'webhook_url')
    def validate_urls(cls, v):
        """Validate URL format"""
        if v and v.strip():
            url_pattern = re.compile(
                r'^https?://'  # http:// or https://
                r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
                r'localhost|'  # localhost...
                r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
                r'(?::\d+)?'  # optional port
                r'(?:/?|[/?]\S+)$', re.IGNORECASE)
            
            if not url_pattern.match(v.strip()):
                raise ValueError(f'Invalid URL format')
            return v.strip()
        return v

class APIIntegrationResponse(APIIntegrationBase):
    """Schema for API integration response"""
    id: int
    is_active: bool
    owner_id: int
    last_used: Optional[datetime]
    usage_count: int
    error_count: int
    rate_limit: Optional[int]
    rate_limit_remaining: Optional[int]
    rate_limit_reset: Optional[datetime]
    created_at: datetime
    updated_at: datetime

# API Key Schemas
class APIKeyCreate(BaseSchema):
    """Schema for creating an API key"""
    name: str = Field(..., min_length=1, max_length=255, description="API key name")
    rate_limit: int = Field(1000, ge=1, le=100000, description="Rate limit per hour")
    expires_at: Optional[datetime] = Field(None, description="Expiration date")

class APIKeyResponse(BaseSchema):
    """Schema for API key response"""
    id: int
    name: str
    key_prefix: str
    is_active: bool
    last_used: Optional[datetime]
    usage_count: int
    rate_limit: int
    expires_at: Optional[datetime]
    created_at: datetime

class APIKeyCreateResponse(APIKeyResponse):
    """Schema for API key creation response (includes full key)"""
    key: str = Field(..., description="Full API key (shown only once)")

# Generic Response Schemas
class MessageResponse(BaseSchema):
    """Generic message response"""
    message: str
    success: bool = True

class ErrorResponse(BaseSchema):
    """Error response schema"""
    error: str
    detail: Optional[str] = None
    code: Optional[str] = None

class PaginatedResponse(BaseSchema):
    """Paginated response schema"""
    items: List[Any]
    total: int
    page: int
    per_page: int
    pages: int
    has_next: bool
    has_prev: bool

# Health Check Schema
class HealthCheckResponse(BaseSchema):
    """Health check response"""
    status: str
    timestamp: datetime
    database: Dict[str, Any]
    redis: Optional[Dict[str, Any]] = None
    services: Dict[str, str]
    version: str = "1.0.0"

# Analytics Schemas
class AnalyticsResponse(BaseSchema):
    """Analytics response schema"""
    metrics: Dict[str, Union[int, float, str]]
    time_range: str
    generated_at: datetime

# Template Schemas
class WorkflowTemplateBase(BaseSchema):
    """Base workflow template schema"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: str = Field(..., min_length=1, max_length=100)
    subcategory: Optional[str] = Field(None, max_length=100)
    complexity_level: str = Field("beginner", pattern=r'^(beginner|intermediate|advanced)$')
    estimated_setup_time: Optional[int] = Field(None, ge=1, description="Setup time in minutes")
    tags: Optional[List[str]] = None

class WorkflowTemplateCreate(WorkflowTemplateBase):
    """Schema for creating a workflow template"""
    nodes: List[Dict[str, Any]] = Field(..., description="Template nodes")
    edges: List[Dict[str, Any]] = Field(..., description="Template edges")
    is_public: bool = Field(True, description="Make template public")

class WorkflowTemplateResponse(WorkflowTemplateBase):
    """Schema for workflow template response"""
    id: int
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    is_public: bool
    is_verified: bool
    usage_count: int
    rating_average: float
    rating_count: int
    version: str
    author_id: Optional[int]
    created_at: datetime
    updated_at: datetime