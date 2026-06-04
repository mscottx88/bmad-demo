import { useEffect, useRef } from 'react';
import { useTypewriter, useLineStream } from '../hooks/useStream';
import CopyButton from './CopyButton';

interface Props {
  command: string;
  output: string[];
  enabled: boolean;
}

const CMD_CPS = 12;

/** A faux terminal: types the real BMAD command, then streams its output. */
export default function Terminal({ command, output, enabled }: Props) {
  const cmd = useTypewriter(command, { enabled, cps: CMD_CPS });
  const afterCmdMs = enabled ? (command.length / CMD_CPS) * 1000 + 350 : 0;
  const lines = useLineStream(output, { enabled, lineMs: 1400, delayMs: afterCmdMs });

  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines.shown, cmd.shown]);

  return (
    <div className="terminal" data-testid="terminal">
      <div className="terminal__bar">TERMINAL</div>
      <div ref={bodyRef} className="terminal__body">
        <div className="terminal__cmdline">
          <span className="terminal__prompt">bmad&nbsp;❯</span>
          <span className="terminal__cmd" data-testid="terminal-command">
            {cmd.shown}
          </span>
          {!cmd.done && <span className="terminal__cursor" aria-hidden />}
          <CopyButton text={command} label={`Copy ${command}`} className="terminal__copy" />
        </div>
        {lines.shown.map((line, i) => (
          <div
            key={i}
            className={`terminal__out${line.startsWith('✓') ? ' is-ok' : ''}`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
