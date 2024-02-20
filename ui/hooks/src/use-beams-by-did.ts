import React from 'react';
import { useGetBeamsByAuthorDidLazyQuery } from './generated/apollo';
import {
  type PageInfo,
  SortOrder,
  AkashaBeamFiltersInput,
  AkashaBeamSortingInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import type {
  GetBeamsByAuthorDidQuery,
  GetBeamsByAuthorDidQueryVariables,
  GetBeamsQueryVariables,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { ApolloError } from '@apollo/client';
import { hasOwn } from './utils/has-own';

export type UseBeamsByDidOptions = {
  overscan: number;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
  did: string;
};

const defaultSorting: AkashaBeamSortingInput = {
  createdAt: SortOrder.Desc,
};

export const useBeamsByDid = ({ overscan, filters, sorting, did }: UseBeamsByDidOptions) => {
  const [state, setState] = React.useState<{
    beams: Exclude<
      GetBeamsByAuthorDidQuery['node'],
      Record<string, never>
    >['akashaBeamList']['edges'];
    pageInfo?: PageInfo;
  }>({ beams: [] });

  const [errors, setErrors] = React.useState<(ApolloError | Error)[]>([]);

  const mergedVars: GetBeamsQueryVariables = React.useMemo(() => {
    const vars: {
      sorting?: AkashaBeamSortingInput;
      filters?: AkashaBeamFiltersInput | AkashaBeamFiltersInput;
      id?: string;
    } = {
      sorting: { ...defaultSorting, ...(sorting ?? {}) },
    };
    if (filters) {
      vars.filters = filters;
    }

    return vars;
  }, [sorting, filters]);

  const [fetchBeams, beamsQuery] = useGetBeamsByAuthorDidLazyQuery({
    variables: {
      ...mergedVars,
      id: did,
      first: overscan,
    },
  });

  const beamCursors = React.useMemo(() => new Set(state.beams.map(b => b.cursor)), [state]);

  const extractData = React.useCallback(
    (
      results: GetBeamsByAuthorDidQuery,
    ): {
      edges: Exclude<
        GetBeamsByAuthorDidQuery['node'],
        Record<string, never>
      >['akashaBeamList']['edges'];

      pageInfo: PageInfo;
    } => {
      if (hasOwn(results, 'node') && hasOwn(results.node, 'akashaBeamList')) {
        return {
          edges: results.node.akashaBeamList.edges.filter(edge => !beamCursors.has(edge.cursor)),
          pageInfo: results.node.akashaBeamList.pageInfo,
        };
      }
    },
    [beamCursors],
  );

  const queryClient = React.useRef(beamsQuery.client);

  const fetchNextPage = async (lastCursor: string) => {
    if (beamsQuery.loading || beamsQuery.error || !lastCursor) return;

    const variables = {
      variables: {
        id: did,
        after: lastCursor,
        sorting: { createdAt: SortOrder.Desc },
        indexer: undefined,
      },
    };

    try {
      const results = await beamsQuery.fetchMore(variables);
      if (results.error) {
        setErrors(prev => [...prev, results.error]);
      }
      if (!results.data) return;
      const { edges, pageInfo } = extractData(results.data);

      setState(prev => ({
        beams: [...prev.beams, ...edges],
        pageInfo: {
          ...prev.pageInfo,
          endCursor: pageInfo.endCursor,
          hasNextPage: pageInfo.hasNextPage,
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
      const { edges, pageInfo } = extractData(results.data);
      setState(prev => ({
        beams: [...edges.reverse(), ...prev.beams],
        pageInfo: {
          ...prev.pageInfo,
          startCursor: pageInfo.endCursor,
          hasPreviousPage: pageInfo.hasNextPage,
        },
      }));
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };

  const fetchInitialBeams = React.useCallback(
    async (variables?: GetBeamsByAuthorDidQueryVariables) => {
      try {
        const results = await fetchBeams({ variables });
        if (results.error) {
          setErrors(prev => [...prev, results.error]);
          return;
        }
        if (!results.data) return;
        const extracted = extractData(results.data);

        /**
         * handle the case where we are requesting the items created before a
         * specific beam (previous beams). In this case the property
         *  pageInfo.hasPreviousPage on the response will always be false and
         * hasNextPage will be true if there are more newer items than requested
         *  (the equivalent of hasPreviousPage)
         *
         * Note: setting hasNextPage to true here will only trigger one more call
         * to fetchNextPage and it will
         * set the actual value inside that function
         **/
        if (variables?.after) {
          extracted.pageInfo = {
            startCursor: extracted.pageInfo.endCursor,
            endCursor: extracted.pageInfo.startCursor,
            hasPreviousPage: extracted.pageInfo.hasNextPage,
            hasNextPage: true,
          };
          extracted.edges = extracted.edges.reverse();
        }
        setState({ beams: extracted.edges, pageInfo: extracted.pageInfo });
      } catch (err) {
        setErrors(prev => prev.concat(err));
      }
    },
    [extractData, fetchBeams],
  );

  const fetchInitialData = React.useCallback(
    async (restoreItem?: { key: string; offsetTop: number }) => {
      if (beamsQuery.called) return;

      const initialVars: GetBeamsByAuthorDidQueryVariables = {
        ...mergedVars,
        sorting: { createdAt: SortOrder.Desc },
        id: did ?? undefined,
      };

      if (restoreItem) {
        initialVars.sorting = { createdAt: SortOrder.Asc };
        initialVars.after = restoreItem.key;
      }

      await fetchInitialBeams(initialVars);
    },
    [beamsQuery.called, did, fetchInitialBeams, mergedVars],
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
    called: beamsQuery.called,
    isLoading: beamsQuery.loading,
    hasNextPage: state.pageInfo?.hasNextPage,
    hasPreviousPage: state.pageInfo?.hasPreviousPage,
    onReset: handleReset,
    hasErrors: errors.length > 0,
    errors: errors.map(err => {
      return err.message;
    }),
  };
};
