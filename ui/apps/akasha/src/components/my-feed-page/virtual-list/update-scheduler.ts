import { useThrottle } from './use-throttle';
import { useDebounce } from './use-debounce';

export const useUpdateScheduler = (updateFn: (from?: string) => void) => {
  const idleUpdate = (from?: string) => window.requestIdleCallback(() => updateFn(from));
  const RAFUpdate = (from?: string) => window.requestAnimationFrame(() => updateFn(from));
  const throttledUpdate = useThrottle((from?: string) => RAFUpdate(from), 334, { leading: false });
  const debouncedUpdate = useDebounce((from?: string) => RAFUpdate(from), 225);

  return {
    update: (from?: string) => updateFn(from),
    idleUpdate,
    RAFUpdate,
    throttledUpdate,
    debouncedUpdate,
  };
};
