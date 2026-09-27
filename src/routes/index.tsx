import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, BookOpen, Map, Cloud, Wind, Thermometer, Snowflake, CloudRain, Radar } from "lucide-react";
import sat1 from "@/assets/sat-1.jpg";
import sat2 from "@/assets/sat-2.jpg";
import sat3 from "@/assets/sat-3.jpg";
import { useI18n } from "@/lib/i18n";
import { ANOMALIES, NEWS, HAZARD_LABEL } from "@/lib/weather-data";
import { Badges } from "@/components/site/PageHeader";
import { IndiaMap, SEV_VAR } from "@/components/site/IndiaMap";
import { meta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => meta("Home", "AI-driven spatio-temporal tracking of extreme weather anomalies over India at 5 km resolution, 3–10 days ahead."),
  component: Index,
});

const SLIDES = [sat1, sat2, sat3];

function Index() {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-deep text-primary-foreground">
        {SLIDES.map((src, k) => (
          <img key={k} src={src} alt={k === 0 ? "Satellite imagery of the Indian subcontinent" : ""} aria-hidden={k !== 0}
            width={1920} height={912} loading={k === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-1000 ${k === i ? "opacity-60" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep via-navy-deep/80 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
          <p className="inline-block rounded bg-accent px-2 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">SIH26078 · MoES</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">{t("heroTitle")}</h1>
          <p className="mt-4 max-w-2xl text-lg opacity-90">{t("heroSub")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/warnings" className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-semibold text-accent-foreground hover:opacity-90">
              <AlertTriangle className="h-4 w-4" /> {t("viewAlerts")}
            </Link>
            <Link to="/weight-maps" className="inline-flex items-center gap-2 rounded-md bg-card px-5 py-3 font-semibold text-primary hover:opacity-90">
              <Map className="h-4 w-4" /> {t("exploreWeights")}
            </Link>
            <Link to="/api-docs" className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/60 px-5 py-3 font-semibold hover:bg-primary-foreground/10">
              <BookOpen className="h-4 w-4" /> {t("apiDocs")}
            </Link>
          </div>
          <div className="mt-6 flex gap-2" role="tablist" aria-label="Satellite slides">
            {SLIDES.map((_, k) => (
              <button key={k} role="tab" aria-selected={k === i} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)}
                className={`h-1.5 w-8 rounded-full ${k === i ? "bg-accent" : "bg-primary-foreground/40"}`} />
            ))}
          </div>
        </div>
      </section>

      <div className="flex items-stretch border-b border-border bg-card" aria-label="Latest updates">
        <span className="flex shrink-0 items-center bg-destructive px-4 text-xs font-bold uppercase text-destructive-foreground">{t("latest")}</span>
        <div className="overflow-hidden py-2.5">
          <div className="animate-ticker flex w-max gap-12 whitespace-nowrap text-sm">
            {[...NEWS, ...NEWS].map((n, k) => (
              <span key={k} className="text-foreground"><span className="text-saffron">◆</span> {n}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-primary">Active anomalies — Day 3 outlook</h2>
          <p className="mt-1 text-sm text-muted-foreground">4D bounding boxes with trajectory paths and ensemble confidence cones.</p>
          <div className="mt-4 overflow-hidden rounded-md border border-border">
            <IndiaMap day={3} className="h-auto w-full" />
          </div>
        </div>
        <div className="space-y-3 lg:col-span-2">
          <Badges />
          {ANOMALIES.map((a) => (
            <Link key={a.id} to="/tracker" className="block rounded-md border border-border bg-card p-4 hover:border-primary">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{a.name}</p>
                <span className="rounded px-2 py-0.5 text-xs font-bold uppercase" style={{ background: SEV_VAR[a.severity], color: "var(--foreground)" }}>{a.severity}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{HAZARD_LABEL[a.hazard]} · EFI {a.efi} · confidence {Math.round(a.confidence * 100)}% · {a.radiusKm} km threat radius</p>
            </Link>
          ))}
          <Link to="/tracker" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><Radar className="h-4 w-4" /> Open full tracker →</Link>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-2xl font-bold text-primary">What makes this different</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [Cloud, "5 km hyper-local threat radius", "Diffusion downscaling from 12 km NEPS-G — beyond district-level warnings."],
              [Map, "Model weight maps", "See which model (NWP vs AI/ML) is most reliable per region and lead time."],
              [BookOpen, "REST Alerts API", "JSON alerts for NDRF, NDMA SACHET and state EOCs."],
              [Thermometer, "Physics-informed AI", "Conservation of mass and energy validated on every run."],
              [Wind, "Spectral smoothing solved", "AMSE loss preserves small-scale extremes."],
              [Radar, "DRL Weight-Agent", "Reinforcement learning adapts blend weights to the current regime."],
            ].map(([Icon, title, body]) => {
              const I = Icon as typeof Cloud;
              return (
                <div key={title as string} className="rounded-md border border-border bg-card p-5">
                  <I className="h-6 w-6 text-saffron" aria-hidden />
                  <p className="mt-3 font-semibold text-primary">{title as string}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{body as string}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CloudRain className="h-4 w-4" /> Rainfall</span>
            <span className="flex items-center gap-2"><Thermometer className="h-4 w-4" /> Heat</span>
            <span className="flex items-center gap-2"><Snowflake className="h-4 w-4" /> Cold</span>
            <span className="flex items-center gap-2"><Wind className="h-4 w-4" /> Wind</span>
          </div>
        </div>
      </section>
    </>
  );
}
