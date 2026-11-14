from app.scientific_engine.analog_matcher import analog_matcher
from app.scientific_engine.mcda_scoring import mcda_engine
from app.scientific_engine.mission_physics import simulator_engine
from app.models.candidate import MCDAWeights, SimulationParameters
from app.geospatial_engine.coordinates import haversine_distance, calculate_traverse_difficulty

def test_analog_matcher():
    results = analog_matcher.find_best_analogs_for_site("luna-shackleton-rim", top_k=3)
    assert len(results) > 0
    top = results[0]
    assert top.overall_similarity_pct > 70.0
    print(f"Analog Match Passed: Top match for Shackleton is {top.analog_name} ({top.overall_similarity_pct}%)")

def test_mcda_scoring():
    sites = analog_matcher.lunar_sites
    weights = MCDAWeights(illumination=0.3, water_ice=0.3, slope_trafficability=0.1, earth_communication=0.1, radiation_shielding=0.1, thermal_stability=0.1)
    results = mcda_engine.evaluate_sites(sites, weights)
    assert len(results) == len(sites)
    assert results[0].rank == 1
    print(f"MCDA Passed: Top ranked lunar site is {results[0].site_name} (Closeness: {results[0].closeness_score})")

def test_mission_simulator():
    site = analog_matcher.all_candidates["luna-shackleton-rim"]
    params = SimulationParameters(
        site_id="luna-shackleton-rim",
        mission_duration_days=30,
        crew_size=4,
        power_system="hybrid"
    )
    summary = simulator_engine.run_simulation(site, params)
    assert len(summary.daily_telemetry) == 30
    assert summary.mission_viability_score > 0
    print(f"Simulator Passed: Viability score {summary.mission_viability_score}, Status: {summary.status}")

def test_geospatial():
    dist = haversine_distance(-89.9, 0.0, -85.99, 2.93, body="Moon")
    assert dist > 100.0 # ~120 km
    diff = calculate_traverse_difficulty(15.0, 8.5)
    assert diff["traverse_feasibility"] == "HIGH"
    print(f"Geospatial Passed: Distance = {dist} km, Traverse time = {diff['estimated_duration_hours']}h")

if __name__ == "__main__":
    test_analog_matcher()
    test_mcda_scoring()
    test_mission_simulator()
    test_geospatial()
    print("ALL SCIENTIFIC ENGINE UNIT TESTS PASSED!")

