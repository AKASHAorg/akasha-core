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
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import {
  GetReflectionsFromBeamQuery,
  GetReflectionsFromBeamQueryVariables,
  GetReflectReflectionsQuery,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { hasOwn } from './utils/has-own';

export type UseReflectionProps = {
  entityId: string;
  entityType: EntityTypes;
  filters?: AkashaReflectFiltersInput;
  sorting?: AkashaReflectSortingInput;
  overscan?: number;
};
const defaultSorting: AkashaReflectSortingInput = {
  createdAt: SortOrder.Asc,
};

export const useReflections = (props: UseReflectionProps) => {
  const { overscan = 10, entityId, entityType, sorting, filters } = props;
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
  });
  const extractData = (data: GetReflectionsFromBeamQuery | GetReflectReflectionsQuery) => {
    if (entityType === EntityTypes.BEAM && hasOwn(data, 'node')) {
      const result = data as GetReflectionsFromBeamQuery;
      if (hasOwn(result.node, 'reflections')) {
        return {
          edges: result.node.reflections.edges,
          pageInfo: result.node.reflections.pageInfo,
        };
      }
    } else {
      const result = data as GetReflectReflectionsQuery;
      return {
        edges: result.akashaReflectIndex.edges,
        pageInfo: result.akashaReflectIndex.pageInfo,
      };
    }
  };

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

        const { edges, pageInfo } = extractData(results.data);

        setState({
          reflections: edges.filter(
            edge => !reflectionCursors.has(edge.cursor),
          ) as AkashaReflectEdge[],
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

        const { edges, pageInfo } = extractData(results.data);

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
      const { edges, pageInfo } = extractData(results.data);

      setState(prev => ({
        reflections: [
          ...prev.reflections,
          ...edges.filter(edge => reflectionCursors.has(edge.cursor)),
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
      const { edges, pageInfo } = extractData(results.data);
      setState(prev => ({
        reflections: [
          ...edges.filter(edge => reflectionCursors.has(edge.cursor)).reverse(),
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
    const client = reflectionsQuery.client;
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
  };
};
