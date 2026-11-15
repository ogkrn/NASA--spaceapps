# Package A — merged with the current repository

Target baseline: `e1d0aaa971342c277ee957f51ceb17d5a795e724`.
This package supersedes the earlier bundle based on `6785244`. Apply this package only; do not apply both. No remote repository changes were made.

## Newer work preserved

- Resource registry and `/api/v1/resources` API; `/health` endpoint and endpoint discovery.
- Candidate `data_provenance` metadata and the frontend provenance panel.
- Analog comparison status, confidence and limitations response fields.
- Simulation execution mode and warning fields.
- Both additional upstream engine tests, unchanged.
- Larger exploration dashboard, comparison-console button, remote globe textures, procedural fallback and decorative orbit tracks.
- Existing Windows launcher scripts, unchanged (not tested on Windows).
- Lunar manifest generation, now explicitly a schema validation result rather than scientific validation.
- Newer API maximums: 3,650 days, 100,000 m² solar area, 100,000 kg/day excavation and 20 m burial. The original narrower frontend slider ranges remain.

The newer commits already repaired nuclear-only generation and added an oxygen-shortage check. Those contributions are retained, not claimed as new work in this merge. The more complete Package A budget still deducts electrolysis energy/feedwater, reports resource deficits and treats any unmet demand as CRITICAL.

## Repair behaviour retained

Finite bounded request validation; positive-sum weights; consistent trafficability; neutral indistinguishable TOPSIS results; no fabricated API fallback responses; stale-response protection; completed-run input snapshots; accessible controls and modal focus; source-linked briefings; conservative claim wording; local API proxy; dependency and container repairs.

The broad registry links are preserved as resources for future verification. They do not establish measured provenance, so the former “medium confidence” label is now “unverified.” Claim-specific evidence remains separate. The hard-coded clock and “SYSTEM NOMINAL” decoration are replaced with honest scenario labels. Remote textures are visual references, not live observation products; a late texture download is disposed safely after unmount.

The presentation guide is updated to agree with the implementation. All nine planetary scenarios, six Earth analogs and existing feature areas remain. Offline substitute calculations are intentionally removed; a failed backend request is an error, not an alternative result.

## Verification scope

48 backend tests pass: 6 existing upstream tests plus 42 regression cases. The five frontend API tests pass. The catalog validator preserves manifest output and validates resource IDs. Production build and TypeScript checks are run before packaging. The update installer checks every changed source file against this exact baseline and refuses conflicts.

No fresh browser, GPU, Docker or Windows execution is claimed for this merged version. Earlier Package A browser checks do not substitute for testing this updated layout on the user's machine. A Starlette/httpx TestClient deprecation warning remains; the tests pass.

## Scientific limits

The engineering defaults remain unverified illustrative assumptions. The analog index is not calibrated physical similarity; the simulation is a simplified daily budget. The resource registry does not replace missing extraction notebooks. No new global analog discovery or operational mission validation is claimed. Read DATA_PROVENANCE.md and SCIENTIFIC_METHODOLOGY.md before presenting results.
