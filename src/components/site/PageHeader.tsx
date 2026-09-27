import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-saffron">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold text-primary md:text-3xl">{title}</h1>
        {children && <div className="mt-2 max-w-3xl text-sm text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-md border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="text-sm font-bold text-primary">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Badges() {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <span className="rounded-full border border-india-green px-2.5 py-1 font-medium text-india-green">✓ Physics-Informed AI · mass & energy conserved</span>
      <span className="rounded-full border border-primary px-2.5 py-1 font-medium text-primary">✓ Spectral smoothing solved · AMSE loss</span>
      <span className="rounded-full border border-saffron px-2.5 py-1 font-medium text-accent-foreground">◎ Ensemble confidence cones</span>
    </div>
  );
}
