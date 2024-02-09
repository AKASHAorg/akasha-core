import * as React from 'react';
import { ApolloError } from '@apollo/client';
import {
  useGetReflectionsFromBeamLazyQuery,
  useGetReflectReflectionsLazyQuery,
} from './generated/apollo';
import {
  AkashaReflectEdge,
  AkashaReflectFiltersInput,
  AkashaReflectSortingInput,
  PageInfo,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EntityTypes, type ReflectEntryData } from '@akashaorg/typings/lib/ui';
import {
  GetReflectionsFromBeamQuery,
  GetReflectionsFromBeamQueryVariables,
  GetReflectReflectionsQuery,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { hasOwn } from './utils/has-own';
import { usePendingReflections } from './use-pending-reflections';
import { useQueryPolling } from './use-query-polling';
import type { createReactiveVar } from './utils/create-reactive-var';

export type UseReflectionProps = {
  entityId: string;
  entityType: EntityTypes;
  filters?: AkashaReflectFiltersInput;
  sorting?: AkashaReflectSortingInput;
  overscan?: number;
  pendingReflectionsVar: ReturnType<typeof createReactiveVar<ReflectEntryData[]>>;
};
const defaultSorting: AkashaReflectSortingInput = {
  createdAt: SortOrder.Asc,
};

const extractData = (
  data: GetReflectionsFromBeamQuery | GetReflectReflectionsQuery,
  entityType: EntityTypes,
) => {
  if (entityType === EntityTypes.BEAM && data && hasOwn(data, 'node')) {
    const result = data as GetReflectionsFromBeamQuery;
    if (hasOwn(result.node, 'reflections')) {
      return {
        edges: result.node.reflections.edges,
        pageInfo: result.node.reflections.pageInfo,
      };
    }
  } else if (data && hasOwn(data, 'akashaReflectIndex')) {
    const result = data as GetReflectReflectionsQuery;
    return {
      edges: result.akashaReflectIndex.edges,
      pageInfo: result.akashaReflectIndex.pageInfo,
    };
  }
  return {
    edges: [],
  };
};

const filterByAuthor = (edges: AkashaReflectEdge[], authorId) => {
  return edges.filter(edge => edge.node.author.id === authorId);
};
const filterById = (edges: AkashaReflectEdge[], entityType, entityId) => {
  return edges.filter(edge => {
    if (entityType === EntityTypes.REFLECT) {
      return edge.node.reflection === entityId;
    }
    return edge.node.beam.id === entityId && edge.node.reflection === null;
  });
};

// extract the logic of pending and

export const useReflections = (props: UseReflectionProps) => {
  const { overscan = 10, entityId, entityType, sorting, filters, pendingReflectionsVar } = props;
  const [state, setState] = React.useState<{
    reflections: AkashaReflectEdge[];
    pageInfo?: PageInfo;
  }>({
    reflections: [],
  });

  const reflectionCursors = React.useMemo(
    () => new Set(state.reflections.map(r => r.cursor)),
    [state],
  );

  const [errors, setErrors] = React.useState<(ApolloError | Error)[]>([]);

  const getterHook =
    entityType === EntityTypes.BEAM
      ? useGetReflectionsFromBeamLazyQuery
      : useGetReflectReflectionsLazyQuery;

  const mergedVars: GetReflectionsFromBeamQueryVariables = React.useMemo(() => {
    const vars: GetReflectionsFromBeamQueryVariables = {
      id: entityId,
      sorting: { ...defaultSorting, ...(sorting ?? {}) },
    };
    if (filters) {
      vars.filters = filters;
    }
    return vars;
  }, [entityId, sorting, filters]);

  const [fetchReflections, reflectionsQuery] = getterHook({
    variables: {
      ...mergedVars,
      first: overscan,
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
        filterById(
          filterByAuthor(edges as AkashaReflectEdge[], pendingReflections[0].authorId),
          entityType,
          entityId,
        ).every(edge => !state.reflections.some(reflection => reflection.cursor === edge.cursor))
      );
    },
    [entityId, entityType, pendingReflections, state.reflections],
  );

  const { lastResponse, removeLastResponse, isPolling, startPolling } = useQueryPolling<
    GetReflectionsFromBeamQueryVariables,
    GetReflectionsFromBeamQuery | GetReflectReflectionsQuery
  >(refetchReflections, stopRefetch);

  React.useEffect(() => {
    if (pendingReflections.length && !isPolling && !lastResponse) {
      startPolling({
        ...mergedVars,
        sorting: { createdAt: SortOrder.Asc },
        after: state.reflections[0].cursor,
        first: 1,
      });
    }

    if (
      lastResponse &&
      extractData(lastResponse.data, entityType)?.edges.length > 0 &&
      pendingReflections.length
    ) {
      const { edges } = extractData(lastResponse.data, entityType);

      const wasPendingReflections = filterByAuthor(
        filterById(edges as AkashaReflectEdge[], entityType, entityId),
        pendingReflections[0]?.authorId,
      ).filter(edge => !state.reflections.some(reflection => reflection.cursor === edge.cursor));

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
            after: restoreItem.key,
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
            .reverse() as AkashaReflectEdge[],
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
          ) as AkashaReflectEdge[],
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
      const results = await reflectionsQuery.fetchMore<
        GetReflectionsFromBeamQuery | GetReflectReflectionsQuery
      >({
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
        ] as AkashaReflectEdge[],
        pageInfo: { ...pageInfo },
      }));
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };

  const fetchPreviousPage = async (firstCursor: string) => {
    if (reflectionsQuery.loading || reflectionsQuery.error || !firstCursor) return;
    try {
      const results = await reflectionsQuery.fetchMore<
        GetReflectionsFromBeamQuery | GetReflectReflectionsQuery
      >({
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
        ] as AkashaReflectEdge[],
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
