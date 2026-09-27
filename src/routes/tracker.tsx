import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { PageHeader, Panel, Badges } from "@/components/site/PageHeader";
import { IndiaMap, SEV_VAR } from "@/components/site/IndiaMap";
import { ANOMALIES, HAZARD_LABEL, SEVERITY_LABEL, type Anomaly } from "@/lib/weather-data";
import { Slider } from "@/components/ui/slider";
import { meta } from "@/lib/seo";

export const Route = createFileRoute("/tracker")({
  head: () => meta("Extreme Weather Tracker", "Interactive 5 km grid map of active cyclones, heat domes and cold waves with 10-day trajectories and confidence cones."),
  component: Tracker,
});

function Tracker() {
  const [day, setDay] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [sel, setSel] = useState<Anomaly>(ANOMALIES[0]!);
  const [grid, setGrid] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setDay((d) => (d >= 10 ? 1 : d + 1)), 900);
    return () => clearInterval(id);
  }, [playing]);

  const [lat, lon] = sel.track[day - 1]!;

  return (
    <>
      <PageHeader eyebrow="Core Feature" title="Extreme Weather Tracker">
        Spatio-temporal tracking of detected anomalies on a 5 km grid. Click an anomaly to inspect it; drag the slider to see forecast evolution.
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-md border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play"} className="rounded-md bg-primary p-2 text-primary-foreground">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <div className="min-w-[200px] flex-1">
                <label className="text-xs font-semibold text-muted-foreground" id="day-lbl">Forecast day: <span className="text-primary">Day {day}</span> (+{day * 24} h)</label>
                <Slider aria-labelledby="day-lbl" min={1} max={10} step={1} value={[day]} onValueChange={(v) => setDay(v[0] ?? 1)} className="mt-2" />
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">{Array.from({ length: 10 }, (_, k) => <span key={k}>D{k + 1}</span>)}</div>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={grid} onChange={(e) => setGrid(e.target.checked)} /> 5 km grid</label>
            </div>
          </div>
          <div className="overflow-hidden rounded-md border border-border">
            <IndiaMap day={day} selected={sel.id} onSelect={setSel} showGrid={grid} className="h-auto w-full" />
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {(["low", "moderate", "severe"] as const).map((s) => (
              <span key={s} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: SEV_VAR[s] }} /> {SEVERITY_LABEL[s]}</span>
            ))}
            <span className="text-muted-foreground">▭ 4D bounding box · ⋯ trajectory · shaded = confidence cone</span>
          </div>
        </div>
        <div className="space-y-4">
          <Panel title="Anomaly details">
            <p className="text-lg font-bold text-primary">{sel.name}</p>
            <p className="text-xs text-muted-foreground">{sel.id} · {HAZARD_LABEL[sel.hazard]}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {[
                ["EFI value", sel.efi.toFixed(2) + (sel.efi > 0.8 ? " (Extreme)" : "")],
                ["Severity", SEVERITY_LABEL[sel.severity]],
                ["Centroid", `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`],
                ["Threat radius", `${sel.radiusKm} km`],
                ["Lead time", `${day * 24} h`],
                ["Confidence", `${Math.round(sel.confidence * 100)}%`],
                ["Cone half-width", `${Math.round(sel.spread[day - 1]! * 111)} km`],
                ["Track points", "10 (daily)"],
              ].map(([k, v]) => (
                <div key={k} className="rounded bg-secondary p-2">
                  <dt className="text-[11px] uppercase text-muted-foreground">{k}</dt>
                  <dd className="font-mono font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Panel title="Active anomalies">
            <ul className="space-y-2">
              {ANOMALIES.map((a) => (
                <li key={a.id}>
                  <button onClick={() => setSel(a)} className={`w-full rounded border p-2 text-left text-sm ${sel.id === a.id ? "border-primary bg-secondary" : "border-border"}`}>
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: SEV_VAR[a.severity] }} />
                    {a.name}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
          <Badges />
        </div>
      </div>
    </>
  );
}
