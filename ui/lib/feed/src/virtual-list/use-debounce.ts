import * as React from 'react';

export const useDebounce = (
  cb: (...args: string[]) => void,
  delay: number,
  deps: unknown[] = [],
) => {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const callback = React.useCallback(cb, [cb, ...deps]);

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
