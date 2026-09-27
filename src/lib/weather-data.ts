export type Severity = "low" | "moderate" | "severe";
export type Hazard = "cyclone" | "heat_dome" | "cold_wave" | "flash_flood";

export interface Anomaly {
  id: string;
  name: string;
  hazard: Hazard;
  severity: Severity;
  efi: number;
  radiusKm: number;
  confidence: number;
  /** [lat, lon] per forecast day 1..10 */
  track: [number, number][];
  /** ensemble spread (degrees) per day */
  spread: number[];
}

export const ANOMALIES: Anomaly[] = [
  {
    id: "CYC-BOB-01",
    name: "Deep Depression BOB-01",
    hazard: "cyclone",
    severity: "severe",
    efi: 0.92,
    radiusKm: 5,
    confidence: 0.87,
    track: [
      [13.2, 88.6], [14.0, 88.0], [14.8, 87.3], [15.5, 86.6], [16.3, 86.1],
      [17.2, 85.6], [18.2, 85.3], [19.3, 85.1], [20.4, 85.3], [21.5, 85.8],
    ],
    spread: [0.2, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2, 1.35, 1.5],
  },
  {
    id: "HTD-NW-02",
    name: "Heat Dome — NW Plains",
    hazard: "heat_dome",
    severity: "severe",
    efi: 0.89,
    radiusKm: 5,
    confidence: 0.81,
    track: [
      [27.0, 74.5], [27.3, 75.2], [27.6, 76.0], [28.0, 76.8], [28.3, 77.4],
      [28.5, 78.1], [28.6, 78.9], [28.4, 79.6], [28.1, 80.3], [27.8, 81.0],
    ],
    spread: [0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.95, 1.1],
  },
  {
    id: "CLD-JK-03",
    name: "Cold Wave — Western Himalaya",
    hazard: "cold_wave",
    severity: "moderate",
    efi: 0.74,
    radiusKm: 5,
    confidence: 0.76,
    track: [
      [34.2, 74.8], [33.8, 75.3], [33.3, 75.8], [32.7, 76.2], [32.1, 76.6],
      [31.5, 77.0], [30.9, 77.5], [30.4, 78.0], [30.0, 78.5], [29.6, 79.0],
    ],
    spread: [0.2, 0.25, 0.35, 0.45, 0.55, 0.65, 0.8, 0.9, 1.0, 1.15],
  },
  {
    id: "FLD-KL-04",
    name: "Flash Flood Risk — Kerala Ghats",
    hazard: "flash_flood",
    severity: "low",
    efi: 0.62,
    radiusKm: 5,
    confidence: 0.69,
    track: [
      [10.0, 76.3], [10.2, 76.4], [10.5, 76.5], [10.8, 76.6], [11.1, 76.7],
      [11.4, 76.9], [11.7, 77.0], [12.0, 77.1], [12.3, 77.2], [12.6, 77.3],
    ],
    spread: [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
  },
];

export const HAZARD_LABEL: Record<Hazard, string> = {
  cyclone: "Cyclone",
  heat_dome: "Heat Dome",
  cold_wave: "Cold Wave",
  flash_flood: "Flash Flood",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  low: "Low",
  moderate: "Moderate",
  severe: "Severe",
};

/** Rough India outline [lon, lat] */
export const INDIA_OUTLINE: [number, number][] = [
  [68.2, 23.7], [70.0, 20.9], [72.8, 19.0], [73.4, 16.0], [74.8, 12.8], [76.3, 9.5], [77.5, 8.1],
  [78.2, 8.9], [79.3, 10.3], [79.9, 12.0], [80.3, 13.5], [80.1, 15.5], [81.3, 16.4], [82.3, 17.0],
  [84.1, 18.3], [85.1, 19.5], [86.9, 20.8], [87.1, 21.6], [88.2, 21.7], [89.0, 21.9], [89.1, 22.9],
  [88.6, 24.3], [88.1, 25.0], [89.8, 25.4], [89.8, 26.1], [92.0, 25.1], [92.4, 24.0], [92.8, 22.6],
  [93.3, 23.9], [94.2, 23.9], [94.6, 25.2], [95.3, 26.6], [96.5, 27.3], [97.3, 28.2], [96.1, 29.4],
  [94.6, 29.3], [92.4, 27.8], [91.6, 27.8], [89.8, 26.7], [88.8, 27.3], [88.1, 27.9], [88.0, 26.4],
  [86.0, 26.6], [84.1, 27.5], [82.0, 27.9], [80.1, 28.8], [81.1, 30.2], [79.0, 31.3], [78.8, 32.5],
  [79.5, 33.0], [78.0, 34.5], [77.8, 35.5], [76.0, 35.9], [74.5, 35.0], [73.8, 34.3], [74.6, 32.8],
  [75.3, 32.2], [74.5, 31.0], [73.9, 30.0], [72.9, 29.0], [71.0, 27.9], [70.2, 27.2], [69.5, 26.2],
  [70.1, 25.2], [68.8, 24.3],
];

export const BOUNDS = { minLon: 66, maxLon: 99, minLat: 5, maxLat: 38 };

export function project(lat: number, lon: number, w: number, h: number): [number, number] {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * w;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * h;
  return [x, y];
}

export function pointInIndia(lon: number, lat: number) {
  let inside = false;
  const p = INDIA_OUTLINE;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i]!;
    const [xj, yj] = p[j]!;
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Deterministic pseudo-random field value in [0,1] */
export function field(lon: number, lat: number, seed: number) {
  const v =
    Math.sin(lon * 0.35 + seed) * Math.cos(lat * 0.4 - seed * 0.7) * 0.5 +
    Math.sin((lon + lat) * 0.18 + seed * 1.3) * 0.3 +
    0.5;
  return Math.max(0, Math.min(1, v));
}

export const MODELS = ["NEPS-G", "NCUM", "GraphCast", "Pangu", "FuXi", "AIFS", "Blended"] as const;

export const SKILL_BY_LEAD = [1, 3, 5, 7, 10].map((d) => ({
  lead: `Day ${d}`,
  "NEPS-G": +(1.1 + d * 0.28).toFixed(2),
  NCUM: +(1.0 + d * 0.3).toFixed(2),
  GraphCast: +(0.9 + d * 0.26).toFixed(2),
  Pangu: +(0.95 + d * 0.27).toFixed(2),
  Blended: +(0.75 + d * 0.2).toFixed(2),
}));

export const SKILL_TABLE = [
  { model: "NEPS-G", rmse: 2.41, mae: 1.82, bias: 0.34, corr: 0.81, pod: 0.72, far: 0.28, csi: 0.56 },
  { model: "NCUM", rmse: 2.36, mae: 1.77, bias: -0.21, corr: 0.82, pod: 0.74, far: 0.26, csi: 0.58 },
  { model: "GraphCast", rmse: 2.12, mae: 1.61, bias: 0.12, corr: 0.86, pod: 0.7, far: 0.22, csi: 0.59 },
  { model: "Pangu", rmse: 2.19, mae: 1.66, bias: 0.18, corr: 0.85, pod: 0.69, far: 0.24, csi: 0.57 },
  { model: "FuXi", rmse: 2.15, mae: 1.63, bias: 0.09, corr: 0.86, pod: 0.71, far: 0.23, csi: 0.59 },
  { model: "AIFS", rmse: 2.1, mae: 1.6, bias: 0.07, corr: 0.87, pod: 0.73, far: 0.21, csi: 0.61 },
  { model: "Blended (SIH26078)", rmse: 1.74, mae: 1.31, bias: 0.03, corr: 0.91, pod: 0.83, far: 0.15, csi: 0.72 },
];

export const NEWS = [
  "Blended forecast achieves 18% RMSE reduction over NEPS-G at Day 5 (JJAS 2025 hindcast)",
  "Cyclone track error reduced to 62 km at 72 h lead — validated against IMDAA",
  "NCMRWF delegation reviews 5 km diffusion downscaling module",
  "Physics-constraint layer passes mass & energy conservation checks on 10,000 cases",
  "AMSE spectral loss eliminates over-smoothing at 5 km — power spectrum matched to ERA5",
  "Alerts API v1 now integrated with NDMA SACHET CAP feed (pilot)",
  "DRL Weight-Agent shifts to AI/ML ensemble for Day 4–7 over Peninsular India",
];

export const REGIONS = [
  "NW India", "Central India", "NE India", "Peninsular", "West Coast", "East Coast", "Himalaya",
];
