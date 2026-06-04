interface Props {
  index: number;
  total: number;
}

/** Slim ride-progress indicator across the top of the stage. */
export default function ProgressBar({ index, total }: Props) {
  const pct = total <= 1 ? 100 : (index / (total - 1)) * 100;
  return (
    <div className="progress" data-testid="progress" aria-hidden>
      <div className="progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
