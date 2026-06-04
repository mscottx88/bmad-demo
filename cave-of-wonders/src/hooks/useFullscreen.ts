import { useCallback, useEffect, useState } from 'react';

/**
 * Thin wrapper over the Fullscreen API. All calls are guarded so unsupported
 * browsers / rejected requests never throw. `isFullscreen` stays in sync even
 * when the user exits via Esc (the browser's native gesture).
 */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const enter = useCallback(() => {
    const el = document.documentElement;
    try {
      void el.requestFullscreen?.().catch(() => {});
    } catch {
      /* ignore — fullscreen is a nice-to-have */
    }
  }, []);

  const exit = useCallback(() => {
    try {
      if (document.fullscreenElement) void document.exitFullscreen?.().catch(() => {});
    } catch {
      /* ignore */
    }
  }, []);

  return { isFullscreen, enter, exit };
}
