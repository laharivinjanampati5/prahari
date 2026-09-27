import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel } from "@/components/site/PageHeader";
import { SKILL_TABLE } from "@/lib/weather-data";
import { meta } from "@/lib/seo";

export const Route = createFileRoute("/validation")({
  head: () => meta("Validation & Skill", "Case studies (Cyclone Amphan, North India heatwaves) and verification metrics against IMDAA and ERA5 baselines."),
  component: Validation,
});

const AMPHAN = [24, 48, 72, 96, 120].map((h) => ({
  lead: `${h} h`,
  "NEPS-G": Math.round(h * 1.35),
  NCUM: Math.round(h * 1.25),
  GraphCast: Math.round(h * 1.05),
  Blended: Math.round(h * 0.86),
}));

const REPORTS = ["Cyclone Amphan (May 2020) case study", "North India Heatwaves 2022–2024", "JJAS 2025 seasonal verification", "IMDAA vs ERA5 dual-baseline report"];

function Validation() {
  return (
    <>
      <PageHeader eyebrow="Validation" title="Validation & Forecast Skill">Verification against IMDAA (regional reanalysis) and ERA5 (global reanalysis) dual baselines.</PageHeader>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Case study: Cyclone Amphan — track error (km)">
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={AMPHAN}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="lead" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend />
                  <Bar dataKey="NEPS-G" fill="var(--chart-5)" /><Bar dataKey="NCUM" fill="var(--chart-3)" />
                  <Bar dataKey="GraphCast" fill="var(--chart-2)" /><Bar dataKey="Blended" fill="var(--chart-1)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Blended landfall position error at 72 h: 62 km (vs 97 km NEPS-G).</p>
          </Panel>
          <Panel title="Case study: North India heatwaves">
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-border pb-2"><span>Heatwave days detected (POD)</span><b className="text-primary">0.86</b></li>
              <li className="flex justify-between border-b border-border pb-2"><span>False alarm ratio (FAR)</span><b className="text-primary">0.14</b></li>
              <li className="flex justify-between border-b border-border pb-2"><span>Tmax RMSE at Day 5</span><b className="text-primary">1.6 °C</b></li>
              <li className="flex justify-between border-b border-border pb-2"><span>Onset lead time gained</span><b className="text-primary">+2.3 days</b></li>
              <li className="flex justify-between"><span>EFI verification (ROC area)</span><b className="text-primary">0.91</b></li>
            </ul>
          </Panel>
        </div>
        <Panel title="Verification metrics — Day 5, all-India (baseline: IMDAA; ERA5 within ±3%)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-muted-foreground">{["Model", "RMSE", "MAE", "Bias", "Corr", "POD", "FAR", "CSI"].map((h) => <th key={h} className="py-2 pr-4">{h}</th>)}</tr></thead>
              <tbody>
                {SKILL_TABLE.map((r) => (
                  <tr key={r.model} className={`border-t border-border font-mono ${r.model.startsWith("Blended") ? "bg-secondary font-bold text-primary" : ""}`}>
                    <td className="py-2 pr-4 font-sans">{r.model}</td><td>{r.rmse}</td><td>{r.mae}</td><td>{r.bias}</td><td>{r.corr}</td><td>{r.pod}</td><td>{r.far}</td><td>{r.csi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Downloadable validation reports">
          <ul className="grid gap-2 sm:grid-cols-2">
            {REPORTS.map((r) => (
              <li key={r}>
                <button onClick={() => toast.info("Reports will be available once the final validation is published.")} className="flex w-full items-center justify-between rounded border border-border p-3 text-left text-sm hover:border-primary">
                  {r} <span className="flex items-center gap-1 text-xs text-primary"><Download className="h-4 w-4" /> PDF</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
