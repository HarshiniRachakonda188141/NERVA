import json

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from config import SCENARIOS_FILE
from engines.cascade_engine import cascade_engine
from engines.risk_engine import risk_engine
from engines.explanation_engine import explanation_engine
from engines.coordination_engine import coordination_engine


router = APIRouter(
    prefix="/api",
    tags=["Simulation"]
)


class SimulationRequest(BaseModel):
    scenario_id: str = "RAIN_01"
    severity: int | None = Field(
        default=None,
        ge=1,
        le=10
    )


def load_scenarios():
    with open(
        SCENARIOS_FILE,
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


@router.get("/scenarios")
def get_scenarios():
    return {
        "scenarios": load_scenarios()
    }


@router.post("/simulate")
def simulate(request: SimulationRequest):
    scenarios = load_scenarios()

    scenario = next(
        (
            item
            for item in scenarios
            if item["id"] == request.scenario_id
        ),
        None
    )

    if not scenario:
        raise HTTPException(
            status_code=404,
            detail="Scenario not found"
        )

    severity = (
        request.severity
        if request.severity is not None
        else scenario["severity"]
    )

    cascade_result = cascade_engine.simulate(
        starting_asset=scenario["starting_asset"],
        severity=severity
    )

    if not cascade_result:
        raise HTTPException(
            status_code=404,
            detail="Starting asset not found"
        )

    cascade = cascade_result["cascade"]

    risk = risk_engine.calculate(
        starting_asset=scenario["starting_asset"],
        severity=severity,
        cascade=cascade
    )

    explanation = explanation_engine.explain(
        starting_asset=scenario["starting_asset"],
        cascade=cascade
    )

    coordination = coordination_engine.recommend(
        cascade
    )

    return {
        "system": "NERVA",
        "mode": "SIMULATED PROTOTYPE DATA",
        "scenario": scenario,
        "cascade": cascade,
        "risk": risk,
        "explanation": explanation,
        "coordination": coordination,
        "disclaimer": (
            "This is a modelled decision-support scenario, "
            "not a guaranteed real-world forecast."
        )
    }
from engines.intervention_engine import (
    intervention_engine
)


class InterventionRequest(BaseModel):
    scenario_id: str = "RAIN_01"
    intervention: str = "CLEAR_DRAIN"


@router.post("/intervene")
def intervene(
    request: InterventionRequest
):
    scenarios = load_scenarios()

    scenario = next(
        (
            item
            for item in scenarios
            if item["id"]
            == request.scenario_id
        ),
        None
    )

    if not scenario:
        raise HTTPException(
            status_code=404,
            detail="Scenario not found"
        )

    result = intervention_engine.apply(
        starting_asset=(
            scenario["starting_asset"]
        ),
        severity=scenario["severity"],
        intervention=request.intervention
    )

    return {
        "system": "NERVA",
        "mode": "MODELLED INTERVENTION",
        "scenario": scenario["name"],
        "result": result,
        "disclaimer": (
            "Intervention outcomes are "
            "prototype simulations and "
            "not guaranteed forecasts."
        )
    }