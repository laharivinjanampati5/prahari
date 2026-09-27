import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader, Panel } from "@/components/site/PageHeader";
import { meta } from "@/lib/seo";

export const Route = createFileRoute("/data-tools")({
  head: () => meta("Data & Tools", "Input datasets, technology stack and system architecture: icosahedral mesh, GNN, diffusion downscaling and physics constraints."),
  component: DataTools,
});

const SOURCES = [
  ["NEPS-G", "NCMRWF global ensemble · 12 km · 23 members"],
  ["NCUM", "NCMRWF Unified Model · deterministic"],
  ["ERA5", "ECMWF global reanalysis · 31 km"],
  ["IMDAA", "Indian regional reanalysis · 12 km"],
  ["GraphCast", "Google DeepMind GNN forecast"],
  ["Pangu-Weather", "Huawei 3D Earth transformer"],
  ["FuXi", "Fudan cascade ML ensemble"],
  ["AIFS", "ECMWF AI forecasting system"],
];
const STACK = ["Xarray", "Dask", "MetPy", "PyTorch", "DGL", "Hugging Face Diffusers"];
const ARCH = ["Icosahedral mesh", "Graph Neural Network", "Diffusion downscaling (5 km)", "Physics constraints", "Alerts API"];
const PUBS = [
  "Lam et al. (2023), Learning skillful medium-range global weather forecasting, Science.",
  "Bi et al. (2023), Accurate medium-range global weather forecasting with 3D neural networks, Nature.",
  "Chen et al. (2023), FuXi: a cascade ML forecasting system, npj Clim. Atmos. Sci.",
  "Mitra et al. (2023), NCMRWF Ensemble Prediction System (NEPS-G), MoES technical report.",
];

function DataTools() {
  return (
    <>
      <PageHeader eyebrow="Data & Tools" title="Data Sources, Stack & Architecture" />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <Panel title="System architecture">
          <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
            {ARCH.map((a, k) => (
              <li key={a} className="flex flex-1 items-center gap-2">
                <div className="flex-1 rounded-md border-2 border-primary bg-secondary p-3 text-center text-sm font-semibold text-primary">
                  <span className="block text-[10px] text-saffron">STEP {k + 1}</span>{a}
                </div>
                {k < ARCH.length - 1 && <ArrowRight className="hidden h-5 w-5 shrink-0 text-saffron md:block" aria-hidden />}
              </li>
            ))}
          </ol>
        </Panel>
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Input data sources">
            <ul className="divide-y divide-border text-sm">
              {SOURCES.map(([n, d]) => <li key={n} className="flex justify-between gap-4 py-2"><b className="text-primary">{n}</b><span className="text-right text-muted-foreground">{d}</span></li>)}
            </ul>
          </Panel>
          <div className="space-y-6">
            <Panel title="Technology stack">
              <div className="flex flex-wrap gap-2">{STACK.map((s) => <span key={s} className="rounded border border-border bg-secondary px-3 py-1.5 font-mono text-sm">{s}</span>)}</div>
            </Panel>
            <Panel title="Publications & references">
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{PUBS.map((p) => <li key={p}>{p}</li>)}</ul>
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}
