import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { RewardTotals } from '../types';
import { WISH } from '../data/phases';
import RewardCounter from './RewardCounter';
import Particles from './Particles';

interface Props {
  totals: RewardTotals;
  reducedMotion: boolean;
}

type Stage = 'gather' | 'hush' | 'erupt' | 'reveal';

/**
 * The signature ritual: the collected treasures gather, the cave goes dark
 * and SILENT for a beat (the hush), then everything erupts in gold and the
 * finished app materializes. The hush→erupt contrast is the emotional payoff.
 *
 * Under reduced motion (and in tests) we jump straight to the reveal so the
 * end state is deterministic.
 */
export default function ClimaxCeremony({ totals, reducedMotion }: Props) {
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
    <div className="app-mock" data-testid="app-mock" aria-label={`${WISH.appName} app preview`}>
      <div className="app-mock__bar app-mock__bar--dark">
        <span className="app-mock__dot app-mock__dot--dark" />
        <span className="app-mock__dot app-mock__dot--dark" />
        <span className="app-mock__dot app-mock__dot--dark" />
        <span className="app-mock__title app-mock__title--dark">📍 {WISH.appName}</span>
      </div>
      <div className="app-mock__map-body">
        <div className="app-mock__map" aria-hidden>
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
