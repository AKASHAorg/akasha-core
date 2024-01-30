import * as React from 'react';
import type { ApolloQueryResult } from '@apollo/client';

export type PollingFn<V, T> = (vars: V) => Promise<ApolloQueryResult<T>>;
export type ShouldStop<T> = (response: T) => boolean;

export const useQueryPolling = <V, T>(
  pollingFn: PollingFn<V, T>,
  shouldStopPolling?: ShouldStop<Awaited<ReturnType<PollingFn<V, T>>>>,
  autoStart = false,
  intervalMs = 3000,
  vars?: V,
) => {
  const timerRef = React.useRef<ReturnType<typeof setInterval>>(null);
  const [isPolling, setIsPolling] = React.useState(false);
  const [lastResponse, setLastResponse] =
    React.useState<Awaited<ReturnType<PollingFn<V, T>>>>(null);
  const variables = React.useRef(null);

  const stopPolling = () => {
    clearInterval(timerRef.current);
    setIsPolling(false);
  };

  const pollingCallback = React.useCallback(async () => {
    const resp = await pollingFn(variables.current);
    if (shouldStopPolling(resp)) {
      setLastResponse(resp);
      stopPolling();
    }
  }, [pollingFn, shouldStopPolling]);

  const startPolling = React.useCallback(
    (vars: V) => {
      variables.current = vars;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = setInterval(pollingCallback, intervalMs);
      setIsPolling(true);
    },
    [intervalMs, pollingCallback],
  );

  React.useEffect(() => {
    if (autoStart && vars) {
      startPolling(vars);
    }
  }, [autoStart, startPolling, vars]);

  const removeLastResponse = () => {
    setLastResponse(null);
  };

  return {
    isPolling,
    lastResponse,
    removeLastResponse,
    startPolling,
    stopPolling,
  };
};
