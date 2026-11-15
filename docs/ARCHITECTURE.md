# Architecture

The Next.js/React frontend sends same-origin requests through a Next.js rewrite to FastAPI. FastAPI reads three JSON catalogs and computes rankings, analog shortlist indices, deterministic briefings and daily resource budgets. NumPy is used for ranking and profile arithmetic. There is no trained model, generative service, database, satellite ingestion or authentication layer.

## Contracts

Existing API paths and catalog identifiers are preserved. Response fields are extended with evidence, assumptions and telemetry. Stricter input validation intentionally returns 422 for unsupported power/body modes, zero-sum/negative weights, nonfinite or out-of-range inputs. Unknown IDs return 404. API documentation is generated at `/docs`.

- `backend/app/models/candidate.py`: validated request/response contracts.
- `backend/app/data/`: descriptions, source claims and separately labelled scenario defaults.
- `backend/app/scientific_engine/`: deterministic computation.
- `frontend/lib/types.ts`: corresponding TypeScript contracts.
- `frontend/lib/api.ts`: 15-second request timeout; no generated substitute responses.
- `frontend/components/ServiceStatus.tsx`: persistent, dismissible request failure notice.
- `frontend/components/EvidencePanel.tsx`: selected-site evidence and limitations.

The simulator returns the input snapshot with its result. The frontend guards against stale responses when selecting sites and marks edited inputs as needing a rerun. Source changes require a backend restart because the analog engine loads catalogs at startup.

## Local deployment and limits

No credentials or paid APIs are required. The default backend listens on localhost; container ports also publish on localhost. CORS allows the two local frontend origins. The same-origin proxy avoids browser access to Docker-only hostnames. Both container processes run as non-root users.

This is a local demo, not a hardened multi-user hosted service: there is no rate limiter or authentication. Duration/crew/power/resource limits bound accepted simulation requests. No results are persisted. `.next`, `node_modules`, virtual environments and Python caches are generated artifacts, not source deliverables.
