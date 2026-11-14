import math
from typing import Tuple, Dict, Any

# Planetary radii in kilometers
R_MOON_KM = 1737.4
R_MARS_KM = 3389.5
R_EARTH_KM = 6371.0

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float, body: str = "Moon") -> float:
    """
    Computes Great-Circle distance (km) between two coordinates on Moon, Mars, or Earth.
    """
    radius = R_MOON_KM if body.lower() == "moon" else (R_MARS_KM if body.lower() == "mars" else R_EARTH_KM)
    
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    
    return round(radius * c, 2)

def calculate_traverse_difficulty(dist_km: float, slope_degrees: float) -> Dict[str, Any]:
    """
    Assesses rover traverse difficulty and estimated battery consumption.
    """
    work_factor = 1.0 + (slope_degrees / 15.0) ** 1.5
    estimated_speed_kmh = max(1.5, 8.0 - (slope_degrees * 0.4))
    traverse_time_hours = round(dist_km / estimated_speed_kmh, 2)
    estimated_kwh = round(dist_km * 0.45 * work_factor, 2)

    return {
        "distance_km": dist_km,
        "estimated_duration_hours": traverse_time_hours,
        "estimated_power_kwh": estimated_kwh,
        "slope_degrees": slope_degrees,
        "traverse_feasibility": "HIGH" if slope_degrees < 10 else ("MODERATE" if slope_degrees < 18 else "HAZARDOUS")
    }

