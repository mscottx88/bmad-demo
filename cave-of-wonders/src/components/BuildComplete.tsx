import { useEffect, useState } from 'react';
import mapBg from '../assets/map-bg.png';
import { AnimatePresence, motion } from 'framer-motion';
import type { OsChrome, RewardTotals } from '../types';
import { DEMO_APP } from '../data/phases';
import RewardCounter from './RewardCounter';
import Particles from './Particles';

interface Props {
  totals: RewardTotals;
  reducedMotion: boolean;
  osChrome: OsChrome;
}

type Stage = 'gather' | 'hush' | 'erupt' | 'reveal';

/**
 * Build-complete ceremony: pipeline→hush→erupt→reveal sequence.
 * Under reduced motion jumps straight to reveal for deterministic snapshots.
 */
export default function BuildComplete({ totals, reducedMotion, osChrome }: Props) {
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
            <AppMock osChrome={osChrome} />
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

/** Satellite city map with heatmap overlay — no dots, real photo background. */
function AppMock({ osChrome }: { osChrome: OsChrome }) {
  const title = `📍 ${DEMO_APP.appName}`;
  return (
    <div className="app-mock" data-testid="app-mock" aria-label={`${DEMO_APP.appName} app preview`}>
      {osChrome === 'win' ? (
        <div className="app-mock__bar app-mock__bar--win">
          <span className="app-mock__title app-mock__title--dark">{title}</span>
          <div className="app-mock__winbtns" aria-hidden>
            <span className="app-mock__wbtn">─</span>
            <span className="app-mock__wbtn">□</span>
            <span className="app-mock__wbtn app-mock__wbtn--close">✕</span>
          </div>
        </div>
      ) : (
        <div className="app-mock__bar app-mock__bar--dark">
          <span className="app-mock__dot app-mock__dot--red" />
          <span className="app-mock__dot app-mock__dot--yellow" />
          <span className="app-mock__dot app-mock__dot--green" />
          <span className="app-mock__title app-mock__title--dark">{title}</span>
        </div>
      )}
      <div className="app-mock__map app-mock__map--full" aria-hidden>
        <MapBackground />
        <div className="heat-blob heat-blob--1" />
        <div className="heat-blob heat-blob--2" />
        <div className="heat-blob heat-blob--3" />
        <div className="map-legend">
          {(['above', 'at', 'below', 'critical'] as const).map((t) => (
            <span key={t} className={`map-legend__item map-legend__item--${t}`}>
              {t === 'above' ? '≥110%' : t === 'at' ? '90–110%' : t === 'below' ? '70–89%' : '<70%'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Seattle satellite screenshot used as the map background. */
function MapBackground() {
  return (
    <img
      src={mapBg}
      alt=""
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center top',
      }}
    />
  );
}

