import type { ReactNode } from 'react';

interface Props {
  accent: string;
  present?: boolean;
  children: ReactNode;
}

/** The cave backdrop the whole ride plays inside. */
export default function Stage({ accent, present = false, children }: Props) {
  return (
    <div
      className={`stage${present ? ' stage--present' : ''}`}
      data-testid="stage"
      data-present={present ? 'true' : undefined}
      style={{ ['--accent' as string]: accent }}
    >
      <div className="stage__glow" aria-hidden />
      <div className="stage__motes" aria-hidden />
      <header className="stage__header">
        <h1 className="stage__brand">🪔 Cave of Wonders</h1>
        <p className="stage__subtitle">How the BMAD method grants your wish</p>
      </header>
      {children}
    </div>
  );
}
