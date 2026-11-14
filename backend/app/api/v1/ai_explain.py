import json
from fastapi import APIRouter, HTTPException

from app.models.candidate import AIExplanationRequest, AIExplanationResponse
from app.scientific_engine.analog_matcher import analog_matcher
from app.config import settings

router = APIRouter()

def find_site(site_id: str):
    lunar_path = settings.DATA_DIR / "lunar_sites.json"
    mars_path = settings.DATA_DIR / "mars_sites.json"

    with open(lunar_path, "r", encoding="utf-8") as f:
        lunar = json.load(f)
    with open(mars_path, "r", encoding="utf-8") as f:
        mars = json.load(f)

    for s in lunar + mars:
        if s["id"] == site_id:
            return s
    return None

@router.post("", response_model=AIExplanationResponse)
def generate_ai_explanation(req: AIExplanationRequest):
    site = find_site(req.site_id)
    if not site:
        raise HTTPException(status_code=404, detail=f"Site with id '{req.site_id}' not found.")

    site_name = site["name"]
    body = site["body"]
    elevation = site["elevation_m"]
    slope = site["slope_degrees"]
    illum = site["solar_illumination_pct"]
    ice_prob = site["water_ice_probability_pct"]
    comm = site["earth_visibility_pct"]
    shielding = site["natural_radiation_shielding_pct"]
    
    # Get top matching analog
    matched_analogs = analog_matcher.find_best_analogs_for_site(req.site_id, top_k=1)
    top_analog = matched_analogs[0] if matched_analogs else None
    analog_mention = (
        f"Analogous conditions have been rigorously simulated at {top_analog.analog_name} ({top_analog.location}), "
        f"matching with a {top_analog.overall_similarity_pct}% fidelity profile."
        if top_analog else "No direct analog available."
    )

    if req.audience_mode == "educational":
        headline = f"Why {site_name} Could Be Humanity's Next Home on {body}"
        verdict = (
            f"A high-potential settlement candidate offering {round(illum)}% solar power access "
            f"and critical water ice proximity, balanced by extreme thermal cold and steep crater walls."
        )
        narrative = (
            f"Imagine standing on the rim of {site_name}. The sun hovers perpetually just above the jagged horizon, "
            f"casting shadows that stretch for miles into darkness. Inside those shadowy hollows lies frozen water ice "
            f"that has remained undisturbed for billions of years—water that future astronauts can drink, breathe as oxygen, "
            f"and split into rocket fuel to travel deeper into the cosmos."
        )
        challenges = [
            f"Bitter cold: Temperatures drop as low as {site['thermal_min_k']} K (-{round(273.15 - site['thermal_min_k'])}°C), brittle enough to snap ordinary steel.",
            f"Steep slopes ({slope}°): Rover navigation requires traction spikes and autonomous descent winches.",
            f"Space radiation: Without an atmosphere, astronauts need to cover their habitats with 2 meters of local dirt (regolith)."
        ]
        takeaways = [
            "Permanent bases need 3 things: energy (sunlight), water (ice in shadows), and shelter (radiation protection).",
            f"Earth test sites like {top_analog.analog_name if top_analog else 'Devon Island'} prove that astronauts can operate rovers and habitats in unforgiving environments before we launch.",
            "Living on the Moon is our stepping stone to surviving on Mars."
        ]
    elif req.audience_mode == "executive":
        headline = f"Strategic Outpost Assessment: {site_name} [{body}]"
        verdict = (
            f"Tier-1 Mission Candidate. Favorable trade-off between power generation ({illum}% illumination) "
            f"and volatile resource access ({ice_prob}% confidence). Earth link duty cycle is {comm}%."
        )
        narrative = (
            f"{site_name} satisfies NASA Artemis / Mars Architecture requirements for early infrastructure deployment. "
            f"Topography at {elevation}m elevation provides elevated telecommunications visibility while maintaining "
            f"short-baseline rover access to volatile-rich cold traps."
        )
        challenges = site["hazards"]
        takeaways = [
            "ROI: Substantially lower launch mass payload required by leveraging in-situ water (ISRU).",
            "Analog ground-truth validates robotic and human operational safety prior to flight.",
            "Next step: High-resolution stereo photogrammetry DEM and subsurface radar sounding."
        ]
    else: # scientific
        headline = f"Planetary Geology & Settlement Feasibility Analysis: {site_name}"
        verdict = (
            f"Quantitative MCDA evaluation demonstrates robust multi-attribute suitability. "
            f"High solar flux insolation coupled with cryogenic volatile proximity renders {site_name} "
            f"a primary scientific anchor for long-duration surface presence."
        )
        narrative = (
            f"{site['geological_context']} Spectroscopic and radar telemetry confirm {ice_prob}% confidence "
            f"in shallow subsurface volatiles. Slope morphology of {slope}° is within the static stability envelope "
            f"of lunar mobility systems (LTV/FPR), though localized scree fields necessitate cautious path planning."
        )
        challenges = site["hazards"]
        takeaways = [
            f"Natural radiation attenuation: {shielding}%. Augmented regolith overburden required for GCR mitigation.",
            f"Earth direct line-of-sight: {comm}%, mitigating relay satellite dependency during nominal operations.",
            f"Scientific return: In-situ sampling of pristine volatiles reveals solar system bombardment history."
        ]

    return AIExplanationResponse(
        site_id=site["id"],
        site_name=site_name,
        body=body,
        headline=headline,
        suitability_verdict=verdict,
        geological_narrative=narrative,
        engineering_challenges=challenges,
        earth_analog_parallels=analog_mention,
        educational_takeaways=takeaways
    )

