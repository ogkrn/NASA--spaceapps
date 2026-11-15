# Methods and scientific limits

## Evidence boundary

Source-backed descriptive facts and illustrative model inputs are different things. All inherited engineering numbers, climate values and normalized Earth profiles remain **unverified scenario assumptions**. Their retention preserves the prototype's interactive experiments; it does not establish observational accuracy. Evidence objects identify exactly which descriptive claim a source supports. Coordinates are approximate orientation markers unless explicitly supported by a linked source.

## TOPSIS priority ranking

Each site's six benefits are illumination/100, ice input/100, max(0.05,1−slope/20), visibility/100, shielding/100, and max(0.05,1−temperature-range/250). Weights must be finite, nonnegative, each at most 1, with positive sum; the engine normalizes their sum. Each criterion is normalized by its column Euclidean norm, multiplied by its weight and compared with the best/worst vector in the selected candidate set. Score = distance-to-worst / (distance-to-best + distance-to-worst). Indistinguishable vectors receive 0.5; sorting of ties is stable. Rank numbers still enumerate the list and do not imply meaningful separation of tied sites.

Scores depend on the comparison set and assumptions. They are neither suitability probabilities nor valid comparisons between different body-filtered runs. No AHP pairwise elicitation or uncertainty propagation is implemented. Strength/vulnerability labels identify the largest/smallest unweighted transformed input, not a causal safety finding.

## Legacy analog profile index

The retained rule computes 100 × (0.82 × cosine similarity + 0.08 for a curated target association + 0.10 for an exact analog-type match), clipped to [0,100]. The previous artificial score floor and cap are removed. The five site entries are capped thermal range/200, slope/25, inverse shielding, ice input and a hard-coded geology-type factor. Earth entries are subjective thermal, regolith, inverse radiation, ice and geology profile scores. Geology factors: crater/polar .90, lava tube .95, delta .85, other .70.

**These vectors are not equivalent physical measurements.** In particular slope versus regolith mechanics and shielding need versus radiation fidelity cannot establish physical similarity. This rule is retained only as an explicitly illustrative shortlist demonstrator. Subscores are profile differences except geology, which is the Earth geology input alone. They must not be interpreted as measured geological/topographic/thermal matches. The six locations are known analogs, not discoveries made by this software. There is no trained ML model or global search. A scientific replacement needs comparable features, calibration and validation before using similarity claims.

## Resource budget, version resource-budget-2

One timestep is a 24-hour Earth day, including for Mars. Each crew member is assigned 3.5 L/day water and 0.84 kg/day oxygen; initial stores cover 18 days at gross demand. These are explicit model assumptions, not claimed site observations. Battery starts full.

- Solar: scenario flux × area × 0.28 efficiency × illumination factor × 24 / 1000 kWh. Nuclear: selected output × 24 kWh. Solar is excluded in nuclear-only mode and nuclear excluded in solar-only mode.
- Lunar poles: illumination input plus a 0.15-amplitude, 29.5-day sine, clamped to [0,1]. Other lunar sites: a 29.5-day on/off cycle integrated over 24 samples per Earth day. Mars: illumination input multiplied by 0.90 + 0.05 sin(day/20). These are invented scenario curves, not location-specific illumination/dust forecasts.
- Base electrical demand: 52.8 kWh/person/day plus 0.45 kWh per kelvin of the catalog's thermal range. Remaining power supports mining at 14 kWh/ton; excavation is throttled by available energy. Water yield uses the illustrative catalog kg/ton value and assumes 1 kg water = 1 L.
- Recovered water reduces gross crew water demand by the selected efficiency. Recovery is disabled on a day with unmet base electrical demand. Mining occurs before electrolysis; this allocation policy is not optimized.
- Electrolysis attempts to replace daily oxygen demand, limited by available water and energy. Oxygen mass is 8/9 of feedwater mass and requires an assumed 6 kWh/kg oxygen. Feedwater and energy are deducted. This simplified accounting omits hydrogen storage/recombination and actual hardware performance.
- Water and oxygen stores cannot become negative. Unmet demands are explicitly recorded. Excess generated energy above storage capacity is discarded. No intraday power routing, night-storage design or battery losses are modeled.
- Radiation: assumed base 1.4 mSv/day Moon or 0.65 Mars, attenuated using a heuristic burial coefficient 1.6/m and scenario shielding; fixed extra events on days 14 and 42. This is not radiation transport, weather forecasting or a validated dose model.

Any unmet water, oxygen or base-power demand makes the entire run CRITICAL, including if it later recovers. Its indicator is max(0,49−15 × number of failed resource categories). Otherwise low final reserves (battery below 25%, water or oxygen below three gross-demand days) or dose above a project warning of 100 mSv gives MARGINAL/65; otherwise NOMINAL/90. The 100 mSv warning is **not a NASA limit**. These scores are categorical indicators, not survival probabilities. The first failure day and daily deficits are more informative than the indicator.

## What passing tests establishes

Tests check conservation identities, mode exclusion, bounds, request handling and consistency across catalogs. They do not establish that any site can support humans. Food, equipment reliability, intraday thermal control, real shielding geometry, habitat leaks, dust transport, gravity, launch/landing safety and biological risks require separate evidence and engineering models.
