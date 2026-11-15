"""Sourced context with deterministic audience-specific explanations (legacy API path retained)."""
from fastapi import APIRouter, HTTPException
from app.models.candidate import AIExplanationRequest, AIExplanationResponse
from app.scientific_engine.analog_matcher import analog_matcher
router = APIRouter()

@router.post("", response_model=AIExplanationResponse)
def generate_ai_explanation(req: AIExplanationRequest):
    site = analog_matcher.all_candidates.get(req.site_id)
    if not site: raise HTTPException(404, "Site not found")
    top = analog_matcher.find_best_analogs_for_site(req.site_id,1)[0]
    introductions = {
        "educational": "Start with what we know, then explore a what-if scenario.",
        "scientific": "Separate sourced observations from unvalidated engineering assumptions.",
        "executive": "Use this shortlist to prioritize further investigation, not authorize a mission."
    }
    return AIExplanationResponse(site_id=site['id'],site_name=site['name'],body=site['body'],
        headline=f"{site['name']}: evidence and open questions",
        suitability_verdict=introductions[req.audience_mode],
        geological_narrative=site['geological_context'],engineering_challenges=site['hazards'],
        earth_analog_parallels=f"The heuristic shortlist currently puts {top.analog_name} first. This is not a validated match or ground-truth proof.",
        educational_takeaways=[site['scientific_significance'],
          "Earth cannot reproduce planetary gravity, atmosphere and radiation together.",
          "Scenario scores and resource budgets are illustrative; source links support only their stated claims."],
        evidence=site.get('evidence',[]))
