---
title: 'Cave of Wonders — BMAD Method React Demo'
type: 'feature'
created: '2026-06-03'
status: 'done'
baseline_commit: 'c345e0ad5abf2c8c6b1eba73004a6601cba3b5de'
context: ['{project-root}/_bmad-output/brainstorming/brainstorming-session-2026-06-03.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Michael (new principal API engineer) needs to engage a skeptical existing team into adopting AI-assisted workflows, but the BMAD method is abstract and hard to make compelling. A static doc won't convert anyone.

**Approach:** Build a self-playing, on-rails React "magic carpet ride" through all 5 BMAD phases. An original wish-granting genie (witty/warm/shapeshifting archetype — NOT Disney's Genie or Robin Williams) transforms into each BMAD expert persona, the viewer collects artifact-"treasures" for one concrete sample wish, and it climaxes in a hush→erupt ceremony revealing the finished app + a reward counter. Upbeat, fun, immersive throughout.

## Boundaries & Constraints

**Always:** Keep tone upbeat/fun/immersive — zero fear, skeptic, or failure framing. Demo must run unattended end-to-end (auto-advance) with play/pause/replay. Teach the 5 phases (Research→PRD→Architecture→UX→Dev) without a live narrator. Original genie design only. Self-contained client-side app (no backend, no network calls). Follow project stack conventions: **React + Vite in TypeScript**, **Playwright snapshot tests**.

**Ask First:** Adding any dependency beyond React + Framer Motion + Playwright (+ Vite/TS toolchain). Adding real audio assets. Changing the chosen sample wish away from a "Recipe Finder" app. **Adding a backend** (project convention is Node/TS/Express, but this pre-scripted demo needs none — confirm before introducing one).

**Never:** Use Disney's Genie design, Robin Williams' likeness/voice, or other third-party IP. No real LLM/API integration (content is pre-scripted). No routing/multi-page complexity. No server for this demo.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Autoplay start | App mounts | Intro plays, then phases auto-advance on a timer through climax to reveal | N/A |
| Pause | User clicks pause mid-ride | Sequence freezes on current phase; current animations settle | N/A |
| Replay | User clicks replay at the end | State resets to intro; ride plays again cleanly (no stale treasures) | N/A |
| Reduced motion | OS prefers-reduced-motion set | Transitions degrade to fades/instant; ride still completes | N/A |
| Manual skip | User clicks a phase / next | Jumps to that phase; vault reflects treasures up to that phase | N/A |

</frozen-after-approval>

## Code Map

- `cave-of-wonders/` -- self-contained Vite React + TypeScript app (isolated from BMAD tooling at repo root)
- `cave-of-wonders/package.json` -- deps: react, react-dom, framer-motion; devDeps: vite, @vitejs/plugin-react, typescript, @playwright/test
- `cave-of-wonders/tsconfig.json` + `vite.config.ts` -- TS + Vite config
- `cave-of-wonders/index.html` -- Vite entry
- `cave-of-wonders/src/main.tsx` -- React root
- `cave-of-wonders/src/App.tsx` -- orchestrates the ride; owns ride state
- `cave-of-wonders/src/data/phases.ts` -- the 5 phases + intro/climax content for the sample wish (single source of truth; typed)
- `cave-of-wonders/src/types.ts` -- shared types (Phase, Persona, Artifact, RideStep)
- `cave-of-wonders/src/hooks/useRideSequencer.ts` -- auto-advance timer, play/pause/replay/skip, current-step state
- `cave-of-wonders/src/components/*.tsx` -- Stage, Genie, WishIntro, TreasureVault, ArtifactCard, ClimaxCeremony, RewardCounter, Controls
- `cave-of-wonders/src/styles/` -- cave palette + keyframes
- `cave-of-wonders/playwright.config.ts` + `cave-of-wonders/tests/ride.spec.ts` -- Playwright snapshot tests of key ride beats

## Tasks & Acceptance

**Execution:**
- [x] `cave-of-wonders/` (package.json, tsconfig.json, vite.config.ts, index.html, src/main.tsx) -- scaffold Vite + React + TS + Framer Motion app -- runnable baseline
- [x] `cave-of-wonders/src/types.ts` -- shared types (Phase, Persona, Artifact, RideStep) -- type backbone
- [x] `cave-of-wonders/src/data/phases.ts` -- define INTRO, 5 PHASES (persona name+role+line, artifact treasure, sample "Recipe Finder" content snippet, reward delta), CLIMAX, REVEAL -- single content source
- [x] `cave-of-wonders/src/hooks/useRideSequencer.ts` -- step index, autoplay timer, play/pause/replay/skip, respects prefers-reduced-motion timing -- drives the on-rails experience
- [x] `cave-of-wonders/src/components/Genie.tsx` -- shapeshift animation per persona (Mary/John/Winston/Sally/Amelia), original design -- the teaching spine
- [x] `cave-of-wonders/src/components/TreasureVault.tsx` + `ArtifactCard.tsx` -- vault that fills one treasure per completed phase, each showing the sample artifact -- value made visible
- [x] `cave-of-wonders/src/components/WishIntro.tsx` -- "diamond in the rough" make-a-wish opening -- frames the ride
- [x] `cave-of-wonders/src/components/ClimaxCeremony.tsx` + `RewardCounter.tsx` -- hush(dark/silent beat)→erupt(gold) reveal of finished app + spinning reward counter -- the payoff
- [x] `cave-of-wonders/src/components/Stage.tsx` + `Controls.tsx` -- cave backdrop + play/pause/replay UI -- container & user control
- [x] `cave-of-wonders/src/App.tsx` -- wire sequencer to components; mini hush→poof transition between phases -- assembles the ride
- [x] `cave-of-wonders/playwright.config.ts` + `cave-of-wonders/tests/ride.spec.ts` -- Playwright snapshot tests of key beats (intro, a mid-phase transform+vault, climax reveal); pause autoplay for deterministic snapshots -- regression safety
- [x] `cave-of-wonders/README.md` -- how to run (`npm install && npm run dev`), run tests (`npm run test`), and how to present it -- usable by Michael

**Acceptance Criteria:**
- Given the app is opened, when it loads, then it auto-plays from intro through all 5 phases to the climax reveal without user input.
- Given the ride is playing, when each phase begins, then the genie visibly transforms into that phase's BMAD persona and one matching treasure drops into the vault.
- Given the ride reaches the end, when the climax fires, then there is a brief hush followed by a gold "eruption" revealing the finished Recipe Finder app and a reward counter that counts up.
- Given a presenter, when they use the controls, then play/pause/replay and manual phase skip all work and leave the vault state consistent.
- Given a viewer with prefers-reduced-motion, when the ride plays, then it still completes end-to-end with reduced animation.
- Given the Playwright suite, when run, then snapshot tests of the intro, a mid-phase (transform + filled vault), and the climax reveal pass deterministically (autoplay paused/seeked to fixed steps).

## Design Notes

The 5 phase→persona→treasure mapping (single beloved genie changing costumes — the breakthrough idea):
1. Research → **Mary** (analyst) → research scroll
2. PRD → **John** (PM) → PRD scroll
3. Architecture → **Winston** (architect) → blueprint gem
4. UX → **Sally** (UX designer) → design map
5. Dev → **Amelia** (developer) → chest of passing tests → unlocks the lamp/app

Sample wish = a "Recipe Finder" app, so each treasure shows a short, realistic artifact snippet (e.g., a 3-bullet PRD, a tiny architecture diagram-as-text, a passing-tests list). Keep snippets 3–6 lines so they read on screen during the ride. Mini hush→poof between phases gives the ride a heartbeat; full hush→erupt only at the finale.

## Verification

**Commands:**
- `cd cave-of-wonders && npm install` -- expected: installs without errors
- `cd cave-of-wonders && npx tsc --noEmit` -- expected: no type errors
- `cd cave-of-wonders && npm run build` -- expected: Vite production build succeeds
- `cd cave-of-wonders && npm run test` -- expected: Playwright snapshot tests pass
- `cd cave-of-wonders && npm run dev` -- expected: dev server starts; app auto-plays the full ride

**Manual checks:**
- Open the dev server URL: ride auto-plays intro→5 phases→climax→reveal; genie transforms each phase; vault fills; climax shows hush→erupt; reward counter counts up; controls (play/pause/replay/skip) work.

## Spec Change Log

- _No bad_spec loopbacks._ One review finding (`patch`): `tsc -b` emitted stray `vite.config.js/.d.ts` + `playwright.config.js/.d.ts` into the working tree; fixed by routing the composite node project's emit into `node_modules/.tmp` ([tsconfig.node.json](../../cave-of-wonders/tsconfig.node.json)). No frozen-intent change.

## Suggested Review Order

**Ride orchestration (entry point)**

- Start here: wires the sequencer, derives collected treasures + reward totals from one index.
  [`App.tsx:50`](../../cave-of-wonders/src/App.tsx#L50)
- The on-rails engine: per-step autoplay timer, manual play/pause/replay/skip, auto-stop at climax.
  [`useRideSequencer.ts:35`](../../cave-of-wonders/src/hooks/useRideSequencer.ts#L35)

**The teaching spine (shapeshift)**

- One genie morphs accent/glyph/nameplate per persona — the core "method-as-character" idea.
  [`Genie.tsx:22`](../../cave-of-wonders/src/components/Genie.tsx#L22)

**Content & types (single source)**

- The 5 phase→persona→treasure mappings + the FridgeChef sample wish.
  [`phases.ts:23`](../../cave-of-wonders/src/data/phases.ts#L23)
- Shared shapes for phases, personas, artifacts, ride steps.
  [`types.ts:1`](../../cave-of-wonders/src/types.ts#L1)

**The payoff**

- Hush→erupt→reveal ritual; jumps straight to reveal under reduced motion (deterministic).
  [`ClimaxCeremony.tsx:32`](../../cave-of-wonders/src/components/ClimaxCeremony.tsx#L32)
- Count-up reward readout; instant final values when not animating.
  [`RewardCounter.tsx:14`](../../cave-of-wonders/src/components/RewardCounter.tsx#L14)
- Vault fills one treasure per reached phase.
  [`TreasureVault.tsx:30`](../../cave-of-wonders/src/components/TreasureVault.tsx#L30)

**Peripherals (scenes, controls, styles, tests)**

- Phase scene + artifact card, wish intro, stage backdrop, presenter controls.
  [`PhaseScene.tsx:11`](../../cave-of-wonders/src/components/PhaseScene.tsx#L11)
  [`Controls.tsx:18`](../../cave-of-wonders/src/components/Controls.tsx#L18)
- Cave palette, layout, genie + keyframes.
  [`global.css:1`](../../cave-of-wonders/src/styles/global.css#L1)
- Deterministic snapshot seeding via URL params.
  [`ride.spec.ts:7`](../../cave-of-wonders/tests/ride.spec.ts#L7)
