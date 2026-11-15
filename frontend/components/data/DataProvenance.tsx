"use client";

import React from "react";
import { ExternalLink, Info } from "lucide-react";
import { CandidateSite } from "@/lib/types";

const RESOURCES: Record<string, { name: string; url: string }> = {
  "lro-diviner": {
    name: "NASA LRO Diviner",
    url: "https://ode.rsl.wustl.edu/moon/indexProductSearch.aspx?display=full&mission=LRO&instrument=DIVINER",
  },
  "lro-lola": {
    name: "NASA LRO LOLA",
    url: "https://ode.rsl.wustl.edu/moon/indexProductSearch.aspx?display=full&mission=LRO&instrument=LOLA",
  },
  "mro-hirise": { name: "NASA MRO HiRISE", url: "https://hirise.lpl.arizona.edu/" },
  "mro-crism": { name: "NASA MRO CRISM", url: "https://crism.jhuapl.edu/" },
  "mro-sharad": { name: "NASA MRO SHARAD", url: "https://mars.nasa.gov/mro/mission/instruments/sharad/" },
  "nasa-pds": { name: "NASA PDS", url: "https://pds.nasa.gov/" },
};

export function DataProvenance({ site }: { site: CandidateSite }) {
  const provenance = site.data_provenance;
  if (!provenance) return null;

  return (
    <div className="mt-4 rounded-xl border border-space-700 bg-space-950/70 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          <Info className="h-3.5 w-3.5 text-cyan-400" />
          Resources for future verification
        </div>
        <span className="rounded border border-amber-800 bg-amber-950/40 px-2 py-0.5 text-[10px] font-mono text-amber-300">
          {provenance.confidence} inputs
        </span>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{provenance.note}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {provenance.sources.map((source) => {
          const resource = RESOURCES[source.id];
          if (!resource) return null;
          return (
            <a
              key={source.id}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded border border-cyan-900 bg-cyan-950/30 px-2 py-1 text-[10px] text-cyan-300 hover:border-cyan-500"
              title={`Fields to investigate (not extracted): ${source.fields.join(", ")}`}
            >
              {resource.name}
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
