# Sankalp Weather Insights

Build a professional, government-grade weather forecasting portal titled "AI-Driven Extreme Weather Tracking System (SIH26078)" with the following structure:

1. HEADER & NAVIGATION
Top bar with Government of India emblem, Ministry of Earth Sciences (MoES) logo, and "Ministry of Education's Innovation Cell (MIC)" text

Main navigation menu: Home | Forecasts | Warnings | Extreme Weather Tracker | Weight Maps | Alerts API | Dashboard | About | Contact

Language toggle (English / Hindi)

Search bar for location-based queries

Live status indicator ("System Operational — Last Updated: [timestamp]")

2. HOME PAGE — HERO SECTION
Full-width banner with rotating satellite imagery of Indian subcontinent

Prominent headline: "AI-Driven Spatio-Temporal Tracking of Extreme Weather Anomalies"

Sub-headline: "From 12 km Global Ensemble to 5 km Hyper-Local Threat Tracking in 3–10 Day Forecasts"

Quick action buttons: "View Live Alerts" | "Explore Weight Maps" | "API Documentation"

Latest news ticker (similar to IMD's EUMETSAT delegation news) showing system updates and validation results

3. EXTREME WEATHER TRACKER (Core Feature)
Interactive map of India with 5 km resolution grid overlay

Real-time display of active anomalies (cyclones, heat domes, cold waves)

4D bounding boxes around detected anomalies with trajectory paths (3–10 day forecast)

Color-coded severity: 🟢 Low | 🟡 Moderate | 🔴 Severe

Time slider to view forecast evolution (Day 1 through Day 10)

Click on any anomaly to see: EFI value, centroid coordinates, radius, lead time, confidence cone

4. FORECAST DASHBOARD
Variable Tabs: Rainfall | Temperature | Wind | Extreme Indicators

Map Layers: Toggle between observed, blended forecast, and ensemble spread

Lead Time Selector: Day 1, Day 3, Day 5, Day 7, Day 10

Model Weight Maps: Show which model (NWP vs AI/ML) is more reliable for each region/lead time — exactly as required by the problem statement

Skill Comparison Charts: RMSE, bias, correlation for blended vs individual models

Extreme Forecast Index (EFI) Panel: Display EFI > 0.8 regions with "Very Unusual/Extreme" warning

5. ALERTING API SECTION
REST API documentation with endpoints:

GET /api/v1/alerts?lat={lat}&lon={lon}&radius=5 — Returns categorized alert

GET /api/v1/anomalies — Returns all active anomalies

GET /api/v1/weight-maps — Returns model weight maps

JSON response example:

json
{
  "alert": "SEVERE",
  "centroid": [15.2, 85.4],
  "radius_km": 5,
  "lead_time_hours": 12,
  "hazard": "flash_flood",
  "confidence": 0.87,
  "efi_value": 0.92,
  "trajectory": [[15.2, 85.4], [15.8, 85.9], [16.3, 86.2]]
}
API key request form

Webhook integration for NDRF/NDMA SACHET

6. MODEL WEIGHT MAPS PAGE
Regional heatmaps showing which model is most reliable per grid cell

Lead-time stratification (Day 1–3, Day 4–7, Day 8–10)

Seasonal breakdown (JJAS monsoon, DJF winter, pre-monsoon)

Weather regime breakdown (cyclone, heatwave, cold wave)

Historical skill trends (interactive charts)

7. VALIDATION & SKILL PAGE
Case studies: Cyclone Amphan, North India Heatwaves

Comparison charts: Blended forecast vs each individual model

Metrics: RMSE, MAE, Bias, Correlation, POD, FAR, CSI, EFI verification

IMDAA + ERA5 dual baseline verification results

Downloadable validation reports (PDF)

8. DATA & TOOLS SECTION
Input data sources: NEPS-G (12 km, 23 members), NCUM, ERA5, IMDAA, GraphCast, Pangu, FuXi, AIFS

Technology stack display: Xarray, Dask, MetPy, PyTorch, DGL, Hugging Face Diffusers

System architecture diagram (icosahedral mesh → GNN → diffusion → physics constraints → API)

Publications & references

9. ABOUT & TEAM
Problem statement: SIH26078

Organization: Ministry of Earth Sciences (MoES)

Problem Creator: Sarim Moin

Team members and roles

Contact form for queries and collaboration

10. FOOTER
Links: NCMRWF | IMD | MoES | NDMA SACHET | NDRF

Copyright: © 2026 Ministry of Earth Sciences, Government of India

Last updated timestamp

Accessibility statement

Screen reader compatible

DESIGN REQUIREMENTS
Color palette: Government-grade blue, white, and saffron/green accents (Indian flag inspired)

Typography: Clean sans-serif (Inter/Poppins) with Hindi support

Responsive: Mobile-first, works on all devices

Accessibility: WCAG 2.1 AA compliant

Performance: Lazy loading for maps, optimized for low bandwidth

Icons: Weather-specific (cyclone, heat, cold, rain, wind)

Interactive elements: Leaflet/Mapbox maps, D3.js charts, time sliders

Real-time updates: WebSocket for live alert push

UNIQUE FEATURES (Not in IMD Mausam)
5 km hyper-local threat radius visualization (not district-level)

Model weight maps per region/lead time (which model is reliable where)

REST API with JSON response for NDRF integration

Physics-informed AI badge showing conservation law validation

Spectral smoothing solved indicator (AMSE loss applied)

Ensemble spread confidence cone on trajectory paths

DRL Weight-Agent dashboard showing adaptive weighting decisions

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://anshum-aasmaan-alert.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/05d128a2-0326-4615-86ba-833e79fe6fb1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
