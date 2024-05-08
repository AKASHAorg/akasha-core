import * as React from 'react';

export const useDebounce = (
  cb: (...args: string[]) => void,
  delay: number,
  deps: (never | ((arg: string) => number))[] = [],
) => {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = React.useMemo(() => cb, [cb, ...deps]);
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return React.useCallback(
    (...args: string[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay],
  );
};
