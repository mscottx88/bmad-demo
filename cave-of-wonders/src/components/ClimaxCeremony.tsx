import { useEffect, useState } from 'react';
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
            The treasures swirl together…
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
            YOUR WISH… IS GRANTED!
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
            <p className="reveal__eyebrow">✨ Built &amp; ready ✨</p>
            <AppMock />
            <RewardCounter totals={totals} animate={!reducedMotion} />
            <p className="reveal__footnote">
              That’s the BMAD method — one wish, five experts, real treasure.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** A small mock of the finished "FridgeChef" app — the granted wish, made real. */
function AppMock() {
  return (
    <div className="app-mock" data-testid="app-mock" aria-label={`${WISH.appName} app preview`}>
      <div className="app-mock__bar">
        <span className="app-mock__dot" />
        <span className="app-mock__dot" />
        <span className="app-mock__dot" />
        <span className="app-mock__title">🍳 {WISH.appName}</span>
      </div>
      <div className="app-mock__body">
        <p className="app-mock__tagline">{WISH.tagline}</p>
        <div className="app-mock__chips">
          <span>🥚 eggs</span>
          <span>🧀 cheese</span>
          <span>🍅 tomato</span>
          <span>🌿 basil</span>
        </div>
        <ul className="app-mock__recipes">
          <li>
            <span>Tomato &amp; Basil Frittata</span>
            <span className="app-mock__match">100% match</span>
          </li>
          <li>
            <span>Cheesy Caprese Toast</span>
            <span className="app-mock__match">90% match</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
