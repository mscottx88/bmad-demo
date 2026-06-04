import { AnimatePresence, motion } from 'framer-motion';
import CheatSheet from './CheatSheet';

interface Props {
  open: boolean;
  onClose: () => void;
  reducedMotion: boolean;
}

/** Controlled slide-out cheat sheet (opened from the Toolbar or the `C` key). */
export default function CheatSheetPanel({ open, onClose, reducedMotion }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="cheat-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-testid="cheat-backdrop"
          />
          <motion.aside
            className="cheat-panel"
            data-testid="cheat-panel"
            initial={reducedMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
          >
            <button
              type="button"
              className="cheat-panel__close"
              onClick={onClose}
              aria-label="Close cheat sheet"
            >
              ✕
            </button>
            <CheatSheet />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
