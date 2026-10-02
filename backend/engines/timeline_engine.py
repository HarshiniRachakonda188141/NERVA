TIMELINE_TEMPLATES = {
    "heavy_rainfall": [
        {
            "minute": 0,
            "stage": "Event Detected",
            "impact": "Heavy rainfall detected in the zone",
            "level": "warning",
        },
        {
            "minute": 10,
            "stage": "Drainage Pressure",
            "impact": "Drainage capacity may become overloaded",
            "level": "high",
        },
        {
            "minute": 25,
            "stage": "Road Impact",
            "impact": "Waterlogging may begin affecting nearby roads",
            "level": "high",
        },
        {
            "minute": 45,
            "stage": "Critical Access Risk",
            "impact": "Traffic and emergency access may be disrupted",
            "level": "critical",
        },
    ],

    "urban_fire": [
        {
            "minute": 0,
            "stage": "Fire Detected",
            "impact": "Urban fire incident detected",
            "level": "critical",
        },
        {
            "minute": 10,
            "stage": "Road Restriction",
            "impact": "Nearby road movement may become restricted",
            "level": "high",
        },
        {
            "minute": 25,
            "stage": "Traffic Impact",
            "impact": "Traffic congestion may increase around the area",
            "level": "high",
        },
        {
            "minute": 45,
            "stage": "Service Impact",
            "impact": "Emergency and nearby infrastructure access may be affected",
            "level": "critical",
        },
    ],

    "power_failure": [
        {
            "minute": 0,
            "stage": "Power Failure",
            "impact": "Power node failure detected",
            "level": "high",
        },
        {
            "minute": 10,
            "stage": "Local Outage",
            "impact": "Connected services may lose electricity",
            "level": "high",
        },
        {
            "minute": 25,
            "stage": "Service Pressure",
            "impact": "Critical facilities may begin relying on backup power",
            "level": "high",
        },
        {
            "minute": 45,
            "stage": "Critical Risk",
            "impact": "Extended outage may affect essential services",
            "level": "critical",
        },
    ],

    "pipeline_burst": [
        {
            "minute": 0,
            "stage": "Pipeline Failure",
            "impact": "Water pipeline failure detected",
            "level": "high",
        },
        {
            "minute": 10,
            "stage": "Water Accumulation",
            "impact": "Water may begin accumulating near the failure",
            "level": "high",
        },
        {
            "minute": 25,
            "stage": "Road Impact",
            "impact": "Nearby roads may become partially disrupted",
            "level": "high",
        },
        {
            "minute": 45,
            "stage": "Service Disruption",
            "impact": "Traffic and water services may be affected",
            "level": "critical",
        },
    ],

    "road_accident": [
        {
            "minute": 0,
            "stage": "Incident Detected",
            "impact": "Major road incident detected",
            "level": "high",
        },
        {
            "minute": 10,
            "stage": "Traffic Build-up",
            "impact": "Congestion may begin around the incident",
            "level": "high",
        },
        {
            "minute": 25,
            "stage": "Route Pressure",
            "impact": "Traffic may shift to surrounding roads",
            "level": "high",
        },
        {
            "minute": 45,
            "stage": "Emergency Delay Risk",
            "impact": "Emergency travel times may increase",
            "level": "critical",
        },
    ],

    "extreme_heat": [
        {
            "minute": 0,
            "stage": "Heat Alert",
            "impact": "Extreme heat conditions detected",
            "level": "warning",
        },
        {
            "minute": 10,
            "stage": "Demand Increase",
            "impact": "Electricity demand may begin increasing",
            "level": "high",
        },
        {
            "minute": 25,
            "stage": "Grid Pressure",
            "impact": "Power infrastructure may experience higher load",
            "level": "high",
        },
        {
            "minute": 45,
            "stage": "Critical Service Risk",
            "impact": "Vulnerable services may face increased disruption risk",
            "level": "critical",
        },
    ],
}


def build_impact_timeline(event_type: str):
    timeline = TIMELINE_TEMPLATES.get(event_type)

    if timeline is None:
        return [
            {
                "minute": 0,
                "stage": "Event Detected",
                "impact": "Scenario detected",
                "level": "warning",
            }
        ]

    return timeline