# Catalog validation, not ingestion

Run `python data_pipeline/scripts/ingest_lro_diviner.py` from the repository root after installing backend dependencies. The legacy-named script validates the nine planetary and six Earth JSON records and their evidence fields. It downloads no observations and performs no Diviner, LOLA, SHARAD, CRISM or Earthdata processing.

A future ingestion pipeline must record source product identifiers/version, license/terms, acquisition period, coordinate reference system, region boundaries, units, spatial resolution, nodata handling, aggregation, uncertainty and reproducible extraction code. Never use a descriptive reference as provenance for unrelated numerical engineering assumptions.

The script also preserves the newer lunar manifest output, with schema-only validation status and empty product identifiers. It verifies the referenced discovery-resource IDs exist.
