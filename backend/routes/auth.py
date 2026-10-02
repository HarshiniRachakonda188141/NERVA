from uuid import uuid4

from fastapi import APIRouter, HTTPException

from schemas.auth import (
    SignupRequest,
    LoginRequest,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


# ==========================================================
# PROTOTYPE USER STORE
# ==========================================================
#
# IMPORTANT:
# This is prototype-only in-memory storage.
#
# - Users disappear when the backend restarts.
# - Passwords are stored as plain text.
# - Production systems must use a database,
#   password hashing and secure authentication.
# ==========================================================

demo_users = [
    {
        "id": "CMD-DEMO-01",
        "name": "City Command Officer",
        "email": "command@nerva.demo",
        "password": "NervaCommand2026!",
        "role": "city_command",
        "department": "City Command",
        "zone": "All Zones",
        "team": "Command Center",
    },
    {
        "id": "FIELD-DEMO-01",
        "name": "Drainage Field Team",
        "email": "field@nerva.demo",
        "password": "NervaField2026!",
        "role": "field_team",
        "department": "Drainage",
        "zone": "Zone A",
        "team": "Team D-01",
    },
]


# ==========================================================
# HELPERS
# ==========================================================

def public_user(user):
    """
    Return user information without exposing
    the prototype password.
    """

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "department": user["department"],
        "zone": user["zone"],
        "team": user["team"],
    }


def find_user_by_email(email: str):
    normalized_email = (
        email.lower().strip()
    )

    return next(
        (
            user
            for user in demo_users
            if user["email"].lower()
            == normalized_email
        ),
        None,
    )


# ==========================================================
# PUBLIC SIGNUP
# ==========================================================

@router.post("/signup")
def signup(
    request: SignupRequest,
):
    email = (
        request.email
        .lower()
        .strip()
    )

    name = request.name.strip()

    # ------------------------------------------------------
    # BASIC VALIDATION
    # ------------------------------------------------------

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required",
        )

    # ------------------------------------------------------
    # DUPLICATE USER CHECK
    # ------------------------------------------------------

    existing_user = (
        find_user_by_email(email)
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists",
        )

    # ------------------------------------------------------
    # ACCESS CONTROL
    # ------------------------------------------------------
    #
    # Public registration is Citizen-only.
    #
    # City Command and Field Team accounts
    # represent internal operational access
    # and must not be self-created publicly.
    # ------------------------------------------------------

    if request.role != "citizen":
        raise HTTPException(
            status_code=403,
            detail=(
                "Public registration is "
                "available for Citizen "
                "Access only."
            ),
        )

    # ------------------------------------------------------
    # CREATE USER
    # ------------------------------------------------------

    user = {
        "id": (
            "USR-"
            f"{uuid4().hex[:8].upper()}"
        ),

        "name": name,

        "email": email,

        # Prototype only.
        # Replace with password hashing
        # before production deployment.
        "password": request.password,

        "role": "citizen",

        # Citizens are not assigned to
        # internal response departments.
        "department": None,
        "zone": None,
        "team": None,
    }

    demo_users.append(user)

    return {
        "message": (
            "Citizen account created"
        ),

        "user": public_user(
            user
        ),
    }


# ==========================================================
# LOGIN
# ==========================================================

@router.post("/login")
def login(
    request: LoginRequest,
):
    email = (
        request.email
        .lower()
        .strip()
    )

    user = find_user_by_email(
        email
    )

    # ------------------------------------------------------
    # CREDENTIAL CHECK
    # ------------------------------------------------------

    if (
        not user
        or user["password"]
        != request.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    # ------------------------------------------------------
    # PROTOTYPE TOKEN
    # ------------------------------------------------------
    #
    # This is NOT a real JWT.
    #
    # It is only used so the frontend can
    # demonstrate authenticated prototype
    # navigation.
    # ------------------------------------------------------

    token = (
        f"nerva-demo-{user['id']}"
    )

    return {
        "message":
            "Login successful",

        "token":
            token,

        "user":
            public_user(user),
    }


# ==========================================================
# ACCESS TYPES
# ==========================================================

@router.get("/roles")
def get_roles():
    return {
        "roles": [
            {
                "id":
                    "city_command",

                "name":
                    "City Command",

                "description": (
                    "Internal command and "
                    "coordination access."
                ),

                "public_signup":
                    False,
            },

            {
                "id":
                    "field_team",

                "name":
                    "Field Team",

                "description": (
                    "Operational access for "
                    "assigned response teams."
                ),

                "public_signup":
                    False,
            },

            {
                "id":
                    "citizen",

                "name":
                    "Citizen Access",

                "description": (
                    "Public access for "
                    "citizen reporting and "
                    "status tracking."
                ),

                "public_signup":
                    True,
            },
        ],

        "default_public_role":
            "citizen",

        "mode":
            "PROTOTYPE ACCESS CONTROL",
    }


# ==========================================================
# DEMO ACCESS INFORMATION
# ==========================================================

@router.get("/demo-access")
def get_demo_access():
    """
    Exposes prototype demo identities
    without returning passwords.
    """

    return {
        "accounts": [
            {
                "role":
                    "city_command",

                "name":
                    "City Command Officer",

                "email":
                    "command@nerva.demo",
            },

            {
                "role":
                    "field_team",

                "name":
                    "Drainage Field Team",

                "email":
                    "field@nerva.demo",

                "department":
                    "Drainage",

                "zone":
                    "Zone A",

                "team":
                    "Team D-01",
            },
        ],

        "note": (
            "These identities are provided "
            "for NERVA prototype testing."
        ),
    }