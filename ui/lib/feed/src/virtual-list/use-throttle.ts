import * as React from 'react';

export type ThrottledFn = (...args: unknown[]) => void;
export type UseThrottleOptions = { leading?: boolean; trailing?: boolean };

export const useThrottle = (fn: ThrottledFn, timeout: number, options: UseThrottleOptions) => {
  const opts = React.useRef({ leading: true, trailing: true, ...options });
  const fnRef = React.useRef(fn);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    fnRef.current = fn;
    opts.current = { ...opts.current, ...options };
  }, [fn, options]);

  React.useEffect(() => {
    const timer = timerRef.current;
    return () => {
      if (timer) {
        clearTimeout(timer);
        timerRef.current = undefined;
      }
    };
  }, [fn, timeout, options]);

  return React.useCallback(
    (...args: unknown[]) => {
      if (timerRef.current) return;

      if (opts.current.leading) {
        fnRef.current(...args);
      }

      if (opts.current.trailing) {
        timerRef.current = setTimeout(() => {
          fnRef.current(...args);
          clearTimeout(timerRef.current);
          timerRef.current = undefined;
        }, timeout);
      }
    },
    [timeout],
  );
};

export default useThrottle;
