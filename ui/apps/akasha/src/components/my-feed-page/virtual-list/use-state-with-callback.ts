import React from 'react';

export const useStateWithCallback = <S>(
  initialState: S,
): [S, (state: S, cb?: (state: S) => void) => void] => {
  const [state, setState] = React.useState<S>(initialState);
  const callback = React.useRef<(state: S) => void>();

  const stateSet = React.useCallback((newState, cb) => {
    callback.current = cb;
    setState(newState);
  }, []);

  React.useEffect(() => {
    if (callback.current) {
      callback.current(state);
      callback.current = null;
    }
  }, [state]);
  return [state, stateSet];
};
