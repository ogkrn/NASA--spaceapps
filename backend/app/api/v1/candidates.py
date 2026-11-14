import json
from typing import List, Optional
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

    return lunar + mars

@router.get("", response_model=List[CandidateSite])
def list_candidate_sites(body: Optional[str] = Query(None, description="Filter by 'Moon' or 'Mars'")):
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

