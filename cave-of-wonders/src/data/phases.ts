import type { Phase, RideStep } from '../types';

export const WISH = {
  raw: 'Every Subway franchise location on one map — performance vs. regional benchmarks, and clear signals on where to open next.',
  appName: 'SubwayIQ',
  tagline: 'Franchise performance intelligence, on the map',
} as const;

export const PHASES: Phase[] = [
  {
    id: 'research',
    index: 1,
    bmadPhase: 'Analysis',
    persona: {
      id: 'mary',
      name: 'Mary',
      role: 'Analyst',
      glyph: '🔍',
      accent: '#5ec8d8',
      line: 'Profiling franchisees and market before we write a line of code.',
    },
    artifact: {
      id: 'research-scroll',
      icon: '📄',
      title: 'Product Brief',
      snippet: [
        '37k+ locations, zero location-level analytics',
        'POS systems are siloed — no geo context',
        'Franchisees make expansion decisions blind',
      ],
    },
    reward: { hoursSaved: 4 },
    durationMs: 9000,
    command: '/bmad-product-brief',
    summary: 'Scout the franchise analytics market; capture the opportunity.',
    dialogue:
      'BMAD runs a research pass before any tickets exist. This one surfaces the real problem: 37,000 Subway franchisees make expansion decisions without location-level analytics. POS systems are siloed. The product brief captures that gap — correlating sales KPIs with geographic signals like foot traffic and competitor proximity. Without this document, every downstream agent is building for the wrong user.',
    terminal: [
      '$ /bmad-product-brief',
      '▸ loading domain context…',
      '▸ analyzing franchise analytics market…',
      '▸ identifying user pain points…',
      '✓ wrote planning/product-brief.md (48 lines)',
    ],
    files: [{ path: 'planning/product-brief.md' }],
    editor: [
      {
        filename: 'product-brief.md',
        kind: 'doc',
        language: 'md',
        content: `# Product Brief — SubwayIQ

## Problem Statement
37,000+ Subway franchisees make expansion and remediation decisions
without location-level analytics. POS systems are siloed; no tool
correlates sales performance with geographic context (population
density, foot traffic, competitor proximity).

## Target User
Subway franchise owners (1–20 locations) making quarterly performance
reviews and 3-year expansion plans. Primary workflow: monthly review
meeting, laptop, 30 minutes.

## Opportunity
A location-intelligence dashboard correlating sales KPIs with geospatial
signals fills an unaddressed gap in franchise tooling. No existing product
connects POS export data to a geographic map layer.

## Success Metrics
- Dashboard load time (37k pins) < 2s on a standard laptop
- Franchisee can identify underperforming locations in < 30s
- Benchmark comparison visible without any configuration

## Out of Scope (v1)
- Predictive modeling, competitor data APIs, mobile native app`,
      },
    ],
  },
  {
    id: 'prd',
    index: 2,
    bmadPhase: 'Planning (PRD)',
    persona: {
      id: 'john',
      name: 'John',
      role: 'Product Manager',
      glyph: '📋',
      accent: '#f4b740',
      line: 'Pinning requirements now. Drift kills dashboards before they ship.',
    },
    artifact: {
      id: 'prd-scroll',
      icon: '📝',
      title: 'PRD',
      snippet: [
        'AC: 37k pins render < 2s',
        'AC: heatmap toggle < 300ms',
        'AC: click pin → panel < 200ms',
      ],
    },
    reward: { hoursSaved: 6 },
    durationMs: 9000,
    command: '/bmad-prd',
    summary: 'Pin down exactly what to build and why.',
    dialogue:
      'Requirements drift kills dashboards. The most common failure: building the map before defining what makes a pin red versus green. BMAD\'s PM agent locks every acceptance criterion — including a 2-second render time for 37,000 pins — before Winston chooses between Leaflet and MapLibre. The filter behavior, click interaction, and color-blind-safe tier palette are all in this file.',
    terminal: [
      '$ /bmad-prd',
      '▸ loading product-brief.md…',
      '▸ eliciting requirements…',
      '▸ generating acceptance criteria…',
      '✓ wrote planning/prd.md (74 lines)',
    ],
    files: [{ path: 'planning/prd.md' }],
    editor: [
      {
        filename: 'prd.md',
        kind: 'doc',
        language: 'md',
        content: `# PRD — SubwayIQ

## Goal
Map-first franchise analytics: every location on the map,
every benchmark visible at a glance.

## Functional Requirements

### FR-01: Location Map
- All franchises rendered as pins, colored by performance tier
  (green ≥ 110%, yellow 90–110%, orange 70–89%, red < 70%)
- Pins cluster below zoom level 10; expand on zoom-in
- AC: 37,000 pins render in < 2s on a standard laptop

### FR-02: Heatmap Layer
- Toggleable heatmap overlay weighted by gross sales
- AC: Toggle animation completes in < 300ms

### FR-03: Location Detail
- Click any pin → side panel with 12-month sales sparkline
- AC: Panel opens in < 200ms with pre-cached data

### FR-04: Segment Filter
- Filter pins by tier (above/at/below/critical)
- AC: Filter re-renders map in < 100ms (client-side only)

## Non-Functional Requirements
- Bundle size < 400 kB gzipped (MapLibre included)
- WCAG 2.1 AA (color-blind-safe tier palette)
- First paint < 1.5s on 4G`,
      },
    ],
  },
  {
    id: 'architecture',
    index: 3,
    bmadPhase: 'Solutioning (Architecture)',
    persona: {
      id: 'winston',
      name: 'Winston',
      role: 'Architect',
      glyph: '🏛️',
      accent: '#8a7fcf',
      line: 'MapLibre vs Leaflet at 37k pins. ADR-001 decides.',
    },
    artifact: {
      id: 'blueprint-gem',
      icon: '⚙️',
      title: 'Architecture',
      snippet: [
        'ADR-001: MapLibre GL (WebGL, 60fps at 37k)',
        'ADR-002: bundled GeoJSON (no tile server)',
        'heatmap weight = grossSales / maxGrossSales',
      ],
    },
    reward: { hoursSaved: 5 },
    durationMs: 9000,
    command: '/bmad-create-architecture',
    summary: 'Choose the stack and system boundaries.',
    dialogue:
      'MapLibre GL or Leaflet: the choice looks arbitrary until you need 37,000 WebGL markers at 60fps on mobile. Winston documents that tradeoff in ADR-001 — one decision, made once, referenced by every downstream agent. The cluster radius, heatmap weight formula, and GeoJSON bundle strategy are locked here. No "why did we use this?" surprise in code review.',
    terminal: [
      '$ /bmad-create-architecture',
      '▸ loading prd.md…',
      '▸ evaluating map rendering options…',
      '▸ writing ADR-001, ADR-002…',
      '✓ wrote planning/architecture.md (92 lines)',
    ],
    files: [{ path: 'planning/architecture.md' }],
    editor: [
      {
        filename: 'architecture.md',
        kind: 'doc',
        language: 'md',
        content: `# Architecture — SubwayIQ

## Stack
- Frontend: React 18 + Vite 5 (TypeScript strict)
- Map: MapLibre GL JS (WebGL, no API key required)
- Charts: D3 v7 (sparklines in side panel)
- Tests: Playwright (map interaction + snapshot)
- Deploy: static host (GeoJSON bundled at build time)

## ADR-001: MapLibre over Leaflet
**Decision:** MapLibre GL for the map renderer.
**Rationale:** 37k WebGL markers at 60fps; Leaflet SVG
  degrades above ~5k markers on mobile.
**Rejected:** Google Maps (API key cost), Deck.gl (bundle size).

## ADR-002: GeoJSON over WMS Tiles
**Decision:** Bundle GeoJSON location data at build time.
**Rationale:** < 2 MB compressed; eliminates tile server;
  enables client-side filter with no network round-trips.
**Rejected:** Tile server (infra cost), live API (latency).

## Data Model
\`\`\`ts
interface LocationStats {
  id: string;
  lat: number;
  lng: number;
  grossSales: number;        // trailing 12-month USD
  regionalBenchmark: number;
  tier: 'above' | 'at' | 'below' | 'critical';
  monthlySales: number[];    // 12 months, oldest first
}
\`\`\`

## Heatmap Config
weight = grossSales / maxGrossSales
radius = 30px at zoom 10, scales linearly with zoom`,
      },
    ],
  },
  {
    id: 'ux',
    index: 4,
    bmadPhase: 'UX Design',
    persona: {
      id: 'sally',
      name: 'Sally',
      role: 'UX Designer',
      glyph: '🎨',
      accent: '#ef7fa6',
      line: 'Speccing tier colors, hover states, and the 0-results overlay.',
    },
    artifact: {
      id: 'design-map',
      icon: '🗺️',
      title: 'UX Design',
      snippet: [
        'Full-screen map + right side panel',
        '4-tier color palette (WCAG AA)',
        'Cluster → pin zoom interaction',
      ],
    },
    reward: { hoursSaved: 3 },
    durationMs: 9000,
    command: '/bmad-ux',
    summary: 'Map the screens, interactions, and tier palette.',
    dialogue:
      'Sally specs the 4 performance tiers — colors, interaction states, and WCAG contrast ratios — before Amelia writes a handler. She also defines the loading skeleton, the 0-results overlay, and the panel animation. These are the UX gaps that cause 40% of rework in dashboard projects: a missing hover state or an unconstrained zoom level becomes a support ticket after launch.',
    terminal: [
      '$ /bmad-ux',
      '▸ loading prd.md + architecture.md…',
      '▸ mapping dashboard layout and zones…',
      '▸ speccing states, transitions, palette…',
      '✓ wrote planning/ux-design.md (81 lines)',
    ],
    files: [{ path: 'planning/ux-design.md' }],
    editor: [
      {
        filename: 'ux-design.md',
        kind: 'doc',
        language: 'md',
        content: `# UX Design — SubwayIQ

## Layout
Full-screen map (MapLibre) with overlay panels.
Single-screen dashboard — no page navigation.

### Map Layer
- Heatmap: always-on at zoom > 8, auto-hides at zoom ≤ 8
- Pins: clustered below zoom 10, individual above
- Pin color: tier palette (green/yellow/orange/red)

### Side Panel (right, 300px)
- Opens on pin click; closes on map click-away
- Header: location name + tier badge
- Body: 12-month sparkline (D3 SVG line chart)
- Footer: "+14% vs. regional avg" diff string

### Toolbar (top-left overlay)
- Segment filter: checkbox per tier
- Heatmap toggle button
- Reset view button

## Tier Color Palette (WCAG AA)
- above (≥110%): #22c55e  — green
- at (90–110%):  #f59e0b  — amber
- below (70–89%): #f97316 — orange
- critical (<70%): #ef4444 — red

## Interaction States
- Pin hover: tooltip with gross sales + tier
- Cluster hover: count badge
- No results: "No locations match filter" center overlay
- Loading: skeleton pins at last-known positions

## Flow
load → heatmap + clustered pins → zoom-in → individual pins
→ click pin → side panel → sparkline + benchmark diff`,
      },
    ],
  },
  {
    id: 'dev',
    index: 5,
    bmadPhase: 'Implementation',
    persona: {
      id: 'amelia',
      name: 'Amelia',
      role: 'Developer',
      glyph: '⚙️',
      accent: '#7ed957',
      line: 'Tests green. Merging.',
    },
    artifact: {
      id: 'tests-chest',
      icon: '✅',
      title: 'Code + Passing Tests',
      snippet: [
        '✓ 37k pins render < 2s',
        '✓ heatmap toggle < 300ms',
        '18 / 18 passing',
      ],
    },
    reward: { hoursSaved: 12, testsPassing: 18 },
    durationMs: 11000,
    command: '/bmad-dev-story',
    summary: 'Implement map, heatmap, panel, and tests.',
    dialogue:
      'Implementation runs against a pinned spec and a pinned architecture. MapLibre is initialized exactly as ADR-001 specifies. The heatmap weight formula comes directly from the architecture doc. Playwright tests verify pin render time, cluster behavior, and panel open latency — all acceptance criteria from the PRD. When all tests go green, the sprint story closes automatically.',
    terminal: [
      '$ /bmad-dev-story',
      '▸ loading prd.md, architecture.md, ux-design.md…',
      '▸ initializing MapLibre GL with ADR-001 config…',
      '▸ wiring heatmap layer + clustered pins…',
      '▸ implementing side panel + sparklines…',
      '▸ npx playwright test → 18/18 ✓',
      '✓ shipped SubwayIQ · sprint status: done',
    ],
    files: [
      { path: 'src/map/SubwayMap.tsx' },
      { path: 'src/components/LocationPanel.tsx' },
      { path: 'tests/map.spec.ts' },
    ],
    editor: [
      {
        filename: 'SubwayMap.tsx',
        kind: 'code',
        language: 'tsx',
        diff: true,
        content: `// src/map/SubwayMap.tsx
import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import type { LocationStats } from '../types';

interface Props {
  locations: LocationStats[];
  onSelect: (loc: LocationStats) => void;
}

export function SubwayMap({ locations, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-98.5795, 39.8283],
      zoom: 4,
    });
    map.on('load', () => {
      map.addSource('locations', {
        type: 'geojson',
        data: toGeoJSON(locations),
        cluster: true,
        clusterRadius: 50,
      });
      map.addLayer({ id: 'heatmap', type: 'heatmap',
        source: 'locations', maxzoom: 10,
        paint: {
          'heatmap-weight': ['/', ['get', 'grossSales'], 2_000_000],
          'heatmap-radius': 30,
        },
      });
    });
    mapRef.current = map;
    return () => map.remove();
  }, []);

  return (
    <div ref={containerRef}
      style={{ width: '100%', height: '100%' }}
      data-testid="map-ready"
    />
  );
}`,
      },
      {
        filename: 'LocationPanel.tsx',
        kind: 'code',
        language: 'tsx',
        diff: true,
        content: `// src/components/LocationPanel.tsx
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import type { LocationStats } from '../types';

interface Props { location: LocationStats; onClose: () => void }

export function LocationPanel({ location, onClose }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const w = 240, h = 60;
    const x = d3.scaleLinear().domain([0, 11]).range([0, w]);
    const y = d3.scaleLinear()
      .domain([0, d3.max(location.monthlySales)!]).range([h, 0]);
    const line = d3.line<number>()
      .x((_, i) => x(i)).y((d) => y(d)).curve(d3.curveMonotoneX);
    d3.select(svgRef.current).append('path')
      .datum(location.monthlySales)
      .attr('d', line).attr('fill', 'none')
      .attr('stroke', TIER_COLOR[location.tier])
      .attr('stroke-width', 2);
  }, [location]);

  const diff = ((location.grossSales / location.regionalBenchmark - 1) * 100);
  return (
    <aside className="location-panel" data-testid="location-panel">
      <button onClick={onClose}>×</button>
      <h2>{location.id}</h2>
      <span className={\`tier-badge tier-badge--\${location.tier}\`}>
        {location.tier}
      </span>
      <svg ref={svgRef} data-testid="sparkline" width={240} height={60} />
      <p>{diff > 0 ? '+' : ''}{diff.toFixed(1)}% vs. regional avg</p>
    </aside>
  );
}`,
      },
      {
        filename: 'map.spec.ts',
        kind: 'code',
        language: 'ts',
        diff: true,
        content: `// tests/map.spec.ts
import { test, expect } from '@playwright/test';

test('renders 37k location pins within 2s', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  await page.waitForSelector('[data-testid="map-ready"]');
  expect(Date.now() - start).toBeLessThan(2000);
});

test('click pin opens performance panel', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="map-ready"]');
  await page.click('.maplibregl-canvas', { position: { x: 400, y: 300 } });
  await expect(page.getByTestId('location-panel')).toBeVisible();
  await expect(page.getByTestId('sparkline')).toBeVisible();
});

test('heatmap toggle completes in under 300ms', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="map-ready"]');
  const t = Date.now();
  await page.click('[data-testid="heatmap-toggle"]');
  await page.waitForFunction(() =>
    document.querySelector('[data-testid="heatmap-toggle"]')
      ?.getAttribute('aria-pressed') === 'false'
  );
  expect(Date.now() - t).toBeLessThan(300);
});`,
      },
    ],
  },
];

export const RIDE_STEPS: RideStep[] = [
  { kind: 'intro', durationMs: 5200 },
  ...PHASES.map<RideStep>((phase) => ({ kind: 'phase', phase, durationMs: phase.durationMs })),
  { kind: 'climax', durationMs: 6500 },
  { kind: 'cheatsheet', durationMs: 999_999 },
];

export const CLIMAX_INDEX = PHASES.length + 1;
export const CHEATSHEET_INDEX = PHASES.length + 2;
