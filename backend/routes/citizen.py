from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


router = APIRouter(
    prefix="/api/citizen",
    tags=["Citizen Signals"],
)


# Prototype in-memory storage.
citizen_reports = []


class CitizenReportRequest(BaseModel):
    category: str

    description: str = Field(
        min_length=3,
        max_length=500,
    )

    location: str = "Location not provided"

    latitude: float | None = None
    longitude: float | None = None


@router.post("/reports")
def create_report(
    request: CitizenReportRequest,
):
    report = {
        "id": (
            f"CR-{uuid4().hex[:6].upper()}"
        ),
        "category": request.category,
        "description": request.description,
        "location": request.location,
        "latitude": request.latitude,
        "longitude": request.longitude,

        # Citizen input is not automatically
        # treated as verified infrastructure data.
        "source": "citizen",
        "verification": "unverified",

        "status": "Received",

        "created_at": datetime.now(
            timezone.utc
        ).isoformat(),
    }

    citizen_reports.append(report)

    return {
        "message": "Report received",
        "report": report,
        "notice": (
            "Citizen reports are treated as "
            "unverified signals until reviewed."
        ),
    }


@router.get("/reports")
def get_reports():
    return {
        "reports": citizen_reports,
        "count": len(citizen_reports),
    }


@router.get("/reports/{report_id}")
def get_report(
    report_id: str,
):
    report = next(
        (
            item
            for item in citizen_reports
            if item["id"] == report_id
        ),
        None,
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    return report


@router.get("/signals")
def get_signal_summary():
    category_counts = {}

    for report in citizen_reports:
        category = report["category"]

        category_counts[category] = (
            category_counts.get(
                category,
                0,
            )
            + 1
        )

    possible_incidents = []

    for category, count in (
        category_counts.items()
    ):
        if count >= 3:
            possible_incidents.append(
                {
                    "category": category,
                    "signal_count": count,
                    "label": (
                        "Possible emerging incident"
                    ),
                    "verification": "unverified",
                }
            )

    return {
        "total_signals": len(
            citizen_reports
        ),
        "categories": category_counts,
        "possible_incidents": (
            possible_incidents
        ),
        "note": (
            "Signal clustering is prototype "
            "logic and does not verify that "
            "an incident actually occurred."
        ),
    }