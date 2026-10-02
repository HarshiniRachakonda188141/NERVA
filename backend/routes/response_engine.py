# ==========================================================
# NERVA RESPONSE ENGINE
# ==========================================================
#
# Converts a simulated city incident into
# department-level response recommendations.
#
# Prototype decision-support only.
# Final operational decisions remain with
# authorized city officials.
# ==========================================================


DEPARTMENT_ACTIONS = {
    "heavy_rainfall": [
        {
            "department": "Drainage",
            "action": (
                "Inspect and clear affected drains"
            ),
            "priority": "Critical",
        },
        {
            "department": "Traffic",
            "action": (
                "Monitor waterlogged roads and "
                "divert traffic"
            ),
            "priority": "High",
        },
        {
            "department": "Emergency Services",
            "action": (
                "Prepare emergency access support"
            ),
            "priority": "High",
        },
    ],

    "urban_fire": [
        {
            "department": "Emergency Services",
            "action": (
                "Dispatch emergency response team"
            ),
            "priority": "Critical",
        },
        {
            "department": "Traffic",
            "action": (
                "Restrict nearby roads"
            ),
            "priority": "High",
        },
        {
            "department": "Electricity",
            "action": (
                "Assess nearby electrical "
                "infrastructure"
            ),
            "priority": "High",
        },
    ],

    "power_failure": [
        {
            "department": "Electricity",
            "action": (
                "Inspect affected power node"
            ),
            "priority": "Critical",
        },
        {
            "department": "Emergency Services",
            "action": (
                "Check critical facilities "
                "for backup power"
            ),
            "priority": "High",
        },
    ],

    "pipeline_burst": [
        {
            "department": "Water",
            "action": (
                "Locate and isolate pipeline failure"
            ),
            "priority": "Critical",
        },
        {
            "department": "Roads",
            "action": (
                "Inspect road surface around "
                "the failure"
            ),
            "priority": "High",
        },
        {
            "department": "Traffic",
            "action": (
                "Redirect traffic if road "
                "access is affected"
            ),
            "priority": "High",
        },
    ],

    "road_accident": [
        {
            "department": "Emergency Services",
            "action": (
                "Dispatch emergency response team"
            ),
            "priority": "Critical",
        },
        {
            "department": "Traffic",
            "action": (
                "Control traffic and create "
                "diversion route"
            ),
            "priority": "Critical",
        },
        {
            "department": "Roads",
            "action": (
                "Inspect road condition "
                "after clearance"
            ),
            "priority": "Medium",
        },
    ],

    "extreme_heat": [
        {
            "department": "Electricity",
            "action": (
                "Monitor increased electricity demand"
            ),
            "priority": "High",
        },
        {
            "department": "Emergency Services",
            "action": (
                "Prepare heat-response support"
            ),
            "priority": "High",
        },
    ],
}


# ==========================================================
# PRIORITY HELPERS
# ==========================================================

PRIORITY_SCORE = {
    "Low": 1,
    "Medium": 2,
    "High": 3,
    "Critical": 4,
}


def increase_priority(priority: str):
    """
    Increase recommendation priority by one level.
    Used for higher-severity simulations.
    """

    priority_order = [
        "Low",
        "Medium",
        "High",
        "Critical",
    ]

    if priority not in priority_order:
        return priority

    index = priority_order.index(
        priority
    )

    if index >= len(priority_order) - 1:
        return "Critical"

    return priority_order[index + 1]


# ==========================================================
# CASCADE HELPERS
# ==========================================================

def get_affected_asset_ids(cascade):
    """
    Extract affected asset IDs from different
    possible cascade result structures.

    This keeps the response engine tolerant of
    prototype cascade-data changes.
    """

    if not cascade:
        return []

    affected_assets = []

    for item in cascade:
        if isinstance(item, str):
            affected_assets.append(
                item
            )
            continue

        if isinstance(item, dict):
            asset_id = (
                item.get("asset_id")
                or item.get("id")
                or item.get("target")
                or item.get("node_id")
            )

            if asset_id:
                affected_assets.append(
                    asset_id
                )

    # Remove duplicates while preserving order.
    return list(
        dict.fromkeys(
            affected_assets
        )
    )


# ==========================================================
# RESPONSE PLAN BUILDER
# ==========================================================

def build_response_plan(
    event_type: str,
    cascade=None,
    severity: int | None = None,
):
    """
    Build department-level response recommendations
    for a simulated NERVA incident.

    Parameters
    ----------
    event_type:
        Type of simulated city incident.

    cascade:
        Optional infrastructure cascade generated
        by the cascade engine.

    severity:
        Optional incident severity from 1 to 10.
    """

    actions = DEPARTMENT_ACTIONS.get(
        event_type,
        [],
    )

    affected_assets = (
        get_affected_asset_ids(
            cascade
        )
    )

    response_cards = []

    # ------------------------------------------------------
    # CREATE DEPARTMENT RESPONSE CARDS
    # ------------------------------------------------------

    for index, item in enumerate(
        actions,
        start=1,
    ):
        priority = item[
            "priority"
        ]

        # Higher-severity incidents escalate
        # department response priority.
        if (
            severity is not None
            and severity >= 8
            and priority != "Critical"
        ):
            priority = (
                increase_priority(
                    priority
                )
            )

        response_cards.append(
            {
                "id": (
                    f"RESP-{index:02d}"
                ),

                "department": item[
                    "department"
                ],

                "recommended_action": item[
                    "action"
                ],

                "priority": priority,

                "status": "Pending",

                "assigned_team": None,

                "task_id": None,

                "affected_assets":
                    affected_assets,

                "severity":
                    severity,
            }
        )

    # ------------------------------------------------------
    # RESPONSE SUMMARY
    # ------------------------------------------------------

    critical_actions = sum(
        1
        for card in response_cards
        if card["priority"]
        == "Critical"
    )

    high_actions = sum(
        1
        for card in response_cards
        if card["priority"]
        == "High"
    )

    if critical_actions > 0:
        response_status = (
            "Immediate Coordination Required"
        )

    elif high_actions > 0:
        response_status = (
            "Priority Response Required"
        )

    elif response_cards:
        response_status = (
            "Response Recommended"
        )

    else:
        response_status = (
            "No Response Template Available"
        )

    # ------------------------------------------------------
    # RETURN RESPONSE CENTER
    # ------------------------------------------------------

    return {
        "title":
            "Response Center",

        "event_type":
            event_type,

        "severity":
            severity,

        "status":
            response_status,

        "affected_assets":
            affected_assets,

        "affected_asset_count":
            len(affected_assets),

        "summary": {
            "departments_involved":
                len(response_cards),

            "critical_actions":
                critical_actions,

            "high_priority_actions":
                high_actions,
        },

        "departments":
            response_cards,

        "workflow": [
            "Pending",
            "Assigned",
            "Responding",
            "Completed",
            "Verified",
            "Resolved",
        ],

        "decision_support": {
            "automatic_assignment":
                False,

            "human_approval_required":
                True,

            "model_generated":
                True,
        },

        "note": (
            "Actions are modelled "
            "decision-support recommendations. "
            "Authorized officials remain "
            "responsible for assignment, "
            "approval and field response."
        ),
    }