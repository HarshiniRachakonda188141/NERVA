from typing import Literal, Optional

from pydantic import BaseModel, EmailStr


UserRole = Literal[
    "city_command",
    "field_team",
    "citizen",
]


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole

    # Field Team accounts only
    department: Optional[str] = None
    zone: Optional[str] = None
    team: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: UserRole

    department: Optional[str] = None
    zone: Optional[str] = None
    team: Optional[str] = None


class AuthResponse(BaseModel):
    message: str
    user: UserResponse