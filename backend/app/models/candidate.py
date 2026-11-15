from typing import List, Optional, Dict
from pydantic import BaseModel as PydanticBaseModel, Field, ConfigDict, model_validator
from typing import Literal

class BaseModel(PydanticBaseModel):
    model_config = ConfigDict(allow_inf_nan=False)

class Evidence(BaseModel):
    title: str
    url: str
    claim: str



class ISRUPotential(BaseModel):
    water_extraction_rate_kg_per_ton: float = Field(..., description="Estimated water extractable per metric ton of regolith")
    oxygen_extraction_ilmenite_pct: float = Field(..., description="Estimated oxygen yield via hydrogen reduction")
    solar_flux_w_m2: float = Field(..., description="Mean incident solar flux at surface")

class ProvenanceSource(BaseModel):
    id: str
    fields: List[str]

class DataProvenance(BaseModel):
    status: str
    confidence: str
    note: str
    sources: List[ProvenanceSource]

class CandidateSite(BaseModel):
    data_provenance: Optional[DataProvenance] = None
    evidence: List[Evidence] = Field(default_factory=list)
    data_status: str = "Scenario inputs, not observed site measurements"
    measurement_notes: str = ""
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
    evidence: List[Evidence] = Field(default_factory=list)
    data_status: str = "Qualitative sourced context; profile scores are illustrative"
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
    comparison_status: str = "assumption_based"
    confidence: str = "unverified"
    limitations: List[str] = Field(default_factory=lambda: ["Subjective proxy features are not calibrated physical measurements.", "Source links support descriptions, not numerical profile scores."])
    evidence: List[Evidence] = Field(default_factory=list)
    data_status: str = "Illustrative profile index; sources support context only"
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
    model_config = ConfigDict(allow_inf_nan=False, extra="forbid")
    illumination: float = Field(.25, ge=0, le=1)
    water_ice: float = Field(.25, ge=0, le=1)
    slope_trafficability: float = Field(.15, ge=0, le=1)
    earth_communication: float = Field(.15, ge=0, le=1)
    radiation_shielding: float = Field(.10, ge=0, le=1)
    thermal_stability: float = Field(.10, ge=0, le=1)

    @model_validator(mode="after")
    def positive_total(self):
        if sum(self.model_dump().values()) <= 0:
            raise ValueError("At least one criterion must have positive weight")
        return self

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
    model_config = ConfigDict(allow_inf_nan=False, extra="forbid")
    site_id: str = Field(min_length=1, max_length=100)
    mission_duration_days: int = Field(60, ge=1, le=3650, strict=True)
    crew_size: int = Field(4, ge=1, le=20, strict=True)
    power_system: Literal["solar_battery", "nuclear_kilopower", "hybrid"] = "hybrid"
    solar_panel_area_m2: float = Field(350, ge=0, le=100000)
    nuclear_output_kw: float = Field(10, ge=0, le=1000)
    battery_capacity_kwh: float = Field(400, gt=0, le=100000)
    water_recycling_efficiency: float = Field(.90, ge=0, le=1)
    isru_excavation_rate_kg_day: float = Field(250, ge=0, le=100000)
    radiation_habitat_burial_depth_m: float = Field(1.5, ge=0, le=20)

class SimulationDayTelemetry(BaseModel):
    water_consumed_net_liters: float = 0
    electrolysis_feedwater_liters: float = 0
    oxygen_produced_kg: float = 0
    water_deficit_liters: float = 0
    oxygen_deficit_kg: float = 0
    power_deficit_kwh: float = 0

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
    execution_mode: Literal["server", "offline_demo"] = "server"
    warnings: List[str] = Field(default_factory=lambda: ["Scenario inputs and daily budgets are illustrative, not operational predictions."])
    parameters: SimulationParameters
    model_version: str = "resource-budget-2"
    assumptions: List[str] = Field(default_factory=list)
    first_failure_day: Optional[int] = None
    initial_water_liters: float = 0
    initial_oxygen_kg: float = 0

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
    audience_mode: Literal["scientific", "educational", "executive"] = "scientific"

class AIExplanationResponse(BaseModel):
    evidence: List[Evidence] = Field(default_factory=list)
    site_id: str
    site_name: str
    body: str
    headline: str
    suitability_verdict: str
    geological_narrative: str
    engineering_challenges: List[str]
    earth_analog_parallels: str
    educational_takeaways: List[str]

