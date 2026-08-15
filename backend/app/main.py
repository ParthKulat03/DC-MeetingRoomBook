from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.logging import configure_logging


# Configure application logging once when the application starts.
configure_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown lifecycle.

    Add startup logic such as:
    - database checks
    - cache initialization
    - WebSocket manager initialization
    - background task setup

    Add shutdown logic such as:
    - closing connections
    - stopping background tasks
    """

    # Startup
    yield

    # Shutdown


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description=(
        "Backend API for the internal company "
        "room booking system."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# API Routes
# ---------------------------------------------------------
app.include_router(api_router)


# ---------------------------------------------------------
# Root Endpoint
# ---------------------------------------------------------
@app.get(
    "/",
    tags=["System"],
)
async def root() -> dict[str, str]:
    return {
        "message": "Room Booker Backend is running",
        "environment": settings.ENVIRONMENT,
    }


# ---------------------------------------------------------
# Health Check
# ---------------------------------------------------------
@app.get(
    "/health",
    tags=["System"],
)
async def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
    }