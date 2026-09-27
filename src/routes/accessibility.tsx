import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { meta } from "@/lib/seo";

export const Route = createFileRoute("/accessibility")({
  head: () => meta("Accessibility Statement", "Our commitment to WCAG 2.1 AA accessibility, screen reader support and low-bandwidth access."),
  component: () => (
    <>
      <PageHeader eyebrow="Accessibility" title="Accessibility Statement" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-sm leading-relaxed text-muted-foreground">
        <p>This portal aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and the Guidelines for Indian Government Websites (GIGW).</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Skip-to-content link, semantic landmarks and labelled controls for screen readers.</li>
          <li>Full keyboard navigation, including map anomalies and forecast controls.</li>
          <li>Colour is never the only indicator — severity is also shown as text.</li>
          <li>Animations respect the reduced-motion preference.</li>
          <li>English and Hindi interface language.</li>
          <li>Lightweight vector maps for low-bandwidth connections.</li>
        </ul>
        <p>If you face any difficulty using this portal, please reach us via the Contact page.</p>
      </div>
    </>
  ),
});
