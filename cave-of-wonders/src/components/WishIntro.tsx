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
      <p className="eyebrow">$ idea —</p>
      <div className="prompt-block" aria-label="Your feature idea">
        <span className="prompt-block__prefix">&gt;</span>
        <blockquote className="wish-text">"{WISH.raw}"</blockquote>
      </div>
      <p className="wish-intro__label">Your feature idea, before BMAD</p>
      <p className="hint">BMAD transforms this into a shippable spec in five structured phases.</p>
    </motion.section>
  );
}
