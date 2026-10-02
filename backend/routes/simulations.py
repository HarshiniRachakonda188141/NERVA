import json

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from config import SCENARIOS_FILE

from engines.cascade_engine import cascade_engine
from engines.risk_engine import risk_engine
from engines.explanation_engine import explanation_engine
from engines.coordination_engine import coordination_engine
from engines.intervention_engine import intervention_engine
from engines.timeline_engine import build_impact_timeline
from engines.evidence_engine import build_evidence

from routes.response_engine import build_response_plan


router = APIRouter(
    prefix="/api",
    tags=["Simulation"],
)


# ==========================================================
# REQUEST MODELS
# ==========================================================

class SimulationRequest(BaseModel):
    scenario_id: str = "RAIN_01"

    severity: int | None = Field(
        default=None,
        ge=1,
        le=10,
    )


class InterventionRequest(BaseModel):
    scenario_id: str = "RAIN_01"

    interventions: list[str] = Field(
        default_factory=lambda: [
            "CLEAR_DRAIN"
        ],
        min_length=1,
        max_length=3,
    )


# ==========================================================
# SCENARIO DATA
# ==========================================================

def load_scenarios():
    try:
        with open(
            SCENARIOS_FILE,
            "r",
            encoding="utf-8",
        ) as file:
            return json.load(file)

    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail=(
                "Scenario dataset "
                "could not be found"
            ),
        )

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=(
                "Scenario dataset "
                "contains invalid JSON"
            ),
        )


def find_scenario(
    scenario_id: str,
):
    scenarios = load_scenarios()

    return next(
        (
            scenario
            for scenario in scenarios
            if scenario.get("id")
            == scenario_id
        ),
        None,
    )


def require_scenario(
    scenario_id: str,
):
    scenario = find_scenario(
        scenario_id
    )

    if not scenario:
        raise HTTPException(
            status_code=404,
            detail="Scenario not found",
        )

    return scenario


# ==========================================================
# CASCADE HELPER
# ==========================================================

def generate_cascade(
    scenario,
    severity,
):
    cascade_result = (
        cascade_engine.simulate(
            starting_asset=scenario[
                "starting_asset"
            ],
            severity=severity,
        )
    )

    if not cascade_result:
        raise HTTPException(
            status_code=404,
            detail=(
                "Starting asset "
                "not found"
            ),
        )

    return cascade_result[
        "cascade"
    ]


# ==========================================================
# SCENARIOS
# ==========================================================

@router.get("/scenarios")
def get_scenarios():
    scenarios = load_scenarios()

    return {
        "count": len(scenarios),
        "scenarios": scenarios,
        "mode": (
            "SIMULATED PROTOTYPE DATA"
        ),
    }


# ==========================================================
# AVAILABLE INTERVENTIONS
# ==========================================================

@router.get("/interventions")
def get_interventions():
    return {
        "interventions":
            intervention_engine
            .get_actions(),

        "maximum_selection": 3,

        "mode":
            "MODELLED INTERVENTIONS",
    }


# ==========================================================
# MAIN SIMULATION
# ==========================================================

@router.post("/simulate")
def simulate(
    request: SimulationRequest,
):
    scenario = require_scenario(
        request.scenario_id
    )

    severity = (
        request.severity
        if request.severity
        is not None
        else scenario["severity"]
    )

    # ------------------------------------------------------
    # CASCADE
    # ------------------------------------------------------

    cascade = generate_cascade(
        scenario=scenario,
        severity=severity,
    )

    # ------------------------------------------------------
    # RISK
    # ------------------------------------------------------

    risk = risk_engine.calculate(
        starting_asset=scenario[
            "starting_asset"
        ],
        severity=severity,
        cascade=cascade,
    )

    # ------------------------------------------------------
    # EXPLANATION
    # ------------------------------------------------------

    explanation = (
        explanation_engine.explain(
            starting_asset=scenario[
                "starting_asset"
            ],
            cascade=cascade,
        )
    )

    # ------------------------------------------------------
    # COORDINATION
    # ------------------------------------------------------

    coordination = (
        coordination_engine.recommend(
            cascade
        )
    )

    # ------------------------------------------------------
    # IMPACT TIMELINE
    # ------------------------------------------------------

    timeline = (
        build_impact_timeline(
            scenario["event_type"]
        )
    )

    # ------------------------------------------------------
    # EVIDENCE
    # ------------------------------------------------------

    evidence = build_evidence(
        event_type=scenario[
            "event_type"
        ],
        cascade=cascade,
    )

    # ------------------------------------------------------
    # RESPONSE CENTER
    # ------------------------------------------------------

    response_center = (
        build_response_plan(
            event_type=scenario[
                "event_type"
            ],
            cascade=cascade,
            severity=severity,
        )
    )

    # ------------------------------------------------------
    # RESPONSE
    # ------------------------------------------------------

    return {
        "system": "NERVA",

        "mode":
            "SIMULATED PROTOTYPE DATA",

        "scenario": {
            **scenario,
            "severity": severity,
        },

        "cascade": cascade,

        "timeline": timeline,

        "evidence": evidence,

        "risk": risk,

        "explanation":
            explanation,

        "coordination":
            coordination,

        "response_center":
            response_center,

        "disclaimer": (
            "This is a modelled "
            "decision-support scenario, "
            "not a guaranteed real-world "
            "forecast."
        ),
    }


# ==========================================================
# TIMELINE
# ==========================================================

@router.get(
    "/scenarios/{scenario_id}/timeline"
)
def get_scenario_timeline(
    scenario_id: str,
):
    scenario = require_scenario(
        scenario_id
    )

    timeline = (
        build_impact_timeline(
            scenario["event_type"]
        )
    )

    return {
        "scenario_id":
            scenario["id"],

        "scenario":
            scenario["name"],

        "event_type":
            scenario["event_type"],

        "severity":
            scenario["severity"],

        "timeline":
            timeline,

        "mode":
            "MODELLED TIMELINE",
    }


# ==========================================================
# EVIDENCE
# ==========================================================

@router.get(
    "/scenarios/{scenario_id}/evidence"
)
def get_scenario_evidence(
    scenario_id: str,
):
    scenario = require_scenario(
        scenario_id
    )

    cascade = generate_cascade(
        scenario=scenario,
        severity=scenario[
            "severity"
        ],
    )

    evidence = build_evidence(
        event_type=scenario[
            "event_type"
        ],
        cascade=cascade,
    )

    return {
        "scenario_id":
            scenario["id"],

        "scenario":
            scenario["name"],

        "event_type":
            scenario["event_type"],

        "evidence":
            evidence,

        "mode":
            "MODELLED EVIDENCE",
    }


# ==========================================================
# RESPONSE CENTER
# ==========================================================

@router.get(
    "/scenarios/{scenario_id}/response"
)
def get_response_center(
    scenario_id: str,
):
    scenario = require_scenario(
        scenario_id
    )

    cascade = generate_cascade(
        scenario=scenario,
        severity=scenario[
            "severity"
        ],
    )

    response_center = (
        build_response_plan(
            event_type=scenario[
                "event_type"
            ],
            cascade=cascade,
            severity=scenario[
                "severity"
            ],
        )
    )

    return {
        "scenario_id":
            scenario["id"],

        "scenario":
            scenario["name"],

        "event_type":
            scenario["event_type"],

        "severity":
            scenario["severity"],

        "response_center":
            response_center,

        "mode":
            "MODELLED RESPONSE PLAN",
    }


# ==========================================================
# TRY A SOLUTION / IMPACT COMPARE
# ==========================================================

@router.post("/intervene")
def intervene(
    request: InterventionRequest,
):
    scenario = require_scenario(
        request.scenario_id
    )

    # Remove duplicates while
    # preserving selection order.
    requested_interventions = list(
        dict.fromkeys(
            request.interventions
        )
    )

    valid_interventions = [
        intervention
        for intervention
        in requested_interventions
        if intervention
        in intervention_engine.ACTIONS
    ]

    invalid_interventions = [
        intervention
        for intervention
        in requested_interventions
        if intervention
        not in intervention_engine.ACTIONS
    ]

    if invalid_interventions:
        raise HTTPException(
            status_code=400,
            detail={
                "message": (
                    "Invalid intervention "
                    "selection"
                ),
                "invalid_interventions":
                    invalid_interventions,
                "available_interventions":
                    list(
                        intervention_engine
                        .ACTIONS.keys()
                    ),
            },
        )

    if not valid_interventions:
        raise HTTPException(
            status_code=400,
            detail=(
                "No valid interventions "
                "selected"
            ),
        )

    result = (
        intervention_engine.compare(
            starting_asset=scenario[
                "starting_asset"
            ],
            severity=scenario[
                "severity"
            ],
            interventions=(
                valid_interventions
            ),
        )
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail=(
                "Starting asset "
                "not found"
            ),
        )

    return {
        "system": "NERVA",

        "mode":
            "MODELLED INTERVENTION",

        "scenario": {
            "id":
                scenario["id"],

            "name":
                scenario["name"],

            "event_type":
                scenario[
                    "event_type"
                ],

            "severity":
                scenario[
                    "severity"
                ],
        },

        "selected_interventions":
            valid_interventions,

        "comparison":
            result,

        "disclaimer": (
            "Intervention outcomes are "
            "prototype simulations and "
            "not guaranteed real-world "
            "forecasts."
        ),
    }