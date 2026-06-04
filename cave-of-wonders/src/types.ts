export type PersonaId = 'mary' | 'john' | 'winston' | 'sally' | 'amelia';
export type OsChrome = 'mac' | 'win';

/** A BMAD expert agent persona displayed by AgentAvatar. */
export interface Persona {
  id: PersonaId;
  name: string;
  role: string;
  /** Single emoji used as an original, IP-safe avatar accent. */
  glyph: string;
  /** CSS color used to tint the agent avatar and scene for this persona. */
  accent: string;
  /** One-line statement this agent persona delivers during the phase. */
  line: string;
}

/** A BMAD artifact produced by a phase — displayed in the ArtifactPanel. */
export interface Artifact {
  id: string;
  /** Emoji icon shown in the artifact panel. */
  icon: string;
  title: string;
  /** 3–6 short lines of realistic sample content shown on screen. */
  snippet: string[];
}

export interface RewardDelta {
  hoursSaved: number;
  testsPassing?: number;
}

/** A file produced during the workflow, shown in the growing file tree. */
export interface TreeFile {
  /** Repo-relative path, e.g. 'planning/prd.md' or 'src/map/SubwayMap.tsx'. */
  path: string;
}

export type EditorKind = 'doc' | 'code';
export type EditorLanguage = 'md' | 'ts' | 'tsx';

/** What the code editor streams/renders during a phase (one editor tab). */
export interface EditorContent {
  /** Tab label, e.g. 'prd.md' or 'SubwayMap.tsx'. */
  filename: string;
  /** 'doc' renders Markdown-lite; 'code' shows token-colored source. */
  kind: EditorKind;
  language: EditorLanguage;
  content: string;
  /** When true (code only), render as a green '+ added' diff (PR-like). */
  diff?: boolean;
}

/** A row in the takeaway cheat sheet — derived from a Phase. */
export interface CheatEntry {
  phase: string;
  command: string;
  output: string;
  does: string;
}

/** A single BMAD phase in the demo sequence. */
export interface Phase {
  id: string;
  /** 1-based phase number; also its step index in the demo sequence. */
  index: number;
  bmadPhase: string;
  persona: Persona;
  artifact: Artifact;
  reward: RewardDelta;
  durationMs: number;
  /** The real BMAD command this phase runs, e.g. '/bmad-prd'. */
  command: string;
  /** Streamed terminal output lines for the command. */
  terminal: string[];
  /** Files this phase produces (appended to the cumulative tree). */
  files: TreeFile[];
  /** Editor tabs this phase shows (artifact doc, or one or more code files). */
  editor: EditorContent[];
  /** One-line "what it does" for the cheat sheet. */
  summary: string;
  /** 60-75 word technical rationale, typewriter-revealed at 500 WPM during the phase. */
  dialogue: string;
}

export type RideStepKind = 'intro' | 'phase' | 'climax' | 'cheatsheet';

export interface RideStep {
  kind: RideStepKind;
  /** Present only when kind === 'phase'. */
  phase?: Phase;
  durationMs: number;
}

export interface RewardTotals {
  hoursSaved: number;
  artifacts: number;
  testsPassing: number;
}
