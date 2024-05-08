import React from 'react';

export const useStateWithCallback = <S>(
  initialState: S | (() => S),
): [S, (state: S, cb: (state: S) => void) => void] => {
  const [state, setState] = React.useState<S>(initialState);
  const callback = React.useRef<(state: S) => void>();

  const stateSet = React.useCallback((newState: S, cb: (state: S) => void) => {
    callback.current = cb;
    setState(newState);
  }, []);

  React.useLayoutEffect(() => {
    if (callback.current) {
      callback.current(state);
      callback.current = undefined;
    }
  }, [state]);

  return [state, stateSet];
};
