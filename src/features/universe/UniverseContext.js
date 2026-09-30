import { createContext, useContext } from 'react';

// Lets pages drive the persistent universe (scroll progress, suspension)
// without re-rendering it. `engineRef.current` is null until the lazily
// loaded engine is ready, or permanently null in the static profile.
export const UniverseContext = createContext({
  engineRef: { current: null },
  profile: 'static',
  setScrollProgress: () => {},
  setSuspended: () => {},
});

export const useUniverse = () => useContext(UniverseContext);
