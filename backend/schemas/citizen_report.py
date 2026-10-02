from typing import Optional

from pydantic import BaseModel, Field


class CitizenReportCreate(BaseModel):
    category: str
    description: str

    location_name: str

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    photo_url: Optional[str] = None

    reporter_name: Optional[str] = None
    reporter_contact: Optional[str] = None


class CitizenReportUpdate(BaseModel):
    status: str
    note: Optional[str] = None


class CitizenReportVerify(BaseModel):
    verified: bool
    verification_note: Optional[str] = None

    department: Optional[str] = None
    priority: Optional[str] = None


class CitizenReportResponse(BaseModel):
    id: str

    category: str
    description: str
    location_name: str

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    photo_url: Optional[str] = None

    status: str
    verified: bool = False

    department: Optional[str] = None
    priority: Optional[str] = None

    signal_count: int = Field(
        default=1,
        ge=1,
    )

    note: Optional[str] = None