import numpy as np
from typing import List, Dict, Any
from app.models.candidate import MCDAWeights, MCDARankResult

class MCDAScoringEngine:
    """
    Implements TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
    for Multi-Criteria Planetary Outpost Site Selection.
    """
    CRITERIA_KEYS = [
        "illumination",
        "water_ice",
        "slope_trafficability",
        "earth_communication",
        "radiation_shielding",
        "thermal_stability"
    ]

    def _extract_decision_matrix(self, sites: List[Dict[str, Any]]) -> np.ndarray:
        matrix = []
        for s in sites:
            # 1. Illumination (benefit)
            c1 = s["solar_illumination_pct"] / 100.0

            # 2. Water ice (benefit)
            c2 = s["water_ice_probability_pct"] / 100.0

            # 3. Slope trafficability (lower slope is better -> benefit inverse)
            slope = s["slope_degrees"]
            c3 = max(0.05, 1.0 - (slope / 20.0))

            # 4. Earth communication (benefit)
            c4 = s["earth_visibility_pct"] / 100.0

            # 5. Radiation shielding (benefit)
            c5 = s["natural_radiation_shielding_pct"] / 100.0

            # 6. Thermal stability (smaller delta is better -> benefit)
            delta_t = abs(s["thermal_max_k"] - s["thermal_min_k"])
            c6 = max(0.05, 1.0 - (delta_t / 250.0))

            matrix.append([c1, c2, c3, c4, c5, c6])

        return np.array(matrix, dtype=float)

    def evaluate_sites(self, sites: List[Dict[str, Any]], weights: MCDAWeights) -> List[MCDARankResult]:
        if not sites:
            return []

        X = self._extract_decision_matrix(sites)
        n_candidates, n_criteria = X.shape

        # Weights vector
        w = np.array([
            weights.illumination,
            weights.water_ice,
            weights.slope_trafficability,
            weights.earth_communication,
            weights.radiation_shielding,
            weights.thermal_stability
        ], dtype=float)

        # Normalize weights
        w_sum = np.sum(w)
        if w_sum > 0:
            w = w / w_sum
        else:
            w = np.ones(n_criteria) / n_criteria

        # Step 1: Vector Normalization
        norms = np.linalg.norm(X, axis=0)
        norms[norms == 0] = 1.0
        R = X / norms

        # Step 2: Weighted Normalized Matrix
        V = R * w

        # Step 3: Determine Ideal Positive (A+) and Ideal Negative (A-)
        # All criteria here are formulated as benefits
        A_plus = np.max(V, axis=0)
        A_minus = np.min(V, axis=0)

        # Step 4: Calculate Separation Distances
        S_plus = np.sqrt(np.sum((V - A_plus) ** 2, axis=1))
        S_minus = np.sqrt(np.sum((V - A_minus) ** 2, axis=1))

        # Step 5: Calculate Relative Closeness to Ideal Solution C_i = S- / (S+ + S-)
        denominator = S_plus + S_minus
        denominator[denominator == 0] = 1e-9
        C = np.where((S_plus + S_minus) < 1e-12, 0.5, S_minus / denominator)

        # Rank candidates
        sorted_indices = np.argsort(-C, kind="stable")

        results = []
        for rank_pos, idx in enumerate(sorted_indices, start=1):
            site = sites[idx]
            closeness = float(C[idx])

            dim_scores = {
                "illumination": round(float(X[idx, 0]) * 100, 1),
                "water_ice": round(float(X[idx, 1]) * 100, 1),
                "trafficability": round(float(X[idx, 2]) * 100, 1),
                "communication": round(float(X[idx, 3]) * 100, 1),
                "radiation_shielding": round(float(X[idx, 4]) * 100, 1),
                "thermal_stability": round(float(X[idx, 5]) * 100, 1)
            }

            # Find strength & vulnerability
            best_dim = max(dim_scores.items(), key=lambda item: item[1])
            worst_dim = min(dim_scores.items(), key=lambda item: item[1])

            strength_map = {
                "illumination": "Higher illumination input in this scenario",
                "water_ice": "Higher ice input in this scenario",
                "trafficability": "Lower slope input in this scenario",
                "communication": "Higher Earth visibility input in this scenario",
                "radiation_shielding": "Higher shielding input in this scenario",
                "thermal_stability": "Smaller temperature range in the scenario"
            }

            vuln_map = {
                "illumination": "Lower illumination input in this scenario",
                "water_ice": "Lower ice input in this scenario",
                "trafficability": "Higher slope input in this scenario",
                "communication": "Lower Earth visibility input in this scenario",
                "radiation_shielding": "Lower shielding input in this scenario",
                "thermal_stability": "Larger temperature range in the scenario"
            }

            results.append(
                MCDARankResult(
                    site_id=site["id"],
                    site_name=site["name"],
                    body=site["body"],
                    closeness_score=round(closeness, 4),
                    rank=rank_pos,
                    dimension_scores=dim_scores,
                    primary_strength=strength_map.get(best_dim[0], best_dim[0]),
                    primary_vulnerability=vuln_map.get(worst_dim[0], worst_dim[0])
                )
            )

        return results

mcda_engine = MCDAScoringEngine()

