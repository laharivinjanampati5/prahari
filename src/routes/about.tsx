import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/site/PageHeader";
import { meta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => meta("About the Project", "Problem statement SIH26078 by the Ministry of Earth Sciences — team, roles and goals of the AI-driven extreme weather tracking system."),
  component: About,
});

const TEAM = [
  ["Team Lead", "Project coordination & DRL Weight-Agent"],
  ["ML Engineer", "GNN forecasting & diffusion downscaling"],
  ["Atmospheric Scientist", "Physics constraints & validation"],
  ["Data Engineer", "Xarray/Dask pipelines, NEPS-G ingestion"],
  ["Full-stack Developer", "Portal, Alerts API & webhooks"],
  ["UI/UX & Accessibility", "Design system, Hindi localisation, WCAG"],
];

function About() {
  return (
    <>
      <PageHeader eyebrow="About" title="About SIH26078" />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Problem statement">
            <dl className="grid gap-3 text-sm sm:grid-cols-3">
              <div><dt className="text-xs text-muted-foreground">ID</dt><dd className="font-bold text-primary">SIH26078</dd></div>
              <div><dt className="text-xs text-muted-foreground">Organisation</dt><dd className="font-bold text-primary">Ministry of Earth Sciences (MoES)</dd></div>
              <div><dt className="text-xs text-muted-foreground">Problem creator</dt><dd className="font-bold text-primary">Sarim Moin</dd></div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Develop an AI-driven system that blends physics-based NWP ensembles with AI/ML weather models to detect and track extreme weather anomalies across India in space and time, downscaling from 12 km global ensembles to 5 km hyper-local threat zones for 3–10 day forecasts, and deliver categorised alerts to disaster management agencies.
            </p>
          </Panel>
          <Panel title="Team members and roles">
            <p className="mb-3 text-xs text-muted-foreground">Names to be added by the team.</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {TEAM.map(([r, d]) => (
                <li key={r} className="rounded border border-border p-3">
                  <p className="font-semibold text-primary">{r}</p><p className="text-sm text-muted-foreground">{d}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <Panel title="Learn more">
          <ul className="space-y-2 text-sm">
            <li><Link to="/validation" className="text-primary hover:underline">Validation & Skill →</Link></li>
            <li><Link to="/data-tools" className="text-primary hover:underline">Data & Tools →</Link></li>
            <li><Link to="/contact" className="text-primary hover:underline">Contact & collaboration →</Link></li>
          </ul>
        </Panel>
      </div>
    </>
  );
}
