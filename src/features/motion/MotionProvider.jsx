import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { safeStorage } from '../../utils/safeStorage';

// Motion preference: 'system' follows prefers-reduced-motion. 'full' and
// 'reduced' are explicit choices made in the header and remembered per browser.
const STORAGE_KEY = 'lfi:motion';
const MotionContext = createContext(null);

const systemPrefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function MotionProvider({ children }) {
  const [preference, setPreferenceState] = useState(() => safeStorage.get(STORAGE_KEY) || 'system');
  const [systemReduced, setSystemReduced] = useState(systemPrefersReduced);

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setSystemReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const reduced = preference === 'reduced' || (preference === 'system' && systemReduced);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  }, [reduced]);

  const setPreference = useCallback((next) => {
    setPreferenceState(next);
    safeStorage.set(STORAGE_KEY, next);
  }, []);

  const value = useMemo(() => ({ reduced, preference, setPreference }), [reduced, preference, setPreference]);

  return (
    <MotionContext.Provider value={value}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>
      </LazyMotion>
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error('useMotion must be used inside <MotionProvider>');
  return ctx;
}
