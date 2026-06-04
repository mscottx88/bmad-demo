import { motion } from 'framer-motion';
import CheatSheet from './CheatSheet';

interface Props {
  reducedMotion: boolean;
}

/** The final ride step: a takeaway cheat-sheet screen after the climax. */
export default function CheatSheetScreen({ reducedMotion }: Props) {
  return (
    <motion.section
      className="scene cheat-screen"
      data-testid="cheat-screen"
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.5 }}
    >
      <p className="eyebrow">Your takeaway</p>
      <CheatSheet />
      <p className="hint">Take this back to your team — every command is real.</p>
    </motion.section>
  );
}
