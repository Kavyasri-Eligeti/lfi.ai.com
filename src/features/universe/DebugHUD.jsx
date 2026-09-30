import { useEffect, useState } from 'react';

// Performance overlay, enabled with ?debug=1. Used for Phase 3 validation.
export default function DebugHUD({ engineRef }) {
  const enabled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const id = window.setInterval(() => {
      const s = engineRef.current?.getStats();
      setStats(s || null);
      if (s) window.__LFI_STATS__ = s;
    }, 500);
    return () => window.clearInterval(id);
  }, [enabled, engineRef]);

  if (!enabled) return null;
  return (
    <pre className="lf-debug" aria-hidden="true">
      {stats ? Object.entries(stats).map(([k, v]) => `${k}: ${v}`).join('\n') : 'engine: not loaded'}
    </pre>
  );
}
