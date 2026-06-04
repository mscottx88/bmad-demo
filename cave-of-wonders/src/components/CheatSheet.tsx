import CopyButton from './CopyButton';
import { CHEAT_ENTRIES, GETTING_STARTED, cheatSheetMarkdown } from '../data/cheatsheet';

/** Trigger an in-browser download of the cheat sheet as Markdown (no network). */
function downloadMarkdown() {
  const blob = new Blob([cheatSheetMarkdown()], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bmad-cheatsheet.md';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Shared cheat-sheet content used by both the slide-out panel and the screen. */
export default function CheatSheet() {
  const gettingStarted = GETTING_STARTED.join('\n');

  return (
    <div className="cheat" data-testid="cheat-sheet">
      <div className="cheat__head">
        <h2 className="cheat__title">📋 BMAD Cheat Sheet</h2>
        <div className="cheat__actions">
          <CopyButton text={cheatSheetMarkdown()} label="Copy the whole cheat sheet" />
          <button
            type="button"
            className="cheat__download"
            onClick={downloadMarkdown}
            data-testid="download-cheatsheet"
          >
            ⬇ Download .md
          </button>
        </div>
      </div>

      <div className="cheat__gs">
        <div className="cheat__gs-head">
          <span>Getting started</span>
          <CopyButton text={gettingStarted} label="Copy getting-started" />
        </div>
        <pre className="cheat__gs-pre">{gettingStarted}</pre>
      </div>

      <ol className="cheat__list">
        {CHEAT_ENTRIES.map((entry, i) => (
          <li key={entry.command} className="cheat__row" data-testid="cheat-row">
            <span className="cheat__num">{i + 1}</span>
            <div className="cheat__main">
              <div className="cheat__cmd">
                <code>{entry.command}</code>
                <CopyButton text={entry.command} label={`Copy ${entry.command}`} />
              </div>
              <div className="cheat__meta">
                <span className="cheat__phase">{entry.phase}</span>
                <span className="cheat__arrow">→</span>
                <code className="cheat__out">{entry.output}</code>
              </div>
              <p className="cheat__does">{entry.does}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
