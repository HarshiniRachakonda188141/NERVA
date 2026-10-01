from engines.cascade_engine import cascade_engine


class InterventionEngine:
    def apply(
        self,
        starting_asset,
        severity,
        intervention
    ):
        original = cascade_engine.simulate(
            starting_asset=starting_asset,
            severity=severity
        )

        if not original:
            return None

        original_count = len(
            original["cascade"]
        )

        if intervention == "CLEAR_DRAIN":
            reduced_severity = max(
                severity - 6,
                1
            )

            protected_cascade = [
                original["cascade"][0]
            ]

        elif intervention == "TRAFFIC_DIVERSION":
            reduced_severity = max(
                severity - 3,
                1
            )

            protected_cascade = (
                original["cascade"][:2]
            )

        else:
            reduced_severity = severity
            protected_cascade = (
                original["cascade"]
            )

        return {
            "intervention": intervention,
            "before": {
                "severity": severity,
                "affected_assets": original_count
            },
            "after": {
                "severity": reduced_severity,
                "affected_assets": len(
                    protected_cascade
                ),
                "cascade": protected_cascade
            },
            "impact_reduction": (
                original_count
                - len(protected_cascade)
            )
        }


intervention_engine = InterventionEngine()