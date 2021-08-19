import * as React from 'react';
import { MutationKey, useQueryClient } from 'react-query';
import { Mutation } from 'react-query/types/core/mutation';

/**
 * Hook to detect changes to a mutation
 * @param mutationKey - the key of the mutation to listen to
 * @returns Mutation | undefined
 */

export const useMutationListener = (mutationKey: MutationKey) => {
  const [mutation, setMutation] = React.useState<Mutation>();
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();
  const mountedRef = React.useRef(false);
  React.useEffect(() => {
    mountedRef.current = true;
    const unsubscribe = mutationCache.subscribe(mutation => {
      if (mutation.options.mutationKey === mutationKey) {
        setMutation(mutation);
      }
    });
    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [mutationKey, mutationCache]);
  return mutation;
};
