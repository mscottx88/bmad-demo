import { useEffect } from 'react';

export type KeyHandlers = Partial<Record<string, () => void>>;

/**
 * Global keydown → handler map. Keys are matched case-insensitively; `Space`
 * and the arrow keys preventDefault so the page doesn't scroll. Handlers are
 * read from a ref-free closure each render via the latest `handlers` object.
 */
export function useKeyboard(handlers: KeyHandlers): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key === ' ' ? 'Space' : e.key;
      const handler = handlers[key] ?? handlers[key.toLowerCase()];
      if (!handler) return;
      if (key === 'Space' || key.startsWith('Arrow')) e.preventDefault();
      handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlers]);
}
