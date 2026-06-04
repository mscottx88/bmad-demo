import type { Phase, TreeFile } from '../types';
import FileTree from './FileTree';
import CodeEditor from './CodeEditor';
import Terminal from './Terminal';
import ScrollingDialogue from './ScrollingDialogue';

interface Props {
  phase: Phase;
  /** All files produced up to and including this phase. */
  cumulativeFiles: TreeFile[];
  reducedMotion: boolean;
}

/**
 * The blended "engineer" center: an IDE mock for the active phase —
 * file tree (left) + code editor (main) + terminal (bottom). This is where
 * the abstract method becomes visibly real: a command runs, a file appears,
 * the tree grows.
 */
export default function Workspace({ phase, cumulativeFiles, reducedMotion }: Props) {
  const enabled = !reducedMotion;
  const newPaths = phase.files.map((f) => f.path);

  return (
    <div className="workspace" data-testid="workspace" data-phase={phase.index}>
      <div className="workspace__chrome">
        <span className="workspace__dot" />
        <span className="workspace__dot" />
        <span className="workspace__dot" />
        <span className="workspace__name">fridgechef — {phase.bmadPhase}</span>
      </div>
      <div className="workspace__grid">
        <FileTree files={cumulativeFiles} newPaths={newPaths} reducedMotion={reducedMotion} />
        <div className="workspace__main">
          <CodeEditor files={phase.editor} enabled={enabled} />
          <Terminal command={phase.command} output={phase.terminal} enabled={enabled} />
          <ScrollingDialogue text={phase.dialogue} reducedMotion={reducedMotion} />
        </div>
      </div>
    </div>
  );
}
