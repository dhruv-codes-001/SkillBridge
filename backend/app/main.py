
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

from sqlalchemy import text
from app.db.session import engine

from app.api.routes.subjects import router as subjects_router
from app.api.routes.users import router as users_router
from app.api.routes.tutor_offerings import router as tutor_offerings_router



app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Peer tutoring platform for college students.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(subjects_router)
app.include_router(users_router)
app.include_router(tutor_offerings_router)


@app.get("/api/health", tags=["System"])
def health_check() -> dict[str, str]:
    """Return the API health status."""
    return {
        "status": "healthy",
        "application": settings.app_name,
    }


@app.get("/api/version", tags=["System"])
def get_version() -> dict[str, str]:
    """Return the application version."""
    return {
        "application": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }


@app.get("/api/db/health", tags=["System"])
def database_health() -> dict[str, str]:
    """Check whether the configured database can answer a query."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "connected", "database": "available"}
    except Exception:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=503,
            detail="Database connection unavailable",
        )
