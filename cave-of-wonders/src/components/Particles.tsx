import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  count?: number;
  reducedMotion: boolean;
}

/**
 * A gold particle burst for the climax eruption. Only renders when motion is
 * enabled — under reduced motion it returns null so seeded snapshots never see
 * its (random) layout.
 */
export default function Particles({ count = 18, reducedMotion }: Props) {
  // Precompute random vectors once per mount.
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 120 + Math.random() * 160;
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          delay: Math.random() * 0.12,
          glyph: i % 3 === 0 ? '✨' : i % 3 === 1 ? '🪙' : '⭐',
        };
      }),
    [count],
  );

  if (reducedMotion) return null;

  return (
    <div className="particles" aria-hidden data-testid="particles">
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="particles__bit"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
          animate={{ x: b.x, y: b.y, opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.1, delay: b.delay, ease: 'easeOut' }}
        >
          {b.glyph}
        </motion.span>
      ))}
    </div>
  );
}
