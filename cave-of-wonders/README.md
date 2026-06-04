# 🪔 Cave of Wonders — the BMAD Method, as a magic-carpet ride

A self-playing React demo that teaches the **BMAD method** by turning it into a
treasure-cave adventure. A wish-granting genie shapeshifts into each BMAD
expert (Analyst → PM → Architect → UX → Developer), you watch the deliverables
pile up as treasure, and it climaxes in a "hush → erupt" reveal of the finished
app plus a reward counter.

Built to **win a room**: drop it on a big screen in a team meeting, loop it at a
booth, or share the link. It runs unattended end to end.

## Run it

```bash
cd cave-of-wonders
npm install
npm run dev
```

Open the printed URL (default http://localhost:5173). The ride **auto-plays**
from the wish through all five phases to the climax. Use the bottom controls to
**play/pause**, **replay**, step **prev/next**, or **jump** to any phase.

## Present it

- Full screen the browser and hit **Replay** when your audience is ready.
- It teaches the five BMAD phases without you narrating — but the dots let you
  pause on any phase to talk through the artifact.
- Honors `prefers-reduced-motion` (and `?reducedMotion=1`) for a calmer playback.

## Build & test

```bash
npm run build                # type-check (tsc -b) + production build
npm run test                 # Playwright snapshot tests
npm run test:update          # (re)generate snapshot baselines — run once first
```

> First-time tests: Playwright has no baseline images yet. Run
> `npm run test:update` once to create them, then `npm run test` to verify.

### Deterministic states (used by tests)

Append URL params to freeze a state:

| Param | Effect |
|-------|--------|
| `?paused=1` | Don't autoplay |
| `?step=N` | Start on step N (0 = wish, 1–5 = phases, 6 = climax) |
| `?reducedMotion=1` | Force reduced motion → stable end states |

## How the concept maps to BMAD

| Phase | Genie becomes | Treasure (artifact) |
|-------|---------------|---------------------|
| Analysis | Mary (Analyst) | 📜 Research Scroll |
| Planning | John (PM) | 🗒️ PRD Scroll |
| Solutioning | Winston (Architect) | 💎 Blueprint Gem |
| UX | Sally (UX Designer) | 🗺️ Design Map |
| Implementation | Amelia (Developer) | 🧰 Chest of Passing Tests |

The sample "wish" is a **FridgeChef** recipe app, so each artifact shows real,
concrete content. The genie is an **original** character (no third-party IP).

## Stack

React + Vite + TypeScript · Framer Motion · Playwright snapshot tests.
Self-contained and client-side — all content is pre-scripted (no backend, no
network calls).

---

Concept forged in a BMAD brainstorming session
(`../_bmad-output/brainstorming/brainstorming-session-2026-06-03.md`).
