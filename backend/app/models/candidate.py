from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class ISRUPotential(BaseModel):
    water_extraction_rate_kg_per_ton: float = Field(..., description="Estimated water extractable per metric ton of regolith")
    oxygen_extraction_ilmenite_pct: float = Field(..., description="Estimated oxygen yield via hydrogen reduction")
    solar_flux_w_m2: float = Field(..., description="Mean incident solar flux at surface")

class CandidateSite(BaseModel):
    id: str
    name: str
    body: str = Field(..., description="'Moon' or 'Mars'")
    region: str
    latitude: float
    longitude: float
    elevation_m: float
    slope_degrees: float
    solar_illumination_pct: float
    water_ice_probability_pct: float
    earth_visibility_pct: float
    thermal_min_k: float
    thermal_max_k: float
    natural_radiation_shielding_pct: float
    geological_context: str
    isru_potential: ISRUPotential
    hazards: List[str]
    scientific_significance: str
    recommended_analog_type: str

class EnvironmentalSimilarityProfile(BaseModel):
    temperature_extreme_score: float
    geological_fidelity_score: float
    isolation_and_logistics_score: float
    regolith_mechanics_score: float
    ice_volatile_relevance_score: float
    radiation_exposure_fidelity: float

class EarthAnalog(BaseModel):
    id: str
    name: str
    location: str
    country: str
    latitude: float
    longitude: float
    analog_type: str
    climate_classification: str
    mean_temp_c: float
    annual_precipitation_mm: float
    geological_features: List[str]
    nasa_mission_testing: List[str]
    environmental_similarity_profile: EnvironmentalSimilarityProfile
    matched_planetary_targets: List[str]
    summary: str

class AnalogMatchResult(BaseModel):
    analog_id: str
    analog_name: str
    location: str
    country: str
    overall_similarity_pct: float
    topography_score: float
    geology_score: float
    thermal_score: float
    volatiles_score: float
    scientific_rationale: str
    key_analog_activities: List[str]

class MCDAWeights(BaseModel):
    illumination: float = 0.25
    water_ice: float = 0.25
    slope_trafficability: float = 0.15
    earth_communication: float = 0.15
    radiation_shielding: float = 0.10
    thermal_stability: float = 0.10

class MCDARankResult(BaseModel):
    site_id: str
    site_name: str
    body: str
    closeness_score: float
    rank: int
    dimension_scores: Dict[str, float]
    primary_strength: str
    primary_vulnerability: str

class SimulationParameters(BaseModel):
    site_id: str
    mission_duration_days: int = 60
    crew_size: int = 4
    power_system: str = "hybrid" # "solar_battery", "nuclear_kilopower", "hybrid"
    solar_panel_area_m2: float = 350.0
    nuclear_output_kw: float = 10.0
    battery_capacity_kwh: float = 400.0
    water_recycling_efficiency: float = 0.90
    isru_excavation_rate_kg_day: float = 250.0
    radiation_habitat_burial_depth_m: float = 1.5

class SimulationDayTelemetry(BaseModel):
    day: int
    power_generated_kwh: float
    power_consumed_kwh: float
    battery_charge_pct: float
    water_stored_liters: float
    water_extracted_isru_liters: float
    oxygen_stored_kg: float
    cumulative_radiation_msv: float
    system_stress_index: float # 0 to 100

class SimulationSummary(BaseModel):
    mission_viability_score: float
    status: str # "NOMINAL", "MARGINAL", "CRITICAL"
    total_power_generated_mwh: float
    total_water_extracted_isru_liters: float
    final_cumulative_radiation_msv: float
    bottlenecks: List[str]
    recommendations: List[str]
    daily_telemetry: List[SimulationDayTelemetry]

class AIExplanationRequest(BaseModel):
    site_id: str
    audience_mode: str = "scientific" # "scientific", "educational", "executive"

class AIExplanationResponse(BaseModel):
    site_id: str
    site_name: str
    body: str
    headline: str
    suitability_verdict: str
    geological_narrative: str
    engineering_challenges: List[str]
    earth_analog_parallels: str
    educational_takeaways: List[str]

