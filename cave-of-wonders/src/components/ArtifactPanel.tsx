import { AnimatePresence, motion } from 'framer-motion';
import type { Phase } from '../types';

interface Props {
  collected: Phase[];
  total: number;
  reducedMotion: boolean;
}

/** Sidebar panel that accumulates one artifact per completed BMAD phase. */
export default function ArtifactPanel({ collected, total, reducedMotion }: Props) {
  return (
    <aside className="vault" data-testid="vault">
      <h2 className="vault__title">
        Artifacts
        <span className="vault__count">
          {collected.length}/{total}
        </span>
      </h2>
      <ul className="vault__list">
        <AnimatePresence initial={false}>
          {collected.map((phase) => (
            <motion.li
              key={phase.artifact.id}
              className="vault__item"
              data-testid="vault-item"
              initial={reducedMotion ? false : { x: 40, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, ease: 'backOut' }}
              style={{ ['--accent' as string]: phase.persona.accent }}
            >
              <span className="vault__icon" role="img" aria-label={phase.artifact.title}>
                {phase.artifact.icon}
              </span>
              <span className="vault__label">{phase.artifact.title}</span>
            </motion.li>
          ))}
        </AnimatePresence>
        {collected.length === 0 && <li className="vault__empty">No artifacts yet.</li>}
      </ul>
    </aside>
  );
}
