import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTypewriter } from '../hooks/useStream';
import CopyButton from './CopyButton';
import type { EditorContent } from '../types';

interface Props {
  files: EditorContent[];
  enabled: boolean;
}

/**
 * A tabbed editor pane. The active tab streams its content in; `doc` files
 * render as Markdown-lite, `code` files render with lightweight in-house token
 * coloring, and `diff` code renders as a green "+ added" view (PR-like).
 * No syntax-highlighter dependency.
 */
export default function CodeEditor({ files, enabled }: Props) {
  const [active, setActive] = useState(0);
  const file = files[active] ?? files[0];
  const cps = file.kind === 'code' ? 130 : 200;
  const { shown, done } = useTypewriter(file.content, { enabled, cps });

  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown]);

  return (
    <div
      className="editor"
      data-testid="code-editor"
      data-kind={file.kind}
      data-diff={file.diff ? 'true' : undefined}
    >
      <div className="editor__tabs" role="tablist">
        {files.map((f, i) => (
          <button
            key={f.filename}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`editor__tab${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            data-testid="editor-tab"
          >
            {fileGlyph(f)} {f.filename}
            {i === active && !done && <span className="editor__tab-dot" aria-hidden />}
          </button>
        ))}
        <span className="editor__tab-spacer" />
        <CopyButton text={file.content} label={`Copy ${file.filename}`} className="editor__copy" />
      </div>

      <div ref={bodyRef} className={`editor__body editor__body--${file.kind}`}>
        {file.kind === 'doc' ? (
          <MarkdownLite text={shown} />
        ) : file.diff ? (
          <DiffCode text={shown} />
        ) : (
          <pre className="editor__code" data-testid="editor-code">
            <code>{colorizeCode(shown)}</code>
          </pre>
        )}
        {!done && <span className="editor__caret" aria-hidden />}
      </div>
    </div>
  );
}

function fileGlyph(file: EditorContent): string {
  if (file.language === 'md') return '📄';
  if (file.filename.endsWith('.spec.ts') || file.filename.endsWith('.test.ts')) return '🧪';
  return '🟦';
}

/** Minimal Markdown renderer — headings, lists, blanks, paragraphs. */
function MarkdownLite({ text }: { text: string }): ReactNode {
  const lines = text.split('\n');
  return (
    <div className="md">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return <h4 key={i} className="md__h2">{line.slice(3)}</h4>;
        if (line.startsWith('# ')) return <h3 key={i} className="md__h1">{line.slice(2)}</h3>;
        if (/^\d+\.\s/.test(line)) return <div key={i} className="md__li">{line}</div>;
        if (line.startsWith('- ')) return <div key={i} className="md__li">• {line.slice(2)}</div>;
        if (line.trim() === '') return <div key={i} className="md__sp" />;
        return <div key={i} className="md__p">{line}</div>;
      })}
    </div>
  );
}

/** Green "+ added" diff view; keeps token coloring on each line. */
function DiffCode({ text }: { text: string }): ReactNode {
  const lines = text.split('\n');
  return (
    <pre className="editor__code editor__code--diff" data-testid="editor-code">
      <code>
        {lines.map((line, i) => (
          <div key={i} className="diff-line">
            <span className="diff-gutter" aria-hidden>+</span>
            <span className="diff-content">{colorizeCode(line)}</span>
          </div>
        ))}
      </code>
    </pre>
  );
}

// Strings, comments, and a small keyword set — enough to read as real code.
const KEYWORDS = new Set([
  'import', 'export', 'from', 'const', 'let', 'var', 'function', 'return',
  'type', 'interface', 'new', 'of', 'in', 'if', 'else', 'for', 'await', 'async', 'default',
]);
const TOKEN_RE = /(\/\/[^\n]*)|('[^']*'|"[^"]*"|`[^`]*`)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$]+)/g;

/** Token-color a code string into spans. Order-preserving, dependency-free. */
function colorizeCode(text: string): ReactNode {
  const out: ReactNode[] = [];
  let key = 0;
  text.replace(TOKEN_RE, (match, comment, str, word, space, punct) => {
    if (comment) {
      out.push(<span key={key++} className="tok-comment">{comment}</span>);
    } else if (str) {
      out.push(<span key={key++} className="tok-string">{str}</span>);
    } else if (word) {
      if (KEYWORDS.has(word)) out.push(<span key={key++} className="tok-kw">{word}</span>);
      else if (/^[A-Z]/.test(word)) out.push(<span key={key++} className="tok-type">{word}</span>);
      else out.push(<Fragment key={key++}>{word}</Fragment>);
    } else if (space) {
      out.push(<Fragment key={key++}>{space}</Fragment>);
    } else if (punct) {
      out.push(<span key={key++} className="tok-punct">{punct}</span>);
    }
    return match;
  });
  return out;
}
