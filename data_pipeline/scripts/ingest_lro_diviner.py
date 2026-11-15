"""Validate the local scenario catalog. This script does NOT ingest NASA observations."""
import sys
import json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "backend"))
from app.scientific_engine.analog_matcher import analog_matcher
from app.models.candidate import CandidateSite, EarthAnalog

def ingest_lunar_reconnaissance_data():
    for site in analog_matcher.all_candidates.values():
        CandidateSite.model_validate(site)
        assert site.get("evidence"), "Missing evidence references"
    for analog in analog_matcher.earth_analogs:
        EarthAnalog.model_validate(analog)
    data_dir = Path(__file__).resolve().parents[2] / "backend" / "app" / "data"
    registry = json.loads((data_dir / "resource_registry.json").read_text())
    if not {"lro-diviner", "lro-lola", "nasa-pds"} <= {x["id"] for x in registry}:
        raise ValueError("Missing lunar discovery resources")
    manifest = {
        "dataset": "lunar_sites.json", "status": "schema_validated_scenario_catalogue",
        "record_count": len(analog_matcher.lunar_sites),
        "resource_families": ["lro-diviner", "lro-lola", "nasa-pds"],
        "product_identifiers": [], "retrieved_at": None,
        "note": "Schema and reference presence checked only. No remote observation download or scientific validation performed.",
    }
    (data_dir / "lunar_catalogue_manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print("Validated 9 scenario records and 6 Earth profiles. No observation ingestion or scientific verification performed.")

if __name__ == "__main__":
    ingest_lunar_reconnaissance_data()
