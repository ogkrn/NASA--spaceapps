import json
from pathlib import Path
from typing import List, Dict, Any
import numpy as np

from app.models.candidate import CandidateSite, EarthAnalog, AnalogMatchResult
from app.config import settings

class AnalogMatcherEngine:
    def __init__(self):
        self._load_datasets()

    def _load_datasets(self):
        lunar_path = settings.DATA_DIR / "lunar_sites.json"
        mars_path = settings.DATA_DIR / "mars_sites.json"
        earth_path = settings.DATA_DIR / "earth_analogs.json"

        with open(lunar_path, "r", encoding="utf-8") as f:
            self.lunar_sites = json.load(f)
        with open(mars_path, "r", encoding="utf-8") as f:
            self.mars_sites = json.load(f)
        with open(earth_path, "r", encoding="utf-8") as f:
            self.earth_analogs = json.load(f)

        self.all_candidates = {s["id"]: s for s in self.lunar_sites + self.mars_sites}

    def _extract_candidate_vector(self, site: Dict[str, Any]) -> np.ndarray:
        """
        Normalized feature vector:
        [
            temperature_severity,
            slope_complexity,
            radiation_shield_need,
            volatiles_abundance,
            geological_specialization
        ]
        """
        # Thermal delta
        thermal_range = abs(site["thermal_max_k"] - site["thermal_min_k"])
        temp_severity = min(1.0, thermal_range / 200.0)

        # Slope complexity
        slope_norm = min(1.0, site["slope_degrees"] / 25.0)

        # Shielding need (inverse of natural shielding)
        shielding_need = 1.0 - (site["natural_radiation_shielding_pct"] / 100.0)

        # Volatiles abundance
        volatiles = site["water_ice_probability_pct"] / 100.0

        # Geological specialization factor
        geo_type = site.get("recommended_analog_type", "")
        if "crater" in geo_type or "polar" in geo_type:
            geo_spec = 0.90
        elif "lava_tube" in geo_type:
            geo_spec = 0.95
        elif "delta" in geo_type:
            geo_spec = 0.85
        else:
            geo_spec = 0.70

        return np.array([temp_severity, slope_norm, shielding_need, volatiles, geo_spec], dtype=float)

    def _extract_analog_vector(self, analog: Dict[str, Any]) -> np.ndarray:
        profile = analog["environmental_similarity_profile"]
        temp = profile["temperature_extreme_score"]
        slope = profile["regolith_mechanics_score"]
        shield = 1.0 - profile["radiation_exposure_fidelity"]
        volatiles = profile["ice_volatile_relevance_score"]
        geo = profile["geological_fidelity_score"]

        return np.array([temp, slope, shield, volatiles, geo], dtype=float)

    def find_best_analogs_for_site(self, site_id: str, top_k: int = 4) -> List[AnalogMatchResult]:
        if site_id not in self.all_candidates:
            raise ValueError(f"Site {site_id} not found in database.")

        site = self.all_candidates[site_id]
        v_site = self._extract_candidate_vector(site)

        results = []
        for analog in self.earth_analogs:
            v_analog = self._extract_analog_vector(analog)

            # Cosine similarity
            dot = np.dot(v_site, v_analog)
            norm_a = np.linalg.norm(v_site)
            norm_b = np.linalg.norm(v_analog)
            cosine_sim = dot / (norm_a * norm_b) if (norm_a > 0 and norm_b > 0) else 0.0

            # Direct target bonus if curated in matched_planetary_targets
            target_bonus = 0.08 if site_id in analog.get("matched_planetary_targets", []) else 0.0
            
            # Type alignment bonus
            type_bonus = 0.10 if analog.get("analog_type") == site.get("recommended_analog_type") else 0.0

            raw_score = (cosine_sim * 0.82) + target_bonus + type_bonus
            overall_pct = round(min(98.5, max(42.0, raw_score * 100)), 1)

            # Sub-scores
            topo_score = round(min(1.0, 1.0 - abs(v_site[1] - v_analog[1])) * 100, 1)
            geol_score = round(analog["environmental_similarity_profile"]["geological_fidelity_score"] * 100, 1)
            therm_score = round(min(1.0, 1.0 - abs(v_site[0] - v_analog[0])) * 100, 1)
            vol_score = round(min(1.0, 1.0 - abs(v_site[3] - v_analog[3])) * 100, 1)

            # Scientific rationale generation
            rationale = self._generate_match_rationale(site, analog, overall_pct)

            results.append(
                AnalogMatchResult(
                    analog_id=analog["id"],
                    analog_name=analog["name"],
                    location=analog["location"],
                    country=analog["country"],
                    overall_similarity_pct=overall_pct,
                    topography_score=topo_score,
                    geology_score=geol_score,
                    thermal_score=therm_score,
                    volatiles_score=vol_score,
                    scientific_rationale=rationale,
                    key_analog_activities=analog["nasa_mission_testing"],
                    comparison_status="assumption_based",
                    confidence="medium",
                    limitations=[
                        "Earth analog profile values are catalogue estimates, not a shared calibrated measurement scale.",
                        "Slope, regolith mechanics, thermal extremes, and geology are compared through proxy features.",
                        "This ranking is a screening aid, not proof that the sites are physically equivalent.",
                    ],
                )
            )

        # Sort descending by overall similarity
        results.sort(key=lambda x: x.overall_similarity_pct, reverse=True)
        return results[:top_k]

    def _generate_match_rationale(self, site: Dict[str, Any], analog: Dict[str, Any], score: float) -> str:
        site_name = site["name"]
        analog_name = analog["name"]
        a_type = analog.get("analog_type")
        s_type = site.get("recommended_analog_type")

        if a_type == s_type and a_type == "lava_tube":
            return (
                f"Exceptional morphological analog. Both {site_name} and {analog_name} feature pristine "
                f"uncollapsed basaltic lava conduits. {analog_name} enables direct calibration of LiDAR SLAM, "
                f"subterranean habitat erection, and dust filtration in basalt voids prior to flight."
            )
        elif a_type == s_type and a_type == "polar_crater":
            return (
                f"High-fidelity polar desert analog. The permafrost and impact breccia at {analog_name} "
                f"closely replicate the cryogenic regolith and cold-trap conditions at {site_name}, "
                f"making it ideal for validating tethered rover traverse and cryogenic core drilling."
            )
        elif a_type == "hyper_arid_canyon":
            return (
                f"Crucial geochemical testbed. The hyper-arid soils and perchlorate chemistry at {analog_name} "
                f"reproduce the oxidative hazards found at {site_name}, facilitating life-detection validation."
            )
        else:
            return (
                f"{analog_name} demonstrates a {score}% operational and environmental alignment with {site_name}, "
                f"offering realistic crew isolation, harsh mechanical wear, and field logistics testing."
            )

analog_matcher = AnalogMatcherEngine()

