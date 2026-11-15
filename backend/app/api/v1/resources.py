import json
from typing import List, Dict

from fastapi import APIRouter

from app.config import settings

router = APIRouter()


@router.get("", response_model=List[Dict[str, str]])
def list_resources():
    """Return the dataset catalogue used to explain every scientific value."""
    path = settings.DATA_DIR / "resource_registry.json"
    with path.open("r", encoding="utf-8") as resource_file:
        return json.load(resource_file)
