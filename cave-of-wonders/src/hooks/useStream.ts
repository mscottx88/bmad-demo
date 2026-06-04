import { useEffect, useState } from 'react';

interface TypewriterOptions {
  enabled: boolean;
  /** Characters per second. */
  cps?: number;
  /** Delay before typing starts (ms). */
  delayMs?: number;
}

/**
 * Reveals `text` character-by-character. When `enabled` is false (reduced
 * motion / seeked state) it shows the full text instantly for deterministic
 * snapshots. RAF-driven so it stays smooth and cancels cleanly on unmount.
 */
export function useTypewriter(
  text: string,
  { enabled, cps = 55, delayMs = 0 }: TypewriterOptions,
): { shown: string; done: boolean } {
  const [count, setCount] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    if (!enabled) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let raf = 0;
    let startedAt = 0;
    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const elapsed = now - startedAt - delayMs;
      if (elapsed >= 0) {
        const n = Math.min(text.length, Math.floor((elapsed / 1000) * cps));
        setCount(n);
        if (n >= text.length) return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, enabled, cps, delayMs]);

  return { shown: text.slice(0, count), done: count >= text.length };
}

interface LineStreamOptions {
  enabled: boolean;
  /** Delay between successive lines (ms). */
  lineMs?: number;
  /** Delay before the first line (ms). */
  delayMs?: number;
}

/**
 * Reveals an array of `lines` one at a time. Instant-completes when disabled.
 */
export function useLineStream(
  lines: string[],
  { enabled, lineMs = 1300, delayMs = 0 }: LineStreamOptions,
): { shown: string[]; done: boolean } {
  const [n, setN] = useState(enabled ? 0 : lines.length);

  useEffect(() => {
    if (!enabled) {
      setN(lines.length);
      return;
    }
    setN(0);
    const timers = lines.map((_, i) =>
      window.setTimeout(() => setN(i + 1), delayMs + i * lineMs),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [lines, enabled, lineMs, delayMs]);

  return { shown: lines.slice(0, n), done: n >= lines.length };
}
