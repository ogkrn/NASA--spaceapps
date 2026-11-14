# ARES-LUNA Architecture & Technical Specification

## Overview

**ARES-LUNA** combines an advanced scientific analytics engine with an interactive, accessible simulation interface to evaluate permanent human settlement sites on the Moon and Mars while automatically pairing them with terrestrial planetary analogs for operational testing.

---

## Architecture Diagram (Stack Mapping)

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                   │
│   • Dashboard & Analytics (Tailwind CSS, shadcn/ui)    │
│   • Interactive 3D Planet Visualizer (Three.js WebGL)  │
│   • Educational Story Mode vs Mission Commander Telemetry │
│   • Real-Time Physics Telemetry Charts (SVG)           │
└───────────────────────────┬────────────────────────────┘
                            │ REST APIs (JSON)
┌───────────────────────────▼────────────────────────────┐
│                    Backend (FastAPI)                   │
│   • Data Orchestration & Candidate Management          │
│   • Asynchronous Simulation Endpoints                  │
│   • Generative AI Explanation Engine                   │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
┌─────────────▼───────────────┐ ┌──────────▼───────────────┐
│      Scientific Engine      │ │     Geospatial Engine    │
│   • Python, NumPy, Pandas   │ │   • Spherical Geodesy    │
│   • TOPSIS MCDA Multi-Criteria│ │   • Great-Circle Math    │
│   • Automated Analog Matcher│ │   • Slope & Traverse Cost│
│   • ECLSS Physics Simulation│ │   • Coordinate Projections│
└─────────────┬───────────────┘ └──────────┬───────────────┘
              │                            │
┌─────────────▼────────────────────────────▼─────────────┐
│                 Data Sources & Ingestion               │
│   • NASA Earthdata / Planetary Data System (PDS)       │
│   • LRO (Diviner Radiometer, LOLA Laser Altimeter)     │
│   • Mars Reconnaissance Orbiter (HiRISE, CRISM, SHARAD)│
│   • Terrestrial Analogs (HMP, HI-SEAS, AMASE, PANGEA) │
└─────────────────────────────┬──────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────┐
│                         Storage                        │
│   • SQLite / GeoJSON (Instant Local Prototype Mode)    │
│   • PostgreSQL 16 + PostGIS (Production Deployment)   │
└────────────────────────────────────────────────────────┘
```

---

## Component Roles

### 1. Frontend (`/frontend`)
- **Framework**: Next.js 14 (App Router) + TypeScript.
- **Styling**: Tailwind CSS with custom cyber space dark theme (`bg-space-950`).
- **3D Visualization**: Three.js WebGL sphere with procedural crater/volcanic texture generation, orbital lighting, stars particles, and interactive 3D landing site pins positioned via latitude/longitude spherical transformations.
- **Dual Audience Modes**:
  - **Mission Commander Mode**: Complete radar breakdowns, TOPSIS closeness index ($C_i$), raw telemetry, and sensitivity sliders.
  - **Educational Explorer Mode**: 4 Foundations of Space Survival, plain-English analogies, and interactive hackathon knowledge challenge quiz.

### 2. Backend (`/backend`)
- **Framework**: FastAPI (Python 3.11).
- **Speed & Async**: Native asynchronous request handling with Pydantic v2 schemas.
- **Routers**:
  - `/api/v1/candidates`: Lunar and Martian candidate catalog.
  - `/api/v1/analogs`: Earth planetary analogs and automated similarity matching.
  - `/api/v1/analysis`: TOPSIS multi-criteria decision analysis.
  - `/api/v1/simulator`: Dynamic day-by-day mission life-support and physics simulator.
  - `/api/v1/explain`: Multi-persona AI explanation generator.

### 3. Scientific Engine (`/backend/app/scientific_engine`)
- **Automated Analog Discovery**: Evaluates candidate sites across 5 normalized environmental dimensions (thermal severity, slope complexity, natural shielding deficit, volatile abundance, geomorphological type), computing cosine similarity and weighted Euclidean distance against Earth analog stations.
- **MCDA TOPSIS Ranking**: Computes relative closeness to ideal solutions across 6 configurable weights (Illumination, Ice, Trafficability, Earth Comms, Radiation Shielding, Thermal Stability).
- **Mission Physics Simulator**: Models solar diurnal cycles, nuclear baseload, battery state of charge (SoC), ECLSS water loop closure, oxygen regeneration, and regolith radiation attenuation ($I = I_0 e^{-\mu \rho x}$).

### 4. Geospatial Engine (`/backend/app/geospatial_engine`)
- Spherical trigonometry, Great-Circle Haversine calculations adjusted for lunar ($R = 1737.4\text{ km}$) and Martian ($R = 3389.5\text{ km}$) radii.
- Surface traverse difficulty and power consumption estimations based on slope gradients.

