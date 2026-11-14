# ARES-LUNA User & Judge Guide

Welcome to **ARES-LUNA**, the Planetary Analog Intelligence & Mission Simulation platform developed for the NASA Space Apps Challenge!

---

## Quick Navigation

The interface provides an interactive mission dashboard with four primary working modes:

### 1. 3D Planetary Explorer & Candidate Sites
- **Planet Switcher**: Toggle between the **Moon** (Artemis polar exploration & lava tubes) and **Mars** (Jezero Crater, Arcadia Planitia ice sheets, Noctis Labyrinthus).
- **Interactive 3D Globe**:
  - Drag to orbit the celestial body.
  - Directional sunlight shows real-time terminator and sub-solar angles.
  - Click on any landing node on the 3D globe to load its telemetry instantly.
- **Radar Analysis**: Inspect the 6-dimensional spider chart (Solar Power, Water-Ice, Trafficability, Direct Earth Link, Radiation Shielding, Thermal Stability).

### 2. Automated Terrestrial Analog Discovery
- Automatically maps candidate sites to high-fidelity Earth testbeds (Devon Island Haughton Crater, HI-SEAS Mauna Loa, Atacama Desert, Svalbard AMASE, Lanzarote Lava Tubes, McMurdo Dry Valleys).
- View environmental fidelity percentages and read NASA/ESA mission test history for rovers, drilling, and EVA suits.

### 3. Mission Planning Simulator
- Customize your mission profile:
  - Mission Duration (14 to 180 sols)
  - Crew Size (2 to 10 astronauts)
  - Power Generation (Hybrid Solar + Nuclear Kilopower vs Solar + Battery)
  - Habitat Regolith Burial Depth (0 to 3.5 meters)
  - Closed-Loop Water Recovery (70% to 98%)
  - ISRU Regolith Excavation Rate (50 to 600 kg/day)
- **Live Output**:
  - Mission Viability Scorecard (0-100%) and Status (`NOMINAL`, `MARGINAL`, `CRITICAL`).
  - Day-by-day battery state-of-charge, water stockpiles, and cumulative radiation curves.
  - Engineering recommendations and bottleneck alerts.

### 4. Intermediate MCDA (TOPSIS) Ranking
- Customize weights for illumination, ice, terrain slope, communications, radiation, and thermal delta.
- Dynamically re-ranks all landing candidates using vector normalization and Euclidean distance to the ideal positive solution.

### 5. Mode Switcher (Scientist vs Explorer)
- Click **Scientist Mode** for raw telemetry, AHP weights, radar charts, and mission commander justifications.
- Click **Explorer Mode** for educational story cards, plain-English survival principles, and the interactive **Judges & Students Knowledge Challenge Quiz**!

