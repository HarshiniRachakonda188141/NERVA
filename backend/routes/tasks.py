from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskVerify,
)

router = APIRouter(
    prefix="/api/tasks",
    tags=["Field Tasks"],
)


# --------------------------------------------------
# PROTOTYPE STORAGE
# --------------------------------------------------

# Prototype-only in-memory task storage.
# Replace with persistent database storage later.
tasks = []


# --------------------------------------------------
# STATUS WORKFLOW
# --------------------------------------------------

FIELD_ALLOWED_STATUSES = {
    "Assigned",
    "Accepted",
    "Work in Progress",
    "Completed",
}


PROGRESS_MAP = {
    "Assigned": 0,
    "Accepted": 15,
    "Work in Progress": 50,
    "Completed": 90,
    "Resolved": 100,
}


# --------------------------------------------------
# HELPERS
# --------------------------------------------------

def find_task(task_id: str):
    for task in tasks:
        if task["id"] == task_id:
            return task

    return None


def current_time():
    return datetime.now(
        timezone.utc
    ).isoformat()


def is_overdue(task):
    due_date = task.get("due_date")

    if not due_date:
        return False

    if task["status"] == "Resolved":
        return False

    try:
        due = datetime.fromisoformat(
            str(due_date).replace(
                "Z",
                "+00:00",
            )
        )

        if due.tzinfo is None:
            due = due.replace(
                tzinfo=timezone.utc
            )

        return (
            datetime.now(timezone.utc)
            > due
        )

    except (
        ValueError,
        TypeError,
    ):
        return False


def serialize_task(task):
    return {
        **task,
        "overdue": is_overdue(task),
    }


# --------------------------------------------------
# ALL TASKS
# --------------------------------------------------

@router.get("/")
def get_all_tasks():
    return {
        "count": len(tasks),
        "tasks": [
            serialize_task(task)
            for task in tasks
        ],
    }


# --------------------------------------------------
# COMMAND ROOM TASK SUMMARY
# --------------------------------------------------

@router.get("/summary")
def get_task_summary():
    summary = {
        "total": len(tasks),
        "assigned": 0,
        "accepted": 0,
        "in_progress": 0,
        "completed": 0,
        "resolved": 0,
        "overdue": 0,
    }

    departments = {}

    for task in tasks:
        status = task["status"]

        if status == "Assigned":
            summary["assigned"] += 1

        elif status == "Accepted":
            summary["accepted"] += 1

        elif status == "Work in Progress":
            summary["in_progress"] += 1

        elif status == "Completed":
            summary["completed"] += 1

        elif status == "Resolved":
            summary["resolved"] += 1

        if is_overdue(task):
            summary["overdue"] += 1

        department = (
            task.get("department")
            or "Unassigned"
        )

        departments[department] = (
            departments.get(
                department,
                0,
            )
            + 1
        )

    return {
        "summary": summary,
        "departments": departments,
        "mode": (
            "PROTOTYPE FIELD OPERATIONS"
        ),
    }


# --------------------------------------------------
# TEAM TASKS
# --------------------------------------------------

@router.get(
    "/team/{team_name}/assigned"
)
def get_team_tasks(
    team_name: str,
):
    team_tasks = [
        serialize_task(task)
        for task in tasks
        if (
            task.get("team")
            and task["team"].lower()
            == team_name.lower()
        )
    ]

    return {
        "team": team_name,
        "count": len(team_tasks),
        "tasks": team_tasks,
    }


# --------------------------------------------------
# DEPARTMENT TASKS
# --------------------------------------------------

@router.get(
    "/department/{department_name}"
)
def get_department_tasks(
    department_name: str,
):
    department_tasks = [
        serialize_task(task)
        for task in tasks
        if (
            task.get("department")
            and task[
                "department"
            ].lower()
            == department_name.lower()
        )
    ]

    return {
        "department": department_name,
        "count": len(
            department_tasks
        ),
        "tasks": department_tasks,
    }


# --------------------------------------------------
# SINGLE TASK
# --------------------------------------------------

@router.get("/{task_id}")
def get_task(task_id: str):
    task = find_task(task_id)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    return serialize_task(task)


# --------------------------------------------------
# CREATE / ASSIGN TASK
# --------------------------------------------------

@router.post("/")
def create_task(
    payload: TaskCreate,
):
    now = current_time()

    task = {
        "id": (
            f"TASK-"
            f"{uuid4().hex[:8].upper()}"
        ),

        "title": payload.title,
        "description": (
            payload.description
        ),

        "department": (
            payload.department
        ),

        "zone": payload.zone,
        "team": payload.team,

        "priority": (
            payload.priority
        ),

        "status": "Assigned",
        "progress": 0,

        "asset_id": (
            payload.asset_id
        ),

        "incident_id": (
            payload.incident_id
        ),

        "location_name": (
            payload.location_name
        ),

        "latitude": (
            payload.latitude
        ),

        "longitude": (
            payload.longitude
        ),

        "due_date": (
            payload.due_date
        ),

        "note": None,
        "evidence_url": None,

        "completion_verified": False,
        "verification_note": None,

        "created_at": now,
        "updated_at": now,
    }

    tasks.append(task)

    return {
        "message": (
            "Task assigned successfully"
        ),

        "task": serialize_task(
            task
        ),
    }


# --------------------------------------------------
# FIELD TEAM STATUS UPDATE
# --------------------------------------------------

@router.patch(
    "/{task_id}/status"
)
def update_task_status(
    task_id: str,
    payload: TaskUpdate,
):
    task = find_task(task_id)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    if (
        payload.status
        not in FIELD_ALLOWED_STATUSES
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid Field Team status. "
                "Use Assigned, Accepted, "
                "Work in Progress or Completed."
            ),
        )

    # Once Command has resolved the task,
    # Field Team cannot reopen it using
    # this endpoint.
    if task["status"] == "Resolved":
        raise HTTPException(
            status_code=400,
            detail=(
                "Resolved tasks cannot be "
                "changed by the Field Team."
            ),
        )

    task["status"] = (
        payload.status
    )

    task["progress"] = (
        PROGRESS_MAP[
            payload.status
        ]
    )

    if payload.note is not None:
        task["note"] = (
            payload.note
        )

    if (
        payload.evidence_url
        is not None
    ):
        task["evidence_url"] = (
            payload.evidence_url
        )

    # Completed means work was reported
    # complete by the employee.
    # It still needs verification.
    if payload.status == "Completed":
        task[
            "completion_verified"
        ] = False

    task["updated_at"] = (
        current_time()
    )

    return {
        "message": (
            "Task status updated"
        ),

        "task": serialize_task(
            task
        ),

        "requires_verification": (
            payload.status
            == "Completed"
        ),
    }


# --------------------------------------------------
# CITY COMMAND VERIFICATION
# --------------------------------------------------

@router.patch(
    "/{task_id}/verify"
)
def verify_task(
    task_id: str,
    payload: TaskVerify,
):
    task = find_task(task_id)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    # Verification only makes sense after
    # Field Team reports completion.
    if (
        payload.verified
        and task["status"]
        != "Completed"
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Task must be marked "
                "Completed before it can "
                "be verified."
            ),
        )

    task[
        "completion_verified"
    ] = payload.verified

    if (
        payload.verification_note
        is not None
    ):
        task[
            "verification_note"
        ] = (
            payload.verification_note
        )

    if payload.verified:
        task["status"] = (
            "Resolved"
        )

        task["progress"] = 100

    else:
        # Command rejected completion.
        # Send it back to Field Team.
        task["status"] = (
            "Work in Progress"
        )

        task["progress"] = 50

    task["updated_at"] = (
        current_time()
    )

    return {
        "message": (
            "Task verification updated"
        ),

        "task": serialize_task(
            task
        ),
    }