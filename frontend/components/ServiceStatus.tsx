"use client";
import { useEffect, useState } from "react";
import { lastApiError, clearApiError } from "@/lib/api";
export function ServiceStatus() {
  const [error, setError] = useState("");
  useEffect(() => { setError(lastApiError); const update = (e: Event) => setError((e as CustomEvent<string>).detail); window.addEventListener("ares-api-error", update); return () => window.removeEventListener("ares-api-error", update); }, []);
  return <div className="max-w-7xl mx-auto w-full px-4 pt-4 space-y-3">
    <div className="rounded-xl border border-amber-700 bg-amber-950/40 p-3 text-sm text-amber-100"><strong>Evidence + what-if scenarios.</strong> Source links support the site descriptions. Engineering values, profile scores and resource budgets are illustrative assumptions, not measured NASA probabilities or mission approval.</div>
    {error && <div role="alert" className="rounded-xl border border-red-500 bg-red-950 p-4 text-white"><strong>Calculation unavailable. No substitute result was generated.</strong><p>{error}</p><div className="flex gap-4 mt-2"><button onClick={() => window.location.reload()} className="underline">Reconnect and reload</button><button onClick={clearApiError} className="underline">Dismiss notice</button></div></div>}
  </div>;
}
