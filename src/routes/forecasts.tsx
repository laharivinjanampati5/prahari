import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel } from "@/components/site/PageHeader";
import { IndiaMap, type FieldMode } from "@/components/site/IndiaMap";
import { SKILL_BY_LEAD, SKILL_TABLE, REGIONS } from "@/lib/weather-data";
import { meta } from "@/lib/seo";

export const Route = createFileRoute("/forecasts")({
  head: () => meta("Forecast Dashboard", "Rainfall, temperature, wind and extreme indicator forecasts with blended model skill, lead-time selector and EFI panel."),
  component: Forecasts,
});

const VARS = {
  rain: { label: "Rainfall", unit: "mm/day", colors: ["var(--secondary)", "var(--chart-1)"] },
  temp: { label: "Temperature", unit: "°C", colors: ["var(--chart-5)", "var(--chart-4)"] },
  wind: { label: "Wind", unit: "m/s", colors: ["var(--secondary)", "var(--chart-3)"] },
  efi: { label: "Extreme Indicators", unit: "EFI", colors: ["var(--card)", "var(--destructive)"] },
} as const;
type VarKey = keyof typeof VARS;
const LAYERS = ["Observed", "Blended forecast", "Ensemble spread"] as const;
const LEADS = [1, 3, 5, 7, 10];

function Forecasts() {
  const [v, setV] = useState<VarKey>("rain");
  const [layer, setLayer] = useState<(typeof LAYERS)[number]>("Blended forecast");
  const [lead, setLead] = useState(3);
  const seed = Object.keys(VARS).indexOf(v) * 2 + LAYERS.indexOf(layer) * 0.7 + lead * 0.35;
  const cfg = VARS[v];
  const fieldMode: FieldMode = {
    seed,
    colors: layer === "Ensemble spread" ? ["var(--card)", "var(--saffron)"] : [cfg.colors[0], cfg.colors[1]],
  };
  const skillBars = SKILL_TABLE.map((r) => ({ model: r.model.replace(" (SIH26078)", ""), RMSE: r.rmse, Bias: r.bias, Corr: r.corr }));

  return (
    <>
      <PageHeader eyebrow="Forecast Dashboard" title="Blended NWP + AI/ML Forecasts">Select a variable, map layer and lead time. Grid shown at 1° for low bandwidth; full 5 km fields are available via the API.</PageHeader>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div role="tablist" aria-label="Variable" className="flex flex-wrap gap-1 border-b border-border">
          {(Object.keys(VARS) as VarKey[]).map((k) => (
            <button key={k} role="tab" aria-selected={v === k} onClick={() => setV(k)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold ${v === k ? "border-saffron text-primary" : "border-transparent text-muted-foreground"}`}>
              {VARS[k].label}
            </button>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex rounded-md border border-border" role="group" aria-label="Map layer">
                {LAYERS.map((l) => (
                  <button key={l} aria-pressed={layer === l} onClick={() => setLayer(l)} className={`px-3 py-1.5 text-xs font-medium ${layer === l ? "bg-primary text-primary-foreground" : ""}`}>{l}</button>
                ))}
              </div>
              <div className="flex rounded-md border border-border" role="group" aria-label="Lead time">
                {LEADS.map((d) => (
                  <button key={d} aria-pressed={lead === d} onClick={() => setLead(d)} className={`px-3 py-1.5 text-xs font-medium ${lead === d ? "bg-accent text-accent-foreground" : ""}`}>Day {d}</button>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-md border border-border">
              <IndiaMap fieldMode={fieldMode} showAnomalies={v === "efi"} day={lead} className="h-auto w-full" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Low</span>
              <span className="h-2 w-40 rounded" style={{ background: `linear-gradient(90deg, ${fieldMode.colors[0]}, ${fieldMode.colors[1]})` }} />
              <span>High ({layer === "Ensemble spread" ? "spread" : cfg.unit})</span>
            </div>
          </div>
          <div className="space-y-4">
            <Panel title="Extreme Forecast Index — EFI > 0.8">
              <ul className="space-y-2 text-sm">
                {[["Odisha coast", 0.92], ["West Rajasthan", 0.89], ["Haryana–Delhi", 0.84], ["Coastal Andhra", 0.81]].map(([r, e]) => (
                  <li key={r as string} className="flex items-center justify-between rounded border border-destructive/40 bg-destructive/5 p-2">
                    <span>{r}</span>
                    <span className="font-mono font-bold text-destructive">{e}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 rounded bg-destructive p-2 text-xs font-bold text-destructive-foreground">⚠ Very Unusual / Extreme conditions expected</p>
            </Panel>
            <Panel title={`Model weight snapshot (Day ${lead})`}>
              <ul className="space-y-2 text-xs">
                {REGIONS.slice(0, 5).map((r, k) => {
                  const ai = Math.round(40 + ((k * 13 + lead * 7) % 45));
                  return (
                    <li key={r}>
                      <div className="flex justify-between"><span>{r}</span><span>AI/ML {ai}% · NWP {100 - ai}%</span></div>
                      <div className="mt-1 flex h-2 overflow-hidden rounded"><span className="bg-saffron" style={{ width: `${ai}%` }} /><span className="flex-1 bg-primary" /></div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="RMSE by lead time (lower is better)">
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={SKILL_BY_LEAD}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="lead" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend />
                  <Line dataKey="NEPS-G" stroke="var(--chart-5)" />
                  <Line dataKey="NCUM" stroke="var(--chart-3)" />
                  <Line dataKey="GraphCast" stroke="var(--chart-2)" />
                  <Line dataKey="Pangu" stroke="var(--chart-4)" />
                  <Line dataKey="Blended" stroke="var(--chart-1)" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <Panel title="Skill comparison — RMSE, bias, correlation">
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={skillBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="model" fontSize={11} /><YAxis fontSize={12} /><Tooltip /><Legend />
                  <Bar dataKey="RMSE" fill="var(--chart-1)" />
                  <Bar dataKey="Bias" fill="var(--chart-2)" />
                  <Bar dataKey="Corr" fill="var(--chart-3)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
