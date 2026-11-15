import json
from typing import List, Optional, Literal
from fastapi import APIRouter, HTTPException, Query

from app.models.candidate import CandidateSite
from app.config import settings

router = APIRouter()

def get_all_sites() -> List[dict]:
    lunar_path = settings.DATA_DIR / "lunar_sites.json"
    mars_path = settings.DATA_DIR / "mars_sites.json"

    with open(lunar_path, "r", encoding="utf-8") as f:
        lunar = json.load(f)
    with open(mars_path, "r", encoding="utf-8") as f:
        mars = json.load(f)

    sites = lunar + mars
    for site in sites:
        if site["body"].lower() == "moon":
            sources = [
                {"id": "lro-diviner", "fields": ["thermal_min_k", "thermal_max_k", "solar_illumination_pct"]},
                {"id": "lro-lola", "fields": ["elevation_m", "slope_degrees"]},
                {"id": "nasa-pds", "fields": ["geological_context", "scientific_significance"]},
            ]
        else:
            sources = [
                {"id": "mro-hirise", "fields": ["geological_context", "slope_degrees", "elevation_m"]},
                {"id": "mro-crism", "fields": ["geological_context"]},
                {"id": "mro-sharad", "fields": ["water_ice_probability_pct"]},
                {"id": "nasa-pds", "fields": ["scientific_significance"]},
            ]
        site["data_provenance"] = {
            "status": "scenario_inputs_not_observations",
            "confidence": "unverified",
            "note": "Suggested resources for future verification only. No listed field was extracted from these archives; numeric inputs remain illustrative assumptions.",
            "sources": sources,
        }
    return sites


@router.get("", response_model=List[CandidateSite])
def list_candidate_sites(body: Optional[Literal["Moon", "Mars"]] = Query(None, description="Filter by 'Moon' or 'Mars'")):
    sites = get_all_sites()
    if body:
        sites = [s for s in sites if s["body"].lower() == body.lower()]
    return sites

@router.get("/{site_id}", response_model=CandidateSite)
def get_candidate_site(site_id: str):
    sites = get_all_sites()
    for s in sites:
        if s["id"] == site_id:
            return s
    raise HTTPException(status_code=404, detail=f"Site with id '{site_id}' not found.")

