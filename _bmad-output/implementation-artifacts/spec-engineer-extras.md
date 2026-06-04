---
title: 'Cave of Wonders — Engineer Extras + Takeaway Cheat Sheet'
type: 'feature'
created: '2026-06-03'
status: 'done'
baseline_commit: 'c345e0ad5abf2c8c6b1eba73004a6601cba3b5de'
context: ['{project-root}/_bmad-output/implementation-artifacts/spec-engineer-process-view.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The demo now shows the process, but engineers leave empty-handed — there's nothing to grab, copy, or take back to their own work, and the dev phase reads less like a real PR than it could.

**Approach:** Add engineer "extras" to the existing Cave of Wonders ride: (1) a **takeaway cheat sheet** of the real BMAD workflow available BOTH as an anytime slide-out panel AND as a final ride screen after the climax, with **copy-to-clipboard** and **download-as-Markdown**; (2) **copy buttons** on terminal commands and generated code; (3) a **diff-style** (green +added) view for the dev-phase code; (4) **multiple code files as editor tabs** in the dev phase. Reuse everything; stay upbeat, client-side, pre-scripted.

## Boundaries & Constraints

**Always:** Reuse the existing app, sequencer, workspace, genie, vault, climax. Cheat-sheet command/output data must derive from the existing `PHASES` (single source — no drift). Copy uses `navigator.clipboard`; download uses an in-browser Blob (no network). Streaming/diff must resolve to stable, complete content under reduced motion (snapshot-safe). Honor existing URL-seed params.

**Ask First:** Adding deps beyond the current set (react, react-dom, framer-motion, playwright). Changing the 5 real commands. Removing the genie/treasure layer.

**Never:** Real LLM/file-system/network calls. Third-party IP. A backend. A syntax-highlighter or clipboard/file-saver dependency (hand-roll).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Cheat-sheet toggle | Click the cheat-sheet button (any step) | Slide-out panel opens with workflow + copy/download; click again or backdrop closes it | N/A |
| Final cheat screen | Ride advances past climax | A dedicated cheat-sheet screen (last step) shows the full reference | N/A |
| Copy command/code | Click a copy button | Writes text to clipboard; button shows transient "Copied!" state | if clipboard API absent, button still shows feedback, no throw |
| Download cheat sheet | Click "Download .md" | Triggers download of `bmad-cheatsheet.md` built from PHASES | N/A |
| Dev phase tabs | Dev phase active | Editor shows 3 tabs (recipes.ts, App.tsx, recipes.spec.ts); active tab streams; clicking a tab shows that file | N/A |
| Diff view | Dev phase code | Generated code lines render with a green `+` gutter (PR-like) | N/A |
| Reduced motion / seeked | `?reducedMotion=1` | Cheat sheet, tabs, diff all show full, stable content instantly | N/A |

</frozen-after-approval>

## Code Map

- `cave-of-wonders/src/types.ts` -- change `Phase.editor` to `EditorContent[]`; add `diff?: boolean` to `EditorContent`; add `CheatEntry`
- `cave-of-wonders/src/data/phases.ts` -- editor becomes arrays; dev phase gets 3 files (recipes.ts, App.tsx, recipes.spec.ts) with `diff: true`; add `cheatsheet` step after `climax` (finite climax duration)
- `cave-of-wonders/src/data/cheatsheet.ts` -- NEW: derive `CHEAT_ENTRIES` from PHASES + getting-started lines + `cheatSheetMarkdown()`
- `cave-of-wonders/src/components/CopyButton.tsx` -- NEW: clipboard copy w/ transient "Copied!" feedback
- `cave-of-wonders/src/components/CheatSheet.tsx` -- NEW: shared cheat-sheet content (workflow table + copy-each + download); used by panel & screen
- `cave-of-wonders/src/components/CheatSheetPanel.tsx` -- NEW: anytime slide-out + toggle button + backdrop
- `cave-of-wonders/src/components/CheatSheetScreen.tsx` -- NEW: final-step screen wrapping CheatSheet
- `cave-of-wonders/src/components/CodeEditor.tsx` -- support multi-file tabs (active streams), diff rendering, copy button
- `cave-of-wonders/src/components/Terminal.tsx` -- add copy button for the command
- `cave-of-wonders/src/components/Controls.tsx` -- label the new `cheatsheet` step
- `cave-of-wonders/src/App.tsx` -- render `cheatsheet` step; hold cheat-panel open state; mount CheatSheetPanel
- `cave-of-wonders/src/styles/global.css` -- cheat sheet panel/screen, tabs, diff gutter, copy button styles
- `cave-of-wonders/tests/ride.spec.ts` -- cheat-screen + panel-toggle + copy-button + diff + multi-tab assertions; fix end-step index

## Tasks & Acceptance

**Execution:**
- [x] `cave-of-wonders/src/types.ts` -- `Phase.editor: EditorContent[]`, `EditorContent.diff?`, `CheatEntry` -- typed contract
- [x] `cave-of-wonders/src/data/phases.ts` -- editor arrays; dev phase 3 diffed files; add `cheatsheet` step; finite climax duration -- content + ride shape
- [x] `cave-of-wonders/src/data/cheatsheet.ts` -- `CHEAT_ENTRIES` (from PHASES), getting-started, `cheatSheetMarkdown()` -- single-source reference
- [x] `cave-of-wonders/src/components/CopyButton.tsx` -- copy text + "Copied!" feedback, clipboard-absent safe -- reuse
- [x] `cave-of-wonders/src/components/CheatSheet.tsx` -- workflow table, per-row copy, download .md -- shared content
- [x] `cave-of-wonders/src/components/CheatSheetPanel.tsx` -- toggle button + slide-out + backdrop -- anytime access
- [x] `cave-of-wonders/src/components/CheatSheetScreen.tsx` -- final-step screen -- takeaway finale
- [x] `cave-of-wonders/src/components/CodeEditor.tsx` -- tabs (active streams), diff gutter, copy button -- richer editor
- [x] `cave-of-wonders/src/components/Terminal.tsx` -- copy button on the command -- grab the command
- [x] `cave-of-wonders/src/components/Controls.tsx` -- handle `cheatsheet` step label -- navigation
- [x] `cave-of-wonders/src/App.tsx` -- render cheatsheet step + cheat-panel state/mount -- wiring
- [x] `cave-of-wonders/src/styles/global.css` -- panel/screen/tabs/diff/copy styles -- visual
- [x] `cave-of-wonders/tests/ride.spec.ts` -- assertions + snapshots for cheat screen, panel toggle, diff, multi-tab, copy presence; end-step index fix -- regression safety

**Acceptance Criteria:**
- Given any step, when the cheat-sheet button is clicked, then a slide-out panel shows the 5 real commands with what each produces, plus copy and download controls.
- Given the ride advances past the climax, when the final step shows, then a cheat-sheet screen presents the same takeaway reference.
- Given the cheat sheet, when "Download .md" is clicked, then a `bmad-cheatsheet.md` file (built from PHASES) downloads.
- Given a copy button on a command or code block, when clicked, then its text is copied and the button shows a transient "Copied!".
- Given the dev phase, when active, then the editor shows multiple file tabs and the code renders as a green `+` diff.
- Given reduced motion or a seeked step, when shown, then cheat sheet, tabs, and diff display complete, stable content.

## Design Notes

Ride steps become: intro · 5 phases · climax · **cheatsheet** (new last step). Climax duration goes finite (~6.5s) so autoplay advances to the cheat screen; cheat screen is the auto-stop end; Replay resets to intro. Cheat data derives from `PHASES` so commands/outputs never drift; `cheatSheetMarkdown()` builds the downloadable file. CopyButton: `navigator.clipboard?.writeText(...)` guarded; always flips to "Copied!" for ~1.2s. Diff = render each code line with a `+` gutter cell + green tint, keeping token coloring. Multi-tab editor streams only the active tab; switching tabs re-streams (or shows full under reduced motion).

## Verification

**Commands:**
- `cd cave-of-wonders && npx tsc --noEmit` -- expected: no type errors
- `cd cave-of-wonders && npm run build` -- expected: build succeeds
- `cd cave-of-wonders && npm run test:update && npm run test` -- expected: snapshots regenerate then pass

**Manual checks:**
- Toggle the cheat panel at various steps; copy a command (see "Copied!"); download the .md; reach the final cheat screen; in the dev phase switch tabs and confirm the green diff.

## Spec Change Log

- _No bad_spec loopbacks; no patches._ Built and verified clean (tsc + build + 8 Playwright tests). Inline review found no blocking issues. Clipboard/download asserted as present (not exercised) to avoid headless-permission flakiness, per the spec's scope note.

## Suggested Review Order

**Cheat sheet (the takeaway)**

- Single-source data derived from PHASES + the downloadable Markdown builder.
  [`cheatsheet.ts:5`](../../cave-of-wonders/src/data/cheatsheet.ts#L5)
- Shared content: workflow rows, per-row copy, and `.md` download.
  [`CheatSheet.tsx:18`](../../cave-of-wonders/src/components/CheatSheet.tsx#L18)
- Anytime slide-out + toggle; and the final-step screen.
  [`CheatSheetPanel.tsx:10`](../../cave-of-wonders/src/components/CheatSheetPanel.tsx#L10)
  [`CheatSheetScreen.tsx:9`](../../cave-of-wonders/src/components/CheatSheetScreen.tsx#L9)

**Engineer extras in the editor**

- Multi-file tabs, diff rendering, and a copy button.
  [`CodeEditor.tsx:22`](../../cave-of-wonders/src/components/CodeEditor.tsx#L22)
- Clipboard copy with transient "Copied!" (API-absent safe).
  [`CopyButton.tsx:22`](../../cave-of-wonders/src/components/CopyButton.tsx#L22)
- Copy button on the run command.
  [`Terminal.tsx:35`](../../cave-of-wonders/src/components/Terminal.tsx#L35)

**Ride shape & wiring**

- New `cheatsheet` step after a time-boxed climax; dev phase now 3 diffed files.
  [`phases.ts:300`](../../cave-of-wonders/src/data/phases.ts#L300)
- Renders the cheat step + mounts the anytime panel.
  [`App.tsx:88`](../../cave-of-wonders/src/App.tsx#L88)

**Peripherals**

- Cheat panel/screen, tabs, diff gutter, copy styles.
  [`global.css:640`](../../cave-of-wonders/src/styles/global.css#L640)
- Cheat-screen, panel-toggle, diff, multi-tab, copy assertions.
  [`ride.spec.ts:28`](../../cave-of-wonders/tests/ride.spec.ts#L28)
