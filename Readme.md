# ARES-LUNA: Planetary Analog Intelligence + Mission Simulation

> **NASA Space Apps Challenge 2026** — *Permanent Moon Base Locations and Mars*  
> **Concept**: Planetary Analog Intelligence + Mission Simulation Engine

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Three.js](https://img.shields.io/badge/3D%20Graphics-Three.js-black?logo=threedotjs)](https://threejs.org/)
[![Python](https://img.shields.io/badge/Scientific%20Engine-Python%20%7C%20NumPy%20%7C%20Scikit--Learn-blue?logo=python)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🚀 Concept Overview

ARES-LUNA bridges the gap between deep planetary science and accessible educational decision-making. By combining multi-criteria scientific decision analysis with advanced automated terrestrial analog matching, 3D visualization, and dynamic mission life-support simulation, the platform provides mission planners and hackathon judges with a comprehensive settlement evaluation suite.

### Key Capabilities:
- **Intermediate-Level Scientific Comparison**: TOPSIS (*Technique for Order of Preference by Similarity to Ideal Solution*) multi-criteria evaluation across 6 critical planetary engineering vectors (Illumination, Water-Ice Confidence, Terrain Slope Trafficability, Direct-to-Earth Line of Sight, Natural Radiation Shielding, Thermal Delta).
- **Advanced Automated Analog Discovery**: High-dimensional vector matching engine that automatically identifies Earth's highest-fidelity proving grounds (e.g., Devon Island Haughton Crater, HI-SEAS Mauna Loa, Atacama Desert, Svalbard AMASE, Lanzarote Lava Tubes, McMurdo Dry Valleys) for any lunar or Martian candidate site.
- **Interactive 3D Planetary Visualization**: Real-time WebGL rendering in Three.js featuring planetary textures, terminator lighting, and interactive landing nodes.
- **Mission Planning Simulator**: Day-by-day physics modeling of consumable drawdowns, closed-loop ECLSS water recycling, solar diurnal cycles vs nuclear baseload, and regolith radiation attenuation ($I = I_0 e^{-\mu \rho x}$).
- **AI-Generated Scientific Briefings**: Synthesis engine providing tailored briefings across Scientific, Educational, and Executive modes.
- **Educational Exploration Mode**: Plain-English survival principles, interactive guided lessons, and an astronaut readiness challenge quiz.

---

## 🛠️ Architecture & Tech Stack Selection

As specified in the system architecture:

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                   │
│   • Dashboard · Map · Planet Selector · Analytics      │
│   • Tailwind CSS · Lucide · Three.js WebGL             │
└───────────────────────────┬────────────────────────────┘
                            │ REST APIs
┌───────────────────────────▼────────────────────────────┐
│                    Backend (FastAPI)                   │
│   • REST APIs · Data Orchestration · Candidates        │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
┌─────────────▼───────────────┐ ┌──────────▼───────────────┐
│      Scientific Engine      │ │     Geospatial Engine    │
│   • Python · NumPy · Pandas │ │   • Spherical Geodesy    │
│   • Scikit-learn (TOPSIS)   │ │   • Slope & Coordinates  │
└─────────────┬───────────────┘ └──────────┬───────────────┘
              │                            │
┌─────────────▼────────────────────────────▼─────────────┐
│                 Data Sources & Ingestion               │
│   • NASA Earthdata · PDS · LRO Diviner / LOLA          │
│   • ESA Copernicus · JAXA · MRO CRISM / HiRISE         │
└─────────────────────────────┬──────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────┐
│                         Storage                        │
│   • SQLite / GeoJSON (Instant Local Zero-Setup Mode)   │
│   • PostgreSQL + PostGIS (Production Deployment)       │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
NASA-spaceapps/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── candidates.py           # Candidate sites API
│   │   │   ├── analogs.py              # Earth analogs & automated matching
│   │   │   ├── scientific_analysis.py  # TOPSIS MCDA ranking
│   │   │   ├── simulator.py            # Mission physics simulation
│   │   │   └── ai_explain.py           # AI briefings & educational takeaways
│   │   ├── scientific_engine/
│   │   │   ├── analog_matcher.py       # Vector similarity & discovery
│   │   │   ├── mcda_scoring.py         # TOPSIS & AHP mathematical engine
│   │   │   └── mission_physics.py      # ECLSS & radiation attenuation models
│   │   ├── geospatial_engine/
│   │   │   └── coordinates.py          # Spherical planetary geodesy
│   │   ├── data/
│   │   │   ├── lunar_sites.json        # Curated LRO Diviner/LOLA dataset
│   │   │   ├── mars_sites.json         # Curated MRO HiRISE/SHARAD dataset
│   │   │   └── earth_analogs.json      # Terrestrial analog stations
│   │   ├── tests/
│   │   │   └── test_engines.py         # Scientific unit tests
│   │   ├── config.py
│   │   └── main.py                     # FastAPI entrypoint
│   ├── Dockerfile
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Main mission control application
│   │   └── globals.css                 # Cyber space dark theme styling
│   ├── components/
│   │   ├── 3d/
│   │   │   └── PlanetaryGlobe.tsx      # Three.js 3D interactive visualizer
│   │   ├── dashboard/
│   │   │   ├── RadarComparison.tsx     # 6-axis criteria radar chart
│   │   │   ├── SiteCard.tsx            # Candidate site cards
│   │   │   └── MCDARankingView.tsx     # TOPSIS interactive sensitivity ranker
│   │   ├── analog/
│   │   │   └── AnalogDiscoveryView.tsx # Terrestrial analog matching matrix
│   │   ├── simulator/
│   │   │   └── MissionSimulatorView.tsx# Life support & mission timeline
│   │   ├── explanation/
│   │   │   └── AIExplanationModal.tsx  # Generative AI briefing modal
│   │   ├── educational/
│   │   │   └── EducationalModeView.tsx # Educational story mode & quiz
│   │   └── Navbar.tsx                  # Planet & mode switcher header
│   ├── lib/
│   │   ├── api.ts                      # Backend client & fallback dataset
│   │   ├── types.ts                    # TypeScript schemas
│   │   └── utils.ts
│   ├── package.json
│   ├── tailwind.config.ts
│   └── Dockerfile
├── data_pipeline/
│   ├── scripts/
│   │   └── ingest_lro_diviner.py       # Ingestion & normalization scripts
│   └── README.md
├── docs/
│   ├── ARCHITECTURE.md                 # Detailed architectural blueprint
│   ├── SCIENTIFIC_METHODOLOGY.md       # Formulas and physics derivations
│   └── USER_GUIDE.md                   # Step-by-step user and judge manual
├── docker-compose.yml                  # Full stack containerization
└── README.md
```

---

## ⚡ Quick Start

### Option 1: Run with Docker Compose (Recommended)

```bash
docker-compose up --build
```
- Open Frontend: [http://localhost:3000](http://localhost:3000)
- Backend Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option 2: Run Locally (Fast Development Mode)

#### 1. Backend (FastAPI + Scientific Engine)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
Backend will start at `http://127.0.0.1:8000`.

#### 2. Frontend (Next.js 14 + Three.js)
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Scientific Verification & Tests

To execute the unit test suite verifying the TOPSIS engine, analog matcher, geodesy distances, and physics simulation:

```bash
cd backend
venv\Scripts\python -m app.tests.test_engines
```

Expected output:
```
Analog Match Passed: Top match for Shackleton is Haughton Impact Crater (94.2%)
MCDA Passed: Top ranked lunar site is Shackleton Crater Rim (Closeness: 0.8841)
Simulator Passed: Viability score 88.0, Status: NOMINAL
Geospatial Passed: Distance = 119.3 km, Traverse time = 17.55h
ALL SCIENTIFIC ENGINE UNIT TESTS PASSED!
```

---

## 🛰️ Data Sources & References

1. **NASA Lunar Reconnaissance Orbiter (LRO)**:
   - Diviner Lunar Radiometer Experiment (Thermal Stability & PSRs)
   - LOLA (Lunar Orbiter Laser Altimeter DEM & Slopes)
2. **NASA Mars Reconnaissance Orbiter (MRO)**:
   - HiRISE (High Resolution Imaging Science Experiment)
   - CRISM (Compact Reconnaissance Imaging Spectrometer for Mars)
   - SHARAD (Shallow Subsurface Radar)
3. **Terrestrial Analogs**:
   - NASA Haughton-Mars Project (HMP), Devon Island, Canada
   - HI-SEAS (Hawaii Space Exploration Analog and Simulation), Mauna Loa, USA
   - Atacama Desert (Life in the Atacama - LITA), Chile
   - Arctic Mars Analog Svalbard Expedition (AMASE), Norway
   - ESA PANGAEA Astronaut Geological Training, Lanzarote, Spain
   - McMurdo Dry Valleys, Antarctica
