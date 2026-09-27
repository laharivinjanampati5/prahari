import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel } from "@/components/site/PageHeader";
import { IndiaMap } from "@/components/site/IndiaMap";
import { REGIONS } from "@/lib/weather-data";
import { meta } from "@/lib/seo";

export const Route = createFileRoute("/weight-maps")({
  head: () => meta("Model Weight Maps", "Which model — NWP or AI/ML — is most reliable for each Indian region, lead time, season and weather regime."),
  component: WeightMaps,
});

const LEADS = ["Day 1–3", "Day 4–7", "Day 8–10"];
const SEASONS = ["JJAS Monsoon", "DJF Winter", "Pre-monsoon (MAM)"];
const REGIMES = ["All", "Cyclone", "Heatwave", "Cold wave"];
const MODELS = ["NEPS-G", "NCUM", "GraphCast", "Pangu", "FuXi", "AIFS"];

const TREND = Array.from({ length: 12 }, (_, k) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][k],
  "NWP weight": +(0.55 - Math.sin(k / 2) * 0.12).toFixed(2),
  "AI/ML weight": +(0.45 + Math.sin(k / 2) * 0.12).toFixed(2),
}));

function Seg({ opts, v, set, label }: { opts: string[]; v: string; set: (s: string) => void; label: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="flex flex-wrap rounded-md border border-border" role="group" aria-label={label}>
        {opts.map((o) => (
          <button key={o} aria-pressed={v === o} onClick={() => set(o)} className={`px-3 py-1.5 text-xs font-medium ${v === o ? "bg-primary text-primary-foreground" : ""}`}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function WeightMaps() {
  const [lead, setLead] = useState<string>(LEADS[0]!);
  const [season, setSeason] = useState<string>(SEASONS[0]!);
  const [regime, setRegime] = useState<string>(REGIMES[0]!);
  const seed = LEADS.indexOf(lead) * 1.7 + SEASONS.indexOf(season) * 0.9 + REGIMES.indexOf(regime) * 0.5 + 3;

  return (
    <>
      <PageHeader eyebrow="Model Weight Maps" title="Which model is reliable where?">
        Each grid cell shows the learned blend weight between physics-based NWP (blue) and AI/ML models (saffron), stratified by lead time, season and weather regime.
      </PageHeader>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap gap-6">
          <Seg label="Lead time" opts={LEADS} v={lead} set={setLead} />
          <Seg label="Season" opts={SEASONS} v={season} set={setSeason} />
          <Seg label="Weather regime" opts={REGIMES} v={regime} set={setRegime} />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-md border border-border">
              <IndiaMap fieldMode={{ seed, colors: ["var(--primary)", "var(--saffron)"], opacity: 0.9 }} showAnomalies={false} cellDeg={0.75} className="h-auto w-full" />
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>NWP dominant</span>
              <span className="h-2 w-40 rounded" style={{ background: "linear-gradient(90deg, var(--primary), var(--saffron))" }} />
              <span>AI/ML dominant</span>
            </div>
          </div>
          <Panel title={`Regional weights · ${lead}`}>
            <table className="w-full text-xs">
              <thead><tr className="text-left text-muted-foreground"><th className="py-1">Region</th><th>Best model</th><th className="text-right">AI/ML w</th></tr></thead>
              <tbody>
                {REGIONS.map((r, k) => {
                  const w = ((Math.sin(seed + k * 1.3) + 1) / 2).toFixed(2);
                  const best = MODELS[Math.floor((seed * 3 + k * 5)) % MODELS.length];
                  return (
                    <tr key={r} className="border-t border-border">
                      <td className="py-1.5">{r}</td><td className="font-semibold">{best}</td><td className="text-right font-mono">{w}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Panel>
        </div>
        <Panel title="Historical weight trends (2025, all-India mean)">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" fontSize={12} /><YAxis domain={[0, 1]} fontSize={12} /><Tooltip /><Legend />
                <Line dataKey="NWP weight" stroke="var(--primary)" strokeWidth={2} />
                <Line dataKey="AI/ML weight" stroke="var(--saffron)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </>
  );
}
