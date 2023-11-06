import * as React from 'react';

export const useDebounce = (cb: (...args: unknown[]) => void, delay: number) => {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return (...args: unknown[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => cb(...args), delay);
  };
};
