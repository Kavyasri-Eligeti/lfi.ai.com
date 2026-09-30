import { useMemo } from 'react';
import { useMotion } from '../motion/MotionProvider';
import { detectProfile } from './engine/profiles';

/** Resolves the rendering profile: 'high' | 'balanced' | 'light' | 'static'. */
export function useRenderProfile() {
  const { reduced } = useMotion();
  return useMemo(() => detectProfile({ reducedMotion: reduced }), [reduced]);
}
