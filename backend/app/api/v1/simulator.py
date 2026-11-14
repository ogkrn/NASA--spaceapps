import json
from fastapi import APIRouter, HTTPException

from app.models.candidate import SimulationParameters, SimulationSummary
from app.scientific_engine.mission_physics import simulator_engine
from app.config import settings

router = APIRouter()

def find_site(site_id: str):
    lunar_path = settings.DATA_DIR / "lunar_sites.json"
    mars_path = settings.DATA_DIR / "mars_sites.json"

    with open(lunar_path, "r", encoding="utf-8") as f:
        lunar = json.load(f)
    with open(mars_path, "r", encoding="utf-8") as f:
        mars = json.load(f)

    for s in lunar + mars:
        if s["id"] == site_id:
            return s
    return None

@router.post("/run", response_model=SimulationSummary)
def run_mission_simulation(params: SimulationParameters):
    site = find_site(params.site_id)
    if not site:
        raise HTTPException(status_code=404, detail=f"Site with id '{params.site_id}' not found.")

    return simulator_engine.run_simulation(site, params)

