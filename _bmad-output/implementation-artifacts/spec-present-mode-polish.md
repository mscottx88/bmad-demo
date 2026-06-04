---
title: 'Cave of Wonders — Present Mode + Polish'
type: 'feature'
created: '2026-06-03'
status: 'done'
baseline_commit: 'c345e0ad5abf2c8c6b1eba73004a6601cba3b5de'
context: ['{project-root}/_bmad-output/implementation-artifacts/spec-engineer-extras.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The demo is feature-complete but not yet presentation-ready: the dev/presenter chrome is always visible, there's no keyboard control for a live room, and the ride lacks the sensory polish (sound, pulse, particles) that makes a screening land.

**Approach:** Add a **present mode** (toggle button + `?present=1` + keyboard, with optional browser fullscreen) that hides all chrome for a clean screening, plus polish: **keyboard shortcuts**, **synthesized Web-Audio sound** (no asset files, muted by default with a toggle), a **per-phase mini hush→poof pulse + progress bar**, and a **gold particle burst** at the climax eruption. Stay self-contained, client-side, upbeat. No backend.

## Boundaries & Constraints

**Always:** Reuse the existing ride/app. New flourishes (present mode, pulse, particles) must be OFF or instant under reduced motion / by default so the existing Playwright snapshots stay deterministic. Sound is **muted by default**, synthesized via Web Audio (oscillators) — no audio files. Fullscreen + audio start only from a user gesture, guarded for absence. Honor existing URL-seed params; add `?present=1`.

**Ask First:** Adding any dependency. Adding a backend (explicitly out of scope this iteration). Auto-playing sound without a gesture.

**Never:** Audio/image asset files or third-party IP. A backend/network calls. Random/non-deterministic visuals while reduced motion is on (particles/pulse must be gated off so snapshots are stable).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Enter present | Click Present / press `P` / `?present=1` | Hide toolbar + controls, enlarge stage, show minimal "Esc to exit" hint, request fullscreen, start playing | fullscreen rejection caught & ignored |
| Exit present | `Esc`, click hint, or leaving fullscreen | Restore chrome; exit fullscreen if active | N/A |
| Keyboard | `Space`/`←`/`→`/`P`/`C`/`M` | play-pause / prev / next / present / cheat / mute | ignore when focus in a button only as needed |
| Sound toggle | Click mute button or `M` | Toggles synthesized cues; default muted | if Web Audio absent, toggle is a no-op (no throw) |
| Phase change (motion) | Step advances | Brief mini hush→poof pulse + progress bar updates + optional whoosh cue | N/A |
| Climax erupt (motion) | Reveal stage reached | Gold particle burst + erupt/ka-ching cue | N/A |
| Reduced motion / seeded | `?reducedMotion=1` | No particles, no pulse, present off by default; toolbar/progress render statically | N/A |

</frozen-after-approval>

## Code Map

- `cave-of-wonders/src/audio.ts` -- NEW: lazy AudioContext + synthesized cues (whoosh/hush/erupt/kaching); safe when absent
- `cave-of-wonders/src/hooks/useKeyboard.ts` -- NEW: global keydown → action map
- `cave-of-wonders/src/hooks/useFullscreen.ts` -- NEW: request/exit fullscreen + sync on fullscreenchange
- `cave-of-wonders/src/components/Toolbar.tsx` -- NEW: top-right buttons (Present, Mute, Cheat Sheet); hidden in present mode
- `cave-of-wonders/src/components/ProgressBar.tsx` -- NEW: ride progress from sequencer index
- `cave-of-wonders/src/components/Pulse.tsx` -- NEW: keyed mini hush→poof flash on step change (motion only)
- `cave-of-wonders/src/components/Particles.tsx` -- NEW: gold burst (motion only; deterministic-off under reduced motion)
- `cave-of-wonders/src/components/CheatSheetPanel.tsx` -- make `open`/`onClose` controlled (lift state to App); drop internal toggle button
- `cave-of-wonders/src/components/ClimaxCeremony.tsx` -- render Particles during erupt/reveal when motion on
- `cave-of-wonders/src/components/Stage.tsx` -- accept `present` flag for enlarged/clean layout
- `cave-of-wonders/src/App.tsx` -- own present/cheatOpen/muted state; wire keyboard, sound cues, Toolbar, ProgressBar, Pulse; hide chrome in present
- `cave-of-wonders/src/styles/global.css` -- toolbar, present mode, progress bar, pulse, particles, mute styles
- `cave-of-wonders/tests/ride.spec.ts` -- present-mode (hide chrome), `?present=1`, keyboard nav, toolbar buttons, progress bar; refresh snapshots for the new toolbar

## Tasks & Acceptance

**Execution:**
- [x] `cave-of-wonders/src/audio.ts` -- synthesized cues with lazy ctx + resume; no-throw when unavailable -- sound engine
- [x] `cave-of-wonders/src/hooks/useFullscreen.ts` -- enter/exit + fullscreenchange sync -- screening support
- [x] `cave-of-wonders/src/hooks/useKeyboard.ts` -- keydown→handlers map; preventDefault Space -- live control
- [x] `cave-of-wonders/src/components/Toolbar.tsx` -- Present / Mute / Cheat buttons -- chrome controls
- [x] `cave-of-wonders/src/components/ProgressBar.tsx` -- index-based progress -- orientation
- [x] `cave-of-wonders/src/components/Pulse.tsx` -- mini hush→poof on step change (motion only) -- the ride's heartbeat
- [x] `cave-of-wonders/src/components/Particles.tsx` -- gold burst (motion only) -- climax wow
- [x] `cave-of-wonders/src/components/CheatSheetPanel.tsx` -- controlled open/onClose -- keyboard/toolbar driven
- [x] `cave-of-wonders/src/components/ClimaxCeremony.tsx` -- mount Particles on erupt/reveal when motion on -- burst
- [x] `cave-of-wonders/src/components/Stage.tsx` -- `present` flag styling hook -- clean screening
- [x] `cave-of-wonders/src/App.tsx` -- present/cheat/muted state, keyboard, sound triggers, Toolbar+ProgressBar+Pulse, hide chrome in present -- wiring
- [x] `cave-of-wonders/src/styles/global.css` -- toolbar/present/progress/pulse/particles styles -- visual
- [x] `cave-of-wonders/tests/ride.spec.ts` -- present + keyboard + toolbar + progress assertions; refresh snapshots -- regression safety

**Acceptance Criteria:**
- Given any step, when Present is activated (button, `P`, or `?present=1`), then the toolbar and controls hide, an "Esc to exit" hint shows, and a fullscreen request is attempted (failure ignored).
- Given present mode, when `Esc` is pressed or fullscreen is left, then the normal chrome returns.
- Given keyboard focus on the page, when `Space`/`←`/`→` are pressed, then play-pause/prev/next act accordingly.
- Given sound is muted by default, when the mute button or `M` toggles it on, then synthesized cues play on transitions/climax (no asset files); absence of Web Audio never throws.
- Given motion is enabled, when a phase changes then a mini pulse fires and the progress bar advances; when the climax erupts then a gold particle burst plays.
- Given reduced motion or a seeded step, when rendered then no particles/pulse appear and present mode is off, keeping snapshots deterministic.

## Design Notes

Lift `cheatOpen` to App so `C` and the Toolbar both control the panel; `CheatSheetPanel` becomes controlled (`open`, `onClose`). Sound: one module-level lazy `AudioContext`; each cue is a short oscillator envelope (e.g., erupt = rising sine + chime, ka-ching = two quick blips); `playCue` resumes the ctx and is a no-op if muted/unavailable. Particles: ~18 spans with precomputed random angles created once per mount, animated outward then faded via Framer — only mounted when `!reducedMotion`, so reduced-motion snapshots never see them. Pulse: a keyed full-stage radial flash (opacity 0→0.4→0) on index change, `!reducedMotion` only. Present mode adds a `stage--present` class (hide `.controls`/`.toolbar`, scale up content) and calls `useFullscreen`.

## Verification

**Commands:**
- `cd cave-of-wonders && npx tsc --noEmit` -- expected: no type errors
- `cd cave-of-wonders && npm run build` -- expected: build succeeds
- `cd cave-of-wonders && npm run test:update && npm run test` -- expected: snapshots regenerate then pass

**Manual checks:**
- Press `P` (or click Present) → chrome hides, fullscreen, autoplay; `Esc` exits. Unmute (`M`) and play → hear cues. Watch a phase change for the pulse + progress; watch the climax for the particle burst.

## Spec Change Log

- _No bad_spec loopbacks; no patches._ Built and verified clean (tsc + build + 13 Playwright tests). Inline review found no blocking issues. Determinism preserved: particles/pulse are motion-gated, present defaults off, sound is muted + DOM-silent — the climax test asserts `particles` is absent under reduced motion.

## Suggested Review Order

**Present mode & control**

- Owns present/cheat/muted state; wires keyboard, sound cues, chrome-hiding; fullscreen-exit sync guarded for headless.
  [`App.tsx:78`](../../cave-of-wonders/src/App.tsx#L78)
- Guarded Fullscreen API wrapper (never throws).
  [`useFullscreen.ts:9`](../../cave-of-wonders/src/hooks/useFullscreen.ts#L9)
- Global keydown → action map (Space/←/→/P/C/M).
  [`useKeyboard.ts:12`](../../cave-of-wonders/src/hooks/useKeyboard.ts#L12)

**Polish**

- Synthesized Web-Audio cues; lazy ctx, no-throw, no asset files.
  [`audio.ts:43`](../../cave-of-wonders/src/audio.ts#L43)
- Gold burst — motion-only so reduced-motion snapshots never see it.
  [`Particles.tsx:14`](../../cave-of-wonders/src/components/Particles.tsx#L14)
- Mini hush→poof flash on step change (motion-only).
  [`Pulse.tsx:17`](../../cave-of-wonders/src/components/Pulse.tsx#L17)
- Toolbar (present/mute/cheat) + progress bar.
  [`Toolbar.tsx:9`](../../cave-of-wonders/src/components/Toolbar.tsx#L9)
  [`ProgressBar.tsx:8`](../../cave-of-wonders/src/components/ProgressBar.tsx#L8)

**Integration**

- Controlled cheat panel (keyboard/toolbar-driven).
  [`CheatSheetPanel.tsx:12`](../../cave-of-wonders/src/components/CheatSheetPanel.tsx#L12)
- Particles mounted at erupt/reveal.
  [`ClimaxCeremony.tsx:60`](../../cave-of-wonders/src/components/ClimaxCeremony.tsx#L60)
- Present/keyboard/toolbar/particle-absence assertions.
  [`ride.spec.ts:94`](../../cave-of-wonders/tests/ride.spec.ts#L94)
