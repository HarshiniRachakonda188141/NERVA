from fastapi import APIRouter, HTTPException

from engines.graph_engine import graph_engine

router = APIRouter(
    prefix="/api/assets",
    tags=["Assets"]
)


@router.get("")
def get_assets():
    return {
        "count": len(graph_engine.get_all_assets()),
        "assets": graph_engine.get_all_assets()
    }


@router.get("/{asset_id}")
def get_asset(asset_id: str):
    asset = graph_engine.get_asset(
        asset_id.upper()
    )

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    return asset


@router.get("/{asset_id}/connections")
def get_connections(asset_id: str):
    asset_id = asset_id.upper()

    if not graph_engine.get_asset(asset_id):
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    return {
        "asset_id": asset_id,
        "connections": graph_engine.get_neighbors(
            asset_id
        )
    }