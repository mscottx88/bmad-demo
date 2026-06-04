---
title: 'Cave of Wonders — Engineer Audience Redesign'
type: 'feature'
created: '2026-06-04'
status: 'done'
baseline_commit: 'b4605a6205a36e5bea54474e3f440f29e09f42b6'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The demo's cave/genie/wish metaphors read as whimsical to skeptical engineers — they disengage before the BMAD value lands. The content is also thin on real code, CLI examples, and BMAD rationale for why each phase exists.

**Approach:** Retheme copy and branding to terminal/engineering language; add a `ScrollingDialogue` component that typewriter-reveals 60-75 word per-phase rationale at 500 WPM; enrich each phase with more realistic TypeScript and CLI output.

## Boundaries & Constraints

**Always:** Preserve all existing `data-testid` attributes unchanged. Keep the five-phase autoplay sequencer, keyboard shortcuts, present mode, and reduced-motion support. Use only dependencies already in package.json.

**Ask First:** Nothing anticipated.

**Never:** Don't add new npm packages. Don't remove or rename `data-testid` attributes. Don't change the three-zone layout (header / workspace / artifact panel). Don't alter the autoplay sequencer logic.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Dialogue completes before phase ends | Short dialogue text, long `durationMs` | Text finishes, interval clears — no re-run | Clamp char index at text.length |
| Reduced motion | `reducedMotion=true` | Full dialogue text visible immediately, no interval | Skip setInterval entirely |
| Phase change mid-scroll | User presses → while dialogue is animating | Dialogue resets and restarts for new phase | Reset on `text` prop change via useEffect cleanup |

</frozen-after-approval>

## Code Map

- `cave-of-wonders/src/types.ts` — Phase interface; add `dialogue: string`
- `cave-of-wonders/src/data/phases.ts` — All phase data: persona lines, terminal, editor content, new `dialogue` field
- `cave-of-wonders/src/components/ScrollingDialogue.tsx` — NEW: typewriter component, `data-testid="scrolling-dialogue"`
- `cave-of-wonders/src/components/Workspace.tsx` — Wire ScrollingDialogue as bottom panel below terminal
- `cave-of-wonders/src/components/Stage.tsx` — Brand header: remove lamp emoji, update copy
- `cave-of-wonders/src/components/WishIntro.tsx` — Replace lamp/diamond/wish framing with terminal-prompt engineering framing
- `cave-of-wonders/src/components/Genie.tsx` — Plate labels: "Your Genie"→"BMAD Agent"; "Wish granted!"→"Shipped ✓"
- `cave-of-wonders/src/components/ClimaxCeremony.tsx` — Replace wish/treasure language with pipeline/CI language
- `cave-of-wonders/src/styles/global.css` — Monospace brand font; swap `--gold/#ffd86b` to terminal green `#00d26a`/`--gold-soft` to `#22c55e`
- `cave-of-wonders/tests/ride.spec.ts` — Update stale text assertions; regenerate snapshots

## Tasks & Acceptance

**Execution:**

- [ ] `cave-of-wonders/src/types.ts` -- Add `dialogue: string` to the `Phase` interface -- needed before data and component changes
- [ ] `cave-of-wonders/src/data/phases.ts` -- (a) Replace each persona `line` with technical copy (see Design Notes). (b) Add `dialogue` field (~60-75 words) to each phase (see Design Notes). (c) Enrich `editor[].content` in research/prd/architecture phases to include 10+ lines of realistic code or config. (d) Add 2-3 extra `terminal` lines per phase showing realistic sub-commands.
- [ ] `cave-of-wonders/src/components/ScrollingDialogue.tsx` -- Create component with props `{ text: string; reducedMotion: boolean }`. If `reducedMotion`, render full text immediately. Otherwise, use `setInterval` at 10ms/char (≈500 WPM) to increment visible char count; clear interval on unmount or `text` change. Render in `<div data-testid="scrolling-dialogue" className="scrolling-dialogue">`.
- [ ] `cave-of-wonders/src/components/Workspace.tsx` -- Import ScrollingDialogue; render it below the terminal panel inside `.workspace__main`, passing `phase.dialogue` and `reducedMotion`.
- [ ] `cave-of-wonders/src/components/Stage.tsx` -- Brand: remove `🪔`, change `h1` text to `BMAD METHOD`; subtitle: `A structured workflow for shipping AI-assisted features — five agents, five artifacts`.
- [ ] `cave-of-wonders/src/components/WishIntro.tsx` -- Replace "Rub the lamp" eyebrow with `$ idea —`; remove diamond emoji block; show the raw wish as a terminal-style blockquote prefixed with `>`; change hint to `BMAD transforms this into a shippable spec in five structured phases.`
- [ ] `cave-of-wonders/src/components/Genie.tsx` -- Update plate: mode=intro `<strong>BMAD Agent</strong>`; mode=climax `<strong>Shipped ✓</strong>`. Remove `.genie__smoke` CSS class reference (keep div for layout, rename class to `.genie__cursor` in CSS).
- [ ] `cave-of-wonders/src/components/ClimaxCeremony.tsx` -- Stage gather: `"Running pipeline…"`; stage erupt line: `"✓ BUILD COMPLETE"`; reveal eyebrow: `"Ready to ship"`; footnote: `"5 agents · 5 artifacts · shipped on spec."`
- [ ] `cave-of-wonders/src/styles/global.css` -- Set `.stage__brand { font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace; }`. Change `--gold: #00d26a` and `--gold-soft: #22c55e`. Update `.genie__smoke` selector to `.genie__cursor` with a blinking-cursor aesthetic (2px bar, blink animation) instead of radial blur smoke.
- [ ] `cave-of-wonders/tests/ride.spec.ts` -- Update the intro test name/assertion (remove "Diamond in the Rough"); run `npx playwright test --update-snapshots` to regenerate all visual baselines.

**Acceptance Criteria:**

- Given the intro step, when the demo loads, then the stage header text is "BMAD METHOD" and contains no lamp emoji, "Cave of Wonders", or "wish" copy at top level
- Given any phase step, when the phase begins and `reducedMotion` is false, then `data-testid="scrolling-dialogue"` is present and its text content grows over time (not all at once)
- Given `reducedMotion=1` URL param, when any phase is active, then `data-testid="scrolling-dialogue"` contains the full dialogue text immediately
- Given the architecture phase (step 3), when rendered, then `data-testid="terminal-command"` shows `/bmad-create-architecture` and the editor content contains ≥ 10 lines
- Given the climax erupt stage, when it fires, then the visible text contains "BUILD COMPLETE" (not "WISH" or "GRANTED")
- Given Playwright snapshot tests, when `--update-snapshots` is run, then all tests exit 0

## Spec Change Log

## Design Notes

**500 WPM rate:** 500 words/min ÷ 5 chars/word = 100 chars/sec → 10ms per character. At 9000ms per phase, a 60-word (~360 char) dialogue completes in ~3.6 seconds, leaving the remainder for reading.

**Persona lines (replace `line` in phases.ts):**
- Research/Mary: `"Profiling users and market before we write a line of code."`
- PRD/John: `"Pinning requirements now. Drift kills sprint velocity."`
- Architecture/Winston: `"Wrong abstractions cost 10× to fix. Here's the ADR."`
- UX/Sally: `"Speccing every screen state. UX gaps cause 40% of rework."`
- Dev/Amelia: `"Tests green. Merging."`

**Dialogue text per phase (add as `dialogue` field, ~65 words each):**
- Research: `"BMAD runs a research pass before any tickets exist. This catches the most common failure mode in AI-assisted work: generating code that solves the wrong problem. Market context and user pain points are captured as a product brief — a shared ground-truth that every downstream agent reads. Without it, the PRD is guesswork. With it, requirements have evidence."`
- PRD: `"Requirements drift accounts for roughly 40% of sprint rework. BMAD's PM agent forces every feature to a testable acceptance criterion — no vague 'should feel fast' allowed. This file becomes the contract: if it's not in the PRD, it won't be in the build. The dev agent reads this file first and generates tasks directly from its ACs."`
- Architecture: `"Choosing the wrong abstraction costs 10× what choosing correctly costs upfront. This phase produces a minimal Architecture Decision Record — stack, data model, API contract, and deployment shape — decided once and shared across all downstream agents. No surprise 'we should have used Postgres' conversations mid-sprint."`
- UX: `"UX gaps cause roughly 40% of implementation rework: missing button states, dead-end flows, validation deferred to the developer. BMAD's UX agent specs every screen and every transition before a line of code is written. The developer agent receives an unambiguous spec, not a Figma mockup with TBD annotations."`
- Dev: `"Implementation runs against a pinned spec and a pinned architecture. No interpreted scope. No Friday-afternoon decisions about state management. The developer agent writes the code, writes the tests, and runs them in a single context. When the test suite goes green, the story closes and sprint status updates automatically."`

## Verification

**Commands:**
- `cd cave-of-wonders && npm run build` -- expected: exits 0, zero TypeScript errors
- `cd cave-of-wonders && npx playwright test --update-snapshots` -- expected: all tests pass, new snapshots written

## Suggested Review Order

**New component — ScrollingDialogue**

- Core new feature: typewriter at 500 WPM, interval-safe, no side effects in setState
  [`ScrollingDialogue.tsx:1`](../../cave-of-wonders/src/components/ScrollingDialogue.tsx#L1)

- Wiring point: renders below terminal inside `.workspace__main` grid
  [`Workspace.tsx:34`](../../cave-of-wonders/src/components/Workspace.tsx#L34)

- Grid row capped to prevent overflow in fixed-height container (patch)
  [`global.css:681`](../../cave-of-wonders/src/styles/global.css#L681)

- Scrolling-dialogue CSS styles and `overflow-y: auto` guard
  [`global.css:691`](../../cave-of-wonders/src/styles/global.css#L691)

**Copy and brand changes**

- Brand header: "🪔 Cave of Wonders" → "BMAD METHOD" (monospace)
  [`Stage.tsx:21`](../../cave-of-wonders/src/components/Stage.tsx#L21)

- Intro screen: lamp/diamond metaphor → terminal prompt engineering frame
  [`WishIntro.tsx:15`](../../cave-of-wonders/src/components/WishIntro.tsx#L15)

- Genie plate labels: "Your Genie"→"BMAD Agent", "Wish granted!"→"Shipped ✓"
  [`Genie.tsx:89`](../../cave-of-wonders/src/components/Genie.tsx#L89)

- Climax copy: pipeline/CI metaphors replace wish/treasure language
  [`ClimaxCeremony.tsx:45`](../../cave-of-wonders/src/components/ClimaxCeremony.tsx#L45)

**Phase content enrichment**

- All 5 phases: dialogue field, terse persona lines, richer terminal/editor content
  [`phases.ts:1`](../../cave-of-wonders/src/data/phases.ts#L1)

**CSS and visual style**

- Gold `#ffd86b` → terminal green `#00d26a`; soft gold to `#22c55e`
  [`global.css:2`](../../cave-of-wonders/src/styles/global.css#L2)

- `.genie__smoke` → `.genie__cursor` blink animation (cursor metaphor)
  [`global.css:130`](../../cave-of-wonders/src/styles/global.css#L130)

**Types and tests**

- `dialogue: string` added to Phase interface
  [`types.ts:78`](../../cave-of-wonders/src/types.ts#L78)

- Test name updated; `scrolling-dialogue` visibility assertion added
  [`ride.spec.ts:10`](../../cave-of-wonders/tests/ride.spec.ts#L10)
