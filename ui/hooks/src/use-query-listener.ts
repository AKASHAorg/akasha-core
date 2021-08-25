import * as React from 'react';
import {
  MutationKey,
  QueryKey,
  QueryObserver,
  QueryObserverResult,
  useQueryClient,
} from 'react-query';
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
  React.useEffect(() => {
    const unsubscribe = mutationCache.subscribe(mutation => {
      if (mutation.options.mutationKey === mutationKey) {
        setMutation(Object.assign({}, mutation));
      }
    });
    return () => {
      unsubscribe();
    };
  }, [mutationKey, mutationCache]);
  return mutation;
};

export const useQueryListener = <TData>(queryKey: QueryKey) => {
  const [query, setQuery] = React.useState<QueryObserverResult<TData, unknown>>();
  const queryClient = useQueryClient();
  React.useLayoutEffect(() => {
    const observer = new QueryObserver<TData, unknown>(queryClient, {
      queryKey,
      queryFn: () => {
        return queryClient.getQueryData(queryKey);
      },
    });
    const unsubscribe = observer.subscribe(query => {
      setQuery(Object.assign({}, query));
    });
    return () => {
      unsubscribe();
      observer.destroy();
    };
  }, [queryKey, queryClient]);

  return query;
};
