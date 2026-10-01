from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

demo_users = []


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup")
def signup(request: SignupRequest):
    existing_user = next(
        (
            user
            for user in demo_users
            if user["email"] == request.email
        ),
        None
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    user = {
        "id": len(demo_users) + 1,
        "name": request.name,
        "email": request.email,
        "password": request.password,
        "role": request.role
    }

    demo_users.append(user)

    return {
        "message": "Account created",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }


@router.post("/login")
def login(request: LoginRequest):
    user = next(
        (
            user
            for user in demo_users
            if user["email"] == request.email
            and user["password"] == request.password
        ),
        None
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    return {
        "message": "Login successful",
        "token": f"nerva-demo-{user['id']}",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }