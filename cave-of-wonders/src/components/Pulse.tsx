import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  /** Changes whenever a new step begins — re-triggers the flash. */
  triggerKey: number;
  reducedMotion: boolean;
}

/**
 * A mini hush→poof "heartbeat": a quick radial flash each time the step
 * changes, giving the ride a pulse. Motion-only so reduced-motion snapshots
 * stay clean.
 */
export default function Pulse({ triggerKey, reducedMotion }: Props) {
  if (reducedMotion) return null;
  return (
    <AnimatePresence>
      <motion.div
        key={triggerKey}
        className="pulse"
        aria-hidden
        initial={{ opacity: 0.4, scale: 0.6 }}
        animate={{ opacity: 0, scale: 1.25 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      />
    </AnimatePresence>
  );
}
