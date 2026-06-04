/**
 * Tiny synthesized sound engine — Web Audio oscillators only, no asset files,
 * no third-party IP. Every cue is safe to call: if Web Audio is unavailable it
 * silently no-ops, and the context is created lazily on first (gesture-driven)
 * play to respect browser autoplay policy.
 */

type Cue = 'whoosh' | 'hush' | 'erupt' | 'kaching';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
  } catch {
    ctx = null;
  }
  return ctx;
}

interface ToneOptions {
  type?: OscillatorType;
  freq: number;
  /** Glide to this frequency over the note. */
  slideTo?: number;
  start: number;
  duration: number;
  peak?: number;
}

function tone(ac: AudioContext, at: number, o: ToneOptions) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(o.freq, at + o.start);
  if (o.slideTo) {
    osc.frequency.exponentialRampToValueAtTime(o.slideTo, at + o.start + o.duration);
  }
  const peak = o.peak ?? 0.12;
  gain.gain.setValueAtTime(0.0001, at + o.start);
  gain.gain.exponentialRampToValueAtTime(peak, at + o.start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + o.start + o.duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(at + o.start);
  osc.stop(at + o.start + o.duration + 0.02);
}

/** Play a named cue. No-op if muted (handled by caller) or Web Audio absent. */
export function playCue(cue: Cue): void {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === 'suspended') void ac.resume();
  const now = ac.currentTime;

  switch (cue) {
    case 'whoosh':
      tone(ac, now, { type: 'triangle', freq: 180, slideTo: 520, start: 0, duration: 0.28, peak: 0.07 });
      break;
    case 'hush':
      tone(ac, now, { type: 'sine', freq: 320, slideTo: 90, start: 0, duration: 0.5, peak: 0.06 });
      break;
    case 'erupt':
      tone(ac, now, { type: 'sawtooth', freq: 140, slideTo: 880, start: 0, duration: 0.5, peak: 0.12 });
      tone(ac, now, { type: 'sine', freq: 1320, start: 0.12, duration: 0.5, peak: 0.1 });
      break;
    case 'kaching':
      tone(ac, now, { type: 'square', freq: 1180, start: 0, duration: 0.09, peak: 0.08 });
      tone(ac, now, { type: 'square', freq: 1560, start: 0.1, duration: 0.16, peak: 0.08 });
      break;
  }
}
