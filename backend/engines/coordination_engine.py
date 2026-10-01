DEPARTMENT_ACTIONS = {
    "drainage": {
        "department": "Drainage",
        "action": "Inspect and clear affected drainage assets."
    },
    "road": {
        "department": "Municipal",
        "action": "Inspect road condition and manage access."
    },
    "junction": {
        "department": "Traffic",
        "action": "Review traffic flow and prepare diversion."
    },
    "hospital": {
        "department": "Health / Emergency",
        "action": "Protect continuity of critical facility access."
    },
    "water": {
        "department": "Water",
        "action": "Inspect water infrastructure for disruption."
    },
    "power": {
        "department": "Electricity",
        "action": "Inspect electrical infrastructure and continuity."
    }
}


class CoordinationEngine:
    def recommend(self, cascade):
        recommendations = []
        used_departments = set()

        for item in cascade:
            asset_type = item["type"]

            recommendation = DEPARTMENT_ACTIONS.get(
                asset_type
            )

            if not recommendation:
                continue

            department = recommendation["department"]

            if department in used_departments:
                continue

            used_departments.add(department)

            recommendations.append({
                "priority": len(recommendations) + 1,
                "department": department,
                "action": recommendation["action"],
                "related_asset": item["asset_id"]
            })

        return recommendations


coordination_engine = CoordinationEngine()