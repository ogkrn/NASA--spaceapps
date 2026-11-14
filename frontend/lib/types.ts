export interface ISRUPotential {
  water_extraction_rate_kg_per_ton: number;
  oxygen_extraction_ilmenite_pct: number;
  solar_flux_w_m2: number;
}

export interface CandidateSite {
  id: string;
  name: string;
  body: "Moon" | "Mars";
  region: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  slope_degrees: number;
  solar_illumination_pct: number;
  water_ice_probability_pct: number;
  earth_visibility_pct: number;
  thermal_min_k: number;
  thermal_max_k: number;
  natural_radiation_shielding_pct: number;
  geological_context: string;
  isru_potential: ISRUPotential;
  hazards: string[];
  scientific_significance: string;
  recommended_analog_type: string;
}

export interface EarthAnalog {
  id: string;
  name: string;
  location: string;
  country: string;
  latitude: number;
  longitude: number;
  analog_type: string;
  climate_classification: string;
  mean_temp_c: number;
  annual_precipitation_mm: number;
  geological_features: string[];
  nasa_mission_testing: string[];
  environmental_similarity_profile: {
    temperature_extreme_score: number;
    geological_fidelity_score: number;
    isolation_and_logistics_score: number;
    regolith_mechanics_score: number;
    ice_volatile_relevance_score: number;
    radiation_exposure_fidelity: number;
  };
  matched_planetary_targets: string[];
  summary: string;
}

export interface AnalogMatchResult {
  analog_id: string;
  analog_name: string;
  location: string;
  country: string;
  overall_similarity_pct: number;
  topography_score: number;
  geology_score: number;
  thermal_score: number;
  volatiles_score: number;
  scientific_rationale: string;
  key_analog_activities: string[];
}

export interface MCDAWeights {
  illumination: number;
  water_ice: number;
  slope_trafficability: number;
  earth_communication: number;
  radiation_shielding: number;
  thermal_stability: number;
}

export interface MCDARankResult {
  site_id: string;
  site_name: string;
  body: string;
  closeness_score: number;
  rank: number;
  dimension_scores: {
    illumination: number;
    water_ice: number;
    trafficability: number;
    communication: number;
    radiation_shielding: number;
    thermal_stability: number;
  };
  primary_strength: string;
  primary_vulnerability: string;
}

export interface SimulationParameters {
  site_id: string;
  mission_duration_days: number;
  crew_size: number;
  power_system: "hybrid" | "solar_battery" | "nuclear_kilopower";
  solar_panel_area_m2: number;
  nuclear_output_kw: number;
  battery_capacity_kwh: number;
  water_recycling_efficiency: number;
  isru_excavation_rate_kg_day: number;
  radiation_habitat_burial_depth_m: number;
}

export interface SimulationDayTelemetry {
  day: number;
  power_generated_kwh: number;
  power_consumed_kwh: number;
  battery_charge_pct: number;
  water_stored_liters: number;
  water_extracted_isru_liters: number;
  oxygen_stored_kg: number;
  cumulative_radiation_msv: number;
  system_stress_index: number;
}

export interface SimulationSummary {
  mission_viability_score: number;
  status: "NOMINAL" | "MARGINAL" | "CRITICAL";
  total_power_generated_mwh: number;
  total_water_extracted_isru_liters: number;
  final_cumulative_radiation_msv: number;
  bottlenecks: string[];
  recommendations: string[];
  daily_telemetry: SimulationDayTelemetry[];
}

export interface AIExplanationResponse {
  site_id: string;
  site_name: string;
  body: string;
  headline: string;
  suitability_verdict: string;
  geological_narrative: string;
  engineering_challenges: string[];
  earth_analog_parallels: string;
  educational_takeaways: string[];
}

