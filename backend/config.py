from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

ASSETS_FILE = DATA_DIR / "assets.json"
RELATIONSHIPS_FILE = DATA_DIR / "relationships.json"
SCENARIOS_FILE = DATA_DIR / "scenarios.json"
# --------------------------------------------------
# NERVA ACCESS ROLES
# --------------------------------------------------

ACCESS_ROLES = {
    "city_command": {
        "name": "City Command",
        "description": "Authorized city officials and department controllers",
        "permissions": [
            "view_city_pulse",
            "view_city_map",
            "view_infrastructure",
            "view_underground",
            "view_connections",
            "run_scenarios",
            "view_predictions",
            "view_evidence",
            "simulate_interventions",
            "manage_response",
            "assign_tasks",
            "verify_completion",
            "view_reports",
        ],
    },

    "field_team": {
        "name": "Field Team",
        "description": "Department field employees",
        "permissions": [
            "view_assigned_tasks",
            "view_task_location",
            "accept_task",
            "update_task_status",
            "submit_work_evidence",
            "mark_task_completed",
        ],
    },

    "citizen": {
        "name": "Citizen Access",
        "description": "Public access to reporting and city information",
        "permissions": [
            "report_issue",
            "upload_report_photo",
            "submit_report_location",
            "view_city_alerts",
            "track_own_reports",
            "view_public_advisories",
        ],
    },
}


DEPARTMENTS = [
    "Drainage",
    "Traffic",
    "Water",
    "Electricity",
    "Roads",
    "Emergency Services",
]