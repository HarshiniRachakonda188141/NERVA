EVIDENCE_TEMPLATES = {
    "heavy_rainfall": {
        "inputs_used": [
            "Rainfall intensity",
            "Drainage capacity",
            "Road dependency",
            "Critical-service connectivity",
        ],
        "confidence": 82,
        "missing_data": [
            "Live drain sensor data",
            "Real-time traffic feed",
        ],
        "assumptions": [
            "Drainage capacity remains unchanged",
            "No preventive intervention has started",
        ],
    },

    "urban_fire": {
        "inputs_used": [
            "Incident location",
            "Nearby road network",
            "Critical-service proximity",
            "Infrastructure dependencies",
        ],
        "confidence": 78,
        "missing_data": [
            "Live fire sensor data",
            "Real-time emergency response data",
        ],
        "assumptions": [
            "Incident remains active",
            "Nearby roads may require restriction",
        ],
    },

    "power_failure": {
        "inputs_used": [
            "Power node status",
            "Connected infrastructure",
            "Critical-service dependencies",
        ],
        "confidence": 84,
        "missing_data": [
            "Live grid telemetry",
            "Backup-power status",
        ],
        "assumptions": [
            "Power node remains unavailable",
            "Connected services depend on the affected node",
        ],
    },

    "pipeline_burst": {
        "inputs_used": [
            "Pipeline failure location",
            "Nearby road network",
            "Drainage connectivity",
            "Service dependencies",
        ],
        "confidence": 76,
        "missing_data": [
            "Live pipeline pressure",
            "Real-time water-flow data",
        ],
        "assumptions": [
            "Water discharge continues",
            "No isolation valve has been activated",
        ],
    },

    "road_accident": {
        "inputs_used": [
            "Incident location",
            "Road connectivity",
            "Traffic dependency",
            "Emergency-access routes",
        ],
        "confidence": 80,
        "missing_data": [
            "Live traffic speed",
            "Verified incident clearance time",
        ],
        "assumptions": [
            "Affected road remains restricted",
            "Traffic diverts to nearby roads",
        ],
    },

    "extreme_heat": {
        "inputs_used": [
            "Heat severity",
            "Power dependency",
            "Critical-service connectivity",
        ],
        "confidence": 74,
        "missing_data": [
            "Live electricity demand",
            "Local temperature sensor feeds",
        ],
        "assumptions": [
            "High temperature persists",
            "Electricity demand increases",
        ],
    },
}


def build_evidence(
    event_type: str,
    cascade: list,
):
    template = EVIDENCE_TEMPLATES.get(
        event_type,
        {
            "inputs_used": [
                "Scenario data",
                "Infrastructure dependencies",
            ],
            "confidence": 60,
            "missing_data": [
                "Live operational data",
            ],
            "assumptions": [
                "Scenario conditions remain active",
            ],
        },
    )

    dependency_path = []

    for item in cascade:
        if isinstance(item, dict):
            asset_id = (
                item.get("asset_id")
                or item.get("id")
                or item.get("asset")
            )

            if asset_id:
                dependency_path.append(
                    str(asset_id)
                )
        elif isinstance(item, str):
            dependency_path.append(item)

    return {
        "title": "Why NERVA Thinks This",
        "inputs_used": template[
            "inputs_used"
        ],
        "dependency_path": dependency_path,
        "confidence": template[
            "confidence"
        ],
        "missing_data": template[
            "missing_data"
        ],
        "assumptions": template[
            "assumptions"
        ],
        "confidence_label": (
            "Modelled prototype confidence"
        ),
        "data_note": (
            "Confidence is illustrative for "
            "the prototype and is not a "
            "validated real-world probability."
        ),
    }