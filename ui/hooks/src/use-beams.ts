import React from 'react';
import { useGetBeamStreamLazyQuery, useGetBeamsByAuthorDidLazyQuery } from './generated/apollo';
import {
  type AkashaBeamStreamFiltersInput,
  type AkashaBeamStreamSortingInput,
  type PageInfo,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import type {
  GetBeamStreamQuery,
  GetBeamStreamQueryVariables,
  GetBeamsByAuthorDidQuery,
  GetBeamsByAuthorDidQueryVariables,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { ApolloError } from '@apollo/client';
import { hasOwn } from './utils/has-own';
import getSDK from '@akashaorg/awf-sdk';

export type UseBeamsOptions = {
  overscan: number;
  filters?: AkashaBeamStreamFiltersInput;
  sorting?: AkashaBeamStreamSortingInput;
  did?: string;
};

const defaultSorting: AkashaBeamStreamSortingInput = {
  createdAt: SortOrder.Desc,
};

export const useBeams = ({ overscan, filters, sorting, did }: UseBeamsOptions) => {
  const [state, setState] = React.useState<{
    beams:
      | Exclude<GetBeamStreamQuery['node'], Record<string, never>>['akashaBeamStreamList']['edges']
      | Exclude<GetBeamsByAuthorDidQuery['node'], Record<string, never>>['akashaBeamList']['edges'];
    pageInfo?: PageInfo;
  }>({ beams: [] });

  const [errors, setErrors] = React.useState<(ApolloError | Error)[]>([]);
  const sdk = getSDK();
  const indexingDID = React.useRef(getSDK().services.gql.indexingDID);

  const mergedVars: GetBeamStreamQueryVariables = React.useMemo(() => {
    const vars: {
      indexer: string;
      sorting?: AkashaBeamStreamSortingInput;
      filters?: AkashaBeamStreamFiltersInput;
    } = {
      indexer: sdk.services.gql.indexingDID,
      sorting: { ...defaultSorting, ...(sorting ?? {}) },
    };
    if (filters) {
      vars.filters = filters;
    }

    return vars;
  }, [sdk.services.gql.indexingDID, sorting, filters]);

  const getterHook = did ? useGetBeamsByAuthorDidLazyQuery : useGetBeamStreamLazyQuery;

  const [fetchBeams, beamsQuery] = getterHook({
    variables: did
      ? {
          ...mergedVars,
          id: did,
          indexer: undefined,
          first: overscan,
        } /* satisfies GetBeamsByAuthorDidQueryVariables */
      : ({
          ...mergedVars,
          first: overscan,
          id: undefined,
          indexer: indexingDID.current,
        } satisfies GetBeamStreamQueryVariables & GetBeamsByAuthorDidQueryVariables),
  });

  const beamCursors = React.useMemo(() => new Set(state.beams.map(b => b.cursor)), [state]);

  const extractData = React.useCallback(
    (
      results: GetBeamStreamQuery | GetBeamsByAuthorDidQuery,
    ): {
      edges:
        | Exclude<
            GetBeamStreamQuery['node'],
            Record<string, never>
          >['akashaBeamStreamList']['edges']
        | Exclude<
            GetBeamsByAuthorDidQuery['node'],
            Record<string, never>
          >['akashaBeamList']['edges'];

      pageInfo: PageInfo;
    } => {
      if (hasOwn(results, 'node') && results.node && hasOwn(results.node, 'akashaBeamList')) {
        return {
          edges: results.node.akashaBeamList.edges.filter(edge => !beamCursors.has(edge.cursor)),
          pageInfo: results.node.akashaBeamList.pageInfo,
        };
      }
      if (hasOwn(results, 'node') && results.node && hasOwn(results.node, 'akashaBeamStreamList')) {
        return {
          edges: results.node.akashaBeamStreamList.edges.filter(
            edge => !beamCursors.has(edge.cursor),
          ),
          pageInfo: results.node.akashaBeamStreamList.pageInfo,
        };
      }
    },
    [beamCursors],
  );

  const queryClient = React.useRef(beamsQuery.client);

  const fetchNextPage = async (lastCursor: string) => {
    if (beamsQuery.loading || beamsQuery.error || !lastCursor) return;

    const variables = did
      ? {
          variables: {
            id: did,
            after: lastCursor,
            sorting: { createdAt: SortOrder.Desc },
            indexer: undefined,
          },
        }
      : {
          variables: {
            after: lastCursor,
            sorting: { createdAt: SortOrder.Desc },
            indexer: indexingDID.current,
          },
        };
    try {
      const results = await beamsQuery.fetchMore(variables);
      if (results.error) {
        setErrors(prev => [...prev, results.error]);
      }
      if (!results.data) return;
      const { edges, pageInfo } = extractData(results.data);

      setState(
        prev =>
          ({
            beams: [
              ...prev.beams,
              ...edges.filter(edge => {
                const isNewBeam = !prev.beams.some(beam => beam.cursor === edge.cursor);
                if (!isNewBeam) {
                  console.warn('on fetchNextPage, beam cursor:', edge.cursor, 'already added!');
                }
                return isNewBeam;
              }),
            ],
            pageInfo: {
              ...prev.pageInfo,
              endCursor: pageInfo.endCursor,
              hasNextPage: pageInfo.hasNextPage,
            },
          }) as {
            /* needs a better type assertion approach to get rid of a typescript error message */
            beams:
              | Exclude<
                  GetBeamStreamQuery['node'],
                  Record<string, never>
                >['akashaBeamStreamList']['edges']
              | Exclude<
                  GetBeamsByAuthorDidQuery['node'],
                  Record<string, never>
                >['akashaBeamList']['edges'];
            pageInfo?: PageInfo;
          },
      );
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

      setState(
        prev =>
          ({
            beams: [
              ...edges.reverse().filter(edge => {
                const isNewBeam = !prev.beams.some(beam => beam.cursor === edge.cursor);
                if (!isNewBeam) {
                  console.warn('on fetch prev page, beam cursor', edge.cursor, 'already added!');
                }
                return isNewBeam;
              }),
              ...prev.beams,
            ],
            pageInfo: {
              ...prev.pageInfo,
              startCursor: pageInfo.endCursor,
              hasPreviousPage: pageInfo.hasNextPage,
            },
          }) as {
            /* needs a better type assertion approach to get rid of a typescript error message */
            beams:
              | Exclude<
                  GetBeamStreamQuery['node'],
                  Record<string, never>
                >['akashaBeamStreamList']['edges']
              | Exclude<
                  GetBeamsByAuthorDidQuery['node'],
                  Record<string, never>
                >['akashaBeamList']['edges'];
            pageInfo?: PageInfo;
          },
      );
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };

  const fetchInitialBeams = React.useCallback(
    async (variables?: GetBeamsByAuthorDidQueryVariables & GetBeamStreamQueryVariables) => {
      try {
        const results = await fetchBeams({ variables, fetchPolicy: 'cache-first' });
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
      if (state.beams.length) {
        setState({
          beams: [],
        });
      }

      const initialVars: GetBeamStreamQueryVariables & GetBeamsByAuthorDidQueryVariables = {
        ...mergedVars,
        sorting: { createdAt: SortOrder.Desc },
        id: did ?? undefined,
        indexer: did ? undefined : indexingDID.current,
      };

      if (restoreItem) {
        initialVars.sorting = { createdAt: SortOrder.Asc };
        initialVars.after = restoreItem.key;
      }

      await fetchInitialBeams(initialVars);
    },
    [did, fetchInitialBeams, state.beams.length],
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
    beamCursors,
    fetchInitialData,
    fetchNextPage,
    fetchPreviousPage,
    isLoading: beamsQuery.loading,
    called: beamsQuery.called,
    hasNextPage: state.pageInfo?.hasNextPage,
    hasPreviousPage: state.pageInfo?.hasPreviousPage,
    onReset: handleReset,
    hasErrors: errors.length > 0,
    errors: errors.map(err => {
      return err.message;
    }),
  };
};
