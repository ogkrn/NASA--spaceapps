from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1 import candidates, analogs, scientific_analysis, simulator, ai_explain

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Scientific Engine & API for Planetary Analog Intelligence, Settlement Evaluation & Mission Simulation",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(candidates.router, prefix=f"{settings.API_V1_STR}/candidates", tags=["Candidate Sites"])
app.include_router(analogs.router, prefix=f"{settings.API_V1_STR}/analogs", tags=["Earth Analogs & Discovery"])
app.include_router(scientific_analysis.router, prefix=f"{settings.API_V1_STR}/analysis", tags=["Scientific Analysis & MCDA"])
app.include_router(simulator.router, prefix=f"{settings.API_V1_STR}/simulator", tags=["Mission Planning Simulator"])
app.include_router(ai_explain.router, prefix=f"{settings.API_V1_STR}/explain", tags=["AI Explanations & Education"])

@app.get("/", tags=["Health"])
def root_status():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "endpoints": {
            "candidates": f"{settings.API_V1_STR}/candidates",
            "analogs": f"{settings.API_V1_STR}/analogs",
            "mcda_analysis": f"{settings.API_V1_STR}/analysis/mcda",
            "mission_simulator": f"{settings.API_V1_STR}/simulator/run",
            "ai_explanations": f"{settings.API_V1_STR}/explain"
        }
    }

