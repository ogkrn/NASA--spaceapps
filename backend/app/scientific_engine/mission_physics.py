import math
from typing import Dict, Any, List
from app.models.candidate import SimulationParameters, SimulationSummary, SimulationDayTelemetry

class MissionSimulatorEngine:
    def run_simulation(self, site: Dict[str, Any], params: SimulationParameters) -> SimulationSummary:
        days = params.mission_duration_days
        crew = params.crew_size

        # Environmental constants
        body = site.get("body", "Moon")
        is_moon = (body == "Moon")
        
        # Solar flux at site (W/m2)
        solar_flux = site.get("isru_potential", {}).get("solar_flux_w_m2", 1361 if is_moon else 590)
        illumination_pct = site.get("solar_illumination_pct", 50.0) / 100.0
        
        # Base daily requirements per astronaut:
        # - Water: 3.5 liters/day
        # - Oxygen: 0.84 kg/day
        # - Food: 0.62 kg dry calories/day
        daily_crew_water_consumption = crew * 3.5
        daily_crew_oxygen_consumption = crew * 0.84

        # Initial stockpiles (for 14 days emergency contingency)
        initial_water = daily_crew_water_consumption * 18.0
        initial_oxygen = daily_crew_oxygen_consumption * 18.0
        
        water_stored = initial_water
        oxygen_stored = initial_oxygen
        
        battery_kwh = params.battery_capacity_kwh
        max_battery_kwh = params.battery_capacity_kwh
        
        # Radiation attenuation by habitat burial depth:
        # Using regolith attenuation factor I = I_0 * exp(-depth * 1.8)
        # Plus natural site shielding
        natural_shield = site.get("natural_radiation_shielding_pct", 10.0) / 100.0
        burial_shield = min(0.98, 1.0 - math.exp(-params.radiation_habitat_burial_depth_m * 1.6))
        effective_shielding = min(0.995, natural_shield + (1.0 - natural_shield) * burial_shield)

        # Baseline daily surface dose equivalent:
        # Deep space GCR: ~1.5 mSv/day (Moon), ~0.7 mSv/day (Mars surface due to thin atmosphere)
        base_gcr_msv_day = 1.4 if is_moon else 0.65
        daily_radiation_dose = base_gcr_msv_day * (1.0 - effective_shielding)
        cumulative_radiation = 0.0

        daily_telemetry: List[SimulationDayTelemetry] = []
        total_power_gen_kwh = 0.0
        total_water_isru_liters = 0.0

        water_shortage_detected = False
        oxygen_shortage_detected = False
        power_blackout_detected = False
        excessive_radiation_detected = False

        # Regolith extraction rate from site
        water_extract_rate = site.get("isru_potential", {}).get("water_extraction_rate_kg_per_ton", 20.0)
        isru_ton_per_day = params.isru_excavation_rate_kg_day / 1000.0
        potential_daily_isru_water = isru_ton_per_day * water_extract_rate # liters of water

        for day in range(1, days + 1):
            # Calculate solar diurnal cycle / fluctuation
            # Polar moon sites have high continuous light, but slight topography shadow variation
            if is_moon and site.get("region") == "South Pole":
                diurnal_factor = max(0.2, illumination_pct + 0.15 * math.sin(day * 2 * math.pi / 29.5))
            elif is_moon:
                # Equatorial / mid-latitude moon: 14 days light, 14 days night
                lunar_phase = (day % 29.5) / 29.5
                diurnal_factor = 1.0 if lunar_phase < 0.5 else 0.0
            else:
                # Mars: 24.6h sol with seasonal dust optical depth
                dust_factor = 0.90 + 0.05 * math.sin(day / 20.0)
                diurnal_factor = 0.55 * dust_factor # daytime average

            # Power Generation (kWh/day)
            solar_pv_efficiency = 0.28
            # kWh = W/m2 * m2 * eff * diurnal_factor * 24h / 1000
            solar_power_kwh = (
                (solar_flux * params.solar_panel_area_m2 * solar_pv_efficiency * diurnal_factor * 24.0) / 1000.0
                if params.power_system in ["solar_battery", "hybrid"]
                else 0.0
            )

            nuclear_power_kwh = params.nuclear_output_kw * 24.0 if params.power_system in ["nuclear_kilopower", "hybrid"] else 0.0

            total_power_day = solar_power_kwh + nuclear_power_kwh
            total_power_gen_kwh += total_power_day

            # Power Consumption (kWh/day)
            # Base life support: 2.2 kW per astronaut * 24 = 52.8 kWh/crew/day
            # Thermal regulation: higher if large delta T
            thermal_delta = abs(site.get("thermal_max_k", 250) - site.get("thermal_min_k", 150))
            thermal_power_kwh = (thermal_delta / 100.0) * 45.0
            
            # ISRU operational power (approx 12 kWh per metric ton processed)
            isru_power_kwh = isru_ton_per_day * 14.0

            power_consumed_day = (crew * 52.8) + thermal_power_kwh + isru_power_kwh

            # Battery balance
            power_net = total_power_day - power_consumed_day
            battery_kwh += power_net
            if battery_kwh > max_battery_kwh:
                battery_kwh = max_battery_kwh
            elif battery_kwh < 0:
                battery_kwh = 0
                power_blackout_detected = True

            battery_pct = round((battery_kwh / max_battery_kwh) * 100, 1)

            # Water and Oxygen loop balance
            recycled_water = daily_crew_water_consumption * params.water_recycling_efficiency
            net_crew_water_loss = daily_crew_water_consumption - recycled_water
            oxygen_consumed = daily_crew_oxygen_consumption
            
            # ISRU addition (only if sufficient power available)
            daily_isru_water = potential_daily_isru_water if battery_pct > 20 else 0.0
            total_water_isru_liters += daily_isru_water
            
            # Water used for electrolysis is not available for potable reserve.
            potential_oxygen = daily_isru_water * 0.88
            oxygen_regenerated = min(oxygen_consumed * 1.1, potential_oxygen)
            water_for_oxygen = oxygen_regenerated / 0.88 if oxygen_regenerated else 0.0
            water_stored = water_stored - net_crew_water_loss + daily_isru_water - water_for_oxygen
            if water_stored <= 0:
                water_stored = 0
                water_shortage_detected = True

            # Oxygen balance (electrolysis of water or ilmenite)
            oxygen_stored = oxygen_stored - oxygen_consumed + min(oxygen_consumed * 1.1, oxygen_regenerated)
            if oxygen_stored < 0:
                oxygen_stored = 0
                oxygen_shortage_detected = True

            # Radiation accumulation
            # Random Solar Particle Event (SPE) probability check
            spe_spike = 4.5 * (1.0 - effective_shielding) if day in [14, 42] else 0.0
            cumulative_radiation += (daily_radiation_dose + spe_spike)
            if cumulative_radiation > 100.0:
                excessive_radiation_detected = True

            # Stress index calculation (0-100)
            stress = 0.0
            if battery_pct < 25:
                stress += (25 - battery_pct) * 1.8
            if water_stored < (initial_water * 0.4):
                stress += 35.0
            if cumulative_radiation > 50.0:
                stress += (cumulative_radiation - 50.0) * 0.5
            stress = min(100.0, stress)

            daily_telemetry.append(
                SimulationDayTelemetry(
                    day=day,
                    power_generated_kwh=round(total_power_day, 1),
                    power_consumed_kwh=round(power_consumed_day, 1),
                    battery_charge_pct=battery_pct,
                    water_stored_liters=round(water_stored, 1),
                    water_extracted_isru_liters=round(daily_isru_water, 2),
                    oxygen_stored_kg=round(oxygen_stored, 1),
                    cumulative_radiation_msv=round(cumulative_radiation, 2),
                    system_stress_index=round(stress, 1)
                )
            )

        # Viability Score calculation
        viability = 100.0
        if power_blackout_detected:
            viability -= 35.0
        if water_shortage_detected:
            viability -= 40.0
        if oxygen_shortage_detected:
            viability -= 45.0
        if excessive_radiation_detected:
            viability -= 20.0
        
        # Penalize low remaining battery or water
        final_bat = daily_telemetry[-1].battery_charge_pct
        if final_bat < 50:
            viability -= (50 - final_bat) * 0.3

        viability_score = round(max(5.0, min(99.0, viability)), 1)
        
        if viability_score >= 80:
            status = "NOMINAL"
        elif viability_score >= 55:
            status = "MARGINAL"
        else:
            status = "CRITICAL"

        # Generate bottlenecks & recommendations
        bottlenecks = []
        recommendations = []

        if power_blackout_detected or final_bat < 30:
            bottlenecks.append(f"Power storage deficit: Battery SoC fell below critical minimum during night cycle.")
            recommendations.append("Increase battery capacity to >= 600 kWh or deploy continuous 10-kWe Kilopower fission reactor.")
        
        if water_shortage_detected or water_stored < initial_water * 0.5:
            bottlenecks.append("Negative water balance: ISRU extraction rate insufficient to offset non-recycled metabolic loss.")
            recommendations.append("Upgrade closed-loop water recovery to >= 95% efficiency (ECLSS upgrade) or increase regolith mining tonnage.")

        if oxygen_shortage_detected:
            bottlenecks.append("Oxygen reserve exhausted during the simulated timeline.")
            recommendations.append(
                "Increase oxygen production capacity or imported reserve; the current configuration is not viable for this duration."
            )

        if cumulative_radiation > 60.0:
            bottlenecks.append(
                f"Project-defined radiation review level exceeded ({round(cumulative_radiation, 1)} mSv); "
                "this is not a universal NASA career limit."
            )
            recommendations.append(
                "Review habitat shielding with a radiation specialist and compare against mission-specific NASA limits."
            )

        if not bottlenecks:
            bottlenecks.append("No critical system failures encountered during simulated mission timeline.")
            recommendations.append("Mission configuration is well-dimensioned for sustained human presence. Ready for operational analog testing.")

        return SimulationSummary(
            mission_viability_score=viability_score,
            status=status,
            total_power_generated_mwh=round(total_power_gen_kwh / 1000.0, 2),
            total_water_extracted_isru_liters=round(total_water_isru_liters, 1),
            final_cumulative_radiation_msv=round(cumulative_radiation, 2),
            bottlenecks=bottlenecks,
            recommendations=recommendations,
            daily_telemetry=daily_telemetry
            ,execution_mode="server"
            ,warnings=[
                "Radiation review levels are project assumptions; compare against mission-specific NASA limits.",
                "Catalogue resource values require product-level validation before operational decisions.",
            ]
        )

simulator_engine = MissionSimulatorEngine()

