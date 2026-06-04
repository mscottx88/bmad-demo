import type { Phase, RideStep } from '../types';

/**
 * The single "wish" the whole ride grants — a relatable sample so every
 * BMAD artifact shows real, concrete content rather than placeholders.
 */
export const WISH = {
  raw: 'I wish I had an app that turns whatever is in my fridge into dinner ideas.',
  appName: 'FridgeChef',
  tagline: 'Recipes from whatever you already have',
} as const;

/**
 * The five BMAD phases. ONE genie shapeshifts through these costumes — the
 * core idea of the demo. Each phase runs a REAL BMAD command in the terminal,
 * streams its output file(s) into the editor, grows the file tree, and drops
 * one treasure (the artifact) into the vault.
 */
export const PHASES: Phase[] = [
  {
    id: 'research',
    index: 1,
    bmadPhase: 'Analysis',
    persona: {
      id: 'mary',
      name: 'Mary',
      role: 'Analyst',
      glyph: '🔍',
      accent: '#5ec8d8',
      line: 'Ooh, a wish! Let me scout the lay of the land first…',
    },
    artifact: {
      id: 'research-scroll',
      icon: '📜',
      title: 'Product Brief',
      snippet: [
        '• 73% of cooks waste food they forgot',
        '• Top ask: "use what I already own"',
        '• Opening: instant fridge → recipe',
      ],
    },
    reward: { hoursSaved: 4 },
    durationMs: 9000,
    command: '/bmad-product-brief',
    summary: 'Scout the market & users; capture the opportunity.',
    terminal: [
      '▸ researching market & users…',
      '▸ drafting product brief…',
      '✓ wrote planning/product-brief.md',
    ],
    files: [{ path: 'planning/product-brief.md' }],
    editor: [
      {
        filename: 'product-brief.md',
        kind: 'doc',
        language: 'md',
        content: `# Product Brief — FridgeChef

## Problem
Home cooks waste food they forget they own and
stall on the nightly "what's for dinner?" question.

## Opportunity
Turn on-hand ingredients into instant dinner ideas.

## Target user
Busy weeknight cooks making fast decisions.

## Success
- Time-to-first-recipe < 10s
- Less waste, fewer last-minute takeout nights`,
      },
    ],
  },
  {
    id: 'prd',
    index: 2,
    bmadPhase: 'Planning (PRD)',
    persona: {
      id: 'john',
      name: 'John',
      role: 'Product Manager',
      glyph: '📋',
      accent: '#f4b740',
      line: 'Marvelous! Let me write down exactly what we want…',
    },
    artifact: {
      id: 'prd-scroll',
      icon: '🗒️',
      title: 'PRD',
      snippet: [
        '1. Enter the ingredients you have',
        '2. Ranked recipes in seconds',
        '3. One tap → shopping list',
      ],
    },
    reward: { hoursSaved: 6 },
    durationMs: 9000,
    command: '/bmad-prd',
    summary: 'Pin down exactly what to build and why.',
    terminal: [
      '▸ loading product brief…',
      '▸ eliciting requirements…',
      '✓ wrote planning/prd.md',
    ],
    files: [{ path: 'planning/prd.md' }],
    editor: [
      {
        filename: 'prd.md',
        kind: 'doc',
        language: 'md',
        content: `# PRD — FridgeChef

## Goal
Dinner ideas from ingredients you already have.

## Requirements
1. Enter or snap your ingredients
2. Get recipes ranked by best match
3. One tap → shopping list for missing items

## Out of scope (v1)
- Accounts, social sharing

## Metrics
- >= 60% reach a recipe in one session`,
      },
    ],
  },
  {
    id: 'architecture',
    index: 3,
    bmadPhase: 'Solutioning (Architecture)',
    persona: {
      id: 'winston',
      name: 'Winston',
      role: 'Architect',
      glyph: '🏛️',
      accent: '#8a7fcf',
      line: 'Now we forge the blueprint so it stands strong…',
    },
    artifact: {
      id: 'blueprint-gem',
      icon: '💎',
      title: 'Architecture',
      snippet: [
        'React + Vite (TS) frontend',
        'Node + TS, modern Express API',
        'Rank by fewest missing items',
      ],
    },
    reward: { hoursSaved: 5 },
    durationMs: 9000,
    command: '/bmad-create-architecture',
    summary: 'Choose the stack and system boundaries.',
    terminal: [
      '▸ analyzing requirements…',
      '▸ choosing stack & boundaries…',
      '✓ wrote planning/architecture.md',
    ],
    files: [{ path: 'planning/architecture.md' }],
    editor: [
      {
        filename: 'architecture.md',
        kind: 'doc',
        language: 'md',
        content: `# Architecture — FridgeChef

## Frontend
React + Vite (TypeScript)
Playwright snapshot tests

## Backend
Node + TypeScript, modern Express
REST: GET /api/recipes?have=eggs,cheese

## Data
In-memory recipe index (v1)
match = owned / required ingredients

## Decisions
- Stateless API — trivial to host
- Rank by fewest missing items`,
      },
    ],
  },
  {
    id: 'ux',
    index: 4,
    bmadPhase: 'UX Design',
    persona: {
      id: 'sally',
      name: 'Sally',
      role: 'UX Designer',
      glyph: '🎨',
      accent: '#ef7fa6',
      line: 'And it must feel delightful — let me map the journey…',
    },
    artifact: {
      id: 'design-map',
      icon: '🗺️',
      title: 'UX Design',
      snippet: [
        'Screen 1: "What\'s in your fridge?"',
        'Screen 2: ranked recipe cards',
        'Tone: warm, fast, one-handed',
      ],
    },
    reward: { hoursSaved: 3 },
    durationMs: 9000,
    command: '/bmad-ux',
    summary: 'Map the screens, flow, and tone.',
    terminal: [
      '▸ mapping the user journey…',
      '▸ specifying screens & states…',
      '✓ wrote planning/ux-design.md',
    ],
    files: [{ path: 'planning/ux-design.md' }],
    editor: [
      {
        filename: 'ux-design.md',
        kind: 'doc',
        language: 'md',
        content: `# UX Design — FridgeChef

## Screens
1. "What's in your fridge?" — chips input
2. Matches — ranked recipe cards
3. Recipe — steps + missing items

## Principles
- One-handed, fast, warm tone
- No dead ends: suggest staples

## Flow
input -> matches -> recipe -> shopping list`,
      },
    ],
  },
  {
    id: 'dev',
    index: 5,
    bmadPhase: 'Implementation',
    persona: {
      id: 'amelia',
      name: 'Amelia',
      role: 'Developer',
      glyph: '⚙️',
      accent: '#7ed957',
      line: 'And now… I BUILD IT. Watch the code appear!',
    },
    artifact: {
      id: 'tests-chest',
      icon: '🧰',
      title: 'Code + Passing Tests',
      snippet: [
        '✓ matches recipes from ingredients',
        '✓ ranks by fewest missing items',
        '18 / 18 passing',
      ],
    },
    reward: { hoursSaved: 12, testsPassing: 18 },
    durationMs: 11000,
    command: '/bmad-dev-story',
    summary: 'Implement, wire the UI, and run the tests.',
    terminal: [
      '▸ implementing recipe matcher…',
      '▸ wiring the React UI…',
      '▸ running tests… 18/18 ✓',
      '✓ shipped FridgeChef',
    ],
    files: [
      { path: 'src/api/recipes.ts' },
      { path: 'src/App.tsx' },
      { path: 'tests/recipes.spec.ts' },
    ],
    editor: [
      {
        filename: 'recipes.ts',
        kind: 'code',
        language: 'ts',
        diff: true,
        content: `// src/api/recipes.ts
import type { Recipe } from './types';

// Rank recipes by how much of each you can already make.
export function rankByPantry(recipes: Recipe[], have: string[]): Recipe[] {
  const owned = new Set(have.map((s) => s.toLowerCase()));
  return recipes
    .map((recipe) => {
      const missing = recipe.ingredients.filter(
        (item) => !owned.has(item.toLowerCase()),
      );
      const match = 1 - missing.length / recipe.ingredients.length;
      return { ...recipe, missing, match };
    })
    .sort((a, b) => b.match - a.match);
}`,
      },
      {
        filename: 'App.tsx',
        kind: 'code',
        language: 'tsx',
        diff: true,
        content: `// src/App.tsx
import { useState } from 'react';
import { rankByPantry } from './api/recipes';
import { RECIPES } from './data/recipes';

export default function App() {
  const [have, setHave] = useState<string[]>([]);
  const matches = rankByPantry(RECIPES, have);
  return (
    <main className="fridgechef">
      <PantryInput onChange={setHave} />
      <RecipeList recipes={matches} />
    </main>
  );
}`,
      },
      {
        filename: 'recipes.spec.ts',
        kind: 'code',
        language: 'ts',
        diff: true,
        content: `// tests/recipes.spec.ts
import { test, expect } from '@playwright/test';
import { rankByPantry } from '../src/api/recipes';
import { RECIPES } from '../src/data/recipes';

test('ranks by fewest missing ingredients', () => {
  const ranked = rankByPantry(RECIPES, ['eggs', 'cheese']);
  expect(ranked[0].missing.length).toBe(0);
});`,
      },
    ],
  },
];

/**
 * The full ride: intro → 5 phases → climax → cheat sheet.
 * Climax is time-boxed so autoplay advances to the takeaway cheat screen.
 * Step index === array index.
 */
export const RIDE_STEPS: RideStep[] = [
  { kind: 'intro', durationMs: 5200 },
  ...PHASES.map<RideStep>((phase) => ({ kind: 'phase', phase, durationMs: phase.durationMs })),
  { kind: 'climax', durationMs: 6500 },
  { kind: 'cheatsheet', durationMs: 999_999 },
];

/** Step index of the climax. */
export const CLIMAX_INDEX = PHASES.length + 1;
/** Step index of the final cheat-sheet screen. */
export const CHEATSHEET_INDEX = PHASES.length + 2;
