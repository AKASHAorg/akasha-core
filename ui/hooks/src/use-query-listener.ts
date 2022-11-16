import * as React from 'react';
import uniqBy from 'lodash/uniqBy';
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
 * @returns Mutation | undefined
 * @example useMutationListener hook
 * ```typescript
 * const sampleMutation = useMutationListener('mutation key');
 *
 * const variables = sampleMutation.state.variables;
 * ```
 */
export const useMutationListener = <TVars>(mutationKey: MutationKey) => {
  const [mutation, setMutation] = React.useState<Mutation<unknown, unknown, TVars>>();
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();
  React.useEffect(() => {
    const unsubscribe = mutationCache.subscribe(mutation => {
      if (mutation.options.mutationKey === mutationKey) {
        setMutation(mutation as unknown as Mutation<unknown, unknown, TVars>);
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
export const useMutationsListener = <TVars>(mutationKey: MutationKey) => {
  const [mutations, setMutations] = React.useState<Mutation<unknown, unknown, TVars>[]>([]);
  const queryClient = useQueryClient();
  const mutationCache = queryClient.getMutationCache();
  React.useEffect(() => {
    const unsubscribe = mutationCache.subscribe(mutation => {
      if (mutation.options.mutationKey === mutationKey) {
        if (mutation.state.status === 'loading') {
          setMutations(mutations =>
            uniqBy(
              [mutation as unknown as Mutation<unknown, unknown, TVars>, ...mutations],
              'mutationId',
            ),
          );
          return;
        }
        setMutations(mutations =>
          mutations.map(_mutation => {
            if (_mutation.mutationId === mutation.mutationId) {
              return mutation as unknown as Mutation<unknown, unknown, TVars>;
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
  return { mutations };
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
