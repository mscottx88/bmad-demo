import { motion } from 'framer-motion';
import { WISH } from '../data/phases';

interface Props {
  reducedMotion: boolean;
}

/**
 * The opening beat: the user's raw, scruffy idea is the "Diamond in the
 * Rough" — humble but precious — that the genie is about to polish into
 * treasure.
 */
export default function WishIntro({ reducedMotion }: Props) {
  return (
    <motion.section
      className="scene wish-intro"
      data-testid="wish-intro"
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: reducedMotion ? 0 : 0.5 }}
    >
      <p className="eyebrow">Rub the lamp & make a wish</p>
      <div className="diamond" aria-hidden>💎</div>
      <p className="diamond-label">Your idea — the Diamond in the Rough</p>
      <blockquote className="wish-text">“{WISH.raw}”</blockquote>
      <p className="hint">The BMAD genie will grant it — one expert at a time.</p>
    </motion.section>
  );
}
