import React from 'react';
import { useGetBeamStreamLazyQuery } from './generated/apollo';
import {
  type AkashaBeamStreamFiltersInput,
  type AkashaBeamStreamSortingInput,
  type PageInfo,
  SortOrder,
  AkashaBeamStreamModerationStatus,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import type {
  GetBeamStreamQuery,
  GetBeamStreamQueryVariables,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { ApolloError } from '@apollo/client';
import { hasOwn } from './utils/has-own';
import getSDK from '@akashaorg/awf-sdk';
import { useNsfwToggling } from './use-nsfw';
import { useGetLogin } from './use-login.new';

export type UseBeamsOptions = {
  overscan: number;
  filters?: AkashaBeamStreamFiltersInput;
  sorting?: AkashaBeamStreamSortingInput;
};

const defaultSorting: AkashaBeamStreamSortingInput = {
  createdAt: SortOrder.Desc,
};

export const useBeams = ({ overscan, filters, sorting }: UseBeamsOptions) => {
  const [state, setState] = React.useState<{
    beams: Exclude<
      GetBeamStreamQuery['node'],
      Record<string, never>
    >['akashaBeamStreamList']['edges'];
    pageInfo?: PageInfo;
  }>({ beams: [] });

  const [errors, setErrors] = React.useState<(ApolloError | Error)[]>([]);
  const sdk = getSDK();
  const { showNsfw } = useNsfwToggling();
  const { data: loginData, loading: authenticating } = useGetLogin();
  const isLoggedIn = !!loginData?.id;

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

  const [fetchBeams, beamsQuery] = useGetBeamStreamLazyQuery({
    variables: {
      ...mergedVars,
      first: overscan,
    },
  });

  const beamCursors = React.useMemo(() => new Set(state.beams.map(b => b.cursor)), [state]);

  const extractData = React.useCallback(
    (
      results: GetBeamStreamQuery,
    ): {
      edges: Exclude<
        GetBeamStreamQuery['node'],
        Record<string, never>
      >['akashaBeamStreamList']['edges'];

      pageInfo: PageInfo;
    } => {
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

    const variables = {
      variables: {
        after: lastCursor,
        sorting: { createdAt: SortOrder.Desc },
        indexer: sdk.services.gql.indexingDID,
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
    async (variables?: GetBeamStreamQueryVariables) => {
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
      /**
       * !(!isLoggedIn && !authenticating && showNsfw) translates to: the user is logged in and
       * has their NSFW setting off. The whole condition means to return from the function
       * immediately if:
       * 1. The beamsQuery has run before (the data has been fetched with default filter that
       * filters out NSFW content) and the user is logged in and their NSFW setting is off.
       * 2. The app is still waiting for authentication data from the hook.
       **/
      if ((beamsQuery.called && !(!isLoggedIn && !authenticating && showNsfw)) || authenticating)
        return;

      const initialVars: GetBeamStreamQueryVariables = {
        ...mergedVars,
        sorting: { createdAt: SortOrder.Desc },
        indexer: sdk.services.gql.indexingDID,
      };

      /**
       * Set the filter for logged-out users and users who toggled off nsfw content.
       **/
      if (!showNsfw || !isLoggedIn) {
        initialVars.filters = {
          or: [
            { where: { status: { equalTo: AkashaBeamStreamModerationStatus.Ok } } },
            { where: { status: { isNull: true } } },
          ],
        };
      }

      /**
       * Set the filter for users who are logged in and want to see nsfw content.
       **/
      if (showNsfw && isLoggedIn) {
        initialVars.filters = {
          or: [
            {
              where: {
                status: {
                  in: [AkashaBeamStreamModerationStatus.Ok, AkashaBeamStreamModerationStatus.Nsfw],
                },
              },
            },
            { where: { status: { isNull: true } } },
          ],
        };
      }

      if (restoreItem) {
        initialVars.sorting = { createdAt: SortOrder.Asc };
        initialVars.after = restoreItem.key;
      }

      await fetchInitialBeams(initialVars);
    },
    [
      authenticating,
      beamsQuery.called,
      fetchInitialBeams,
      isLoggedIn,
      mergedVars,
      sdk.services.gql.indexingDID,
      showNsfw,
    ],
  );

  React.useEffect(() => {
    const unsub = queryClient.current.onClearStore(() => {
      return fetchInitialData();
    });
    return () => {
      unsub();
    };
  }, [fetchInitialData]);

  React.useEffect(() => {
    /**
     * Reset the beamCursors in case the user logs out and has the NSFW setting on
     * so as to be able to accept the updated data in the `extractData` function
     *  when the hook refetches again (Specificallly for dealing with the filter condition
     *  `!beamCursors.has(edge.cursor)` because if not resetted, no data will be extracted
     * from the function because the existing beamCursors will contain the data.cursor).
     * Maybe a better approach?
     **/
    if (!isLoggedIn && !authenticating && showNsfw) {
      beamCursors.clear();
    }
    if (!authenticating || showNsfw || isLoggedIn) {
      fetchInitialData();
    }
  }, [showNsfw, isLoggedIn, authenticating]);

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
      return err.message;
    }),
  };
};
