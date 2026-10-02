from typing import Optional

from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str
    description: str

    department: str
    zone: str
    team: str

    priority: str = "Medium"

    asset_id: Optional[str] = None
    incident_id: Optional[str] = None

    location_name: str

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    due_date: Optional[str] = None


class TaskUpdate(BaseModel):
    status: str

    note: Optional[str] = None
    evidence_url: Optional[str] = None


class TaskVerify(BaseModel):
    verified: bool

    verification_note: Optional[str] = None


class TaskResponse(BaseModel):
    id: str

    title: str
    description: str

    department: str
    zone: str
    team: str

    priority: str
    status: str

    location_name: str

    asset_id: Optional[str] = None
    incident_id: Optional[str] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    due_date: Optional[str] = None

    note: Optional[str] = None
    evidence_url: Optional[str] = None

    completion_verified: bool = False

    progress: int = Field(
        default=0,
        ge=0,
        le=100,
    )