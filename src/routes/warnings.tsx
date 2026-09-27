import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CloudLightning, Snowflake, Sun, Waves, BellRing } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/site/PageHeader";
import { SEV_VAR } from "@/components/site/IndiaMap";
import { ANOMALIES, HAZARD_LABEL, type Hazard } from "@/lib/weather-data";
import { meta } from "@/lib/seo";

export const Route = createFileRoute("/warnings")({
  head: () => meta("Live Warnings", "Live categorised extreme weather warnings for India with 5 km threat radius, EFI and lead time."),
  component: Warnings,
});

const ICON: Record<Hazard, typeof Sun> = { cyclone: CloudLightning, heat_dome: Sun, cold_wave: Snowflake, flash_flood: Waves };

function Warnings() {
  const [pushes, setPushes] = useState<string[]>([]);
  useEffect(() => {
    // Simulated live push feed (production: WebSocket wss://…/v1/stream)
    const msgs = ["BOB-01 intensified: EFI 0.92 → 0.94", "Heat Dome NW: Tmax anomaly +6.8 °C at Day 2", "Cold wave advisory updated for J&K"];
    let k = 0;
    const id = setInterval(() => {
      const m = msgs[k++ % msgs.length];
      setPushes((p) => [`${new Date().toLocaleTimeString("en-IN")} — ${m}`, ...p].slice(0, 6));
      toast(m, { icon: <BellRing className="h-4 w-4" /> });
    }, 12000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <PageHeader eyebrow="Warnings" title="Live Extreme Weather Alerts">Alerts are pushed in real time as the blended ensemble updates. Colour indicates severity.</PageHeader>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {ANOMALIES.map((a) => {
            const I = ICON[a.hazard];
            return (
              <article key={a.id} className="flex gap-4 rounded-md border-l-4 border-y border-r border-border bg-card p-4" style={{ borderLeftColor: SEV_VAR[a.severity] }}>
                <I className="h-8 w-8 shrink-0 text-primary" aria-hidden />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-primary">{a.name}</h2>
                    <span className="rounded px-2 py-0.5 text-[11px] font-bold uppercase" style={{ background: SEV_VAR[a.severity] }}>{a.severity}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {HAZARD_LABEL[a.hazard]} centred at {a.track[0]![0]}°N {a.track[0]![1]}°E, moving toward {a.track[9]![0]}°N {a.track[9]![1]}°E over 10 days.
                  </p>
                  <p className="mt-2 font-mono text-xs">EFI {a.efi} · radius {a.radiusKm} km · confidence {Math.round(a.confidence * 100)}% · lead 12–240 h</p>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="rounded-md border border-border bg-card p-4" aria-live="polite">
          <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" /> Live push feed
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">Streaming updates (simulated in this prototype).</p>
          <ul className="mt-3 space-y-2 text-sm">
            {pushes.length === 0 && <li className="text-muted-foreground">Waiting for next update…</li>}
            {pushes.map((p) => <li key={p} className="rounded bg-secondary p-2">{p}</li>)}
          </ul>
        </aside>
      </div>
    </>
  );
}
