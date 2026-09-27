import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/site/PageHeader";
import { meta } from "@/lib/seo";

export const Route = createFileRoute("/api-docs")({
  head: () => meta("Alerts API", "REST API documentation for categorised 5 km extreme weather alerts, anomalies and model weight maps, with NDMA SACHET webhooks."),
  component: ApiDocs,
});

const ENDPOINTS = [
  { m: "GET", p: "/api/v1/alerts?lat={lat}&lon={lon}&radius=5", d: "Returns the categorised alert for a point within a 5 km threat radius." },
  { m: "GET", p: "/api/v1/anomalies", d: "Returns all active anomalies with 4D bounding boxes and trajectories." },
  { m: "GET", p: "/api/v1/weight-maps?lead=1-3&season=JJAS", d: "Returns model weight maps per grid cell." },
  { m: "POST", p: "/api/v1/webhooks", d: "Registers a webhook (e.g. NDMA SACHET CAP, NDRF EOC) for pushed alerts." },
];

const EXAMPLE = `{
  "alert": "SEVERE",
  "centroid": [15.2, 85.4],
  "radius_km": 5,
  "lead_time_hours": 12,
  "hazard": "flash_flood",
  "confidence": 0.87,
  "efi_value": 0.92,
  "trajectory": [[15.2, 85.4], [15.8, 85.9], [16.3, 86.2]]
}`;

const WEBHOOK = `POST https://your-eoc.gov.in/hooks/sih26078
Content-Type: application/json
X-SIH-Signature: sha256=<hmac>

{ "event": "alert.created", "cap_format": "CAP-1.2", "data": { ...alert } }`;

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  org: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(255),
  use: z.string().trim().min(10).max(1000),
});

function ApiDocs() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <>
      <PageHeader eyebrow="Alerts API" title="REST API for Disaster Response Integration">Machine-readable JSON alerts for NDRF, NDMA SACHET, state EOCs and research partners.</PageHeader>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Endpoints">
            <ul className="divide-y divide-border">
              {ENDPOINTS.map((e) => (
                <li key={e.p} className="py-3">
                  <code className="font-mono text-sm"><span className={`mr-2 rounded px-1.5 py-0.5 text-xs font-bold ${e.m === "GET" ? "bg-india-green text-primary-foreground" : "bg-saffron text-accent-foreground"}`}>{e.m}</span>{e.p}</code>
                  <p className="mt-1 text-sm text-muted-foreground">{e.d}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Example response — GET /api/v1/alerts">
            <pre className="overflow-x-auto rounded bg-navy-deep p-4 font-mono text-xs text-primary-foreground">{EXAMPLE}</pre>
          </Panel>
          <Panel title="Webhook integration — NDRF / NDMA SACHET">
            <p className="mb-3 text-sm text-muted-foreground">Alerts are delivered in Common Alerting Protocol (CAP 1.2) compatible JSON, signed with HMAC-SHA256. Live dashboards can also subscribe via WebSocket at <code className="font-mono">wss://api/v1/stream</code>.</p>
            <pre className="overflow-x-auto rounded bg-navy-deep p-4 font-mono text-xs text-primary-foreground">{WEBHOOK}</pre>
          </Panel>
        </div>
        <Panel title="Request an API key">
          <form className="space-y-3" noValidate onSubmit={(e) => {
            e.preventDefault();
            const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
            if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message]))); return; }
            setErrors({}); e.currentTarget.reset();
            toast.success("Request received. The team will review it within 3 working days.");
          }}>
            {([["name", "Full name"], ["org", "Organisation"], ["email", "Official email"]] as const).map(([n, l]) => (
              <div key={n}>
                <label htmlFor={n} className="text-xs font-semibold">{l}</label>
                <input id={n} name={n} type={n === "email" ? "email" : "text"} className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm" aria-invalid={!!errors[n]} />
                {errors[n] && <p className="mt-1 text-xs text-destructive">{errors[n]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="use" className="text-xs font-semibold">Intended use</label>
              <textarea id="use" name="use" rows={4} className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-sm" aria-invalid={!!errors["use"]} />
              {errors["use"] && <p className="mt-1 text-xs text-destructive">{errors["use"]}</p>}
            </div>
            <button className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground">Submit request</button>
          </form>
        </Panel>
      </div>
    </>
  );
}
