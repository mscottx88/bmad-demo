import { AnimatePresence, motion } from 'framer-motion';
import type { Persona } from '../types';

interface Props {
  persona: Persona | null;
  mode: 'intro' | 'phase' | 'climax';
  reducedMotion: boolean;
  /** 'full' = large centerpiece; 'mascot' = compact corner guide. */
  variant?: 'full' | 'mascot';
  /** Optional speech bubble (used in the blended workspace layout). */
  speech?: string;
}

const INTRO_ACCENT = '#7fd1ff';
const CLIMAX_ACCENT = '#ffd86b';

/**
 * One original wish-granting genie (NOT Disney's Genie / Robin Williams).
 * The same character "shapeshifts" into each BMAD persona by swapping its
 * accent color, glyph, and nameplate — the teaching spine of the demo.
 */
export default function Genie({
  persona,
  mode,
  reducedMotion,
  variant = 'full',
  speech,
}: Props) {
  const accent =
    mode === 'climax' ? CLIMAX_ACCENT : persona ? persona.accent : INTRO_ACCENT;
  const glyph = mode === 'climax' ? '🎉' : persona ? persona.glyph : '🧞';
  const morphKey = mode === 'climax' ? 'climax' : persona ? persona.id : 'intro';

  const floatAnim = reducedMotion
    ? {}
    : { y: [0, -10, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } };

  return (
    <div
      className={`genie genie--${variant}`}
      data-testid="genie"
      style={{ ['--accent' as string]: accent }}
    >
      {speech && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${morphKey}-speech`}
            className="genie__speech"
            data-testid="genie-speech"
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reducedMotion ? 0 : 0.35 }}
          >
            “{speech}”
          </motion.div>
        </AnimatePresence>
      )}
      <motion.div className="genie__body" animate={floatAnim}>
        <div className="genie__cursor" aria-hidden />
        <AnimatePresence mode="wait">
          <motion.div
            key={morphKey}
            className="genie__head"
            initial={reducedMotion ? false : { scale: 0.4, opacity: 0, filter: 'blur(8px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={reducedMotion ? { opacity: 0 } : { scale: 0.4, opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: reducedMotion ? 0 : 0.45 }}
          >
            <span className="genie__glyph" role="img" aria-label={persona?.role ?? 'genie'}>
              {glyph}
            </span>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${morphKey}-plate`}
          className="genie__plate"
          initial={reducedMotion ? false : { y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { y: -8, opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.35 }}
        >
          {mode === 'phase' && persona ? (
            <>
              <strong>{persona.name}</strong>
              <span>{persona.role}</span>
            </>
          ) : mode === 'climax' ? (
            <strong>Shipped ✓</strong>
          ) : (
            <strong>BMAD Agent</strong>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
