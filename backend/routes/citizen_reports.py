from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from schemas.citizen_report import (
    CitizenReportCreate,
    CitizenReportUpdate,
    CitizenReportVerify,
)


router = APIRouter(
    prefix="/api/citizen-reports",
    tags=["Citizen Reports"],
)


# --------------------------------------------------
# PROTOTYPE STORAGE
# --------------------------------------------------

# Prototype-only in-memory storage.
# Reports disappear when the backend restarts.
citizen_reports = []


# --------------------------------------------------
# HELPERS
# --------------------------------------------------

def find_report(report_id: str):
    for report in citizen_reports:
        if report["id"] == report_id:
            return report

    return None


def normalise_category(category: str):
    return category.strip().lower()


def calculate_signal_count(
    category: str,
    location_name: str,
):
    """
    Prototype clustering.

    Reports are considered related when
    category and location name match.

    This is not yet true geospatial
    clustering.
    """

    category_key = normalise_category(
        category
    )

    location_key = (
        location_name.strip().lower()
    )

    count = 1

    for report in citizen_reports:
        same_category = (
            normalise_category(
                report["category"]
            )
            == category_key
        )

        same_location = (
            report["location_name"]
            .strip()
            .lower()
            == location_key
        )

        if same_category and same_location:
            count += 1

    return count


def update_related_signal_counts(
    category: str,
    location_name: str,
    count: int,
):
    category_key = normalise_category(
        category
    )

    location_key = (
        location_name.strip().lower()
    )

    for report in citizen_reports:
        if (
            normalise_category(
                report["category"]
            )
            == category_key
            and report["location_name"]
            .strip()
            .lower()
            == location_key
        ):
            report["signal_count"] = count


# --------------------------------------------------
# CREATE REPORT
# --------------------------------------------------

@router.post("/")
def create_report(
    payload: CitizenReportCreate,
):
    now = datetime.now(
        timezone.utc
    ).isoformat()

    signal_count = (
        calculate_signal_count(
            payload.category,
            payload.location_name,
        )
    )

    report = {
        "id": (
            f"CR-{uuid4().hex[:8].upper()}"
        ),

        "category": payload.category,
        "description": payload.description,

        "location_name": (
            payload.location_name
        ),

        "latitude": payload.latitude,
        "longitude": payload.longitude,

        "photo_url": payload.photo_url,

        "reporter_name": (
            payload.reporter_name
        ),

        "reporter_contact": (
            payload.reporter_contact
        ),

        # Citizen reports start as
        # unverified signals.
        "source": "citizen",
        "status": "Submitted",
        "verified": False,

        "department": None,
        "priority": None,

        "signal_count": signal_count,

        "possible_incident": (
            signal_count >= 3
        ),

        "note": None,
        "verification_note": None,

        "created_at": now,
        "updated_at": now,
    }

    citizen_reports.append(report)

    update_related_signal_counts(
        payload.category,
        payload.location_name,
        signal_count,
    )

    return {
        "message": (
            "Issue reported successfully"
        ),

        "report": report,

        "notice": (
            "Citizen reports are treated "
            "as unverified signals until "
            "reviewed by an authorized team."
        ),
    }


# --------------------------------------------------
# ALL REPORTS
# --------------------------------------------------

@router.get("/")
def get_reports():
    return {
        "count": len(
            citizen_reports
        ),

        "reports": citizen_reports,

        "mode": (
            "CITIZEN SIGNAL DATA"
        ),
    }


# --------------------------------------------------
# SIGNAL INTELLIGENCE
# --------------------------------------------------

@router.get("/signals/summary")
def get_signal_summary():
    clusters = {}

    for report in citizen_reports:
        key = (
            normalise_category(
                report["category"]
            ),
            report["location_name"]
            .strip()
            .lower(),
        )

        if key not in clusters:
            clusters[key] = {
                "category": (
                    report["category"]
                ),
                "location": (
                    report[
                        "location_name"
                    ]
                ),
                "signal_count": 0,
                "report_ids": [],
            }

        clusters[key][
            "signal_count"
        ] += 1

        clusters[key][
            "report_ids"
        ].append(
            report["id"]
        )

    signals = []

    for cluster in clusters.values():
        count = cluster[
            "signal_count"
        ]

        signals.append(
            {
                **cluster,

                "classification": (
                    "Possible Emerging Incident"
                    if count >= 3
                    else "Citizen Signal"
                ),

                "verified": False,

                "confidence_note": (
                    "Multiple matching citizen "
                    "reports detected."
                    if count >= 3
                    else
                    "Insufficient independent "
                    "signals for clustering."
                ),
            }
        )

    return {
        "total_reports": len(
            citizen_reports
        ),

        "clusters": signals,

        "possible_incidents": [
            signal
            for signal in signals
            if signal["signal_count"] >= 3
        ],

        "disclaimer": (
            "Citizen signal clustering does "
            "not confirm that an incident "
            "occurred. Verification is "
            "required."
        ),
    }


# --------------------------------------------------
# SINGLE REPORT
# --------------------------------------------------

@router.get("/{report_id}")
def get_report(
    report_id: str,
):
    report = find_report(
        report_id
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    return report


# --------------------------------------------------
# UPDATE STATUS
# --------------------------------------------------

@router.patch("/{report_id}/status")
def update_report(
    report_id: str,
    payload: CitizenReportUpdate,
):
    report = find_report(
        report_id
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    report["status"] = (
        payload.status
    )

    report["note"] = (
        payload.note
    )

    report["updated_at"] = (
        datetime.now(
            timezone.utc
        ).isoformat()
    )

    return {
        "message": (
            "Report status updated"
        ),
        "report": report,
    }


# --------------------------------------------------
# VERIFY SIGNAL
# --------------------------------------------------

@router.patch("/{report_id}/verify")
def verify_report(
    report_id: str,
    payload: CitizenReportVerify,
):
    report = find_report(
        report_id
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    report["verified"] = (
        payload.verified
    )

    report["department"] = (
        payload.department
    )

    report["priority"] = (
        payload.priority
    )

    report["verification_note"] = (
        payload.verification_note
    )

    if payload.verified:
        report["status"] = "Verified"

    else:
        report["status"] = (
            "Needs Review"
        )

    report["updated_at"] = (
        datetime.now(
            timezone.utc
        ).isoformat()
    )

    return {
        "message": (
            "Report verification updated"
        ),

        "report": report,
    }