from fastapi import FastAPI
from fastapi.middleware.cors import (
    CORSMiddleware
)

from routes.assets import (
    router as assets_router
)

from routes.simulations import (
    router as simulations_router
)

from routes.auth import (
    router as auth_router
)


app = FastAPI(
    title="NERVA Engine",
    description=(
        "Neural Engine for "
        "Resilient Virtual Assets"
    ),
    version="0.3.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(
    assets_router
)

app.include_router(
    simulations_router
)

app.include_router(
    auth_router
)


@app.get("/")
def root():
    return {
        "name": "NERVA",
        "full_name": (
            "Neural Engine for "
            "Resilient Virtual Assets"
        ),
        "status": "online",
        "mode": "prototype",
        "version": "0.3.0"
    }


@app.get("/health")
def health():
    return {
        "api": "healthy",
        "graph_engine": "ready",
        "cascade_engine": "ready",
        "coordination_engine": "ready"
    }