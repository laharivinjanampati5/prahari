import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useI18n, type TKey } from "@/lib/i18n";
import { LiveTime } from "./LiveTime";

const NAV: { to: string; k: TKey }[] = [
  { to: "/", k: "home" },
  { to: "/forecasts", k: "forecasts" },
  { to: "/warnings", k: "warnings" },
  { to: "/tracker", k: "tracker" },
  { to: "/weight-maps", k: "weightMaps" },
  { to: "/api-docs", k: "api" },
  { to: "/dashboard", k: "dashboard" },
  { to: "/about", k: "about" },
  { to: "/contact", k: "contact" },
];

function Emblem() {
  return (
    <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0 text-primary" aria-hidden>
      <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <line key={i} x1={24 + Math.cos(a) * 2} y1={24 + Math.sin(a) * 2} x2={24 + Math.cos(a) * 8} y2={24 + Math.sin(a) * 8} stroke="currentColor" strokeWidth="0.8" />
        );
      })}
    </svg>
  );
}

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <header className="bg-card">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-primary focus:p-2 focus:text-primary-foreground">
        Skip to main content
      </a>
      <div className="tricolor-bar h-1" />
      <div className="bg-navy-deep text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-xs">
          <div className="flex items-center gap-2" role="status" aria-live="polite">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span>{t("operational")} — {t("lastUpdated")}: <LiveTime /></span>
          </div>
          <div className="flex items-center gap-1" role="group" aria-label="Language">
            {(["en", "hi"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded px-2 py-0.5 ${lang === l ? "bg-accent text-accent-foreground" : "hover:bg-primary"}`}
              >
                {l === "en" ? "English" : "हिन्दी"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <Emblem />
          <div className="border-l border-border pl-3 leading-tight">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("gov")}</p>
            <p className="text-base font-bold text-primary">{t("moes")} (MoES)</p>
            <p className="text-xs text-muted-foreground">{t("mic")}</p>
          </div>
        </Link>
        <div className="hidden text-right md:block">
          <p className="text-sm font-bold text-primary">AI-Driven Extreme Weather Tracking System</p>
          <p className="text-xs font-semibold text-saffron">Smart India Hackathon · SIH26078</p>
        </div>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({ to: "/forecasts" as never });
          }}
          className="flex w-full items-center rounded-md border border-input bg-background sm:w-64"
        >
          <label htmlFor="loc-search" className="sr-only">Search location</label>
          <input id="loc-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} className="w-full bg-transparent px-3 py-2 text-sm outline-none" />
          <button type="submit" aria-label="Search" className="px-3 text-muted-foreground hover:text-primary"><Search className="h-4 w-4" /></button>
        </form>
      </div>

      <nav aria-label="Main" className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center px-4">
          <button className="py-3 lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <ul className={`${open ? "flex" : "hidden"} w-full flex-col lg:flex lg:flex-row lg:flex-wrap`}>
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: n.to === "/" }}
                  className="block border-b-2 border-transparent px-3 py-3 text-sm font-medium hover:bg-navy-deep"
                  activeProps={{ className: "border-accent bg-navy-deep" }}
                >
                  {t(n.k)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
