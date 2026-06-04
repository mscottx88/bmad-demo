import { useCallback, useEffect, useRef, useState } from 'react';
import type { RideStep } from '../types';

interface Options {
  autoplay: boolean;
  startIndex: number;
}

export interface Sequencer {
  index: number;
  playing: boolean;
  atStart: boolean;
  atEnd: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  goTo: (i: number) => void;
  replay: () => void;
}

/**
 * Drives the on-rails ride: auto-advances through steps on a per-step timer,
 * with manual play / pause / replay / skip. Any manual action pauses autoplay
 * so the presenter stays in control. Stops automatically at the final step.
 */
export function useRideSequencer(steps: RideStep[], options: Options): Sequencer {
  const lastIndex = steps.length - 1;
  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(i, lastIndex)),
    [lastIndex],
  );

  const [index, setIndex] = useState(() => clamp(options.startIndex));
  const [playing, setPlaying] = useState(options.autoplay);
  const timer = useRef<number | null>(null);

  const atEnd = index >= lastIndex;
  const atStart = index <= 0;

  useEffect(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if (!playing) return;
    if (index >= lastIndex) {
      // Reached the climax — settle and stop the ride.
      setPlaying(false);
      return;
    }
    const ms = steps[index]?.durationMs ?? 4000;
    timer.current = window.setTimeout(() => {
      setIndex((i) => Math.min(i + 1, lastIndex));
    }, ms);

    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [index, playing, steps, lastIndex]);

  const play = useCallback(() => {
    setIndex((i) => (i >= lastIndex ? 0 : i));
    setPlaying(true);
  }, [lastIndex]);

  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => setPlaying((p) => !p), []);

  const next = useCallback(() => {
    setPlaying(false);
    setIndex((i) => Math.min(i + 1, lastIndex));
  }, [lastIndex]);

  const prev = useCallback(() => {
    setPlaying(false);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setPlaying(false);
      setIndex(clamp(i));
    },
    [clamp],
  );

  const replay = useCallback(() => {
    setIndex(0);
    setPlaying(true);
  }, []);

  return { index, playing, atStart, atEnd, play, pause, toggle, next, prev, goTo, replay };
}
