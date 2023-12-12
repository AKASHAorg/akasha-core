import React from 'react';
import { useGetBeamsLazyQuery } from './generated/apollo';
import {
  type AkashaBeamEdge,
  type AkashaBeamFiltersInput,
  type AkashaBeamSortingInput,
  type PageInfo,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import type { GetBeamsQueryVariables } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { ApolloError } from '@apollo/client';

export type UseBeamsOptions = {
  overscan: number;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
};

const defaultSorting: AkashaBeamSortingInput = {
  createdAt: SortOrder.Desc,
};

export const useBeams = ({ overscan, filters, sorting }: UseBeamsOptions) => {
  const [state, setState] = React.useState<{
    beams: AkashaBeamEdge[];
    pageInfo?: PageInfo;
  }>({
    beams: [],
  });

  const [errors, setErrors] = React.useState<(ApolloError | Error)[]>([]);

  const mergedVars: GetBeamsQueryVariables = React.useMemo(() => {
    const vars: { sorting: AkashaBeamSortingInput; filters?: AkashaBeamFiltersInput } = {
      sorting: { ...defaultSorting, ...(sorting ?? {}) },
    };
    if (filters) {
      vars.filters = filters;
    }
    return vars;
  }, [sorting, filters]);

  const [fetchBeams, beamsQuery] = useGetBeamsLazyQuery({
    variables: {
      ...mergedVars,
      first: overscan,
    },
    onError: error => {
      setErrors(prev => prev.concat(error));
    },
  });
  const queryClient = React.useRef(beamsQuery.client);

  const fetchNextPage = async (lastCursor: string) => {
    if (beamsQuery.loading || beamsQuery.error || !lastCursor) return;
    try {
      const results = await beamsQuery.fetchMore({
        variables: {
          after: lastCursor,
          sorting: { createdAt: SortOrder.Desc },
        },
      });
      if (results.error) {
        setErrors(prev => [...prev, results.error]);
      }
      if (!results.data) return;

      const newBeams: AkashaBeamEdge[] = results.data?.akashaBeamIndex?.edges;

      setState(prev => ({
        beams: [...prev.beams, ...newBeams],
        pageInfo: {
          startCursor: prev.pageInfo.startCursor,
          endCursor: results.data.akashaBeamIndex.pageInfo.endCursor,
          hasPreviousPage: prev.pageInfo.hasPreviousPage,
          hasNextPage: results.data.akashaBeamIndex.pageInfo.hasNextPage,
        },
      }));
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };

  const fetchPreviousPage = async (firstCursor: string) => {
    if (beamsQuery.loading || beamsQuery.error || !firstCursor) return;
    try {
      const results = await beamsQuery.fetchMore({
        variables: {
          sorting: { createdAt: SortOrder.Asc },
          after: firstCursor,
        },
      });
      if (results.error) {
        setErrors(prev => [...prev, results.error]);
        return;
      }
      if (!results.data) return;
      const newBeams = results.data.akashaBeamIndex.edges.slice();
      setState(prev => ({
        beams: [...newBeams.reverse(), ...prev.beams],
        pageInfo: {
          startCursor: results.data.akashaBeamIndex.pageInfo.endCursor,
          endCursor: prev.pageInfo.startCursor,
          hasPreviousPage: results.data.akashaBeamIndex.pageInfo.hasNextPage,
          hasNextPage: prev.pageInfo.hasNextPage,
        },
      }));
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };

  const fetchInitialBeams = React.useCallback(
    async (variables?: GetBeamsQueryVariables) => {
      try {
        const results = await fetchBeams({ variables });
        if (results.error) {
          setErrors(prev => [...prev, results.error]);
          return;
        }
        if (!results.data) return;
        const newBeams: AkashaBeamEdge[] = results.data.akashaBeamIndex.edges.slice();
        let pageInfo: PageInfo = results.data.akashaBeamIndex.pageInfo;

        if (variables?.after) {
          pageInfo = {
            startCursor: results.data.akashaBeamIndex.pageInfo.endCursor,
            endCursor: results.data.akashaBeamIndex.pageInfo.startCursor,
            hasPreviousPage: results.data.akashaBeamIndex.pageInfo.hasNextPage,
            hasNextPage: true,
          };
          newBeams.reverse();
        }
        setState({ beams: newBeams, pageInfo });
      } catch (err) {
        setErrors(prev => prev.concat(err));
      }
    },
    [fetchBeams],
  );

  const fetchInitialData = React.useCallback(
    async (restoreItem?: { key: string; offsetTop: number }) => {
      if (beamsQuery.called) return;

      const initialVars: GetBeamsQueryVariables = {
        sorting: { createdAt: SortOrder.Desc },
      };

      if (restoreItem) {
        initialVars.sorting = { createdAt: SortOrder.Asc };
        initialVars.after = restoreItem.key;
      }

      await fetchInitialBeams(initialVars);
    },
    [beamsQuery.called, fetchInitialBeams],
  );

  React.useEffect(() => {
    const unsub = queryClient.current.onClearStore(() => {
      return fetchInitialData();
    });
    return () => {
      unsub();
    };
  }, [fetchInitialData]);

  const handleReset = async () => {
    setState({ beams: [] });
    try {
      await queryClient.current.clearStore();
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };

  return {
    beams: state.beams,
    fetchInitialData,
    fetchNextPage,
    fetchPreviousPage,
    isLoading: beamsQuery.loading,
    hasNextPage: state.pageInfo?.hasNextPage,
    hasPreviousPage: state.pageInfo?.hasPreviousPage,
    onReset: handleReset,
    hasErrors: errors.length > 0,
    errors: errors.map(err => {
      if (err instanceof ApolloError) {
        console.log('Apollo error:', JSON.stringify(err));
        return err.message;
      } else {
        console.log('Error:', err);
        return err.message;
      }
    }),
  };
};
