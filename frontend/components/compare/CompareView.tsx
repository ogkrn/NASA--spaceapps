"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CandidateSite, EarthAnalog, AnalogMatchResult } from "@/lib/types";
import { fetchAnalogs, fetchCandidates, matchAnalogsForSite } from "@/lib/api";
import { PlanetaryGlobe } from "@/components/3d/PlanetaryGlobe";
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  Globe2,
  Layers3,
  MapPin,
  Mountain,
  Thermometer,
  Waves,
} from "lucide-react";

interface CompareViewProps {
  initialBody: "Moon" | "Mars";
  initialSites: CandidateSite[];
}

type CompareNode = "thermal" | "terrain" | "geology" | "volatiles" | "operations";

const NODE_LABELS: Record<CompareNode, string> = {
  thermal: "Thermal environment",
  terrain: "Terrain and mobility",
  geology: "Geology and regolith",
  volatiles: "Water and volatiles",
  operations: "Field operations",
};

const OBSERVATION_SOURCES = [
  { label: "NASA EMIT L2B minerals", url: "https://lpdaac.usgs.gov/products/emitl2bminv001/", types: ["hyper_arid_canyon", "polar_crater"] },
  { label: "NASA SRTM elevation", url: "https://lpdaac.usgs.gov/products/srtmgl1v003/", types: ["hyper_arid_canyon", "lava_tube", "polar_crater"] },
  { label: "NASA HLS Landsat + Sentinel-2", url: "https://hls.gsfc.nasa.gov/", types: ["hyper_arid_canyon", "lava_tube", "permafrost_tundra"] },
  { label: "CSA RADARSAT data", url: "https://donnees-data.asc-csa.gc.ca/", types: ["polar_crater", "permafrost_tundra"] },
  { label: "ESA Copernicus Data Space", url: "https://dataspace.copernicus.eu/", types: ["hyper_arid_canyon", "lava_tube", "permafrost_tundra"] },
  { label: "JAXA G-Portal", url: "https://gportal.jaxa.jp/", types: ["polar_crater", "permafrost_tundra"] },
];

function targetValue(site: CandidateSite, node: CompareNode): string {
  switch (node) {
    case "thermal":
      return `${site.thermal_min_k}-${site.thermal_max_k} K`;
    case "terrain":
      return `${site.slope_degrees}° slope · ${site.elevation_m} m`;
    case "geology":
      return site.geological_context;
    case "volatiles":
      return `${site.water_ice_probability_pct}% ice screening value`;
    case "operations":
      return `${site.earth_visibility_pct}% Earth-visibility screening value`;
  }
}

function analogValue(analog: EarthAnalog, node: CompareNode): string {
  const profile = analog.environmental_similarity_profile;
  switch (node) {
    case "thermal":
      return `${analog.mean_temp_c}°C mean · ${Math.round(profile.temperature_extreme_score * 100)}% proxy`;
    case "terrain":
      return `${Math.round(profile.regolith_mechanics_score * 100)}% regolith proxy`;
    case "geology":
      return `${Math.round(profile.geological_fidelity_score * 100)}% geology proxy`;
    case "volatiles":
      return `${Math.round(profile.ice_volatile_relevance_score * 100)}% volatile proxy`;
    case "operations":
      return `${Math.round(profile.isolation_and_logistics_score * 100)}% operations proxy`;
  }
}

function analogScore(analog: EarthAnalog, node: CompareNode): number {
  const profile = analog.environmental_similarity_profile;
  switch (node) {
    case "thermal":
      return profile.temperature_extreme_score;
    case "terrain":
      return profile.regolith_mechanics_score;
    case "geology":
      return profile.geological_fidelity_score;
    case "volatiles":
      return profile.ice_volatile_relevance_score;
    case "operations":
      return profile.isolation_and_logistics_score;
  }
}

export function CompareView({ initialBody, initialSites }: CompareViewProps) {
  const [body, setBody] = useState<"Moon" | "Mars">(initialBody);
  const [sites, setSites] = useState<CandidateSite[]>(initialSites);
  const [site, setSite] = useState<CandidateSite | null>(initialSites[0] || null);
  const [analogs, setAnalogs] = useState<EarthAnalog[]>([]);
  const [matches, setMatches] = useState<AnalogMatchResult[]>([]);
  const [analog, setAnalog] = useState<EarthAnalog | null>(null);
  const [node, setNode] = useState<CompareNode>("geology");
  const [showSiteImage, setShowSiteImage] = useState(true);

  const SITE_IMAGES: Record<string, { image: string; title: string; source: string; sourceUrl: string }> = {
    "earth-devon-island": {
      image: "https://images-assets.nasa.gov/image/ARC-2007-ACD07-0170-005/ARC-2007-ACD07-0170-005~medium.jpg",
      title: "Haughton-Mars Project field site",
      source: "NASA Ames Research Center archive",
      sourceUrl: "https://archive.org/details/AILS-ACD07-0170-005",
    },
    "earth-hi-seas-mauna-loa": {
      image: "https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/150000/150697/maunaloa_oli2_2022336_lrg.jpg",
      title: "HI-SEAS / Mauna Loa volcanic flank",
      source: "NASA Earth Observatory",
      sourceUrl: "https://science.nasa.gov/earth/earth-observatory/living-the-lava-life-on-mauna-loa-150697/",
    },
    "earth-atacama-yungay": {
      image: "https://www.nasa.gov/wp-content/uploads/2023/03/3-img_8314.jpg",
      title: "Estación Yungay field operations",
      source: "NASA Atacama Rover Astrobiology Drilling Studies",
      sourceUrl: "https://www.nasa.gov/image-article/atacama-rover-astrobiology-drilling-studies-night-falls/",
    },
    "earth-svalbard-amase": {
      image: "https://upload.wikimedia.org/wikipedia/commons/5/59/LOCAD-PTS_Used_to_Analyze_Hot_Springs_on_AMASE_2004.JPG",
      title: "AMASE 2004 Svalbard field campaign",
      source: "NASA GSFC / Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:LOCAD-PTS_Used_to_Analyze_Hot_Springs_on_AMASE_2004.JPG",
    },
    "earth-lanzarote-geopark": {
      image: "https://upload.wikimedia.org/wikipedia/commons/1/10/Lanzarote_5_Luc_Viatour.jpg",
      title: "Cueva de los Verdes lava tube, Lanzarote",
      source: "Wikimedia Commons · Cueva de los Verdes",
      sourceUrl: "https://commons.wikimedia.org/wiki/Category:Cueva_de_los_Verdes",
    },
    "earth-mcmurdo-dry-valleys": {
      image: "https://images-assets.nasa.gov/image/PIA12461/PIA12461~medium.jpg",
      title: "Taylor and Wright Valleys, McMurdo Dry Valleys",
      source: "NASA/JPL ASTER image archive",
      sourceUrl: "https://www.jpl.nasa.gov/images/pia12461-dry-valleys-antarctica/",
    },
  };

  useEffect(() => {
    if (body === initialBody) {
      setSites(initialSites);
      setSite(initialSites[0] || null);
      return;
    }
    fetchCandidates(body).then((nextSites) => {
      setSites(nextSites);
      setSite(nextSites[0] || null);
    });
  }, [body, initialBody, initialSites]);

  useEffect(() => {
    fetchAnalogs().then(setAnalogs);
  }, []);

  useEffect(() => {
    if (!site) return;
    matchAnalogsForSite(site.id).then((nextMatches) => {
      setMatches(nextMatches);
      const topId = nextMatches[0]?.analog_id;
      const nextAnalog = analogs.find((item) => item.id === topId) || analogs[0] || null;
      setAnalog(nextAnalog);
    });
  }, [site, analogs]);

  useEffect(() => {
    setShowSiteImage(true);
  }, [analog?.id]);

  const selectedMatch = useMemo(
    () => matches.find((item) => item.analog_id === analog?.id),
    [analog, matches],
  );
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${analog?.latitude ?? 0},${analog?.longitude ?? 0}`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${analog?.latitude ?? 0},${analog?.longitude ?? 0}`;
  const mapBounds = `${(analog?.longitude ?? 0) - 0.12},${(analog?.latitude ?? 0) - 0.08},${(analog?.longitude ?? 0) + 0.12},${(analog?.latitude ?? 0) + 0.08}`;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(mapBounds)}&layer=mapnik&marker=${analog?.latitude ?? 0},${analog?.longitude ?? 0}`;
  const observationSources = OBSERVATION_SOURCES.filter((source) => source.types.includes(analog?.analog_type || ""));
  const siteImage = analog ? SITE_IMAGES[analog.id] : undefined;

  if (!site || !analog) {
    return <div className="rounded-2xl cyber-card p-10 text-sm text-slate-400">Loading comparison datasets...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-400">
            <Globe2 className="h-3.5 w-3.5" />
            Comparative analog console
          </div>
          <h1 className="mt-2 text-3xl font-black text-white">Target world vs Earth proving ground</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Select a lunar or Martian site on the left, then inspect the Earth location that can help test
            the relevant technology. Scores are transparent screening proxies, not proof of equivalence.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-amber-800/60 bg-amber-950/20 px-3 py-2 text-[10px] font-mono text-amber-300">
          <FlaskConical className="h-3.5 w-3.5" />
          Earth analogs support testing; they do not recreate another world
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-cyan-800/50 bg-space-950/70 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">Target world</div>
              <h2 className="text-xl font-bold text-white">{site.name}</h2>
            </div>
            <div className="flex rounded-lg border border-space-700 bg-black/30 p-1">
              {(["Moon", "Mars"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setBody(option)}
                  className={`rounded-md px-3 py-1 text-[11px] font-mono ${
                    body === option ? "bg-cyan-600/30 text-cyan-200" : "text-slate-500 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <select
            value={site.id}
            onChange={(event) => setSite(sites.find((item) => item.id === event.target.value) || site)}
            className="mb-3 w-full rounded-lg border border-space-700 bg-space-900 px-3 py-2 text-xs text-slate-200"
          >
            {sites.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <PlanetaryGlobe planet={body} sites={[site]} selectedSiteId={site.id} onSelectSite={setSite} compact />
          <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono">
            <div className="rounded-lg border border-space-800 bg-black/30 p-2"><span className="text-slate-500">Ice</span><strong className="block text-cyan-300">{site.water_ice_probability_pct}%</strong></div>
            <div className="rounded-lg border border-space-800 bg-black/30 p-2"><span className="text-slate-500">Slope</span><strong className="block text-emerald-300">{site.slope_degrees}°</strong></div>
            <div className="rounded-lg border border-space-800 bg-black/30 p-2"><span className="text-slate-500">Thermal</span><strong className="block text-amber-300">{site.thermal_min_k}-{site.thermal_max_k}K</strong></div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-800/50 bg-space-950/70 p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Earth proving ground</div>
              <h2 className="text-xl font-bold text-white">{analog.name}</h2>
              <div className="mt-1 flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3 w-3 text-emerald-400" />{analog.location}, {analog.country}</div>
            </div>
            <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 px-2 py-1 text-right">
              <div className="text-lg font-mono font-bold text-emerald-300">{selectedMatch?.overall_similarity_pct || Math.round(analogScore(analog, node) * 100)}%</div>
              <div className="text-[9px] uppercase text-emerald-400">proxy match</div>
            </div>
          </div>
          <select
            value={analog.id}
            onChange={(event) => setAnalog(analogs.find((item) => item.id === event.target.value) || analog)}
            className="mb-3 w-full rounded-lg border border-space-700 bg-space-900 px-3 py-2 text-xs text-slate-200"
          >
            {analogs.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <div className="relative overflow-hidden rounded-xl border border-space-800 bg-black">
            <iframe
              title={`OpenStreetMap view of ${analog.name}`}
              src={mapEmbedUrl}
              className="h-[320px] w-full border-0"
              loading="lazy"
            />
            <div className="flex items-center justify-between gap-3 border-t border-space-800 bg-space-950 px-3 py-2 text-[10px] font-mono">
              <span className="text-emerald-300">REAL MAP DATA · OpenStreetMap · marker at catalogue coordinates</span>
              <a href={mapUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">Open full map <ExternalLink className="inline h-3 w-3" /></a>
            </div>
          </div>
          {siteImage && (
            <div className="mt-3 overflow-hidden rounded-xl border border-emerald-900/60 bg-black/40">
              <div className="flex items-center justify-between gap-3 border-b border-emerald-900/50 px-3 py-2">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300">Exact-site image</div>
                  <div className="text-xs text-slate-300">{siteImage.title}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSiteImage((visible) => !visible)}
                  className="rounded-md border border-emerald-800 px-2 py-1 text-[10px] font-mono text-emerald-300 hover:bg-emerald-950/60"
                >
                  {showSiteImage ? "Hide image" : "Show image"}
                </button>
              </div>
              {showSiteImage && (
                <a href={siteImage.sourceUrl} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={siteImage.image}
                    alt={`${siteImage.title}, ${analog.location}, ${analog.country}`}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="flex items-center justify-between gap-3 px-3 py-2 text-[10px] text-slate-400">
                    <span>{siteImage.source}</span>
                    <span className="text-emerald-300">Open source page <ExternalLink className="inline h-3 w-3" /></span>
                  </div>
                </a>
              )}
            </div>
          )}
          <div className="mt-3 rounded-xl border border-cyan-900/50 bg-cyan-950/10 p-3">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-cyan-300">
              <Layers3 className="h-3.5 w-3.5" /> Earth observation products to inspect
            </div>
            <p className="mt-1 text-[11px] text-slate-400">These links point to real satellite data portals. The prototype does not claim to have downloaded or processed the products yet.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {observationSources.map((source) => (
                <a key={source.label} href={source.url} target="_blank" rel="noreferrer" className="rounded-md border border-cyan-900/70 px-2 py-1 text-[10px] text-cyan-200 hover:bg-cyan-950/60">
                  {source.label} <ExternalLink className="inline h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-emerald-800 px-3 py-1.5 text-[11px] font-mono text-emerald-300 hover:bg-emerald-950/50">Open exact map point <ExternalLink className="h-3 w-3" /></a>
            <a href={streetViewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-space-700 px-3 py-1.5 text-[11px] font-mono text-slate-300 hover:border-emerald-700">Street view if available <ArrowUpRight className="h-3 w-3" /></a>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-space-700/80 bg-space-950/80 p-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">Comparison dashboard</div>
            <h2 className="mt-1 text-xl font-bold text-white">Click a node to compare one mission factor</h2>
            <p className="mt-1 text-xs text-slate-400">The Earth percentage is the analog profile proxy for the selected factor.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(NODE_LABELS) as CompareNode[]).map((key) => (
              <button key={key} onClick={() => setNode(key)} className={`rounded-lg border px-3 py-2 text-[11px] font-mono transition ${node === key ? "border-cyan-500 bg-cyan-950/60 text-cyan-200" : "border-space-700 text-slate-400 hover:text-white"}`}>
                {NODE_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-cyan-900/60 bg-cyan-950/20 p-4">
            <div className="text-[10px] uppercase text-cyan-300">Target: {site.name}</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{targetValue(site, node)}</p>
          </div>
          <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-4">
            <div className="text-[10px] uppercase text-emerald-300">Earth: {analog.name}</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{analogValue(analog, node)}</p>
            <div className="mt-3 h-2 rounded-full bg-black/50"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${analogScore(analog, node) * 100}%` }} /></div>
          </div>
          <div className="rounded-xl border border-space-800 bg-black/20 p-4">
            <div className="flex items-center gap-1.5 text-[10px] uppercase text-slate-400"><CheckCircle2 className="h-3.5 w-3.5 text-amber-300" /> Why this matters</div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">{selectedMatch?.scientific_rationale || analog.summary}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300"><Mountain className="h-3.5 w-3.5 text-emerald-400" />Place description and materials</div>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">{analog.geological_features.map((feature) => <li key={feature}>• {feature}</li>)}</ul>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300"><Waves className="h-3.5 w-3.5 text-cyan-400" />Test activities</div>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">{analog.nasa_mission_testing.map((activity) => <li key={activity}>• {activity}</li>)}</ul>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-space-800 pt-3 text-[10px] font-mono text-amber-300"><Thermometer className="h-3.5 w-3.5" />Screening comparison only: validate minerals, soil mechanics, temperature, and site imagery against the linked source data before mission decisions.</div>
      </section>
    </div>
  );
}
