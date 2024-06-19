import { useCallback, useState } from 'react';

interface TUseDevModeReturn {
  devMode: boolean;
  propagateDevMode: (_isDevMode: boolean) => void;
}

/**
 * Hook to check or set Dev Mode preference
 * @example useDevMode hook
 * ```typescript
 * const { devMode, propagateDevMode } = useDevMode();
 * ```
 * @returns `{ devMode, propagateDevMode }` The current devMode value and a function to set the devMode preference.
 * The `propagateDevMode` function takes just a boolean parameter indicating whether or not you are enabling dev mode.
 **/
export const useDevMode = (): TUseDevModeReturn => {
  // get the dev mode preference, if any, from local storage
  const isDevMode = window.localStorage.getItem('DevMode');

  const [devMode, setDevMode] = useState<boolean>(isDevMode === 'true');

  const propagateDevMode = useCallback((_isDevMode: boolean) => {
    setDevMode(_isDevMode);
    window.localStorage.setItem('DevMode', JSON.stringify(_isDevMode));
  }, []);

  return { devMode, propagateDevMode };
};
