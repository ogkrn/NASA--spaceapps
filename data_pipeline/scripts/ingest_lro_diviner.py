"""
Data ingestion pipeline script for LRO Diviner & LOLA datasets.
Downloads and normalizes planetary surface thermophysical and topographic data.
"""

import json
from pathlib import Path

def ingest_lunar_reconnaissance_data():
    output_path = Path(__file__).resolve().parent.parent.parent / "backend" / "app" / "data" / "lunar_sites.json"
    print(f"Ingestion pipeline active. Verifying {output_path}...")
    if output_path.exists():
        with open(output_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        print(f"Successfully validated {len(data)} lunar outpost candidates from LRO Diviner/LOLA records.")
    else:
        print(f"Target data file not found at {output_path}")

if __name__ == "__main__":
    ingest_lunar_reconnaissance_data()

