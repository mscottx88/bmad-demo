import type { Sequencer } from '../hooks/useRideSequencer';
import type { RideStep } from '../types';

interface Props {
  sequencer: Sequencer;
  steps: RideStep[];
}

function stepLabel(step: RideStep, i: number): string {
  if (step.kind === 'intro') return 'Brainstorming';
  if (step.kind === 'climax') return 'Implementation';
  if (step.kind === 'cheatsheet') return 'Cheat Sheet';
  return `${step.phase?.persona.name ?? i}`;
}

/** Presenter controls: play/pause, replay, step navigation + jump dots. */
export default function Controls({ sequencer, steps }: Props) {
  const { index, playing, atStart, atEnd, toggle, prev, next, replay, goTo } = sequencer;

  return (
    <div className="controls" data-testid="controls">
      <button className="controls__btn" onClick={prev} disabled={atStart} aria-label="Previous step">
        ⏮
      </button>

      {atEnd ? (
        <button className="controls__btn controls__btn--primary" onClick={replay} aria-label="Replay">
          ↻ Replay
        </button>
      ) : (
        <button
          className="controls__btn controls__btn--primary"
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
      )}

      <button className="controls__btn" onClick={next} disabled={atEnd} aria-label="Next step">
        ⏭
      </button>

      <div className="controls__dots" role="tablist" aria-label="Jump to step">
        {steps.map((step, i) => (
          <button
            key={i}
            className={`controls__dot${i === index ? ' is-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to ${stepLabel(step, i)}`}
            aria-selected={i === index}
            role="tab"
          >
            <span className="controls__dot-label">{stepLabel(step, i)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
