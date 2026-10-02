from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.assets import (
    router as assets_router,
)

from routes.simulations import (
    router as simulations_router,
)

from routes.auth import (
    router as auth_router,
)

from routes.tasks import (
    router as tasks_router,
)

from routes.citizen_reports import (
    router as citizen_reports_router,
)


app = FastAPI(
    title="NERVA Engine",
    description=(
        "Neural Engine for "
        "Resilient Virtual Assets"
    ),
    version="0.3.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://nervaengine.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# NERVA ROUTES
# --------------------------------------------------

app.include_router(
    assets_router,
)

app.include_router(
    simulations_router,
)

app.include_router(
    auth_router,
)

app.include_router(
    tasks_router,
)

app.include_router(
    citizen_reports_router,
)


# --------------------------------------------------
# ROOT
# --------------------------------------------------

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
        "version": "0.3.0",
    }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "api": "healthy",
        "graph_engine": "ready",
        "cascade_engine": "ready",
        "coordination_engine": "ready",
        "task_system": "ready",
        "citizen_reporting": "ready",
        "citizen_signal_system": "ready",
    }