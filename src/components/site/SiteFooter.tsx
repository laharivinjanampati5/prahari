import { Link } from "@tanstack/react-router";
import { LiveTime } from "./LiveTime";

const EXT = [
  ["NCMRWF", "https://www.ncmrwf.gov.in"],
  ["IMD", "https://mausam.imd.gov.in"],
  ["MoES", "https://moes.gov.in"],
  ["NDMA SACHET", "https://sachet.ndma.gov.in"],
  ["NDRF", "https://www.ndrf.gov.in"],
];

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-navy-deep text-primary-foreground">
      <div className="tricolor-bar h-1" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-bold">AI-Driven Extreme Weather Tracking System (SIH26078)</p>
          <p className="mt-2 text-sm opacity-80">
            Blending NWP and AI/ML ensembles into 5 km hyper-local extreme weather threat tracking for India.
          </p>
          <p className="mt-4 text-xs opacity-70">Last updated: <LiveTime /></p>
        </div>
        <div>
          <p className="text-sm font-semibold text-saffron">Partner Agencies</p>
          <ul className="mt-2 space-y-1 text-sm">
            {EXT.map(([n, u]) => (
              <li key={n}><a href={u} target="_blank" rel="noreferrer" className="hover:underline">{n}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-saffron">Resources</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link to="/validation" className="hover:underline">Validation & Skill</Link></li>
            <li><Link to="/data-tools" className="hover:underline">Data & Tools</Link></li>
            <li><Link to="/api-docs" className="hover:underline">Alerts API</Link></li>
            <li><Link to="/accessibility" className="hover:underline">Accessibility Statement</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs opacity-80">
          © 2026 Ministry of Earth Sciences, Government of India. Prototype built for Smart India Hackathon. Forecast data shown is illustrative.
        </p>
      </div>
    </footer>
  );
}
