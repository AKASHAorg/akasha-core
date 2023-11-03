import { useThrottle } from './use-throttle';
import { useDebounce } from './use-debounce';

export const useUpdateScheduler = (updateFn: (from?: string) => void) => {
  const idleUpdate = (debugFrom?: string) => window.requestIdleCallback(() => updateFn(debugFrom));
  const RAFUpdate = (debugFrom?: string) => window.requestAnimationFrame(() => updateFn(debugFrom));
  const throttledUpdate = useThrottle((debugFrom?: string) => RAFUpdate(debugFrom), 334, {
    leading: false,
  });
  const debouncedUpdate = useDebounce((debugFrom?: string) => RAFUpdate(debugFrom), 225);

  return {
    update: (debugFrom?: string) => updateFn(debugFrom),
    idleUpdate,
    RAFUpdate,
    throttledUpdate,
    debouncedUpdate,
  };
};
