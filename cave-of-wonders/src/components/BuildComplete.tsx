import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { RewardTotals } from '../types';
import { DEMO_APP } from '../data/phases';
import RewardCounter from './RewardCounter';
import Particles from './Particles';

interface Props {
  totals: RewardTotals;
  reducedMotion: boolean;
}

type Stage = 'gather' | 'hush' | 'erupt' | 'reveal';

/**
 * Build-complete ceremony: pipeline→hush→erupt→reveal sequence.
 * Under reduced motion jumps straight to reveal for deterministic snapshots.
 */
export default function BuildComplete({ totals, reducedMotion }: Props) {
  const [stage, setStage] = useState<Stage>(reducedMotion ? 'reveal' : 'gather');

  useEffect(() => {
    if (reducedMotion) return;
    const timers = [
      window.setTimeout(() => setStage('hush'), 1000),
      window.setTimeout(() => setStage('erupt'), 1850),
      window.setTimeout(() => setStage('reveal'), 2550),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reducedMotion]);

  return (
    <section className={`scene climax climax--${stage}`} data-testid="climax" data-stage={stage}>
      {(stage === 'erupt' || stage === 'reveal') && <Particles reducedMotion={reducedMotion} />}
      <AnimatePresence mode="wait">
        {stage === 'gather' && (
          <motion.p
            key="gather"
            className="climax__line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Running pipeline…
          </motion.p>
        )}

        {stage === 'hush' && (
          <motion.p
            key="hush"
            className="climax__line climax__line--hush"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
          >
            …
          </motion.p>
        )}

        {stage === 'erupt' && (
          <motion.p
            key="erupt"
            className="climax__line climax__line--erupt"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            ✓ BUILD COMPLETE
          </motion.p>
        )}

        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            className="reveal"
            data-testid="reveal"
            initial={reducedMotion ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.6, ease: 'backOut' }}
          >
            <p className="reveal__eyebrow">Ready to ship</p>
            <AppMock />
            <RewardCounter totals={totals} animate={!reducedMotion} />
            <p className="reveal__footnote">
              5 agents · 5 artifacts · shipped on spec.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const MAP_PINS = [
  { x: 28, y: 45, tier: 'above', delay: 0 },
  { x: 42, y: 35, tier: 'above', delay: 90 },
  { x: 58, y: 52, tier: 'at', delay: 180 },
  { x: 33, y: 60, tier: 'below', delay: 270 },
  { x: 66, y: 38, tier: 'critical', delay: 360 },
  { x: 74, y: 58, tier: 'above', delay: 450 },
  { x: 50, y: 70, tier: 'at', delay: 540 },
  { x: 20, y: 52, tier: 'below', delay: 630 },
  { x: 45, y: 25, tier: 'above', delay: 720 },
] as const;

const CHART_BARS = [
  { label: 'NE', pct: 94, color: '#f59e0b' },
  { label: 'SE', pct: 61, color: '#ef4444' },
  { label: 'MW', pct: 112, color: '#22c55e' },
  { label: 'SW', pct: 78, color: '#f97316' },
] as const;

/** Animated geospatial mock: heatmap blobs + pin plot + regional sales chart. */
function AppMock() {
  return (
    <div className="app-mock" data-testid="app-mock" aria-label={`${DEMO_APP.appName} app preview`}>
      <div className="app-mock__bar app-mock__bar--dark">
        <span className="app-mock__dot app-mock__dot--dark" />
        <span className="app-mock__dot app-mock__dot--dark" />
        <span className="app-mock__dot app-mock__dot--dark" />
        <span className="app-mock__title app-mock__title--dark">📍 {DEMO_APP.appName}</span>
      </div>
      <div className="app-mock__map-body">
        <div className="app-mock__map" aria-hidden>
          <SatelliteMap />
          <div className="heat-blob heat-blob--1" />
          <div className="heat-blob heat-blob--2" />
          <div className="heat-blob heat-blob--3" />
          {MAP_PINS.map((pin, i) => (
            <div
              key={i}
              className={`map-pin map-pin--${pin.tier}`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%`, animationDelay: `${pin.delay}ms` }}
            />
          ))}
        </div>
        <div className="app-mock__chart" aria-hidden>
          <p className="app-mock__chart-label">Sales vs. Benchmark</p>
          {CHART_BARS.map((bar) => (
            <div key={bar.label} className="chart-row">
              <span className="chart-row__label">{bar.label}</span>
              <div className="chart-row__track">
                <div
                  className="chart-row__bar"
                  style={
                    {
                      '--bar-pct': `${bar.pct}%`,
                      '--bar-color': bar.color,
                    } as React.CSSProperties
                  }
                />
              </div>
              <span className="chart-row__val">{bar.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * SVG satellite-map slice — approximates a Mapbox satellite aerial view.
 * Absolutely positioned to fill .app-mock__map; heatmap blobs and pins
 * are layered on top via position:absolute siblings.
 */
function SatelliteMap() {
  return (
    <svg
      viewBox="0 0 240 150"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sm-terrain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3c3826" />
          <stop offset="60%" stopColor="#2e2b1f" />
          <stop offset="100%" stopColor="#232a1c" />
        </linearGradient>
        <linearGradient id="sm-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e3558" />
          <stop offset="100%" stopColor="#082240" />
        </linearGradient>
      </defs>

      {/* base terrain */}
      <rect width="240" height="150" fill="url(#sm-terrain)" />

      {/* ── top row blocks ── */}
      <rect x="0"   y="0"  width="54"  height="43" fill="#484440" />
      <rect x="5"   y="5"  width="22"  height="16" fill="#545250" />
      <rect x="30"  y="5"  width="18"  height="12" fill="#525050" />
      <rect x="5"   y="25" width="30"  height="14" fill="#4e4c48" />

      <rect x="57"  y="0"  width="52"  height="43" fill="#403e38" />
      <rect x="61"  y="4"  width="24"  height="16" fill="#4e4c44" />
      <rect x="89"  y="4"  width="16"  height="18" fill="#504e46" />
      <rect x="61"  y="24" width="44"  height="15" fill="#484640" />

      {/* park patch — top centre-right */}
      <rect x="112" y="0"  width="60"  height="43" fill="#1a3d18" />
      <rect x="115" y="3"  width="54"  height="37" fill="#1e4520" opacity="0.7" />
      <rect x="120" y="8"  width="18"  height="12" fill="#254d22" opacity="0.8" />
      <rect x="145" y="10" width="20"  height="10" fill="#1c4018" opacity="0.7" />

      <rect x="175" y="0"  width="65"  height="43" fill="#454038" />
      <rect x="179" y="4"  width="28"  height="20" fill="#4e4c44" />
      <rect x="211" y="4"  width="25"  height="15" fill="#504e48" />
      <rect x="179" y="28" width="55"  height="12" fill="#484640" />

      {/* ── middle row blocks ── */}
      <rect x="0"   y="47" width="54"  height="48" fill="#3c3a36" />
      <rect x="4"   y="51" width="26"  height="18" fill="#484642" />
      <rect x="33"  y="51" width="18"  height="22" fill="#464440" />
      <rect x="4"   y="74" width="46"  height="17" fill="#424038" />

      <rect x="57"  y="47" width="52"  height="48" fill="#464240" />
      <rect x="61"  y="51" width="20"  height="16" fill="#525050" />
      <rect x="85"  y="51" width="20"  height="14" fill="#505048" />
      <rect x="61"  y="70" width="44"  height="21" fill="#4a4844" />

      <rect x="112" y="47" width="60"  height="48" fill="#3a3830" />
      <rect x="116" y="51" width="28"  height="20" fill="#484440" />
      <rect x="148" y="51" width="20"  height="18" fill="#464240" />
      <rect x="116" y="74" width="52"  height="17" fill="#444038" />

      <rect x="175" y="47" width="65"  height="48" fill="#424038" />
      <rect x="179" y="51" width="50"  height="28" fill="#484440" />
      <rect x="179" y="83" width="55"  height="10" fill="#444240" />

      {/* ── water ── */}
      <rect x="0" y="98" width="240" height="52" fill="url(#sm-water)" />
      {/* subtle water ripple variation */}
      <rect x="20"  y="108" width="70" height="6"  fill="#0d3d68" opacity="0.45" />
      <rect x="110" y="115" width="90" height="5"  fill="#0a3060" opacity="0.4"  />
      <rect x="60"  y="125" width="50" height="4"  fill="#0f3a6a" opacity="0.35" />

      {/* ── street grid ── */}
      {/* horizontal */}
      <rect x="0"   y="43" width="240" height="4" fill="#8a7e68" opacity="0.9" />
      <rect x="0"   y="95" width="240" height="3" fill="#8a7e68" opacity="0.9" />
      {/* vertical */}
      <rect x="54"  y="0"  width="3"   height="95" fill="#8a7e68" opacity="0.9" />
      <rect x="109" y="0"  width="3"   height="95" fill="#8a7e68" opacity="0.9" />
      <rect x="172" y="0"  width="3"   height="95" fill="#8a7e68" opacity="0.9" />
      {/* diagonal connector — adds realism */}
      <line x1="172" y1="0" x2="240" y2="43" stroke="#8a7e68" strokeWidth="3" opacity="0.8" />
      {/* narrow side street */}
      <rect x="85"  y="0"  width="2"   height="43" fill="#7a7060" opacity="0.6" />
      <rect x="0"   y="70" width="54"  height="2"  fill="#7a7060" opacity="0.6" />
    </svg>
  );
}
