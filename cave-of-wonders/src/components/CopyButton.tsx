import { useEffect, useState } from 'react';

interface Props {
  /** Text to copy to the clipboard. */
  text: string;
  /** Optional accessible label / tooltip. */
  label?: string;
  className?: string;
}

/**
 * Copy-to-clipboard button with a transient "Copied!" state. Guards against
 * environments without the Clipboard API so it never throws — it still gives
 * visual feedback.
 */
export default function CopyButton({ text, label = 'Copy', className }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(t);
  }, [copied]);

  const onCopy = () => {
    try {
      void navigator.clipboard?.writeText(text);
    } catch {
      /* ignore — feedback still shows */
    }
    setCopied(true);
  };

  return (
    <button
      type="button"
      className={`copy-btn${copied ? ' is-copied' : ''}${className ? ` ${className}` : ''}`}
      onClick={onCopy}
      aria-label={label}
      data-testid="copy-button"
    >
      {copied ? '✓ Copied!' : '⧉ Copy'}
    </button>
  );
}
