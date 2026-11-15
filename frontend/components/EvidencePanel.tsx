import { CandidateSite } from "@/lib/types";
export function EvidencePanel({ site }: { site: CandidateSite }) {
 return <section className="rounded-xl border border-cyan-800 bg-space-900 p-4 space-y-2 text-sm" aria-label="Evidence and assumptions">
  <h3 className="font-bold text-cyan-200">What the sources establish</h3>
  <p>{site.geological_context}</p>
  <ul className="space-y-2">{site.evidence?.map((e) => <li key={e.url}><a href={e.url} target="_blank" rel="noopener noreferrer" className="underline text-cyan-300">{e.title} ↗</a><p className="text-slate-300">{e.claim}</p></li>)}</ul>
  <p className="text-amber-200">{site.data_status}</p><p className="text-slate-400">{site.measurement_notes}</p>
 </section>;
}
