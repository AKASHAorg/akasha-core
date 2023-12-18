import * as React from 'react';

export type ThrottledFn = (...args: unknown[]) => void;
export type UseThrottleOptions = { leading?: boolean; trailing?: boolean };

export const useThrottle = (
  fn: ThrottledFn,
  timeout: number,
  option: UseThrottleOptions,
  deps: unknown[] = [],
) => {
  const timerId = React.useRef<ReturnType<typeof setTimeout>>();
  const lastArgs = React.useRef<unknown[]>();
  const isUnmounted = React.useRef(false);

  const opt = React.useMemo(
    () => ({
      leading: true,
      trailing: true,
      ...option,
    }),
    [option],
  );

  React.useEffect(() => {
    return () => {
      isUnmounted.current = true;
      clearTimeout(timerId.current);
    };
  }, []);

  return React.useCallback(
    (...args: unknown[]) => {
      if (isUnmounted.current) return;

      const { trailing, leading } = opt;

      const waitFn = () => {
        if (!isUnmounted.current && trailing && lastArgs.current) {
          fn(...lastArgs.current);
          lastArgs.current = undefined;
          timerId.current = setTimeout(waitFn, timeout);
        } else {
          timerId.current = undefined;
        }
      };

      if (!timerId.current && leading && !isUnmounted.current) {
        fn(...args);
      } else {
        lastArgs.current = args;
      }

      if (!timerId.current) {
        timerId.current = setTimeout(waitFn, timeout);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [opt, fn, timeout, ...deps],
  );
};

export default useThrottle;
