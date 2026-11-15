"""Illustrative daily resource budget. Not mission certification or measured site performance.
All coefficients and site scenario defaults are disclosed in docs/SCIENTIFIC_METHODOLOGY.md.
"""
import math
from app.models.candidate import SimulationParameters, SimulationSummary, SimulationDayTelemetry

OXYGEN_FRACTION = 8 / 9
ELECTROLYSIS_KWH_PER_KG_O2 = 6.0  # scenario assumption, not calibrated hardware

class MissionSimulatorEngine:
    def run_simulation(self, site, params: SimulationParameters) -> SimulationSummary:
        params = SimulationParameters.model_validate(params.model_dump())
        crew = params.crew_size
        demand_water, demand_o2 = crew * 3.5, crew * .84
        water = initial_water = demand_water * 18
        oxygen = initial_oxygen = demand_o2 * 18
        battery = capacity = params.battery_capacity_kwh
        is_moon = site["body"] == "Moon"
        flux = site["isru_potential"]["solar_flux_w_m2"]
        illumination = site["solar_illumination_pct"] / 100
        natural = site["natural_radiation_shielding_pct"] / 100
        shield = min(.995, natural + (1-natural) * min(.98, 1-math.exp(-params.radiation_habitat_burial_depth_m*1.6)))
        cumulative_rad = total_gen = total_water = 0.0
        telemetry = []
        failures = set()
        first_failure = None
        for day in range(1, params.mission_duration_days+1):
            if is_moon and site.get("region") == "South Pole":
                light = min(1., max(0., illumination + .15*math.sin(day*2*math.pi/29.5)))
            elif is_moon:
                # Integrate the fraction of this Earth day inside the 29.5-day cycle.
                light = sum(((day-1+(h+.5)/24) % 29.5) < 29.5*illumination for h in range(24))/24
            else:
                light = illumination * (.90 + .05*math.sin(day/20))
            solar = flux*params.solar_panel_area_m2*.28*light*24/1000 if params.power_system in ("solar_battery","hybrid") else 0.
            nuclear = params.nuclear_output_kw*24 if params.power_system in ("nuclear_kilopower","hybrid") else 0.
            generation = solar+nuclear
            total_gen += generation
            available = battery+generation
            base_demand = crew*52.8 + abs(site["thermal_max_k"]-site["thermal_min_k"])*.45
            base_used = min(base_demand, available)
            power_deficit = base_demand-base_used
            available -= base_used
            # When power is insufficient, recycling is conservatively disabled.
            recovery = params.water_recycling_efficiency if power_deficit < 1e-9 else 0.
            net_water_demand = demand_water*(1-recovery)
            # Life support has priority. Mining is throttled to available energy.
            tons = min(params.isru_excavation_rate_kg_day/1000, available/14)
            mining_energy = tons*14
            available -= mining_energy
            extracted = tons*site["isru_potential"]["water_extraction_rate_kg_per_ton"]
            total_water += extracted
            water += extracted
            water_used = min(water, net_water_demand)
            water -= water_used
            water_deficit = net_water_demand-water_used
            # Produce replacement oxygen; subtract its feedwater and electrical energy.
            produced = min(demand_o2, water*OXYGEN_FRACTION, available/ELECTROLYSIS_KWH_PER_KG_O2)
            feedwater = produced/OXYGEN_FRACTION
            water -= feedwater
            electrolysis_energy = produced*ELECTROLYSIS_KWH_PER_KG_O2
            available -= electrolysis_energy
            oxygen += produced
            oxygen_used = min(oxygen, demand_o2)
            oxygen -= oxygen_used
            oxygen_deficit = demand_o2-oxygen_used
            battery = min(capacity, max(0., available))
            daily_dose = (1.4 if is_moon else .65)*(1-shield)
            # Fixed scenario events, not forecasts or random event probabilities.
            daily_dose += 4.5*(1-shield) if day in (14,42) else 0
            cumulative_rad += daily_dose
            today = []
            for label, value in (("power",power_deficit),("water",water_deficit),("oxygen",oxygen_deficit)):
                if value > 1e-8:
                    failures.add(label); today.append(label)
            if today and first_failure is None: first_failure = day
            stress = min(100., (100 if today else 0) + max(0.,25-battery/capacity*100)*1.8)
            telemetry.append(SimulationDayTelemetry(
                day=day, power_generated_kwh=generation,
                power_consumed_kwh=base_used+mining_energy+electrolysis_energy,
                power_deficit_kwh=power_deficit, battery_charge_pct=battery/capacity*100,
                water_stored_liters=max(0.,water), water_extracted_isru_liters=extracted,
                water_consumed_net_liters=water_used, electrolysis_feedwater_liters=feedwater,
                water_deficit_liters=water_deficit, oxygen_produced_kg=produced,
                oxygen_stored_kg=max(0.,oxygen), oxygen_deficit_kg=oxygen_deficit,
                cumulative_radiation_msv=cumulative_rad, system_stress_index=stress))
        low_reserves = battery < .25*capacity or water < demand_water*3 or oxygen < demand_o2*3
        dose_warning = cumulative_rad > 100  # project warning, NOT NASA career limit
        if failures:
            status, score = "CRITICAL", max(0.,49.-15*len(failures))
        elif low_reserves or dose_warning:
            status, score = "MARGINAL", 65.
        else:
            status, score = "NOMINAL", 90.
        bottlenecks = [f"Unmet {x} demand occurred; first resource failure on day {first_failure}." for x in sorted(failures)]
        recommendations = []
        if failures: recommendations.append("Revise resource and power inputs, then rerun; this scenario does not meet all modelled demands.")
        if low_reserves: bottlenecks.append("Final power or consumable reserve is low under the declared scenario.")
        if dose_warning: bottlenecks.append("Dose estimate exceeds the project's illustrative 100 mSv warning; this is not a NASA limit or compliance assessment.")
        if not bottlenecks: bottlenecks.append("No unmet demand in this simplified daily budget; intraday storage, food, reliability and field conditions are not validated.")
        if not recommendations: recommendations.append("Compare alternative assumptions and obtain engineering review; a nominal budget is not proof of mission safety.")
        return SimulationSummary(parameters=params, mission_viability_score=score, status=status,
            total_power_generated_mwh=total_gen/1000, total_water_extracted_isru_liters=total_water,
            final_cumulative_radiation_msv=cumulative_rad, bottlenecks=bottlenecks,
            recommendations=recommendations, daily_telemetry=telemetry, first_failure_day=first_failure,
            initial_water_liters=initial_water, initial_oxygen_kg=initial_oxygen,
            assumptions=["24-hour Earth-day budget; not an intraday/sol survival model.",
             "Site engineering quantities are illustrative scenario inputs, not measured NASA probabilities.",
             "Score is a categorical budget indicator, not a probability of survival.",
             "Radiation is an unvalidated shielding scenario with fixed events on days 14 and 42.",
             "3.5 L water and 0.84 kg oxygen per person per day; 18-day initial reserves; coefficients documented in methodology."])

simulator_engine = MissionSimulatorEngine()
