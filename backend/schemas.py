from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from models import DeliveryStatus, SMSProvider


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Task schemas
class TaskBase(BaseModel):
    name: str
    description: Optional[str] = None
    source_link: Optional[str] = None
    schedule_cron: Optional[str] = None
    schedule_human: Optional[str] = None
    recipients: List[str] = Field(default_factory=list)
    condition_rules: Optional[Dict[str, Any]] = None
    message_template: Optional[str] = None
    is_active: bool = True


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    source_link: Optional[str] = None
    schedule_cron: Optional[str] = None
    schedule_human: Optional[str] = None
    recipients: Optional[List[str]] = None
    condition_rules: Optional[Dict[str, Any]] = None
    message_template: Optional[str] = None
    is_active: Optional[bool] = None


class TaskResponse(TaskBase):
    id: int
    user_id: int
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Notification schemas
class NotificationBase(BaseModel):
    recipient: str
    message: str
    provider: SMSProvider


class NotificationCreate(NotificationBase):
    task_id: int


class NotificationResponse(NotificationBase):
    id: int
    task_id: int
    status: DeliveryStatus
    sent_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    error_message: Optional[str] = None
    retry_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None

