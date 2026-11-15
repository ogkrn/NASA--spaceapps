import { CandidateSite, EarthAnalog, AnalogMatchResult, MCDAWeights, MCDARankResult, SimulationParameters, SimulationSummary, AIExplanationResponse, ResourceRecord } from "./types";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/backend";
export let lastApiError = "";
function announce(message: string) {
  lastApiError = message;
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("ares-api-error", { detail: message }));
}
async function request<T>(path: string, body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(API_BASE + path, { method: body === undefined ? "GET" : "POST", cache: "no-store", signal: controller.signal,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
    if (!res.ok) {
      let detail = "";
      try { const data = await res.json(); detail = typeof data.detail === "string" ? data.detail : res.status === 422 ? "Invalid inputs. Check the allowed ranges." : ""; } catch { /* proxy errors may be HTML */ }
      throw new Error(`Request failed (${res.status}). ${detail}`);
    }
    const data = await res.json();
    // Failure notice persists until explicitly dismissed: another successful request
    // must not conceal a failed calculation in a different view.
    return data as T;
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError" ? "The API took too long to respond. Check the backend and retry." : error instanceof Error ? error.message : "API unavailable";
    announce(message); throw new Error(message);
  } finally { clearTimeout(timer); }
}
export function clearApiError() { announce(""); }
export const fetchCandidates = (body?: "Moon" | "Mars") => request<CandidateSite[]>(`/candidates${body ? `?body=${body}` : ""}`);
export const fetchAnalogs = () => request<EarthAnalog[]>("/analogs");
export const matchAnalogsForSite = (id: string) => request<AnalogMatchResult[]>(`/analogs/match/${encodeURIComponent(id)}`);
export const runMCDA = (weights: MCDAWeights, body?: "Moon" | "Mars") => request<MCDARankResult[]>(`/analysis/mcda${body ? `?body=${body}` : ""}`, weights);
export const runMissionSimulation = (params: SimulationParameters) => request<SimulationSummary>("/simulator/run", params);
export const fetchAIExplanation = (id: string, audience_mode: "scientific" | "educational" | "executive" = "scientific") => request<AIExplanationResponse>("/explain", { site_id: id, audience_mode });
export const fetchResources = () => request<ResourceRecord[]>("/resources");
