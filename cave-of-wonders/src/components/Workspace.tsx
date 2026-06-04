import type { OsChrome, Phase, TreeFile } from '../types';
import FileTree from './FileTree';
import CodeEditor from './CodeEditor';
import Terminal from './Terminal';
import ScrollingDialogue from './ScrollingDialogue';

interface Props {
  phase: Phase;
  /** All files produced up to and including this phase. */
  cumulativeFiles: TreeFile[];
  reducedMotion: boolean;
  osChrome: OsChrome;
}

export default function Workspace({ phase, cumulativeFiles, reducedMotion, osChrome }: Props) {
  const enabled = !reducedMotion;
  const newPaths = phase.files.map((f) => f.path);
  const title = `${phase.bmadPhase.toLowerCase()} — ${phase.files[0]?.path ?? ''}`;

  return (
    <div className="workspace" data-testid="workspace" data-phase={phase.index}>
      {osChrome === 'win' ? (
        <div className="workspace__chrome workspace__chrome--win">
          <span className="workspace__name workspace__name--win">{title}</span>
          <div className="workspace__winbtns" aria-hidden>
            <span className="workspace__wbtn">─</span>
            <span className="workspace__wbtn">□</span>
            <span className="workspace__wbtn workspace__wbtn--close">✕</span>
          </div>
        </div>
      ) : (
        <div className="workspace__chrome workspace__chrome--mac">
          <span className="workspace__dot workspace__dot--red" />
          <span className="workspace__dot workspace__dot--yellow" />
          <span className="workspace__dot workspace__dot--green" />
          <span className="workspace__name">{title}</span>
        </div>
      )}
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
