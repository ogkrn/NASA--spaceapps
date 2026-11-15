"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Database, ExternalLink, Info, Satellite } from "lucide-react";
import { fetchResources } from "@/lib/api";
import { ResourceRecord } from "@/lib/types";

const bundledCounts = { targetSites: 9, earthAnalogs: 6 };

export function ReferencesView() {
  const [resources, setResources] = useState<ResourceRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResources().then(setResources).catch((err) => setError(err instanceof Error ? err.message : "Unable to load resource registry."));
  }, []);

  const nasaCount = useMemo(
    () => resources.filter((resource) => resource.organization.toLowerCase().includes("nasa")).length,
    [resources],
  );
  const partnerCount = useMemo(
    () => resources.filter((resource) => !resource.organization.toLowerCase().includes("nasa")).length,
    [resources],
  );

  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-400">
          <Satellite className="h-3.5 w-3.5" />
          Source ledger and data accounting
        </div>
        <h1 className="mt-2 text-3xl font-black text-white">References & data used</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
          This page explains exactly what ARES-LUNA uses today, what is linked for verification, and what is
          not yet direct satellite-data ingestion. This prevents a reference link from being mistaken for a
          measurement used in the score.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-cyan-900/70 bg-cyan-950/20 p-4">
          <div className="text-[10px] uppercase text-cyan-300">NASA-linked records</div>
          <div className="mt-1 text-3xl font-mono font-bold text-white">{nasaCount}</div>
          <div className="text-[11px] text-slate-400">NASA resource families and products</div>
        </div>
        <div className="rounded-xl border border-emerald-900/70 bg-emerald-950/20 p-4">
          <div className="text-[10px] uppercase text-emerald-300">Partner records</div>
          <div className="mt-1 text-3xl font-mono font-bold text-white">{partnerCount}</div>
          <div className="text-[11px] text-slate-400">CSA, ESA, JAXA and related portals</div>
        </div>
        <div className="rounded-xl border border-space-700 bg-space-950/70 p-4">
          <div className="text-[10px] uppercase text-slate-300">Bundled catalogue</div>
          <div className="mt-1 text-3xl font-mono font-bold text-white">{bundledCounts.targetSites + bundledCounts.earthAnalogs}</div>
          <div className="text-[11px] text-slate-400">{bundledCounts.targetSites} target scenarios + {bundledCounts.earthAnalogs} Earth analogs</div>
        </div>
        <div className="rounded-xl border border-amber-900/70 bg-amber-950/20 p-4">
          <div className="text-[10px] uppercase text-amber-300">Direct measurements ingested</div>
          <div className="mt-1 text-3xl font-mono font-bold text-white">0</div>
          <div className="text-[11px] text-slate-400">Product-level NASA values are future work</div>
        </div>
      </section>

      <section className="rounded-2xl border border-space-700 bg-space-950/80 p-5">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Database className="h-4 w-4 text-cyan-400" /> How to interpret the numbers
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs leading-relaxed">
          <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <strong className="mt-2 block text-emerald-200">Source-backed context</strong>
            <p className="mt-1 text-slate-400">Mission, instrument, field-site and dataset descriptions are linked to official agency portals.</p>
          </div>
          <div className="rounded-xl border border-amber-900/60 bg-amber-950/20 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <strong className="mt-2 block text-amber-200">Illustrative scenario values</strong>
            <p className="mt-1 text-slate-400">Candidate-site engineering fields, analog proxy scores and mission budgets are bundled prototype assumptions.</p>
          </div>
          <div className="rounded-xl border border-cyan-900/60 bg-cyan-950/20 p-3">
            <Info className="h-4 w-4 text-cyan-400" />
            <strong className="mt-2 block text-cyan-200">Next ingestion step</strong>
            <p className="mt-1 text-slate-400">Add product ID, acquisition date, resolution, processing level, extracted values and uncertainty before using satellite measurements in ranking.</p>
          </div>
        </div>
      </section>

      {error ? (
        <p role="alert" className="rounded-xl border border-red-800 bg-red-950/30 p-4 text-sm text-red-200">{error}</p>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {resources.map((resource) => (
            <article key={resource.id} className="rounded-xl border border-space-700 bg-space-950/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">{resource.organization}</div>
                  <h2 className="mt-1 text-sm font-bold text-white">{resource.name}</h2>
                </div>
                <a href={resource.url} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-white" aria-label={`Open ${resource.name}`}>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-2 text-xs text-slate-300">{resource.role}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{resource.use_in_app}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
