from engines.graph_engine import graph_engine


class RiskEngine:
    def calculate(self, starting_asset, severity, cascade):
        asset = graph_engine.get_asset(starting_asset)

        if not asset:
            return None

        severity_points = min(severity * 3, 30)

        criticality_points = min(
            asset["criticality"] * 2.5,
            25
        )

        critical_facility_found = any(
            item["type"] == "hospital"
            for item in cascade
        )

        critical_facility_points = (
            20 if critical_facility_found else 0
        )

        affected_count = max(len(cascade) - 1, 0)

        dependency_points = min(
            affected_count * 5,
            15
        )

        condition_risk = 100 - asset["condition"]

        condition_points = min(
            condition_risk / 10,
            10
        )

        total = round(
            severity_points
            + criticality_points
            + critical_facility_points
            + dependency_points
            + condition_points
        )

        total = min(total, 100)

        if total >= 80:
            level = "CRITICAL"
        elif total >= 60:
            level = "HIGH"
        elif total >= 40:
            level = "MEDIUM"
        else:
            level = "LOW"

        return {
            "score": total,
            "level": level,
            "breakdown": {
                "severity": round(severity_points, 1),
                "asset_criticality": round(
                    criticality_points,
                    1
                ),
                "critical_facility": critical_facility_points,
                "dependency_impact": dependency_points,
                "asset_condition": round(
                    condition_points,
                    1
                )
            }
        }


risk_engine = RiskEngine()