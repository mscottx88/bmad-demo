import { useEffect, useState } from 'react';
import type { RewardTotals } from '../types';

interface Props {
  totals: RewardTotals;
  /** When true, numbers count up; when false they show final value instantly. */
  animate: boolean;
}

function useCountUp(target: number, run: boolean, durationMs = 1100): number {
  const [value, setValue] = useState(run ? 0 : target);

  useEffect(() => {
    if (!run) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutCubic for a satisfying spin-up
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, durationMs]);

  return value;
}

/** The payoff readout that spins up at the climax — value made tangible. */
export default function RewardCounter({ totals, animate }: Props) {
  const hours = useCountUp(totals.hoursSaved, animate);
  const artifacts = useCountUp(totals.artifacts, animate);
  const tests = useCountUp(totals.testsPassing, animate);

  return (
    <div className="reward-counter" data-testid="reward-counter">
      <div className="reward-counter__stat">
        <span className="reward-counter__num">{hours}</span>
        <span className="reward-counter__label">⏱️ hours saved</span>
      </div>
      <div className="reward-counter__stat">
        <span className="reward-counter__num">{artifacts}</span>
        <span className="reward-counter__label">📦 artifacts</span>
      </div>
      <div className="reward-counter__stat">
        <span className="reward-counter__num">{tests}</span>
        <span className="reward-counter__label">✅ tests passing</span>
      </div>
    </div>
  );
}
