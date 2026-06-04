import type { CheatEntry } from '../types';
import { PHASES, DEMO_APP } from './phases';

/** Derived from PHASES so commands/outputs never drift out of sync. */
export const CHEAT_ENTRIES: CheatEntry[] = [
  ...PHASES.map((phase) => ({
    phase: phase.bmadPhase,
    command: phase.command,
    output: phase.files[0].path,
    does: phase.summary,
  })),
  {
    phase: 'Backlog Creation',
    command: '/bmad-create-epics-and-stories',
    output: 'implementation/epics.md',
    does: 'Break architecture into prioritized, implementable sprint stories.',
  },
  {
    phase: 'Code Review',
    command: '/bmad-code-review',
    output: 'review findings inline',
    does: 'Review a diff for correctness bugs, simplifications, and spec drift.',
  },
  {
    phase: 'Sprint Planning',
    command: '/bmad-sprint-planning',
    output: 'implementation/sprint-status.yaml',
    does: 'Propose sprint scope with story ordering and dependency mapping.',
  },
];

/** The entry-point command — displayed as a hero block on the cheat sheet. */
export const BMAD_HELP = {
  command: '/bmad-help',
  does: 'Your BMAD navigator. Run it at any point — it reads your project context and tells you exactly which command to run next and why.',
} as const;

/** Install command shown in the getting-started block. */
export const GETTING_STARTED: string[] = [
  'npx bmad-method install',
];

/** Build the downloadable Markdown cheat sheet from the live data. */
export function cheatSheetMarkdown(): string {
  const steps = CHEAT_ENTRIES.map(
    (e, i) => `${i + 1}. \`${e.command}\` → \`${e.output}\`\n   ${e.does}`,
  ).join('\n');

  return `# BMAD Method — Quick Reference

> Generated from the BMAD Method demo. Example: ${DEMO_APP.appName}.

## Start here — your navigator
\`\`\`
${BMAD_HELP.command}
\`\`\`
${BMAD_HELP.does}

## Install
\`\`\`bash
${GETTING_STARTED.join('\n')}
\`\`\`

## The workflow
${steps}

Tip: run each command in a fresh context window.
`;
}
