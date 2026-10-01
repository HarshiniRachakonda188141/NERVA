from engines.graph_engine import graph_engine


class CascadeEngine:
    def simulate(self, starting_asset, severity, max_depth=3):
        start = graph_engine.get_asset(starting_asset)

        if not start:
            return None

        affected = graph_engine.get_affected_assets(
            starting_asset,
            max_depth=max_depth
        )

        cascade = [
            {
                "asset_id": starting_asset,
                "name": start["name"],
                "type": start["type"],
                "depth": 0,
                "state": "origin"
            }
        ]

        for item in affected:
            asset = item["asset"]
            depth = item["depth"]

            if asset["type"] == "hospital":
                state = "critical_facility_risk"
            elif depth == 1:
                state = "high"
            elif depth == 2:
                state = "medium"
            else:
                state = "watch"

            cascade.append({
                "asset_id": asset["id"],
                "name": asset["name"],
                "type": asset["type"],
                "depth": depth,
                "state": state
            })

        return {
            "starting_asset": starting_asset,
            "severity": severity,
            "cascade": cascade
        }


cascade_engine = CascadeEngine()