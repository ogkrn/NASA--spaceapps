import json
from typing import List, Optional
from fastapi import APIRouter, Query
from typing import Literal

from app.models.candidate import MCDAWeights, MCDARankResult
from app.scientific_engine.mcda_scoring import mcda_engine
from app.config import settings

router = APIRouter()

def get_sites_by_body(body: Optional[Literal["Moon", "Mars"]] = None):
    lunar_path = settings.DATA_DIR / "lunar_sites.json"
    mars_path = settings.DATA_DIR / "mars_sites.json"

    with open(lunar_path, "r", encoding="utf-8") as f:
        lunar = json.load(f)
    with open(mars_path, "r", encoding="utf-8") as f:
        mars = json.load(f)

    if body and body.lower() == "moon":
        return lunar
    elif body and body.lower() == "mars":
        return mars
    return lunar + mars

@router.post("/mcda", response_model=List[MCDARankResult])
def run_mcda_ranking(weights: MCDAWeights, body: Optional[Literal["Moon", "Mars"]] = Query(None, description="'Moon' or 'Mars'")):
    sites = get_sites_by_body(body)
    return mcda_engine.evaluate_sites(sites, weights)

@router.get("/benchmarks")
def get_benchmarks(body: Optional[Literal["Moon", "Mars"]] = Query(None)):
    sites = get_sites_by_body(body)
    benchmarks = []
    for s in sites:
        benchmarks.append({
            "id": s["id"],
            "name": s["name"],
            "body": s["body"],
            "metrics": {
                "illumination": s["solar_illumination_pct"],
                "water_ice_probability": s["water_ice_probability_pct"],
                "flatness_trafficability": round(max(5.0, 100.0 - (s["slope_degrees"] * 5.0)), 1),
                "earth_comm_link": s["earth_visibility_pct"],
                "radiation_shielding": s["natural_radiation_shielding_pct"],
                "thermal_stability": round(max(5.0, 100.0 - (abs(s["thermal_max_k"] - s["thermal_min_k"]) / 2.5)), 1)
            }
        })
    return benchmarks

