# ARES-LUNA — evidence and exploration scenarios

Explore nine Moon/Mars scenarios and six established Earth analog locations. Compare priorities, investigate source evidence, and run a transparent resource-budget exercise. Built for the NASA Space Apps terrestrial analog challenge; not endorsed by NASA.

**Scientific status:** NASA, ESA and USGS references support descriptive context. The inherited engineering values and Earth profile scores have no verified measurement provenance and are explicitly labelled illustrative. The app does not discover new analog sites, ingest satellite products, certify landings, or calculate survival probabilities. See [data provenance](docs/DATA_PROVENANCE.md).

## What you can do

- Select five lunar and four Martian scenarios using cards or the procedural 3D globe. Cards remain usable without WebGL.
- Rank scenarios with six adjustable priorities using TOPSIS, a relative decision-ranking method.
- Compare Earth analog profiles and follow the evidence for relevant field activities.
- Inspect an exact-coordinate OpenStreetMap view for each Earth analog instead of an unrelated stock photograph, then open partner-agency and NASA product portals for mineral, elevation, radar, and land-surface verification.
- Run a daily water, oxygen and electrical-energy budget with three power strategies.
- Inspect full telemetry, assumptions, unmet demand and the settings used for each completed run.
- Read audience-specific, deterministic site briefings and use the educational lessons/quiz.

## Run locally

Use Python 3.12+ and Node.js 22. No account, API key, paid service or database is required. Installation needs Internet access; normal calculations use bundled JSON. External evidence links and the optional globe textures need Internet access; the globe retains a procedural fallback.

From the repository root (Linux/macOS):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements-dev.txt
cd backend
python run.py
```

In a second terminal, from the repository root:

```bash
cd frontend
npm ci
npm run dev
```

Open http://localhost:3000. API documentation: http://127.0.0.1:8000/docs.
The frontend proxies `/api/backend` to the backend. For a different backend host, set `BACKEND_URL` before starting development or building production. `NEXT_PUBLIC_API_URL` remains an optional build-time override.

Production frontend: `npm run build` then `npm start` inside `frontend`. Never reuse someone else's `.next` output: always build from source.

Optional container configuration: `docker compose up --build`. Docker execution was not available during this repair; this path is not runtime-verified. Ports bind to localhost. The previous unused PostGIS service is omitted because no application code queried it.

## Deploy with Railway and Vercel

For Railway, create a service from this repository and set its **Root Directory** to `backend`. Railway will use [`backend/Dockerfile`](./backend/Dockerfile). The container now listens on Railway's injected `PORT` value.

Railway settings:

- Service root directory: `backend`
- Builder: Dockerfile
- Health check path: `/health`
- Public networking: Generate a domain
- `CORS_ORIGINS`: JSON array containing the final Vercel URL, for example `["https://your-project.vercel.app"]`

The previous Render Blueprint remains available in [`render.yaml`](./render.yaml) if you change providers.

For Render, create a Blueprint from this repository, or create a Docker web service with:

- Dockerfile: `backend/Dockerfile`
- Docker context: `backend`
- Health check path: `/health`
- Port: `8000`
- `CORS_ORIGINS`: JSON array containing the final Vercel URL, for example `["https://your-project.vercel.app"]`

In Vercel, import the repository and set the project root directory to `frontend`. Use the default Next.js build settings, then add:

- `BACKEND_URL`: the deployed Render URL, for example `https://ares-luna-api.onrender.com`
- Do not set `NEXT_PUBLIC_API_URL` unless you intentionally want browser-direct API calls.

The Next.js rewrite sends `/api/backend/*` to Render server-side, so the browser uses the Vercel origin and avoids CORS issues. After both services deploy, verify `https://<render-host>/health` and `https://<vercel-host>/api/backend/candidates?body=Moon`.

## Verify

From the repository root with the virtual environment active:

```bash
python -m pytest -q
python data_pipeline/scripts/ingest_lro_diviner.py
cd frontend
npm test
npm run build
npm run typecheck
```

The catalog script validates local records; its legacy filename does not imply data ingestion. Unit tests verify software behaviour and budgets, not physical accuracy. See [methodology](docs/SCIENTIFIC_METHODOLOGY.md), [user guide](docs/USER_GUIDE.md), [architecture](docs/ARCHITECTURE.md), and [repair report](docs/PACKAGE_A_CHANGES.md).

The comparison console links CSA RADARSAT, the SAR Python/GIS starting point, ESA Copernicus Data Space, the ESA Open Science Catalog, JAXA G-Portal, NASA EMIT L2B minerals, NASA SRTM elevation, and NASA/ESA HLS. These are source portals for the next ingestion stage; the prototype labels them as reference-only until product IDs, acquisition dates, processing level, and extracted measurements are recorded.

## Extension path

Keep sourced observations separate from scenario assumptions. Before replacing an engineering value, record the exact product/version, region, resolution, units, extraction code and uncertainty. A source about a region does not validate every number assigned to that region. A global search, new analog discovery and validated physical similarity require a subsequent data-processing phase.
