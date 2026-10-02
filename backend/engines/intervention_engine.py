from engines.cascade_engine import cascade_engine


class InterventionEngine:

    ACTIONS = {
        "CLEAR_DRAIN": {
            "name": "Clear Drain",
            "severity_reduction": 6,
            "cascade_limit": 1,
            "department": "Drainage",
        },

        "CLOSE_ROAD": {
            "name": "Close Road",
            "severity_reduction": 2,
            "cascade_limit": 2,
            "department": "Traffic",
        },

        "TRAFFIC_DIVERSION": {
            "name": "Divert Traffic",
            "severity_reduction": 3,
            "cascade_limit": 2,
            "department": "Traffic",
        },

        "DISPATCH_EMERGENCY_TEAM": {
            "name": "Dispatch Emergency Team",
            "severity_reduction": 3,
            "cascade_limit": 2,
            "department": "Emergency Services",
        },

        "ISOLATE_POWER_NODE": {
            "name": "Isolate Power Node",
            "severity_reduction": 4,
            "cascade_limit": 2,
            "department": "Electricity",
        },

        "ISOLATE_PIPELINE": {
            "name": "Isolate Pipeline",
            "severity_reduction": 5,
            "cascade_limit": 1,
            "department": "Water",
        },

        "DEPLOY_COOLING_SUPPORT": {
            "name": "Deploy Cooling Support",
            "severity_reduction": 2,
            "cascade_limit": 2,
            "department": "Emergency Services",
        },
    }

    def get_actions(self):
        return [
            {
                "id": action_id,
                **details,
            }
            for action_id, details
            in self.ACTIONS.items()
        ]

    def apply(
        self,
        starting_asset,
        severity,
        intervention,
    ):
        original = cascade_engine.simulate(
            starting_asset=starting_asset,
            severity=severity,
        )

        if not original:
            return None

        original_cascade = original["cascade"]
        original_count = len(original_cascade)

        action = self.ACTIONS.get(
            intervention
        )

        if not action:
            return {
                "intervention": intervention,
                "valid": False,
                "message": "Unknown intervention",
                "before": {
                    "severity": severity,
                    "affected_assets": original_count,
                    "cascade": original_cascade,
                },
                "after": {
                    "severity": severity,
                    "affected_assets": original_count,
                    "cascade": original_cascade,
                },
                "impact_reduction": 0,
            }

        reduced_severity = max(
            severity
            - action["severity_reduction"],
            1,
        )

        cascade_limit = min(
            action["cascade_limit"],
            original_count,
        )

        protected_cascade = (
            original_cascade[:cascade_limit]
        )

        return {
            "intervention": intervention,
            "intervention_name": action["name"],
            "department": action["department"],
            "valid": True,

            "before": {
                "severity": severity,
                "affected_assets": original_count,
                "cascade": original_cascade,
            },

            "after": {
                "severity": reduced_severity,
                "affected_assets": len(
                    protected_cascade
                ),
                "cascade": protected_cascade,
            },

            "impact_reduction": (
                original_count
                - len(protected_cascade)
            ),
        }

    def compare(
        self,
        starting_asset,
        severity,
        interventions,
    ):
        original = cascade_engine.simulate(
            starting_asset=starting_asset,
            severity=severity,
        )

        if not original:
            return None

        original_cascade = original["cascade"]
        original_count = len(original_cascade)

        valid_actions = [
            self.ACTIONS[action]
            for action in interventions
            if action in self.ACTIONS
        ]

        if not valid_actions:
            return {
                "selected_actions": [],
                "before": {
                    "severity": severity,
                    "affected_assets": original_count,
                    "cascade": original_cascade,
                },
                "after": {
                    "severity": severity,
                    "affected_assets": original_count,
                    "cascade": original_cascade,
                },
                "impact_reduction": 0,
            }

        total_reduction = sum(
            action["severity_reduction"]
            for action in valid_actions
        )

        reduced_severity = max(
            severity - total_reduction,
            1,
        )

        strongest_limit = min(
            action["cascade_limit"]
            for action in valid_actions
        )

        protected_cascade = (
            original_cascade[:strongest_limit]
        )

        selected_actions = []

        for action_id in interventions:
            action = self.ACTIONS.get(
                action_id
            )

            if action:
                selected_actions.append(
                    {
                        "id": action_id,
                        "name": action["name"],
                        "department": (
                            action["department"]
                        ),
                    }
                )

        return {
            "selected_actions": selected_actions,

            "before": {
                "severity": severity,
                "affected_assets": original_count,
                "cascade": original_cascade,
            },

            "after": {
                "severity": reduced_severity,
                "affected_assets": len(
                    protected_cascade
                ),
                "cascade": protected_cascade,
            },

            "impact_reduction": (
                original_count
                - len(protected_cascade)
            ),

            "comparison_label": (
                "No Action vs Selected Actions"
            ),

            "model_note": (
                "Impact reduction is a prototype "
                "simulation and not a validated "
                "real-world forecast."
            ),
        }


intervention_engine = InterventionEngine()