import { motion } from 'framer-motion';
import { WISH } from '../data/phases';

interface Props {
  reducedMotion: boolean;
}

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
      <p className="eyebrow">$ brainstorm —</p>
      <div className="prompt-block" aria-label="Brainstorming input">
        <span className="prompt-block__prefix">&gt;</span>
        <blockquote className="wish-text">"{WISH.raw}"</blockquote>
      </div>
      <p className="wish-intro__label">Your brainstorming input, before BMAD</p>
      <p className="hint">BMAD structures this into a shippable implementation in five phases.</p>
    </motion.section>
  );
}
