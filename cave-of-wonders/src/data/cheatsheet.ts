import type { CheatEntry } from '../types';
import { PHASES, WISH } from './phases';

/** Derived from PHASES so commands/outputs never drift out of sync. */
export const CHEAT_ENTRIES: CheatEntry[] = PHASES.map((phase) => ({
  phase: phase.bmadPhase,
  command: phase.command,
  output: phase.files[0].path,
  does: phase.summary,
}));

/** Copy-pasteable "get going" block shown on the cheat sheet. */
export const GETTING_STARTED: string[] = [
  '# Install BMAD into your project',
  'npx bmad-method install',
  '',
  '# Then, inside the project:',
  '/bmad-help        # ask what to do next',
];

/** Build the downloadable Markdown cheat sheet from the live data. */
export function cheatSheetMarkdown(): string {
  const steps = CHEAT_ENTRIES.map(
    (e, i) => `${i + 1}. \`${e.command}\` → \`${e.output}\`\n   ${e.does}`,
  ).join('\n');

  return `# BMAD Method — Quick Reference

> Generated from the BMAD Method demo. Example: ${WISH.appName}.

## Getting started
\`\`\`bash
${GETTING_STARTED.join('\n')}
\`\`\`

## The workflow
${steps}

## Tip
Run each command in a fresh context window. \`/bmad-help\` always
tells you the next recommended step.
`;
}
