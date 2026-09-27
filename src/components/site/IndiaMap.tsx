import { useMemo } from "react";
import { ANOMALIES, INDIA_OUTLINE, project, pointInIndia, field, type Anomaly, type Severity } from "@/lib/weather-data";

const W = 600;
const H = 600;

export const SEV_VAR: Record<Severity, string> = {
  low: "var(--success)",
  moderate: "var(--warning)",
  severe: "var(--destructive)",
};

const outlinePath =
  INDIA_OUTLINE.map(([lon, lat], i) => {
    const [x, y] = project(lat, lon, W, H);
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z";

export type FieldMode = { seed: number; colors: [string, string]; opacity?: number } | null;

export function IndiaMap({
  day = 1,
  selected,
  onSelect,
  showAnomalies = true,
  showGrid = true,
  fieldMode = null,
  cellDeg = 1,
  className,
}: {
  day?: number;
  selected?: string | null;
  onSelect?: (a: Anomaly) => void;
  showAnomalies?: boolean;
  showGrid?: boolean;
  fieldMode?: FieldMode;
  cellDeg?: number;
  className?: string;
}) {
  const cells = useMemo(() => {
    if (!fieldMode) return [];
    const out: { x: number; y: number; w: number; h: number; v: number }[] = [];
    for (let lon = 68; lon < 98; lon += cellDeg) {
      for (let lat = 7; lat < 37; lat += cellDeg) {
        if (!pointInIndia(lon + cellDeg / 2, lat + cellDeg / 2)) continue;
        const [x, y] = project(lat + cellDeg, lon, W, H);
        const [x2, y2] = project(lat, lon + cellDeg, W, H);
        out.push({ x, y, w: x2 - x, h: y2 - y, v: field(lon, lat, fieldMode.seed) });
      }
    }
    return out;
  }, [fieldMode, cellDeg]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label="Map of India showing forecast anomalies">
      <defs>
        <pattern id="grid5" width="9" height="9" patternUnits="userSpaceOnUse">
          <path d="M9 0H0V9" fill="none" stroke="var(--primary)" strokeOpacity="0.12" strokeWidth="0.5" />
        </pattern>
        <clipPath id="india-clip"><path d={outlinePath} /></clipPath>
      </defs>
      <rect width={W} height={H} fill="var(--secondary)" />
      <path d={outlinePath} fill="var(--card)" stroke="var(--primary)" strokeWidth="1.5" />
      {fieldMode && (
        <g clipPath="url(#india-clip)">
          {cells.map((c, i) => (
            <rect key={i} x={c.x} y={c.y} width={c.w + 0.5} height={c.h + 0.5}
              fill={`color-mix(in oklab, ${fieldMode.colors[1]} ${Math.round(c.v * 100)}%, ${fieldMode.colors[0]})`}
              opacity={fieldMode.opacity ?? 0.85} />
          ))}
        </g>
      )}
      {showGrid && <path d={outlinePath} fill="url(#grid5)" />}
      {showAnomalies &&
        ANOMALIES.map((a) => {
          const col = SEV_VAR[a.severity];
          const idx = Math.min(day, 10) - 1;
          const pts = a.track.map(([lat, lon]) => project(lat, lon, W, H));
          const [cx, cy] = pts[idx]!;
          const pxPerDeg = W / 33;
          // confidence cone polygon
          const left: string[] = [];
          const right: string[] = [];
          pts.slice(0, idx + 1).forEach(([x, y], i) => {
            const r = a.spread[i]! * pxPerDeg;
            left.push(`${x - r},${y}`);
            right.unshift(`${x + r},${y}`);
          });
          const box = a.spread[idx]! * pxPerDeg + 10;
          const isSel = selected === a.id;
          return (
            <g key={a.id} className="cursor-pointer" onClick={() => onSelect?.(a)} tabIndex={0} role="button"
              aria-label={`${a.name}, ${a.severity}`}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect?.(a); }}>
              {idx > 0 && <polygon points={[...left, ...right].join(" ")} fill={col} opacity="0.15" />}
              <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={col} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
              <polyline points={pts.slice(0, idx + 1).map((p) => p.join(",")).join(" ")} fill="none" stroke={col} strokeWidth="2.5" />
              {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.8" fill={col} />)}
              <rect x={cx - box} y={cy - box} width={box * 2} height={box * 2} fill="none" stroke={col}
                strokeWidth={isSel ? 3 : 1.5} strokeDasharray={isSel ? undefined : "3 2"} />
              <circle cx={cx} cy={cy} r="6" fill={col} stroke="var(--card)" strokeWidth="2" />
              <circle cx={cx} cy={cy} r="12" fill="none" stroke={col} opacity="0.6">
                <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x={cx + box + 4} y={cy - box + 10} fontSize="11" fontWeight="700" fill="var(--foreground)">{a.id}</text>
            </g>
          );
        })}
    </svg>
  );
}
