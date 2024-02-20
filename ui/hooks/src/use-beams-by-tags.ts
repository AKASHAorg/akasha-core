import React from 'react';
import { useGetIndexedStreamLazyQuery } from './generated/apollo';
import getSDK from '@akashaorg/awf-sdk';
import {
  AkashaIndexedStreamStreamType,
  type PageInfo,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import type {
  GetIndexedStreamQuery,
  GetIndexedStreamQueryVariables,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { ApolloError } from '@apollo/client';
import { hasOwn } from './utils/has-own';

export const useBeamsByTags = (tag: string | string[]) => {
  const sdk = getSDK();
  const [state, setState] = React.useState<{
    beams: Exclude<
      GetIndexedStreamQuery['node'],
      Record<string, never>
    >['akashaIndexedStreamList']['edges'];
    pageInfo?: PageInfo;
  }>({ beams: [] });

  const [errors, setErrors] = React.useState<(ApolloError | Error)[]>([]);

  const tagsFilters =
    typeof tag === 'string'
      ? { where: { indexValue: { equalTo: tag } } }
      : {
          or: tag?.map(_tag => ({ where: { indexValue: { equalTo: _tag } } })) || [],
        };

  const [fetchBeams, beamsQuery] = useGetIndexedStreamLazyQuery({
    variables: {
      indexer: sdk.services.gql.indexingDID,
      first: 10,
      sorting: { createdAt: SortOrder.Desc },
      filters: {
        and: [
          { where: { streamType: { equalTo: AkashaIndexedStreamStreamType.Beam } } },
          { where: { indexType: { equalTo: sdk.services.gql.labelTypes.TAG } } },
          { where: { active: { equalTo: true } } },
          tagsFilters,
        ],
      },
    },
  });

  const beamCursors = React.useMemo(() => new Set(state.beams.map(b => b.cursor)), [state]);

  const extractData = React.useCallback(
    (
      results: GetIndexedStreamQuery,
    ): {
      edges: Exclude<
        GetIndexedStreamQuery['node'],
        Record<string, never>
      >['akashaIndexedStreamList']['edges'];
      pageInfo: PageInfo;
    } => {
      if (hasOwn(results, 'node') && hasOwn(results.node, 'akashaIndexedStreamList')) {
        return {
          edges: results.node.akashaIndexedStreamList.edges.filter(
            edge => !beamCursors.has(edge.cursor),
          ),
          pageInfo: results.node.akashaIndexedStreamList.pageInfo,
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
        after: lastCursor,
        sorting: { createdAt: SortOrder.Desc },
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
    async (variables?: GetIndexedStreamQueryVariables) => {
      try {
        const results = await fetchBeams({ variables });
        if (results.error) {
          setErrors(prev => [...prev, results.error]);
          return;
        }

        if (!results.data) return;

        const extracted = extractData(results.data);

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
    async (newTag?: boolean, restoreItem?: { key: string; offsetTop: number }) => {
      if (beamsQuery.called && !newTag) return;

      const initialVars: GetIndexedStreamQueryVariables = {
        indexer: sdk.services.gql.indexingDID,
      };

      if (restoreItem) {
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

  React.useEffect(() => {
    setState({ beams: [] });
    fetchInitialData(true);
    /*
     * tag is a dependency so that it will update when we switch from one tag to another
     */
  }, [tag]);

  return {
    beams: state.beams,
    called: !!state.pageInfo,
    fetchInitialData,
    fetchNextPage,
    fetchPreviousPage,
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
