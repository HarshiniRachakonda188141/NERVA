from engines.graph_engine import graph_engine


RELATION_TEXT = {
    "drains_corridor": "serves the drainage corridor of",
    "feeds_traffic_into": "feeds traffic into",
    "provides_access_to": "provides access to",
    "crosses_below": "crosses below",
    "powers": "provides power to"
}


class ExplanationEngine:
    def explain(self, starting_asset, cascade):
        critical_assets = [
            item
            for item in cascade
            if item["type"] == "hospital"
        ]

        if not critical_assets:
            return {
                "summary": (
                    "The model detected connected "
                    "infrastructure that may be affected."
                ),
                "path": []
            }

        critical = critical_assets[0]
        target = critical["asset_id"]

        path = graph_engine.get_path(
            starting_asset,
            target
        )

        evidence = []

        for edge in path:
            source_asset = graph_engine.get_asset(
                edge["source"]
            )

            target_asset = graph_engine.get_asset(
                edge["target"]
            )

            relation = RELATION_TEXT.get(
                edge["relation"],
                edge["relation"]
            )

            evidence.append({
                "source": source_asset["id"],
                "source_name": source_asset["name"],
                "relation": relation,
                "target": target_asset["id"],
                "target_name": target_asset["name"]
            })

        return {
            "summary": (
                f"{critical['name']} is a critical facility. "
                "The infrastructure graph contains a dependency "
                f"path from {starting_asset} to {target}. "
                "The scenario therefore flags a possible "
                "indirect critical-access impact."
            ),
            "path": evidence
        }


explanation_engine = ExplanationEngine()