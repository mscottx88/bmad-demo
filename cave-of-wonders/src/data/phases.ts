import type { Phase, RideStep } from '../types';

export const WISH = {
  raw: 'I wish I had an app that turns whatever is in my fridge into dinner ideas.',
  appName: 'FridgeChef',
  tagline: 'Recipes from whatever you already have',
} as const;

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
      line: 'Profiling users and market before we write a line of code.',
    },
    artifact: {
      id: 'research-scroll',
      icon: '📄',
      title: 'Product Brief',
      snippet: [
        '73% of cooks waste food they forgot',
        'Top ask: "use what I already own"',
        'Gap: no ingredient-first recipe app',
      ],
    },
    reward: { hoursSaved: 4 },
    durationMs: 9000,
    command: '/bmad-product-brief',
    summary: 'Scout the market & users; capture the opportunity.',
    dialogue:
      'BMAD runs a research pass before any tickets exist. This catches the most common failure mode in AI-assisted work: generating code that solves the wrong problem. Market context and user pain points are captured as a product brief — a shared ground-truth that every downstream agent reads. Without it, the PRD is guesswork. With it, requirements have evidence.',
    terminal: [
      '$ /bmad-product-brief',
      '▸ loading domain context…',
      '▸ running user research synthesis…',
      '▸ identifying market gaps…',
      '✓ wrote planning/product-brief.md (42 lines)',
    ],
    files: [{ path: 'planning/product-brief.md' }],
    editor: [
      {
        filename: 'product-brief.md',
        kind: 'doc',
        language: 'md',
        content: `# Product Brief — FridgeChef

## Problem Statement
Home cooks waste food they forget they own and stall on the
nightly "what's for dinner?" decision. 73% report discarding
ingredients weekly; only 12% of existing recipe apps support
ingredient-first search.

## Target User
Busy weeknight cooks (25–45) making fast, low-effort decisions.
Primary device: mobile. Key constraint: one-handed use.

## Opportunity
An ingredient-first recipe matcher fills a clear gap.
No existing app ranks by "fewest missing items."

## Success Metrics
- Time-to-first-recipe < 10s
- Session-to-recipe rate ≥ 60%
- Food waste self-report down 20% at 30 days

## Out of Scope (v1)
- Social sharing, accounts, nutrition data`,
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
      line: 'Pinning requirements now. Drift kills sprint velocity.',
    },
    artifact: {
      id: 'prd-scroll',
      icon: '📝',
      title: 'PRD',
      snippet: [
        'AC: ingredient input → ranked recipes < 2s',
        'AC: match score = owned / required',
        'AC: one-tap shopping list for missing items',
      ],
    },
    reward: { hoursSaved: 6 },
    durationMs: 9000,
    command: '/bmad-prd',
    summary: 'Pin down exactly what to build and why.',
    dialogue:
      'Requirements drift accounts for roughly 40% of sprint rework. BMAD\'s PM agent forces every feature to a testable acceptance criterion — no vague "should feel fast" allowed. This file becomes the contract: if it\'s not in the PRD, it won\'t be in the build. The developer agent reads this file first and generates story tasks directly from its acceptance criteria.',
    terminal: [
      '$ /bmad-prd',
      '▸ loading product-brief.md…',
      '▸ eliciting requirements…',
      '▸ generating acceptance criteria…',
      '✓ wrote planning/prd.md (68 lines)',
    ],
    files: [{ path: 'planning/prd.md' }],
    editor: [
      {
        filename: 'prd.md',
        kind: 'doc',
        language: 'md',
        content: `# PRD — FridgeChef

## Goal
Dinner ideas ranked by ingredients you already own.

## Functional Requirements

### FR-01: Ingredient Input
- User enters comma-separated or chip-style ingredients
- Input persists across page refresh (localStorage)
- AC: Given ≥ 1 ingredient, recipes appear within 2s

### FR-02: Recipe Ranking
- Recipes ranked by match = owned / required
- Ties broken by total ingredient count (ascending)
- AC: Given ["eggs","cheese"], top result has match ≥ 0.8

### FR-03: Shopping List
- Tapping a recipe shows missing ingredients
- One tap copies list to clipboard
- AC: missing items = required − owned (case-insensitive)

## Non-Functional Requirements
- Bundle size < 200 kB gzipped
- First paint < 1.5s on 4G

## Out of Scope (v1)
- Accounts, social sharing, nutrition data`,
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
      line: 'Wrong abstractions cost 10× to fix. Here\'s the ADR.',
    },
    artifact: {
      id: 'blueprint-gem',
      icon: '⚙️',
      title: 'Architecture',
      snippet: [
        'React + Vite (TS) · Playwright tests',
        'GET /api/recipes?have=eggs,cheese',
        'Rank: match = owned / required',
      ],
    },
    reward: { hoursSaved: 5 },
    durationMs: 9000,
    command: '/bmad-create-architecture',
    summary: 'Choose the stack and system boundaries.',
    dialogue:
      'Choosing the wrong abstraction costs 10× what choosing correctly costs upfront. This phase produces a minimal Architecture Decision Record — stack, data model, API contract, and deployment shape — decided once and shared across all downstream agents. No surprise "we should have used Postgres" conversations mid-sprint. Every developer agent that follows reads this file first.',
    terminal: [
      '$ /bmad-create-architecture',
      '▸ loading prd.md…',
      '▸ evaluating stack options…',
      '▸ writing ADR-001, ADR-002…',
      '✓ wrote planning/architecture.md (85 lines)',
    ],
    files: [{ path: 'planning/architecture.md' }],
    editor: [
      {
        filename: 'architecture.md',
        kind: 'doc',
        language: 'md',
        content: `# Architecture — FridgeChef

## Stack
- Frontend: React 18 + Vite 5 (TypeScript strict)
- Tests: Playwright (snapshot + integration)
- Deploy: static host (no SSR needed)

## ADR-001: Stateless API
**Decision:** Express REST, no session state.
**Rationale:** Trivial to host; no auth in v1.
**Endpoint:** GET /api/recipes?have=eggs,cheese

## ADR-002: In-Memory Recipe Index
**Decision:** JSON dataset bundled at build time.
**Rationale:** < 50 kB; no DB latency; offline-ready.
**Rejected:** SQLite (overkill), external API (latency).

## Data Model
\`\`\`ts
interface Recipe {
  id: string;
  name: string;
  ingredients: string[];  // lowercase, singular
}
interface RankedRecipe extends Recipe {
  match: number;          // owned / required
  missing: string[];
}
\`\`\`

## API Contract
GET /api/recipes?have=eggs,cheese
→ RankedRecipe[] sorted by match desc`,
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
      line: 'Speccing every screen state. UX gaps cause 40% of rework.',
    },
    artifact: {
      id: 'design-map',
      icon: '🗺️',
      title: 'UX Design',
      snippet: [
        'Screen 1: chip input + empty state',
        'Screen 2: ranked recipe cards',
        'Screen 3: recipe + missing items list',
      ],
    },
    reward: { hoursSaved: 3 },
    durationMs: 9000,
    command: '/bmad-ux',
    summary: 'Map the screens, flow, and tone.',
    dialogue:
      'UX gaps cause roughly 40% of implementation rework: missing button states, dead-end flows, validation deferred to the developer. BMAD\'s UX agent specs every screen and every transition before a line of code is written. The developer agent receives an unambiguous spec — not a Figma mockup with TBD annotations.',
    terminal: [
      '$ /bmad-ux',
      '▸ loading prd.md + architecture.md…',
      '▸ mapping user journey…',
      '▸ speccing screens, states, edge cases…',
      '✓ wrote planning/ux-design.md (74 lines)',
    ],
    files: [{ path: 'planning/ux-design.md' }],
    editor: [
      {
        filename: 'ux-design.md',
        kind: 'doc',
        language: 'md',
        content: `# UX Design — FridgeChef

## Screens

### Screen 1: Pantry Input
- Chip-style multi-input (comma or Enter adds chip)
- Empty state: "Add your first ingredient"
- Placeholder chips: "eggs", "cheese", "onion"
- No submit button — results update live (debounce 300ms)

### Screen 2: Recipe List
- Cards sorted by match % (badge top-right)
- 0-result state: "No full matches — showing closest"
- Skeleton loaders on first paint

### Screen 3: Recipe Detail
- Ingredient list: ✓ owned (green) / ✗ missing (muted)
- "Copy shopping list" button → clipboard
- Back chevron returns to Screen 2

## Interaction Principles
- One-handed, mobile-first (thumb zone)
- No dead ends: 0 results always shows closest match
- Tone: direct, fast — no marketing copy

## Flow
input (debounced) → ranked list → detail → clipboard`,
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
      line: 'Tests green. Merging.',
    },
    artifact: {
      id: 'tests-chest',
      icon: '✅',
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
    dialogue:
      'Implementation runs against a pinned spec and a pinned architecture. No interpreted scope, no Friday-afternoon decisions about state management. The developer agent writes the code, writes the tests, and runs them in a single context. When the test suite goes green, the story closes and sprint status updates automatically.',
    terminal: [
      '$ /bmad-dev-story',
      '▸ loading prd.md, architecture.md, ux-design.md…',
      '▸ implementing rankByPantry()…',
      '▸ wiring React UI (3 screens)…',
      '▸ writing Playwright tests…',
      '▸ npx playwright test → 18/18 ✓',
      '✓ shipped FridgeChef · sprint status: done',
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
import type { Recipe, RankedRecipe } from './types';

/**
 * Rank recipes by pantry coverage.
 * match = owned_ingredients / total_required
 * Ties broken by total ingredient count (ascending).
 */
export function rankByPantry(
  recipes: Recipe[],
  have: string[],
): RankedRecipe[] {
  const owned = new Set(have.map((s) => s.toLowerCase().trim()));
  return recipes
    .map((recipe) => {
      const missing = recipe.ingredients.filter(
        (item) => !owned.has(item.toLowerCase()),
      );
      const match = 1 - missing.length / recipe.ingredients.length;
      return { ...recipe, missing, match };
    })
    .sort((a, b) => b.match - a.match || a.ingredients.length - b.ingredients.length);
}

export function getShoppingList(recipe: RankedRecipe): string {
  return recipe.missing.join('\\n');
}`,
      },
      {
        filename: 'App.tsx',
        kind: 'code',
        language: 'tsx',
        diff: true,
        content: `// src/App.tsx
import { useDeferredValue, useState } from 'react';
import { rankByPantry } from './api/recipes';
import { RECIPES } from './data/recipes';
import { PantryInput } from './components/PantryInput';
import { RecipeList } from './components/RecipeList';

export default function App() {
  const [have, setHave] = useState<string[]>([]);
  const deferred = useDeferredValue(have);
  const matches = rankByPantry(RECIPES, deferred);

  return (
    <main className="fridgechef">
      <h1>FridgeChef</h1>
      <PantryInput value={have} onChange={setHave} />
      <RecipeList
        recipes={matches}
        isPending={deferred !== have}
      />
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
  expect(ranked[0].missing.length).toBeLessThanOrEqual(
    ranked[ranked.length - 1].missing.length,
  );
});

test('match score is 1 when all ingredients owned', () => {
  const [first] = rankByPantry(RECIPES, ['eggs', 'cheese', 'tomato', 'basil']);
  expect(first.match).toBe(1);
});

test('missing list is case-insensitive', () => {
  const [top] = rankByPantry(RECIPES, ['Eggs', 'CHEESE']);
  expect(top.missing.every((m) => m === m.toLowerCase())).toBe(true);
});`,
      },
    ],
  },
];

export const RIDE_STEPS: RideStep[] = [
  { kind: 'intro', durationMs: 5200 },
  ...PHASES.map<RideStep>((phase) => ({ kind: 'phase', phase, durationMs: phase.durationMs })),
  { kind: 'climax', durationMs: 6500 },
  { kind: 'cheatsheet', durationMs: 999_999 },
];

export const CLIMAX_INDEX = PHASES.length + 1;
export const CHEATSHEET_INDEX = PHASES.length + 2;
