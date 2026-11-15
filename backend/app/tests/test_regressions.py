import math
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.candidate import SimulationParameters, MCDAWeights
from app.scientific_engine.analog_matcher import analog_matcher
from app.scientific_engine.mission_physics import simulator_engine, OXYGEN_FRACTION
from app.scientific_engine.mcda_scoring import mcda_engine

client = TestClient(app, raise_server_exceptions=False)
SID='luna-shackleton-rim'

def simulate(site=SID, **kw):
    return simulator_engine.run_simulation(analog_matcher.all_candidates[site], SimulationParameters(site_id=site, **kw))

@pytest.mark.parametrize('extra',[
 {'mission_duration_days':0},{'mission_duration_days':3651},{'mission_duration_days':1.2},
 {'battery_capacity_kwh':0},{'battery_capacity_kwh':-1},{'crew_size':-4},{'crew_size':0},
 {'crew_size':21},{'crew_size':True},{'water_recycling_efficiency':1.5},
 {'water_recycling_efficiency':-.1},{'solar_panel_area_m2':-1},{'nuclear_output_kw':-1},
 {'power_system':'invalid'},{'radiation_habitat_burial_depth_m':-1},
 {'isru_excavation_rate_kg_day':-1},{'water_recycling_efficiency':'NaN'},
 {'battery_capacity_kwh':'Infinity'},{'unknown':1}])
def test_bad_requests(extra):
    assert client.post('/api/v1/simulator/run',json={'site_id':SID,**extra}).status_code==422

@pytest.mark.parametrize('weights',[{'illumination':-1},{'water_ice':'NaN'},dict.fromkeys(MCDAWeights.model_fields,0),{'unknown':1}])
def test_bad_weights(weights):
    assert client.post('/api/v1/analysis/mcda',json=weights).status_code==422

@pytest.mark.parametrize('sid',list(analog_matcher.all_candidates))
def test_conservation_and_failures(sid):
    s=simulate(sid)
    water,oxygen=s.initial_water_liters,s.initial_oxygen_kg
    battery=s.parameters.battery_capacity_kwh
    for d in s.daily_telemetry:
        assert d.water_stored_liters == pytest.approx(water+d.water_extracted_isru_liters-d.water_consumed_net_liters-d.electrolysis_feedwater_liters,abs=1e-7)
        assert d.oxygen_produced_kg == pytest.approx(d.electrolysis_feedwater_liters*OXYGEN_FRACTION)
        assert d.oxygen_stored_kg == pytest.approx(oxygen+d.oxygen_produced_kg-(s.parameters.crew_size*.84-d.oxygen_deficit_kg),abs=1e-7)
        assert d.power_consumed_kwh <= battery+d.power_generated_kwh+1e-7
        assert min(d.water_stored_liters,d.oxygen_stored_kg,d.battery_charge_pct)>=0
        assert 0<=d.battery_charge_pct<=100
        water,oxygen=d.water_stored_liters,d.oxygen_stored_kg
        battery=d.battery_charge_pct/100*s.parameters.battery_capacity_kwh
    assert s.total_power_generated_mwh==pytest.approx(sum(x.power_generated_kwh for x in s.daily_telemetry)/1000)
    assert s.total_water_extracted_isru_liters==pytest.approx(sum(x.water_extracted_isru_liters for x in s.daily_telemetry))
    if any(d.oxygen_deficit_kg>1e-8 or d.water_deficit_liters>1e-8 or d.power_deficit_kwh>1e-8 for d in s.daily_telemetry):
        assert s.status=='CRITICAL' and s.mission_viability_score<55 and s.first_failure_day

def test_no_mining_cannot_report_nominal_forever():
    s=simulate(isru_excavation_rate_kg_day=0,water_recycling_efficiency=0,mission_duration_days=120)
    assert s.status=='CRITICAL'
    assert any(d.oxygen_deficit_kg>0 for d in s.daily_telemetry)
    assert any('oxygen' in b for b in s.bottlenecks)

def test_power_modes_and_zero_generation():
    args=dict(mission_duration_days=1)
    nuclear=simulate(power_system='nuclear_kilopower',**args).daily_telemetry[0].power_generated_kwh
    solar=simulate(power_system='solar_battery',**args).daily_telemetry[0].power_generated_kwh
    hybrid=simulate(power_system='hybrid',**args).daily_telemetry[0].power_generated_kwh
    assert nuclear==240
    assert hybrid==pytest.approx(nuclear+solar)
    zero=simulate(solar_panel_area_m2=0,nuclear_output_kw=0)
    assert zero.total_power_generated_mwh==0 and zero.status=='CRITICAL'

def test_solar_factor_never_exceeds_one():
    s=simulate('luna-malapert-mountain',power_system='solar_battery')
    limit=1361*350*.28*24/1000
    assert max(d.power_generated_kwh for d in s.daily_telemetry)<=limit

def test_metrics_agree_and_ties_neutral():
    ranks=client.post('/api/v1/analysis/mcda?body=Moon',json={}).json()
    benches={x['id']:x for x in client.get('/api/v1/analysis/benchmarks?body=Moon').json()}
    for r in ranks: assert r['dimension_scores']['trafficability']==benches[r['site_id']]['metrics']['flatness_trafficability']
    one=mcda_engine.evaluate_sites([analog_matcher.all_candidates[SID]],MCDAWeights())
    assert one[0].closeness_score==.5

def test_catalog_and_source_contract():
    sites=client.get('/api/v1/candidates').json(); assert len(sites)==9
    assert len(client.get('/api/v1/analogs').json())==6
    for s in sites:
        assert s['evidence'] and 'illustrative' in s['data_status'].lower()
    assert client.get('/api/v1/candidates?body=Jupiter').status_code==422
    assert client.post('/api/v1/analysis/mcda?body=Jupiter',json={}).status_code==422
    assert client.post('/api/v1/simulator/run',json={'site_id':'missing'}).status_code==404

def test_mars_briefing_not_lunar_template():
    for mode in ['educational','scientific','executive']:
        r=client.post('/api/v1/explain',json={'site_id':'mars-jezero-crater','audience_mode':mode})
        assert r.status_code==200 and r.json()['evidence']
        assert 'Without an atmosphere' not in r.text and 'Tier-1' not in r.text and 'satisfies NASA' not in r.text

def test_short_and_max_runs():
    for days in [1,3650]:
        s=simulate(mission_duration_days=days)
        assert len(s.daily_telemetry)==days
        assert math.isfinite(s.final_cumulative_radiation_msv)

def test_newer_resource_and_health_routes_preserved():
    assert client.get('/health').json()['status']=='ok'
    resources=client.get('/api/v1/resources').json()
    ids={x['id'] for x in resources}
    assert len(ids)==8 and {'lro-diviner','mro-sharad','jaxa-selene'} <= ids
    for site in client.get('/api/v1/candidates').json():
        p=site['data_provenance']
        assert p['confidence']=='unverified'
        assert {s['id'] for s in p['sources']} <= ids
        assert site['evidence']

def test_newer_response_fields_preserved():
    matches=client.get('/api/v1/analogs/match/'+SID).json()
    assert all(x['comparison_status']=='assumption_based' and x['limitations'] and x['confidence']=='unverified' for x in matches)
    s=client.post('/api/v1/simulator/run',json={'site_id':SID,'mission_duration_days':1}).json()
    assert s['execution_mode']=='server' and s['warnings'] and s['parameters']['site_id']==SID

def test_newer_input_ranges_preserved():
    p=SimulationParameters(site_id=SID,mission_duration_days=3650,solar_panel_area_m2=100000,isru_excavation_rate_kg_day=100000,radiation_habitat_burial_depth_m=20)
    assert p.mission_duration_days==3650
