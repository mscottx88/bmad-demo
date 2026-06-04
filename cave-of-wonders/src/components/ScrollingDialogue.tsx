import { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  reducedMotion: boolean;
}

const MS_PER_CHAR = 20; // 50 chars/sec ≈ 250 WPM at 5 chars/word

/**
 * Typewriter-reveals text at ~500 WPM (10ms/char).
 * Under reduced motion, shows full text immediately.
 * Resets and replays whenever `text` changes.
 */
export default function ScrollingDialogue({ text, reducedMotion }: Props) {
  const [visibleCount, setVisibleCount] = useState(reducedMotion ? text.length : 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(reducedMotion ? text.length : 0);

    if (reducedMotion || text.length === 0) return;

    intervalRef.current = setInterval(() => {
      setVisibleCount((n) => Math.min(n + 1, text.length));
    }, MS_PER_CHAR);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, reducedMotion]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleCount]);

  return (
    <div
      ref={bodyRef}
      className="scrolling-dialogue"
      data-testid="scrolling-dialogue"
      aria-label={text}
    >
      <span className="scrolling-dialogue__label">// agent commentary</span>
      <p className="scrolling-dialogue__text" aria-hidden="true">{text.slice(0, visibleCount)}</p>
    </div>
  );
}
