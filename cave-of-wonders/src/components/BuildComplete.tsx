import { useEffect, useState } from 'react';
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

// SVG viewBox is 500×220. Pins use x/y as % of that space.
// Major streets: Main Blvd y=105 (47.7%), Central Ave x=210 (42%),
// Grand Ave diagonal (0,105)→(210,35), secondary grid x=85,145,275,330 / y=35,65,140,165
const MAP_PINS = [
  { x: 17, y: 15.9, tier: 'above',    delay: 0    }, // downtown 1st×A
  { x: 29, y: 15.9, tier: 'above',    delay: 80   }, // downtown 2nd×A
  { x: 42, y: 15.9, tier: 'at',       delay: 160  }, // Central Ave×A
  { x: 17, y: 29.5, tier: 'above',    delay: 240  }, // downtown 1st×B
  { x: 29, y: 29.5, tier: 'at',       delay: 320  }, // downtown 2nd×B
  { x: 42, y: 29.5, tier: 'above',    delay: 400  }, // Central Ave×B
  { x: 17, y: 47.7, tier: 'above',    delay: 480  }, // Main Blvd×1st
  { x: 29, y: 47.7, tier: 'at',       delay: 560  }, // Main Blvd×2nd
  { x: 42, y: 47.7, tier: 'above',    delay: 640  }, // Main Blvd×Central (major)
  { x: 55, y: 47.7, tier: 'above',    delay: 720  }, // Main Blvd×midtown
  { x: 55, y: 29.5, tier: 'at',       delay: 800  }, // midtown B
  { x: 66, y: 29.5, tier: 'above',    delay: 880  }, // midtown east B
  { x: 66, y: 47.7, tier: 'at',       delay: 960  }, // Main Blvd×park blvd
  { x: 29, y: 77.3, tier: 'below',    delay: 1040 }, // south bank 2nd
  { x: 55, y: 77.3, tier: 'critical', delay: 1120 }, // south bank midtown
] as const;

/** Full-width city map with animated Subway location circles. */
function AppMock() {
  return (
    <div className="app-mock" data-testid="app-mock" aria-label={`${DEMO_APP.appName} app preview`}>
      <div className="app-mock__bar app-mock__bar--dark">
        <span className="app-mock__dot app-mock__dot--dark" />
        <span className="app-mock__dot app-mock__dot--dark" />
        <span className="app-mock__dot app-mock__dot--dark" />
        <span className="app-mock__title app-mock__title--dark">📍 {DEMO_APP.appName}</span>
      </div>
      <div className="app-mock__map app-mock__map--full" aria-hidden>
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
        <div className="map-legend">
          {(['above','at','below','critical'] as const).map((t) => (
            <span key={t} className={`map-legend__item map-legend__item--${t}`}>{
              t === 'above' ? '≥110%' : t === 'at' ? '90–110%' : t === 'below' ? '70–89%' : '<70%'
            }</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Inline SVG satellite city map — viewBox 500×220. */
function SatelliteMap() {
  return (
    <svg
      viewBox="0 0 500 220"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2e2c1e" />
          <stop offset="100%" stopColor="#22271a" />
        </linearGradient>
        <linearGradient id="sm-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e3558" />
          <stop offset="100%" stopColor="#092340" />
        </linearGradient>
      </defs>

      {/* ─── base terrain ─── */}
      <rect width="500" height="220" fill="url(#sm-bg)" />

      {/* ─── DOWNTOWN blocks (x 0–210, y 0–105) ─── */}
      {/* row A (y 2–33) */}
      <rect x="2"   y="2"  width="81" height="31" fill="#484440" />
      <rect x="6"   y="5"  width="28" height="14" fill="#525050" />
      <rect x="38"  y="5"  width="38" height="10" fill="#504e4a" />
      <rect x="6"   y="22" width="70" height="10" fill="#4e4c48" />
      <rect x="87"  y="2"  width="56" height="31" fill="#4a4640" />
      <rect x="91"  y="5"  width="22" height="16" fill="#545250" />
      <rect x="117" y="5"  width="22" height="22" fill="#524e48" />
      <rect x="147" y="2"  width="61" height="31" fill="#444038" />
      <rect x="151" y="5"  width="30" height="20" fill="#4e4a44" />
      <rect x="186" y="5"  width="18" height="14" fill="#504c46" />
      {/* row B (y 37–63) */}
      <rect x="2"   y="37" width="81" height="26" fill="#424038" />
      <rect x="6"   y="40" width="35" height="18" fill="#4c4a44" />
      <rect x="45"  y="40" width="34" height="12" fill="#4a4840" />
      <rect x="87"  y="37" width="56" height="26" fill="#464240" />
      <rect x="91"  y="40" width="48" height="19" fill="#504e48" />
      <rect x="147" y="37" width="61" height="26" fill="#484440" />
      <rect x="151" y="40" width="54" height="19" fill="#4e4a44" />
      {/* row C (y 67–103) */}
      <rect x="2"   y="67" width="81" height="36" fill="#444038" />
      <rect x="6"   y="70" width="40" height="28" fill="#4c4844" />
      <rect x="50"  y="70" width="28" height="14" fill="#4a4640" />
      <rect x="50"  y="88" width="28" height="12" fill="#484440" />
      <rect x="87"  y="67" width="56" height="36" fill="#464240" />
      <rect x="91"  y="70" width="48" height="28" fill="#504c48" />
      <rect x="147" y="67" width="61" height="36" fill="#424038" />
      <rect x="151" y="70" width="26" height="28" fill="#4c4840" />
      <rect x="181" y="70" width="23" height="20" fill="#4a4640" />

      {/* ─── MIDTOWN blocks (x 212–355, y 0–105) ─── */}
      <rect x="212" y="2"  width="61" height="61" fill="#3e3c34" />
      <rect x="216" y="5"  width="30" height="25" fill="#484440" />
      <rect x="250" y="5"  width="20" height="30" fill="#464240" />
      <rect x="216" y="34" width="54" height="25" fill="#424038" />
      <rect x="275" y="2"  width="53" height="61" fill="#424038" />
      <rect x="279" y="5"  width="22" height="35" fill="#4c4844" />
      <rect x="305" y="5"  width="20" height="22" fill="#4a4640" />
      <rect x="279" y="44" width="46" height="16" fill="#464240" />
      <rect x="330" y="2"  width="23" height="61" fill="#3c3a30" />
      <rect x="212" y="67" width="61" height="36" fill="#3e3c34" />
      <rect x="216" y="70" width="54" height="28" fill="#444038" />
      <rect x="275" y="67" width="53" height="36" fill="#424038" />
      <rect x="279" y="70" width="46" height="28" fill="#464240" />
      <rect x="330" y="67" width="23" height="36" fill="#3a3830" />

      {/* ─── PARK (x 357–498, y 2–103) ─── */}
      <rect x="357" y="2"  width="141" height="101" fill="#19391a" />
      <rect x="360" y="5"  width="135" height="95"  fill="#1c4020" opacity="0.65" />
      <rect x="368" y="12" width="55"  height="38"  fill="#235225" opacity="0.75" />
      <rect x="430" y="8"  width="58"  height="48"  fill="#1e4820" opacity="0.6"  />
      <rect x="365" y="60" width="42"  height="35"  fill="#1a3e1c" opacity="0.7"  />
      <rect x="415" y="62" width="68"  height="32"  fill="#214c22" opacity="0.65" />

      {/* ─── SOUTH ZONE (y 107–138) ─── */}
      <rect x="2"   y="107" width="81"  height="31" fill="#3a3830" />
      <rect x="87"  y="107" width="56"  height="31" fill="#3c3a32" />
      <rect x="147" y="107" width="61"  height="31" fill="#3a3830" />
      <rect x="212" y="107" width="61"  height="31" fill="#3a3830" />
      <rect x="275" y="107" width="53"  height="31" fill="#3c3a32" />
      <rect x="330" y="107" width="23"  height="31" fill="#383630" />
      <rect x="357" y="107" width="141" height="31" fill="#3a3830" />

      {/* ─── RIVER (y 140–165) ─── */}
      <polygon points="0,141 500,138 500,166 0,169" fill="url(#sm-river)" />
      <polygon points="0,143 500,140 500,162 0,165" fill="#0d3560" opacity="0.7" />
      <rect x="40"  y="147" width="90" height="5" fill="#103a6a" opacity="0.5" />
      <rect x="200" y="150" width="120" height="4" fill="#0f3868" opacity="0.45" />
      <rect x="370" y="148" width="80" height="5" fill="#103a6a" opacity="0.5" />

      {/* ─── FAR SOUTH (y 167–220) ─── */}
      <rect x="2"   y="167" width="81"  height="51" fill="#312e28" />
      <rect x="87"  y="167" width="56"  height="51" fill="#333028" />
      <rect x="147" y="167" width="61"  height="51" fill="#312e28" />
      <rect x="212" y="167" width="61"  height="51" fill="#2e2c28" />
      <rect x="275" y="167" width="53"  height="51" fill="#332e28" />
      <rect x="330" y="167" width="23"  height="51" fill="#302c28" />
      <rect x="357" y="167" width="141" height="51" fill="#312e28" />

      {/* ─── LOCAL STREETS (downtown only, 1.5px) ─── */}
      <line x1="0"   y1="50" x2="85"  y2="50"  stroke="#5a5448" strokeWidth="1.5" />
      <line x1="0"   y1="80" x2="85"  y2="80"  stroke="#5a5448" strokeWidth="1.5" />
      <line x1="115" y1="0"  x2="115" y2="35"  stroke="#5a5448" strokeWidth="1.5" />
      <line x1="115" y1="37" x2="115" y2="63"  stroke="#5a5448" strokeWidth="1.5" />
      <line x1="175" y1="37" x2="175" y2="63"  stroke="#5a5448" strokeWidth="1.5" />
      <line x1="175" y1="67" x2="175" y2="103" stroke="#5a5448" strokeWidth="1.5" />

      {/* ─── SECONDARY STREETS (2.5px) ─── */}
      <line x1="85"  y1="0"   x2="85"  y2="140" stroke="#7a7060" strokeWidth="2.5" />
      <line x1="145" y1="0"   x2="145" y2="140" stroke="#7a7060" strokeWidth="2.5" />
      <line x1="275" y1="0"   x2="275" y2="140" stroke="#7a7060" strokeWidth="2.5" />
      <line x1="330" y1="0"   x2="330" y2="140" stroke="#7a7060" strokeWidth="2.5" />
      <line x1="355" y1="0"   x2="355" y2="103" stroke="#7a7060" strokeWidth="2"   />
      <line x1="85"  y1="166" x2="85"  y2="220" stroke="#7a7060" strokeWidth="2"   />
      <line x1="145" y1="166" x2="145" y2="220" stroke="#7a7060" strokeWidth="2"   />
      <line x1="275" y1="166" x2="275" y2="220" stroke="#7a7060" strokeWidth="2"   />
      <line x1="0"   y1="35"  x2="210" y2="35"  stroke="#7a7060" strokeWidth="2.5" />
      <line x1="0"   y1="65"  x2="210" y2="65"  stroke="#7a7060" strokeWidth="2.5" />
      <line x1="0"   y1="140" x2="500" y2="140" stroke="#7a7060" strokeWidth="2.5" />
      <line x1="0"   y1="166" x2="500" y2="166" stroke="#7a7060" strokeWidth="2"   />

      {/* ─── GRAND AVENUE diagonal (0,105)→(210,35) ─── */}
      <line x1="0" y1="105" x2="210" y2="35" stroke="#9a8e76" strokeWidth="4" opacity="0.9" />

      {/* ─── MAIN ARTERIES (5px) ─── */}
      <line x1="0"   y1="105" x2="500" y2="105" stroke="#9a8e76" strokeWidth="5" />
      <line x1="210" y1="0"   x2="210" y2="220" stroke="#9a8e76" strokeWidth="5" />
    </svg>
  );
}
