import { renderHook } from '@testing-library/react-hooks';
import { useThrottle, ThrottledFn, UseThrottleOptions } from '../use-throttle';

describe('useThrottle function', () => {
  const timeout = 200;
  const deps: unknown[] = [];

  it('should throttle function on leading edge', async () => {
    const opts: UseThrottleOptions = { trailing: false };
    const fn: ThrottledFn = jest.fn();
    const { result } = renderHook(() => useThrottle(fn, timeout, opts, deps));

    // Call the throttled function multiple times
    result.current();
    result.current();

    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('should throttle function calls on trailing edge', async () => {
    const opts: UseThrottleOptions = { leading: false };
    const fn: ThrottledFn = jest.fn();
    const { result, waitFor } = renderHook(() => useThrottle(fn, timeout, opts, deps));

    // Call the throttled function multiple times
    result.current();
    result.current();

    await waitFor(() => expect(fn).toHaveBeenCalledTimes(1), { interval: 200 });
  });
});
