import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Stage from './components/Stage';
import Genie from './components/Genie';
import WishIntro from './components/WishIntro';
import Workspace from './components/Workspace';
import ClimaxCeremony from './components/ClimaxCeremony';
import CheatSheetScreen from './components/CheatSheetScreen';
import CheatSheetPanel from './components/CheatSheetPanel';
import TreasureVault from './components/TreasureVault';
import Controls from './components/Controls';
import Toolbar from './components/Toolbar';
import ProgressBar from './components/ProgressBar';
import Pulse from './components/Pulse';
import { useRideSequencer } from './hooks/useRideSequencer';
import { useFullscreen } from './hooks/useFullscreen';
import { useKeyboard } from './hooks/useKeyboard';
import { playCue } from './audio';
import { PHASES, RIDE_STEPS } from './data/phases';
import type { RewardTotals, TreeFile } from './types';

/**
 * Read once-only URL params so Playwright can seed a deterministic state:
 *   ?paused=1 ?step=N ?reducedMotion=1 ?present=1
 */
function readParams() {
  if (typeof window === 'undefined') {
    return { paused: false, step: 0, forceReduced: false, present: false };
  }
  const p = new URLSearchParams(window.location.search);
  const stepRaw = Number(p.get('step'));
  return {
    paused: p.get('paused') === '1',
    step: Number.isFinite(stepRaw) ? stepRaw : 0,
    forceReduced: p.get('reducedMotion') === '1',
    present: p.get('present') === '1',
  };
}

export default function App() {
  const params = useMemo(readParams, []);
  const systemReduced = useReducedMotion();
  const reducedMotion = params.forceReduced || !!systemReduced;

  const steps = RIDE_STEPS;
  const sequencer = useRideSequencer(steps, {
    autoplay: !params.paused,
    startIndex: params.step,
  });

  const [present, setPresent] = useState(params.present);
  const [cheatOpen, setCheatOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const fullscreen = useFullscreen();

  const step = steps[sequencer.index];

  const collected = useMemo(
    () => PHASES.filter((phase) => sequencer.index >= phase.index),
    [sequencer.index],
  );
  const cumulativeFiles = useMemo<TreeFile[]>(
    () => collected.flatMap((phase) => phase.files),
    [collected],
  );
  const totals = useMemo<RewardTotals>(
    () => ({
      hoursSaved: collected.reduce((sum, p) => sum + p.reward.hoursSaved, 0),
      artifacts: collected.length,
      testsPassing: collected.reduce((sum, p) => sum + (p.reward.testsPassing ?? 0), 0),
    }),
    [collected],
  );

  // --- Present mode ---
  const enterPresent = useCallback(() => {
    setPresent(true);
    fullscreen.enter();
    sequencer.play();
  }, [fullscreen, sequencer]);

  const exitPresent = useCallback(() => {
    setPresent(false);
    fullscreen.exit();
  }, [fullscreen]);

  const togglePresent = useCallback(() => {
    setPresent((p) => {
      if (p) {
        fullscreen.exit();
        return false;
      }
      fullscreen.enter();
      sequencer.play();
      return true;
    });
  }, [fullscreen, sequencer]);

  // If the user leaves fullscreen (Esc) while presenting, leave present too —
  // but only when we had actually entered fullscreen (avoids headless false-exit).
  const wasFs = useRef(false);
  useEffect(() => {
    if (wasFs.current && !fullscreen.isFullscreen && present) setPresent(false);
    wasFs.current = fullscreen.isFullscreen;
  }, [fullscreen.isFullscreen, present]);

  // --- Sound cues on step change (only when unmuted) ---
  const prevIndex = useRef(sequencer.index);
  useEffect(() => {
    const cur = sequencer.index;
    if (cur !== prevIndex.current) {
      if (!muted) {
        const k = steps[cur].kind;
        if (k === 'climax') playCue('erupt');
        else if (k === 'cheatsheet') playCue('kaching');
        else playCue('whoosh');
      }
      prevIndex.current = cur;
    }
  }, [sequencer.index, muted, steps]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const nextMuted = !m;
      if (!nextMuted) playCue('whoosh'); // feedback on unmute (user gesture)
      return nextMuted;
    });
  }, []);

  // --- Keyboard ---
  const handlers = useMemo(
    () => ({
      Space: sequencer.toggle,
      ArrowLeft: sequencer.prev,
      ArrowRight: sequencer.next,
      p: togglePresent,
      c: () => setCheatOpen((o) => !o),
      m: toggleMute,
      Escape: () => {
        if (present) exitPresent();
        else setCheatOpen(false);
      },
    }),
    [sequencer.toggle, sequencer.prev, sequencer.next, togglePresent, toggleMute, present, exitPresent],
  );
  useKeyboard(handlers);

  const stageAccent =
    step.kind === 'phase'
      ? step.phase!.persona.accent
      : step.kind === 'climax' || step.kind === 'cheatsheet'
        ? '#ffd86b'
        : '#7fd1ff';

  return (
    <Stage accent={stageAccent} present={present}>
      <ProgressBar index={sequencer.index} total={steps.length} />
      <Pulse triggerKey={sequencer.index} reducedMotion={reducedMotion} />

      {!present && (
        <Toolbar
          muted={muted}
          onToggleMute={toggleMute}
          onPresent={enterPresent}
          onToggleCheat={() => setCheatOpen((o) => !o)}
        />
      )}

      {step.kind === 'phase' ? (
        <div className="ride ride--work">
          <header className="work-header">
            <Genie
              persona={step.phase!.persona}
              mode="phase"
              variant="mascot"
              speech={step.phase!.persona.line}
              reducedMotion={reducedMotion}
            />
            <p className="work-header__label">
              Phase {step.phase!.index} of 5 · {step.phase!.bmadPhase}
            </p>
          </header>
          <div className="ride__work-body">
            <Workspace
              phase={step.phase!}
              cumulativeFiles={cumulativeFiles}
              reducedMotion={reducedMotion}
            />
            <TreasureVault collected={collected} total={PHASES.length} reducedMotion={reducedMotion} />
          </div>
        </div>
      ) : step.kind === 'cheatsheet' ? (
        <div className="ride ride--cheat">
          <CheatSheetScreen reducedMotion={reducedMotion} />
        </div>
      ) : (
        <div className="ride">
          <div className="ride__main">
            <Genie persona={null} mode={step.kind} reducedMotion={reducedMotion} />
            <div className="ride__center">
              {step.kind === 'intro' && <WishIntro reducedMotion={reducedMotion} />}
              {step.kind === 'climax' && (
                <ClimaxCeremony totals={totals} reducedMotion={reducedMotion} />
              )}
            </div>
          </div>
          <TreasureVault collected={collected} total={PHASES.length} reducedMotion={reducedMotion} />
        </div>
      )}

      <CheatSheetPanel open={cheatOpen} onClose={() => setCheatOpen(false)} reducedMotion={reducedMotion} />

      {present ? (
        <button type="button" className="present-hint" onClick={exitPresent} data-testid="present-hint">
          Esc to exit · ← → navigate
        </button>
      ) : (
        <Controls sequencer={sequencer} steps={steps} />
      )}
    </Stage>
  );
}
