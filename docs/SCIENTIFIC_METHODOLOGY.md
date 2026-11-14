# ARES-LUNA Scientific Methodology & Mathematical Foundations

This document provides the formal mathematical formulations, empirical models, and physics equations underpinning the **ARES-LUNA** decision support and mission simulation platform.

---

## 1. Multi-Criteria Decision Analysis (TOPSIS Formulation)

Settlement outpost ranking is formulated as a Multi-Criteria Decision Analysis (MCDA) problem using **TOPSIS** (*Technique for Order Preference by Similarity to Ideal Solution*).

Given $m$ candidate planetary outpost sites and $n=6$ decision criteria:
1. **$C_1$ (Solar Power)**: Mean annual illumination percentage $\tau_{\text{illum}} \in [0, 100]$
2. **$C_2$ (Volatiles / Ice)**: Cryogenic water-ice probability index $P_{\text{ice}} \in [0, 100]$
3. **$C_3$ (Terrain Trafficability)**: Inverse slope penalty function $S_{\text{traffic}} = \max\left(5, 100 - 4.5 \cdot \theta_{\text{slope}}\right)$
4. **$C_4$ (Direct Earth Comms)**: Line-of-sight visibility duty cycle $L_{\text{comm}} \in [0, 100]$
5. **$C_5$ (Natural Radiation Shielding)**: Topographic/lava-tube shielding attenuation factor $\eta_{\text{rad}} \in [0, 100]$
6. **$C_6$ (Thermal Stability)**: Thermal amplitude resilience $T_{\text{stab}} = \max\left(5, 100 - \frac{|T_{\max} - T_{\min}|}{2.5}\right)$

### Step 1: Decision Matrix Normalization
Vector normalization converts diverse physical units into dimensionless scores:
$$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{k=1}^{m} x_{kj}^2}}, \quad \forall i \in \{1,\dots,m\}, \; j \in \{1,\dots,n\}$$

### Step 2: Weight Assignment
Users dynamically configure weights $w_j$ such that $\sum_{j=1}^{n} w_j = 1$. The weighted normalized value is:
$$v_{ij} = w_j \cdot r_{ij}$$

### Step 3: Ideal Positive ($A^+$) and Ideal Negative ($A^-$) Solutions
Since all transformed criteria represent positive benefits:
$$A^+ = \left( \max_i v_{i1}, \max_i v_{i2}, \dots, \max_i v_{in} \right)$$
$$A^- = \left( \min_i v_{i1}, \min_i v_{i2}, \dots, \min_i v_{in} \right)$$

### Step 4: Separation Distances
Euclidean distance to $A^+$ and $A^-$:
$$S_i^+ = \sqrt{\sum_{j=1}^{n} (v_{ij} - A_j^+)^2}, \qquad S_i^- = \sqrt{\sum_{j=1}^{n} (v_{ij} - A_j^-)^2}$$

### Step 5: Relative Closeness Index ($C_i$)
$$C_i = \frac{S_i^-}{S_i^+ + S_i^-}, \quad C_i \in [0, 1]$$
Candidates are ranked in descending order of $C_i$, where $C_i = 1$ is the optimal target outpost.

---

## 2. Automated Terrestrial Analog Discovery Engine

To identify which Earth field station best models a target site, we define a feature vector $\vec{x}_{\text{site}} \in \mathbb{R}^5$ and analog vector $\vec{y}_{\text{analog}} \in \mathbb{R}^5$ comprising:
- Thermal severity $\Delta T$
- Slope complexity $\theta$
- Radiation shield requirement $(1 - \eta_{\text{rad}})$
- Volatile accessibility index
- Geomorphological classification alignment

The base environmental similarity is given by the cosine metric:
$$\text{Sim}_{\cos}(\vec{x}, \vec{y}) = \frac{\vec{x} \cdot \vec{y}}{\|\vec{x}\|_2 \|\vec{y}\|_2}$$

Augmented by domain bonuses for NASA/ESA field verification history:
$$\text{Score}_{\text{overall}} = 100 \cdot \left[ 0.82 \cdot \text{Sim}_{\cos} + \beta_{\text{target}} + \beta_{\text{morphology}} \right]$$

---

## 3. Mission Physics & ECLSS Simulation Engine

### 3.1 Solar Irradiance & Generation
$$P_{\text{solar}}(t) = I_0 \cdot A_{\text{pv}} \cdot \eta_{\text{pv}} \cdot \delta_{\text{illum}}(t)$$
Where:
- $I_0 = 1361 \text{ W/m}^2$ (Lunar South Pole), $590 \text{ W/m}^2$ (Mars equator)
- $\eta_{\text{pv}} = 0.28$ (High-efficiency space-grade GaInP/GaAs triple-junction cells)
- $\delta_{\text{illum}}(t)$ = Diurnal illumination modifier

### 3.2 Radiation Exposure & Regolith Burial
Surface Galactic Cosmic Ray (GCR) background dose $D_0 \approx 1.4 \text{ mSv/day}$ (Moon) and $0.65 \text{ mSv/day}$ (Mars).
Regolith shielding follows the exponential attenuation law:
$$I = I_0 \cdot e^{-\mu \cdot \rho \cdot x}$$
Where:
- $\rho \approx 1.5 \text{ g/cm}^3$ (Lunar regolith bulk density)
- $x$ = Habitat burial depth in meters
- $\mu$ = Mass attenuation coefficient for high-Z cosmic rays

Total cumulative dose $D_{\text{cum}} = \sum_{t=1}^{T} D_{\text{daily}}(t)$. A warning threshold triggers when cumulative exposure exceeds $60 \text{ mSv}$, and critical breach at $>100 \text{ mSv}$ (NASA career guideline safety margins).

### 3.3 Closed-Loop Water & Oxygen Mass Balance
- Metabolic crew water demand: $3.5 \text{ L/day/astronaut}$
- Closed-loop ECLSS recovery: $W_{\text{recycled}} = W_{\text{demand}} \cdot \eta_{\text{recycle}}$
- Regolith ISRU Water Extraction:
$$W_{\text{ISRU}} = \dot{m}_{\text{regolith}} \cdot \gamma_{\text{H2O}}$$
- Oxygen Generation: $O_{\text{regen}} = W_{\text{ISRU}} \cdot 0.88$ (Electrolysis $2\text{H}_2\text{O} \to 2\text{H}_2 + \text{O}_2$).

