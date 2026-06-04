import { useTypewriter, useLineStream } from '../hooks/useStream';
import CopyButton from './CopyButton';

interface Props {
  command: string;
  output: string[];
  enabled: boolean;
}

const CMD_CPS = 24;

/** A faux terminal: types the real BMAD command, then streams its output. */
export default function Terminal({ command, output, enabled }: Props) {
  const cmd = useTypewriter(command, { enabled, cps: CMD_CPS });
  // Start streaming output once the command has finished "typing".
  const afterCmdMs = enabled ? (command.length / CMD_CPS) * 1000 + 350 : 0;
  const lines = useLineStream(output, { enabled, lineMs: 700, delayMs: afterCmdMs });

  return (
    <div className="terminal" data-testid="terminal">
      <div className="terminal__bar">TERMINAL</div>
      <div className="terminal__body">
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
