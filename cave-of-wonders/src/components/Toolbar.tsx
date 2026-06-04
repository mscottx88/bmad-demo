interface Props {
  muted: boolean;
  onToggleMute: () => void;
  onPresent: () => void;
  onToggleCheat: () => void;
}

/** Top-right controls: present, mute, cheat sheet. Hidden in present mode. */
export default function Toolbar({ muted, onToggleMute, onPresent, onToggleCheat }: Props) {
  return (
    <div className="toolbar" data-testid="toolbar">
      <button type="button" className="toolbar__btn" onClick={onPresent} data-testid="present-btn">
        ▶ Present
      </button>
      <button
        type="button"
        className="toolbar__btn"
        onClick={onToggleMute}
        aria-pressed={!muted}
        data-testid="mute-btn"
        title="Toggle sound (M)"
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <button type="button" className="toolbar__btn" onClick={onToggleCheat} data-testid="cheat-toggle">
        📋 Cheat Sheet
      </button>
    </div>
  );
}
