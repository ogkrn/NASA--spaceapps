import json
from typing import List
from fastapi import APIRouter, HTTPException, Query

from app.models.candidate import EarthAnalog, AnalogMatchResult
from app.scientific_engine.analog_matcher import analog_matcher
from app.config import settings

router = APIRouter()

def load_earth_analogs() -> List[dict]:
    earth_path = settings.DATA_DIR / "earth_analogs.json"
    with open(earth_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("", response_model=List[EarthAnalog])
def list_earth_analogs():
    return load_earth_analogs()

@router.get("/{analog_id}", response_model=EarthAnalog)
def get_earth_analog(analog_id: str):
    analogs = load_earth_analogs()
    for a in analogs:
        if a["id"] == analog_id:
            return a
    raise HTTPException(status_code=404, detail=f"Analog with id '{analog_id}' not found.")

@router.get("/match/{site_id}", response_model=List[AnalogMatchResult])
def match_analogs_for_site(site_id: str, top_k: int = Query(4, ge=1, le=10)):
    try:
        results = analog_matcher.find_best_analogs_for_site(site_id, top_k=top_k)
        return results
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

