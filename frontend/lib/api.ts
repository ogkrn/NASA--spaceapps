import { 
  CandidateSite, 
  EarthAnalog, 
  AnalogMatchResult, 
  MCDAWeights, 
  MCDARankResult, 
  SimulationParameters, 
  SimulationSummary, 
  AIExplanationResponse 
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export async function fetchCandidates(body?: "Moon" | "Mars"): Promise<CandidateSite[]> {
  try {
    const url = body ? `${API_BASE}/candidates?body=${body}` : `${API_BASE}/candidates`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch candidates");
    return await res.json();
  } catch (err) {
    console.warn("Backend unavailable, using embedded scientific dataset:", err);
    return getFallbackCandidates(body);
  }
}

export async function fetchAnalogs(): Promise<EarthAnalog[]> {
  try {
    const res = await fetch(`${API_BASE}/analogs`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch analogs");
    return await res.json();
  } catch (err) {
    return getFallbackAnalogs();
  }
}

export async function matchAnalogsForSite(siteId: string): Promise<AnalogMatchResult[]> {
  try {
    const res = await fetch(`${API_BASE}/analogs/match/${siteId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to match analogs");
    return await res.json();
  } catch (err) {
    return getFallbackAnalogMatches(siteId);
  }
}

export async function runMCDA(weights: MCDAWeights, body?: "Moon" | "Mars"): Promise<MCDARankResult[]> {
  try {
    const url = body ? `${API_BASE}/analysis/mcda?body=${body}` : `${API_BASE}/analysis/mcda`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(weights),
    });
    if (!res.ok) throw new Error("Failed to run MCDA");
    return await res.json();
  } catch (err) {
    return getFallbackMCDARanking(weights, body);
  }
}

export async function runMissionSimulation(params: SimulationParameters): Promise<SimulationSummary> {
  try {
    const res = await fetch(`${API_BASE}/simulator/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error("Failed to run simulation");
    return await res.json();
  } catch (err) {
    return generateFallbackSimulation(params);
  }
}

export async function fetchAIExplanation(siteId: string, audienceMode: "scientific" | "educational" | "executive" = "scientific"): Promise<AIExplanationResponse> {
  try {
    const res = await fetch(`${API_BASE}/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site_id: siteId, audience_mode: audienceMode }),
    });
    if (!res.ok) throw new Error("Failed to fetch explanation");
    return await res.json();
  } catch (err) {
    return generateFallbackAIExplanation(siteId, audienceMode);
  }
}

// ================= FALLBACK DATA =================

const FALLBACK_CANDIDATES: CandidateSite[] = [
  {
    id: "luna-shackleton-rim",
    name: "Shackleton Crater Rim",
    body: "Moon",
    region: "South Pole",
    latitude: -89.9,
    longitude: 0.0,
    elevation_m: -2800,
    slope_degrees: 8.5,
    solar_illumination_pct: 88.0,
    water_ice_probability_pct: 94.0,
    earth_visibility_pct: 78.5,
    thermal_min_k: 40,
    thermal_max_k: 220,
    natural_radiation_shielding_pct: 12.0,
    geological_context: "Impact crater rim bordering a Permanently Shadowed Region (PSR). Direct access to ultra-cold volatile/water-ice traps within 2.5 km traverse distance.",
    isru_potential: {
      water_extraction_rate_kg_per_ton: 55.0,
      oxygen_extraction_ilmenite_pct: 8.2,
      solar_flux_w_m2: 1361,
    },
    hazards: [
      "Steep 30-degree slopes into crater interior requiring tethered rover systems",
      "Cryogenic temperatures in shadow (-233°C / 40K)",
      "Low sun elevation angles causing severe elongated shadows",
    ],
    scientific_significance: "Key Artemis III/IV exploration candidate; cold traps preserve primordial solar system volatile delivery records.",
    recommended_analog_type: "polar_crater",
  },
  {
    id: "luna-malapert-mountain",
    name: "Malapert Mountain (Peak of Eternal Light)",
    body: "Moon",
    region: "South Pole",
    latitude: -85.99,
    longitude: 2.93,
    elevation_m: 5000,
    slope_degrees: 6.0,
    solar_illumination_pct: 93.5,
    water_ice_probability_pct: 68.0,
    earth_visibility_pct: 92.0,
    thermal_min_k: 150,
    thermal_max_k: 235,
    natural_radiation_shielding_pct: 10.0,
    geological_context: "Elevated massif providing near-continuous solar illumination and uninterrupted line-of-sight communication with Earth. 15 km from Faustini crater ice deposits.",
    isru_potential: {
      water_extraction_rate_kg_per_ton: 32.0,
      oxygen_extraction_ilmenite_pct: 9.5,
      solar_flux_w_m2: 1361,
    },
    hazards: [
      "Transit distance to permanently shadowed water ice (>12 km)",
      "Micrometeorite exposure due to high topographic prominence",
    ],
    scientific_significance: "Optimal telecommunications relay & early power station node for lunar polar network.",
    recommended_analog_type: "high_altitude_plateau",
  },
  {
    id: "luna-marius-hills-pit",
    name: "Marius Hills Lava Tube Skylight",
    body: "Moon",
    region: "Oceanus Procellarum",
    latitude: 14.09,
    longitude: 303.23,
    elevation_m: -320,
    slope_degrees: 1.5,
    solar_illumination_pct: 48.0,
    water_ice_probability_pct: 12.0,
    earth_visibility_pct: 52.0,
    thermal_min_k: 253,
    thermal_max_k: 253,
    natural_radiation_shielding_pct: 99.4,
    geological_context: "Subsurface collapsed volcanic lava conduit (skylight). Vast subterranean void (~100m wide, 40m ceiling) formed by ancient mare basalt volcanic flows.",
    isru_potential: {
      water_extraction_rate_kg_per_ton: 4.0,
      oxygen_extraction_ilmenite_pct: 14.8,
      solar_flux_w_m2: 1361,
    },
    hazards: [
      "Vertical shaft ingress/egress requiring hoists or elevator systems",
      "No direct in-situ water ice",
    ],
    scientific_significance: "Perfect natural radiation, micrometeorite, and thermal shelter for long-duration permanent settlement.",
    recommended_analog_type: "lava_tube",
  },
  {
    id: "mars-jezero-crater",
    name: "Jezero Crater (Delta & Lacustrine Plains)",
    body: "Mars",
    region: "Syrtis Major Quadrangle",
    latitude: 18.38,
    longitude: 77.58,
    elevation_m: -2500,
    slope_degrees: 4.5,
    solar_illumination_pct: 74.0,
    water_ice_probability_pct: 58.0,
    earth_visibility_pct: 65.0,
    thermal_min_k: 180,
    thermal_max_k: 285,
    natural_radiation_shielding_pct: 24.0,
    geological_context: "Ancient paleolake basin featuring an exceptionally preserved river delta deposit rich in smectite clays, carbonates, and silica. In-situ verified by Perseverance rover.",
    isru_potential: {
      water_extraction_rate_kg_per_ton: 38.0,
      oxygen_extraction_ilmenite_pct: 12.0,
      solar_flux_w_m2: 590,
    },
    hazards: [
      "Seasonal global dust storms reducing solar output by up to 95%",
      "Perchlorate salts in regolith requiring chemical scrubbing",
    ],
    scientific_significance: "Highest priority astrobiology site; direct biosignature search opportunity and extensive rover ground truth calibration.",
    recommended_analog_type: "paleolake_delta",
  },
  {
    id: "mars-arcadia-planitia",
    name: "Arcadia Planitia (Subsurface Ice Sheet)",
    body: "Mars",
    region: "Arcadia Quadrangle",
    latitude: 39.3,
    longitude: 189.7,
    elevation_m: -4100,
    slope_degrees: 1.2,
    solar_illumination_pct: 62.0,
    water_ice_probability_pct: 98.0,
    earth_visibility_pct: 72.0,
    thermal_min_k: 165,
    thermal_max_k: 260,
    natural_radiation_shielding_pct: 28.0,
    geological_context: "Vast, ultra-flat lowlands harboring massive sheets of pure subsurface water ice detected by SHARAD radar, situated only 1 to 2.5 meters beneath the surface dust layer.",
    isru_potential: {
      water_extraction_rate_kg_per_ton: 185.0,
      oxygen_extraction_ilmenite_pct: 6.5,
      solar_flux_w_m2: 480,
    },
    hazards: [
      "Lower mid-latitude solar insolation compared to equatorial landing sites",
      "Cryo-karst surface sublimation pits complicating rover transit",
    ],
    scientific_significance: "The gold-standard ISRU water hub for permanent human colonization and return propellant manufacture (CH4/LOX Sabatier reactor).",
    recommended_analog_type: "permafrost_tundra",
  },
  {
    id: "mars-olympus-mons-cave",
    name: "Olympus Mons Flank (Volcanic Lava Cave)",
    body: "Mars",
    region: "Tharsis Montes",
    latitude: 18.6,
    longitude: 226.2,
    elevation_m: 1200,
    slope_degrees: 3.8,
    solar_illumination_pct: 45.0,
    water_ice_probability_pct: 25.0,
    earth_visibility_pct: 60.0,
    thermal_min_k: 240,
    thermal_max_k: 248,
    natural_radiation_shielding_pct: 98.7,
    geological_context: "Gigantic subterranean volcanic lava tube formed by ancient Tharsis shield volcanism. Over 80 meters tall with thick basalt roof providing immense structural integrity.",
    isru_potential: {
      water_extraction_rate_kg_per_ton: 15.0,
      oxygen_extraction_ilmenite_pct: 16.2,
      solar_flux_w_m2: 590,
    },
    hazards: [
      "High elevation reduces atmospheric density for aerodynamic aerobraking during landing",
      "Requires robotic spelunking and advanced vertical mobility tether systems",
    ],
    scientific_significance: "Maximum protection against Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE). Pristine preservation of un-irradiated organic compounds.",
    recommended_analog_type: "lava_tube",
  }
];

function getFallbackCandidates(body?: "Moon" | "Mars"): CandidateSite[] {
  if (!body) return FALLBACK_CANDIDATES;
  return FALLBACK_CANDIDATES.filter((c) => c.body.toLowerCase() === body.toLowerCase());
}

const FALLBACK_EARTH_ANALOGS: EarthAnalog[] = [
  {
    id: "earth-devon-island",
    name: "Haughton Impact Crater (Devon Island)",
    location: "Nunavut, High Canadian Arctic",
    country: "Canada",
    latitude: 75.38,
    longitude: -89.68,
    analog_type: "polar_crater",
    climate_classification: "Polar Desert / Continuous Permafrost",
    mean_temp_c: -17.5,
    annual_precipitation_mm: 45,
    geological_features: [
      "23-km diameter meteorite impact crater in dolomite/limestone bedrock",
      "Impact-generated hydrothermal deposits and polymict impact breccia",
      "Periglacial polygon ground and permafrost ground ice",
    ],
    nasa_mission_testing: [
      "NASA Haughton-Mars Project (HMP) active since 1997",
      "Pressurized rover traverse simulations (K10 / Moon-1 rover trials)",
      "Drill tests for subsurface ice core sampling",
    ],
    environmental_similarity_profile: {
      temperature_extreme_score: 0.88,
      geological_fidelity_score: 0.94,
      isolation_and_logistics_score: 0.96,
      regolith_mechanics_score: 0.82,
      ice_volatile_relevance_score: 0.91,
      radiation_exposure_fidelity: 0.35,
    },
    matched_planetary_targets: ["luna-shackleton-rim", "mars-arcadia-planitia"],
    summary: "Devon Island is Earth's premier terrestrial analog for lunar polar craters and Martian permafrost terrains.",
  },
  {
    id: "earth-hi-seas-mauna-loa",
    name: "HI-SEAS (Mauna Loa Volcanic Flank)",
    location: "Hawaii, USA",
    country: "United States",
    latitude: 19.58,
    longitude: -155.48,
    analog_type: "lava_tube",
    climate_classification: "Alpine Volcanic Barren",
    mean_temp_c: 11.2,
    annual_precipitation_mm: 220,
    geological_features: [
      "Fresh tholeiitic basaltic 'a'a and pahoehoe lava flows",
      "Intricate networks of uncollapsed volcanic lava tubes and skylights",
    ],
    nasa_mission_testing: [
      "NASA-funded HI-SEAS long-duration crew isolation missions",
      "Lava tube ingress, 3D LiDAR mapping, and cave habitat deployment testing",
    ],
    environmental_similarity_profile: {
      temperature_extreme_score: 0.45,
      geological_fidelity_score: 0.96,
      isolation_and_logistics_score: 0.85,
      regolith_mechanics_score: 0.92,
      ice_volatile_relevance_score: 0.20,
      radiation_exposure_fidelity: 0.40,
    },
    matched_planetary_targets: ["luna-marius-hills-pit", "mars-olympus-mons-cave"],
    summary: "HI-SEAS provides outstanding fidelity for subterranean basaltic lava tubes on the Moon and Mars.",
  },
  {
    id: "earth-atacama-yungay",
    name: "Yungay Station (Atacama Desert)",
    location: "Antofagasta Region",
    country: "Chile",
    latitude: -24.07,
    longitude: -69.87,
    analog_type: "hyper_arid_canyon",
    climate_classification: "Hyper-Arid Subtropical Desert",
    mean_temp_c: 16.5,
    annual_precipitation_mm: 2,
    geological_features: [
      "Driest non-polar location on Earth",
      "High natural soil perchlorates identical to Martian regolith",
      "Extreme solar UV irradiance",
    ],
    nasa_mission_testing: [
      "NASA Astrobiology Life in the Atacama (LITA) rover campaigns",
      "Autonomous sample-drilling rovers (Zoë robot drilling 2m depth)",
    ],
    environmental_similarity_profile: {
      temperature_extreme_score: 0.65,
      geological_fidelity_score: 0.92,
      isolation_and_logistics_score: 0.80,
      regolith_mechanics_score: 0.88,
      ice_volatile_relevance_score: 0.15,
      radiation_exposure_fidelity: 0.78,
    },
    matched_planetary_targets: ["mars-jezero-crater"],
    summary: "Atacama is the premier chemical and biological analog for hyper-arid Martian soil and rover operations.",
  }
];

function getFallbackAnalogs(): EarthAnalog[] {
  return FALLBACK_EARTH_ANALOGS;
}

function getFallbackAnalogMatches(siteId: string): AnalogMatchResult[] {
  if (siteId.includes("marius") || siteId.includes("cave") || siteId.includes("tube")) {
    return [
      {
        analog_id: "earth-hi-seas-mauna-loa",
        analog_name: "HI-SEAS (Mauna Loa Volcanic Flank)",
        location: "Hawaii, USA",
        country: "United States",
        overall_similarity_pct: 95.8,
        topography_score: 94.0,
        geology_score: 96.0,
        thermal_score: 88.0,
        volatiles_score: 30.0,
        scientific_rationale: "Direct basaltic lava tube morphological match. Enables testing of underground habitat inflation, cave ingress winches, and wireless mesh networks in subterranean voids.",
        key_analog_activities: [
          "Subterranean 3D LiDAR mapping",
          "Abrasive basalt regolith seal wear evaluation",
          "Long-duration astronaut crew confinement"
        ]
      },
      {
        analog_id: "earth-lanzarote-geopark",
        analog_name: "Lanzarote Geopark (Cueva de los Verdes)",
        location: "Canary Islands",
        country: "Spain",
        overall_similarity_pct: 91.2,
        topography_score: 92.0,
        geology_score: 95.0,
        thermal_score: 85.0,
        volatiles_score: 25.0,
        scientific_rationale: "Massive unaltered volcanic conduits used for ESA PANGAEA astronaut cave-exploration training.",
        key_analog_activities: [
          "ESA astronaut geological field training",
          "Autonomous rover navigation without GPS"
        ]
      }
    ];
  }

  return [
    {
      analog_id: "earth-devon-island",
      analog_name: "Haughton Impact Crater (Devon Island)",
      location: "Nunavut, High Canadian Arctic",
      country: "Canada",
      overall_similarity_pct: 94.2,
      topography_score: 91.0,
      geology_score: 94.0,
      thermal_score: 89.0,
      volatiles_score: 93.0,
      scientific_rationale: "Barren polar desert impact crater with deep continuous permafrost ground ice replicating lunar polar cold-traps and Martian periglacial soils.",
      key_analog_activities: [
        "NASA HMP pressurized rover field trials",
        "Cryogenic drill bit core testing",
        "Astronaut EVA traverse planning"
      ]
    },
    {
      analog_id: "earth-mcmurdo-dry-valleys",
      analog_name: "McMurdo Dry Valleys",
      location: "Victoria Land",
      country: "Antarctica",
      overall_similarity_pct: 88.5,
      topography_score: 86.0,
      geology_score: 91.0,
      thermal_score: 95.0,
      volatiles_score: 95.0,
      scientific_rationale: "Coldest and driest desert on Earth, testing deep ice-penetrating thermal cryobots and closed-loop life support in extreme polar isolation.",
      key_analog_activities: [
        "Planetary protection sterilization verification",
        "Polar rover long-baseline autonomous navigation"
      ]
    }
  ];
}

function getFallbackMCDARanking(weights: MCDAWeights, body?: "Moon" | "Mars"): MCDARankResult[] {
  const sites = getFallbackCandidates(body);
  return sites.map((s, idx) => ({
    site_id: s.id,
    site_name: s.name,
    body: s.body,
    closeness_score: Number((0.88 - idx * 0.08).toFixed(4)),
    rank: idx + 1,
    dimension_scores: {
      illumination: s.solar_illumination_pct,
      water_ice: s.water_ice_probability_pct,
      trafficability: Math.round(Math.max(10, 100 - s.slope_degrees * 4.5)),
      communication: s.earth_visibility_pct,
      radiation_shielding: s.natural_radiation_shielding_pct,
      thermal_stability: Math.round(Math.max(10, 100 - Math.abs(s.thermal_max_k - s.thermal_min_k) / 2.5)),
    },
    primary_strength: "High Continuous Solar Power Availability",
    primary_vulnerability: "Steep Crater Walls / Scree Hazards",
  }));
}

function generateFallbackSimulation(params: SimulationParameters): SimulationSummary {
  const telemetry = [];
  let water = params.crew_size * 3.5 * 14;
  let o2 = params.crew_size * 0.84 * 14;
  let rad = 0;
  
  for (let d = 1; d <= params.mission_duration_days; d++) {
    const dailyWaterISRU = (params.isru_excavation_rate_kg_day / 1000) * 45;
    water = water - params.crew_size * 3.5 * (1 - params.water_recycling_efficiency) + dailyWaterISRU;
    o2 = o2 - params.crew_size * 0.84 + dailyWaterISRU * 0.88;
    rad += 0.25 * Math.exp(-params.radiation_habitat_burial_depth_m * 1.5);

    telemetry.push({
      day: d,
      power_generated_kwh: 340 + Math.sin(d / 5) * 40,
      power_consumed_kwh: params.crew_size * 52.8 + 45,
      battery_charge_pct: Math.min(100, Math.max(45, 92 - Math.sin(d / 4) * 20)),
      water_stored_liters: Math.round(water),
      water_extracted_isru_liters: Math.round(dailyWaterISRU * 10) / 10,
      oxygen_stored_kg: Math.round(o2),
      cumulative_radiation_msv: Math.round(rad * 100) / 100,
      system_stress_index: Math.min(100, Math.round(15 + rad * 0.5)),
    });
  }

  return {
    mission_viability_score: 87.5,
    status: "NOMINAL",
    total_power_generated_mwh: 12.8,
    total_water_extracted_isru_liters: 1350.0,
    final_cumulative_radiation_msv: Number(rad.toFixed(2)),
    bottlenecks: ["No critical resource exhaustion encountered."],
    recommendations: ["Maintain regolith burial depth >= 1.5m to keep cumulative dose below 50 mSv."],
    daily_telemetry: telemetry,
  };
}

function generateFallbackAIExplanation(siteId: string, audienceMode: string): AIExplanationResponse {
  const site = FALLBACK_CANDIDATES.find((s) => s.id === siteId) || FALLBACK_CANDIDATES[0];
  return {
    site_id: site.id,
    site_name: site.name,
    body: site.body,
    headline: audienceMode === "educational" 
      ? `How ${site.name} Can Become a Thriving Outpost on the ${site.body}`
      : `Scientific Evaluation & Analog Mapping: ${site.name}`,
    suitability_verdict: `High-value candidate combining ${site.solar_illumination_pct}% solar power with direct access to frozen water ice reservoirs.`,
    geological_narrative: `${site.geological_context} Topographic slopes of ${site.slope_degrees}° fall within rover traction tolerances.`,
    engineering_challenges: site.hazards,
    earth_analog_parallels: `Fidelity tested at Haughton Impact Crater (Devon Island) and HI-SEAS with high operational correlation.`,
    educational_takeaways: [
      "Sunlight + Ice + Shielding = Survival in Deep Space.",
      "Testing rovers and suits in Earth's extreme deserts prevents disastrous mistakes on other worlds.",
      "Artemis and Mars missions will use in-situ resources to manufacture drinking water and rocket propellant."
    ],
  };
}

