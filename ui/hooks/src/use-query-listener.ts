import * as React from 'react';
import uniqBy from 'lodash/uniqBy';
import isEqual from 'lodash/isEqual';
import {
  MutationKey,
  QueryKey,
  QueryObserver,
  QueryObserverResult,
  useQueryClient,
} from '@tanstack/react-query';
import type { Mutation } from '@tanstack/react-query';

/**
 * Hook to detect changes to a mutation
 * @returns Mutation | undefined
 * @example useMutationListener hook
 * ```typescript
 * const sampleMutation = useMutationListener('mutation key');
 *
 * const variables = sampleMutation.state.variables;
 * ```
 */
export const useMutationListener = <TVars, TData>(mutationKey: MutationKey) => {
  const [mutation, setMutation] = React.useState<Mutation<TData, unknown, TVars, unknown>>(null);
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();
  React.useEffect(() => {
    const unsubscribe = mutationCache.subscribe(event => {
      if (event.mutation && isEqual(event.mutation.options.mutationKey, mutationKey)) {
        setMutation(_mutation =>
          event.mutation.state.status !== _mutation?.state.status
            ? Object.assign({}, event.mutation)
            : _mutation,
        );
      }
    });
    return () => {
      unsubscribe();
    };
  }, [mutationKey, mutationCache]);
  return {
    mutation,
    clear: () => setMutation(null),
  };
};

/**
 * Hook to detect changes to mutations
 * @returns Mutation[] | undefined
 * @example useMutationsListener hook
 * ```typescript
 * const sampleMutations = useMutationsListener('mutation key');
 *
 * const variables = sampleMutations[0]?.state?.variables;
 * ```
 */
export const useMutationsListener = <TVars, TData>(mutationKey: MutationKey) => {
  const [mutations, setMutations] = React.useState<Mutation<TData, unknown, TVars, unknown>[]>([]);
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();
  React.useEffect(() => {
    const unsubscribe = mutationCache.subscribe(event => {
      if (event.mutation && isEqual(event.mutation.options.mutationKey, mutationKey)) {
        if (event.mutation.state.status === 'loading') {
          setMutations(mutations => uniqBy([event.mutation, ...mutations], 'mutationId'));
          return;
        }
        setMutations(mutations =>
          mutations.map(_mutation => {
            if (_mutation.mutationId === event.mutation.mutationId) {
              return event.mutation;
            }
            return _mutation;
          }),
        );
      }
    });
    return () => {
      unsubscribe();
    };
  }, [mutationKey, mutationCache]);
  return { mutations, clear: () => setMutations(null) };
};

/**
 * Hook to detect changes to a query
 * @example useQueryListener hook
 * ```typescript
 * const sampleQuery = useQueryListener('query key');
 *
 * const result = sampleQuery.data;
 * ```
 */
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
