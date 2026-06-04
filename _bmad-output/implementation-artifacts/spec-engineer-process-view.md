---
title: 'Cave of Wonders — Engineer Process View (blended)'
type: 'feature'
created: '2026-06-03'
status: 'done'
baseline_commit: 'c345e0ad5abf2c8c6b1eba73004a6601cba3b5de'
context: ['{project-root}/_bmad-output/implementation-artifacts/spec-cave-of-wonders-demo.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The current Cave of Wonders ride sells the *feeling* of BMAD but not the *substance*. Skeptical engineers want to see the real process: actual commands, files being created, and code materializing.

**Approach:** Blend an engineer-facing "workspace" into the existing ride. Each of the 5 phases now plays out inside an IDE mock — a faux **terminal** types and runs the real BMAD command, a **code editor** streams the generated file (artifact docs render as readable Markdown; the dev phase streams real TypeScript), and a **file tree** grows as outputs appear. The genie (now a corner mascot) and the treasure vault/reward counter stay, so wow + proof coexist. Still pre-scripted, client-side, upbeat.

## Boundaries & Constraints

**Always:** Reuse the existing app, sequencer, intro, climax, vault, reward counter, and FridgeChef sample wish. Keep tone upbeat. Use the REAL BMAD command per phase. Streaming animations must resolve to full, stable content under reduced motion (deterministic for snapshots). The file tree is cumulative across phases. Honor existing URL-seed params (`paused`, `step`, `reducedMotion`).

**Ask First:** Adding deps beyond the current set (react, react-dom, framer-motion, playwright). Changing the 5 phase→command mapping. Replacing the genie/treasure layer (intent is to BLEND, not remove).

**Never:** Real LLM/terminal/file-system calls — all output is scripted. No third-party IP. No backend. No syntax-highlighter dependency (do lightweight token coloring in-house).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Phase plays (full motion) | Step is a phase | Terminal types command → streams output lines; editor streams file; tree gains this phase's file(s) | N/A |
| Reduced motion / seeked | `?reducedMotion=1` or jumped via dots | Terminal + editor show COMPLETE content instantly; tree shows all files up to this phase | N/A |
| Skip mid-stream | User clicks next/dot while streaming | Streaming cancels cleanly; target step shows its completed state | cancel timers/RAF |
| Dev phase | Step 5 | Editor streams real TS/TSX code with token coloring; tree shows code files | N/A |
| Planning phases | Steps 1–4 | Editor renders the artifact as formatted Markdown doc | N/A |

</frozen-after-approval>

## Code Map

- `cave-of-wonders/src/data/phases.ts` -- EXTEND each Phase with `command`, `terminal[]`, `files[]`, `editor{ filename, kind: 'doc'|'code', language, content }`
- `cave-of-wonders/src/types.ts` -- add the new Phase fields + `TreeFile`
- `cave-of-wonders/src/hooks/useStream.ts` -- NEW: typewriter/line-stream hook; instant-complete when `reducedMotion`; cancelable
- `cave-of-wonders/src/components/Workspace.tsx` -- NEW: IDE shell composing FileTree + Editor + Terminal for a phase
- `cave-of-wonders/src/components/Terminal.tsx` -- NEW: types the command, streams output lines
- `cave-of-wonders/src/components/CodeEditor.tsx` -- NEW: streams file content; renders doc (Markdown-lite) or code (token-colored)
- `cave-of-wonders/src/components/FileTree.tsx` -- NEW: cumulative tree of files produced so far
- `cave-of-wonders/src/components/Genie.tsx` -- adjust: support a compact `mascot` placement
- `cave-of-wonders/src/App.tsx` -- render Workspace for phase steps (blended with mascot genie + vault); compute cumulative files
- `cave-of-wonders/src/styles/global.css` -- IDE/terminal/editor/tree styling
- `cave-of-wonders/tests/ride.spec.ts` -- add assertions/snapshots for the workspace (terminal command, file tree count, code in editor)

## Tasks & Acceptance

**Execution:**
- [x] `cave-of-wonders/src/types.ts` -- add `TreeFile`, and Phase fields `command`, `terminal`, `files`, `editor` -- typed contract
- [x] `cave-of-wonders/src/data/phases.ts` -- author per-phase command (real BMAD), terminal output, produced files, and editor content (md docs for 1–4, real TS/TSX for 5) for the FridgeChef wish -- content source
- [x] `cave-of-wonders/src/hooks/useStream.ts` -- cancelable streaming hook (chars for editor, lines for terminal); returns full content instantly when reduced motion -- animation engine
- [x] `cave-of-wonders/src/components/Terminal.tsx` -- prompt + typed `command` + streamed output lines with a blinking cursor -- "see the commands"
- [x] `cave-of-wonders/src/components/CodeEditor.tsx` -- tabbed editor; streams content; `doc` kind renders Markdown-lite, `code` kind shows lightweight token coloring -- "see code generated" + rendered artifacts
- [x] `cave-of-wonders/src/components/FileTree.tsx` -- cumulative file tree; newly-added files highlighted -- growing project
- [x] `cave-of-wonders/src/components/Workspace.tsx` -- IDE shell: FileTree (left) + CodeEditor (main) + Terminal (bottom) for the active phase -- the blended center
- [x] `cave-of-wonders/src/components/Genie.tsx` -- add compact `mascot` variant for corner placement -- keep the magic in the blend
- [x] `cave-of-wonders/src/App.tsx` -- for phase steps render Workspace + mascot genie + vault; pass cumulative files (all phases with index <= current) -- wiring
- [x] `cave-of-wonders/src/styles/global.css` -- styles for IDE shell, terminal, editor (doc + code), file tree, mascot -- visual
- [x] `cave-of-wonders/tests/ride.spec.ts` -- update/extend snapshots: workspace at a planning phase (rendered doc + tree) and the dev phase (streamed code); assert real command text + cumulative file count -- regression safety

**Acceptance Criteria:**
- Given a phase is active, when it plays, then a terminal shows the real BMAD command being run and the editor + file tree fill with that phase's output.
- Given phases 1–4, when active, then the editor renders the produced artifact as a formatted document; given phase 5, then the editor shows generated TypeScript with token coloring.
- Given the dev phase, when reached, then the file tree contains the cumulative files from all prior phases plus this phase's code files.
- Given reduced motion or a jumped step, when shown, then terminal/editor/tree display complete, stable content with no in-progress animation.
- Given the genie and treasure vault, when in a phase, then both remain visible alongside the workspace (blended, not replaced).

## Design Notes

Phase → real command → primary output file:
1. Analysis → `/bmad-product-brief` → `planning/product-brief.md`
2. Planning → `/bmad-prd` → `planning/prd.md`
3. Solutioning → `/bmad-create-architecture` → `planning/architecture.md`
4. UX → `/bmad-ux` → `planning/ux-design.md`
5. Implementation → `/bmad-dev-story` → `src/api/recipes.ts`, `src/App.tsx`, `tests/recipes.spec.ts`

Architecture doc + dev code should reflect the project's own stack (React+Vite+TS front, Node/TS+Express back, Playwright) so it reads true to an engineer. Token coloring = regex passes for keywords/strings/comments wrapped in spans; no dependency. Keep editor content ~12–22 lines so it reads on screen. Terminal output ~3–5 lines per phase ending in `✓ wrote <file>`.

## Verification

**Commands:**
- `cd cave-of-wonders && npx tsc --noEmit` -- expected: no type errors
- `cd cave-of-wonders && npm run build` -- expected: build succeeds
- `cd cave-of-wonders && npm run test:update && npm run test` -- expected: snapshots regenerate then pass

**Manual checks:**
- Play through: each phase shows command in terminal, doc/code streaming in editor, file tree growing; genie mascot + vault stay visible; reduced motion shows full content instantly.

## Spec Change Log

- _No bad_spec loopbacks._ Two review findings, both `patch`:
  1. (carried) build emitted stray config JS/d.ts → routed composite emit to `node_modules/.tmp`.
  2. IDE grid lacked `min-height: 0`, so long docs expanded the editor and pushed the **terminal** below the fold (regressing a core "see the commands" requirement). Fixed with grid `min-height: 0` + tightened workspace height; added a viewport-bounds test asserting the terminal sits within the viewport.
- Superseded `PhaseScene.tsx` + `ArtifactCard.tsx` removed (their role is now the editor's rendered doc).

## Suggested Review Order

**Blended wiring (entry point)**

- Start here: phase steps render the Workspace + mascot genie + vault; computes cumulative files.
  [`App.tsx:74`](../../cave-of-wonders/src/App.tsx#L74)
- The IDE shell composing tree + editor + terminal per phase.
  [`Workspace.tsx:23`](../../cave-of-wonders/src/components/Workspace.tsx#L23)

**The "process" surfaces**

- Types the real BMAD command, then streams output lines.
  [`Terminal.tsx:11`](../../cave-of-wonders/src/components/Terminal.tsx#L11)
- Streams the file; renders Markdown docs or token-colored code (dependency-free).
  [`CodeEditor.tsx:18`](../../cave-of-wonders/src/components/CodeEditor.tsx#L18)
- Builds a nested tree from flat paths; highlights freshly-added files.
  [`FileTree.tsx:24`](../../cave-of-wonders/src/components/FileTree.tsx#L24)

**Animation engine**

- Cancelable typewriter + line-stream; instant-complete under reduced motion (snapshot-safe).
  [`useStream.ts:20`](../../cave-of-wonders/src/hooks/useStream.ts#L20)

**Content & types**

- Per-phase command, terminal output, produced files, editor doc/code for FridgeChef.
  [`phases.ts:25`](../../cave-of-wonders/src/data/phases.ts#L25)
- New Phase fields + `TreeFile`/`EditorContent`.
  [`types.ts:48`](../../cave-of-wonders/src/types.ts#L48)

**Peripherals**

- Mascot genie + speech bubble variant.
  [`Genie.tsx:30`](../../cave-of-wonders/src/components/Genie.tsx#L30)
- IDE/terminal/editor/tree styling + the `min-height:0` fix.
  [`global.css:560`](../../cave-of-wonders/src/styles/global.css#L560)
- Workspace assertions incl. terminal-in-viewport guard.
  [`ride.spec.ts:16`](../../cave-of-wonders/tests/ride.spec.ts#L16)
