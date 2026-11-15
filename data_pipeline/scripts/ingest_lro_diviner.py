"""Validate the curated catalogue and emit a provenance manifest.

This script does not claim to download NASA products. It validates the local
catalogue and records which official resource family is intended for each field.
Product-level downloads should be added only when their identifiers and retrieval
metadata are persisted with the records.
"""

import json
from pathlib import Path


REQUIRED_FIELDS = {
    "id",
    "name",
    "body",
    "latitude",
    "longitude",
    "slope_degrees",
    "thermal_min_k",
    "thermal_max_k",
}


def ingest_lunar_reconnaissance_data():
    data_dir = Path(__file__).resolve().parents[2] / "backend" / "app" / "data"
    input_path = data_dir / "lunar_sites.json"
    registry_path = data_dir / "resource_registry.json"
    manifest_path = data_dir / "lunar_catalogue_manifest.json"

    with input_path.open("r", encoding="utf-8") as data_file:
        records = json.load(data_file)
    with registry_path.open("r", encoding="utf-8") as registry_file:
        registry = {item["id"]: item for item in json.load(registry_file)}

    errors = []
    for record in records:
        missing = REQUIRED_FIELDS - record.keys()
        if missing:
            errors.append(f"{record.get('id', '<unknown>')}: missing {sorted(missing)}")
        if record.get("body") != "Moon":
            errors.append(f"{record.get('id', '<unknown>')}: expected body Moon")
    if "lro-diviner" not in registry or "lro-lola" not in registry:
        errors.append("NASA LRO Diviner and LOLA resource records are required")
    if errors:
        raise ValueError("\n".join(errors))

    manifest = {
        "dataset": "lunar_sites.json",
        "status": "validated_curated_catalogue",
        "record_count": len(records),
        "resource_families": ["lro-diviner", "lro-lola", "nasa-pds"],
        "product_identifiers": [],
        "retrieved_at": None,
        "note": "No remote download is performed by this validation script.",
    }
    with manifest_path.open("w", encoding="utf-8") as manifest_file:
        json.dump(manifest, manifest_file, indent=2)
    print(f"Validated {len(records)} lunar catalogue records.")
    print(f"Wrote provenance manifest to {manifest_path}")

if __name__ == "__main__":
    ingest_lunar_reconnaissance_data()

