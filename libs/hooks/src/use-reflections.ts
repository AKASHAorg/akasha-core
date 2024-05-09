import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { useGetReflectionStreamLazyQuery } from './generated/apollo';
import {
  AkashaReflectStreamEdge,
  AkashaReflectSortingInput,
  AkashaReflectStreamFiltersInput,
  AkashaReflectStreamSortingInput,
  PageInfo,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EntityTypes, type ReflectEntryData } from '@akashaorg/typings/lib/ui';
import {
  GetReflectionStreamQuery,
  GetReflectionStreamQueryVariables,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { hasOwn } from './utils/has-own';
import { usePendingReflections } from './use-pending-reflections';
import { useQueryPolling } from './use-query-polling';
import type { createReactiveVar } from './utils/create-reactive-var';
import getSDK from '@akashaorg/awf-sdk';

export type UseReflectionProps = {
  entityId: string;
  entityType: EntityTypes;
  filters?: AkashaReflectStreamFiltersInput;
  sorting?: AkashaReflectStreamSortingInput;
  overscan?: number;
  pendingReflectionsVar: ReturnType<typeof createReactiveVar<ReflectEntryData[]>>;
};
const defaultSorting: AkashaReflectSortingInput = {
  createdAt: SortOrder.Asc,
};

const extractData = (data: GetReflectionStreamQuery, entityType: EntityTypes) => {
  if (data && hasOwn(data, 'node')) {
    if (entityType === EntityTypes.BEAM) {
      const result = data;
      if (hasOwn(result.node, 'akashaReflectStreamList')) {
        return {
          edges: result.node.akashaReflectStreamList.edges.filter(
            edge => edge.node.replyTo === null,
          ),
          pageInfo: result.node.akashaReflectStreamList.pageInfo,
        };
      }
    } else if (entityType === EntityTypes.REFLECT) {
      const result = data;
      if (hasOwn(result.node, 'akashaReflectStreamList')) {
        return {
          edges: result.node.akashaReflectStreamList.edges.filter(
            edge => edge.node.replyTo !== null,
          ),
          pageInfo: result.node.akashaReflectStreamList.pageInfo,
        };
      }
    }
  }

  return {
    edges: [],
  };
};

// const filterByAuthor = (edges: AkashaReflectStreamEdge[], authorId) => {
//   return edges.filter(edge => edge.node. === authorId);
// };
const filterById = (edges: AkashaReflectStreamEdge[], entityType, entityId) => {
  return edges.filter(edge => {
    if (entityType === EntityTypes.REFLECT) {
      return edge.node.reflection === entityId;
    }
    return edge.node.beamID === entityId && edge.node.reflection === null;
  });
};

// extract the logic of pending and

export const useReflections = (props: UseReflectionProps) => {
  const { overscan = 10, entityId, entityType, sorting, filters, pendingReflectionsVar } = props;
  const [state, setState] = React.useState<{
    reflections: AkashaReflectStreamEdge[];
    pageInfo?: PageInfo;
  }>({
    reflections: [],
  });

  const reflectionCursors = React.useMemo(
    () => new Set(state.reflections.map(r => r.cursor)),
    [state],
  );

  const [errors, setErrors] = React.useState<(ApolloError | Error)[]>([]);

  const indexingDID = React.useRef(getSDK().services.gql.indexingDID);

  const mergedVars: GetReflectionStreamQueryVariables = React.useMemo(() => {
    const vars: GetReflectionStreamQueryVariables = {
      indexer: indexingDID.current,
      sorting: { ...defaultSorting, ...(sorting ?? {}) },
    };
    if (filters) {
      vars.filters = filters;
    }
    return vars;
  }, [sorting, filters]);

  const [fetchReflections, reflectionsQuery] = useGetReflectionStreamLazyQuery({
    variables: {
      ...mergedVars,
      first: overscan,
      indexer: indexingDID.current,
    },
    onError: error => {
      setErrors(prev => [...prev, error]);
    },
    fetchPolicy: 'cache-and-network',
  });

  const { pendingReflections, removePendingReflections } =
    usePendingReflections(pendingReflectionsVar);

  const refetchReflections = React.useCallback(
    variables => {
      return reflectionsQuery.refetch(variables);
    },
    [reflectionsQuery],
  );

  const stopRefetch = React.useCallback(
    response => {
      const { edges } = extractData(response.data, entityType);
      return (
        edges.length > 0 &&
        filterById(edges as AkashaReflectStreamEdge[], entityType, entityId).every(
          edge => !state.reflections.some(reflection => reflection.cursor === edge.cursor),
        )
      );
    },
    [entityId, entityType, pendingReflections, state.reflections],
  );

  const { lastResponse, removeLastResponse, isPolling, startPolling } = useQueryPolling<
    GetReflectionStreamQueryVariables,
    GetReflectionStreamQuery
  >(refetchReflections, stopRefetch);

  React.useEffect(() => {
    if (pendingReflections.length && !isPolling && !lastResponse) {
      startPolling({
        ...mergedVars,
        sorting: { createdAt: SortOrder.Asc },
        after: state.reflections[0]?.cursor,
        first: 1,
      });
    }

    if (
      lastResponse &&
      extractData(lastResponse.data, entityType)?.edges.length > 0 &&
      pendingReflections.length
    ) {
      const { edges } = extractData(lastResponse.data, entityType);

      const wasPendingReflections = edges.filter(
        edge => !state.reflections.some(reflection => reflection.cursor === edge.cursor),
      );

      if (wasPendingReflections.length) {
        setState(prev => ({
          reflections: [...wasPendingReflections, ...prev.reflections],
          pageInfo: {
            ...prev.pageInfo,
            startCursor: wasPendingReflections[0].cursor,
          },
        }));
        removePendingReflections();
        removeLastResponse();
      }
    }
  }, [
    entityId,
    entityType,
    isPolling,
    lastResponse,
    mergedVars,
    pendingReflections,
    reflectionsQuery.data,
    removeLastResponse,
    removePendingReflections,
    startPolling,
    state.reflections,
  ]);

  const fetchInitialData = async (restoreItem: { key: string; offsetTop: number }) => {
    if (restoreItem && !reflectionsQuery.called) {
      try {
        const results = await fetchReflections({
          variables: {
            ...mergedVars,
            after: restoreItem?.key,
            indexer: indexingDID.current,
          },
        });
        if (results.error) {
          setErrors(prev => [...prev, results.error]);
          return;
        }
        if (!results.data) return;

        const { edges, pageInfo } = extractData(results.data, entityType);

        setState({
          reflections: edges
            .filter(edge => !reflectionCursors.has(edge.cursor))
            .reverse() as AkashaReflectStreamEdge[],
          pageInfo,
        });
      } catch (err) {
        setErrors(prev => prev.concat(err));
      }
    } else if (!reflectionsQuery.called) {
      try {
        const results = await fetchReflections({
          variables: {
            ...mergedVars,
            indexer: indexingDID.current,
            sorting: { createdAt: SortOrder.Desc },
          },
        });
        if (results.error) {
          setErrors(prev => [...prev, results.error]);
          return;
        }

        if (!results.data) return;

        const { edges, pageInfo } = extractData(results.data, entityType);

        setState({
          reflections: edges.filter(
            edge => !reflectionCursors.has(edge.cursor),
          ) as AkashaReflectStreamEdge[],
          pageInfo: pageInfo,
        });
      } catch (err) {
        setErrors(prev => prev.concat(err));
      }
    }
  };

  const fetchNextPage = async (lastCursor: string) => {
    if (reflectionsQuery.loading || reflectionsQuery.error || !lastCursor) return;
    try {
      const results = await reflectionsQuery.fetchMore<GetReflectionStreamQuery>({
        variables: {
          after: lastCursor,
          sorting: { createdAt: SortOrder.Desc },
        },
      });
      if (results.error) {
        setErrors(prev => [...prev, results.error]);
        return;
      }

      if (!results.data) return;
      const { edges, pageInfo } = extractData(results.data, entityType);

      setState(prev => ({
        reflections: [
          ...prev.reflections,
          ...edges.filter(edge => !reflectionCursors.has(edge.cursor)),
        ] as AkashaReflectStreamEdge[],
        pageInfo: { ...pageInfo },
      }));
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };

  const fetchPreviousPage = async (firstCursor: string) => {
    if (reflectionsQuery.loading || reflectionsQuery.error || !firstCursor) return;
    try {
      const results = await reflectionsQuery.fetchMore<GetReflectionStreamQuery>({
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
      const { edges, pageInfo } = extractData(results.data, entityType);
      setState(prev => ({
        reflections: [
          ...edges.filter(edge => !reflectionCursors.has(edge.cursor)).reverse(),
          ...prev.reflections,
        ] as AkashaReflectStreamEdge[],
        pageInfo,
      }));
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };
  const handleReset = () => {
    //@TODO:
    // const client = reflectionsQuery.client;
  };
  return {
    reflections: state.reflections,
    fetchInitialData,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage: state.pageInfo?.hasNextPage,
    hasPreviousPage: state.pageInfo?.hasPreviousPage,
    onReset: handleReset,
    hasErrors: errors.length > 0,
    errors: errors.map(err => {
      return err.message;
    }),
    called: reflectionsQuery.called,
    isLoading: reflectionsQuery.loading,
  };
};
