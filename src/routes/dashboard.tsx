import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Atom, Cpu, ShieldCheck, Waves } from "lucide-react";
import { PageHeader, Panel } from "@/components/site/PageHeader";
import { meta } from "@/lib/seo";

export const Route = createFileRoute("/dashboard")({
  head: () => meta("System Dashboard", "DRL Weight-Agent decisions, physics-constraint validation and spectral fidelity status for the SIH26078 forecasting pipeline."),
  component: Dashboard,
});

const AGENT = Array.from({ length: 24 }, (_, k) => ({
  cycle: `${String(k).padStart(2, "0")}Z`,
  NWP: +(0.5 + Math.sin(k / 4) * 0.15).toFixed(2),
  "AI/ML": +(0.5 - Math.sin(k / 4) * 0.15).toFixed(2),
}));

const DECISIONS = [
  ["06:00 IST", "Peninsular, Day 4–7", "Shift +12% to GraphCast/FuXi", "Monsoon break regime detected; AI/ML RMSE 9% lower last 5 cycles"],
  ["00:00 IST", "Bay of Bengal, Day 1–3", "Hold NCUM at 0.58", "Cyclone genesis — NWP track skill superior at short range"],
  ["18:00 IST", "NW India, Day 8–10", "Shift +8% to AIFS", "Heatwave persistence better captured by AIFS"],
  ["12:00 IST", "Himalaya, Day 1–3", "Shift +10% to NEPS-G", "Orographic precipitation — physics model favoured"],
];

function Dashboard() {
  const stats = [
    [Activity, "Pipeline cycles today", "4 / 4"],
    [Cpu, "Grid cells @ 5 km", "1.31 M"],
    [ShieldCheck, "Conservation checks passed", "99.7%"],
    [Waves, "Spectral RMSE vs ERA5", "0.041"],
  ] as const;
  return (
    <>
      <PageHeader eyebrow="Dashboard" title="DRL Weight-Agent & System Health">How the deep reinforcement learning agent adapts model weights every cycle, with physics and spectral validation.</PageHeader>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([I, l, v]) => (
            <div key={l} className="rounded-md border border-border bg-card p-4">
              <I className="h-5 w-5 text-saffron" aria-hidden />
              <p className="mt-2 text-2xl font-bold text-primary">{v}</p>
              <p className="text-xs text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel title="Adaptive weights — last 24 cycles">
              <div className="h-72">
                <ResponsiveContainer>
                  <AreaChart data={AGENT} stackOffset="expand">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="cycle" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Legend />
                    <Area dataKey="NWP" stackId="1" stroke="var(--primary)" fill="var(--primary)" />
                    <Area dataKey="AI/ML" stackId="1" stroke="var(--saffron)" fill="var(--saffron)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
          <div className="space-y-4">
            <div className="rounded-md border-2 border-india-green bg-card p-4">
              <p className="flex items-center gap-2 font-bold text-india-green"><Atom className="h-5 w-5" /> Physics-Informed AI</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>✓ Mass conservation — residual 2.1e-6</li>
                <li>✓ Energy budget — closure 99.4%</li>
                <li>✓ Moisture non-negativity enforced</li>
                <li>✓ Hydrostatic balance within tolerance</li>
              </ul>
            </div>
            <div className="rounded-md border-2 border-primary bg-card p-4">
              <p className="flex items-center gap-2 font-bold text-primary"><Waves className="h-5 w-5" /> Spectral smoothing solved</p>
              <p className="mt-2 text-sm text-muted-foreground">AMSE loss applied — kinetic energy spectrum matches ERA5 down to 10 km wavelengths; no blurring of extremes.</p>
            </div>
          </div>
        </div>
        <Panel title="Recent agent decisions">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-muted-foreground"><th className="py-2">Cycle</th><th>Region / lead</th><th>Action</th><th>Reason</th></tr></thead>
              <tbody>
                {DECISIONS.map((d) => (
                  <tr key={d[0]} className="border-t border-border"><td className="py-2 font-mono">{d[0]}</td><td>{d[1]}</td><td className="font-semibold text-primary">{d[2]}</td><td className="text-muted-foreground">{d[3]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}
