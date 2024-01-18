import * as React from 'react';
import { ApolloError } from '@apollo/client';

import {
  type AkashaReflectStreamFiltersInput,
  type AkashaReflectStreamSortingInput,
  PageInfo,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EntityTypes } from '@akashaorg/typings/lib/ui';

import { hasOwn } from './utils/has-own';
import { useGetReflectionStreamLazyQuery } from './generated/apollo';
import getSDK from '@akashaorg/awf-sdk';
import type { GetReflectionStreamQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

export type UseReflectionProps = {
  entityId: string;
  entityType: EntityTypes;
  filters?: AkashaReflectStreamFiltersInput;
  sorting?: AkashaReflectStreamSortingInput;
  overscan?: number;
  indexingDID?: string;
};

const defaultSorting: AkashaReflectStreamSortingInput = {
  createdAt: SortOrder.Asc,
};

const getDefaultFilters = (
  entityId: string,
  entityType: EntityTypes,
): AkashaReflectStreamFiltersInput => {
  return {
    and: [
      {
        where:
          entityType === EntityTypes.BEAM
            ? { beamID: { equalTo: entityId } }
            : { reflectionID: { equalTo: entityId } },
      },
    ],
  };
};

export type ReflectionEdges = Exclude<
  GetReflectionStreamQuery['node'],
  Record<string, never>
>['akashaReflectStreamList']['edges'];

export const useReflections = (props: UseReflectionProps) => {
  const { indexingDID, overscan = 10, entityId, entityType, sorting, filters } = props;
  const [state, setState] = React.useState<{
    reflections: ReflectionEdges;
    pageInfo?: PageInfo;
  }>({
    reflections: [],
  });

  const reflectionCursors = React.useMemo(
    () => new Set(state.reflections.map(r => r.cursor)),
    [state],
  );
  const [errors, setErrors] = React.useState<(ApolloError | Error)[]>([]);

  const mergedVars = React.useMemo(() => {
    const vars: Parameters<typeof useGetReflectionStreamLazyQuery>[0]['variables'] = {
      indexer: indexingDID ?? getSDK().services.gql.indexingDID,
      sorting: { ...defaultSorting, ...(sorting ?? {}) },
      filters: filters ?? getDefaultFilters(entityId, entityType),
    };
    return vars;
  }, [indexingDID, sorting, filters, entityId, entityType]);

  const [fetchReflections, reflectionsQuery] = useGetReflectionStreamLazyQuery({
    variables: {
      ...mergedVars,
      first: overscan,
    },
    onError: error => {
      setErrors(prev => [...prev, error]);
    },
  });

  const fetchInitialData = React.useCallback(
    async (restoreItem: { key: string; offsetTop: number }) => {
      if (state.reflections.length) {
        setState({
          reflections: [],
        });
      }

      if (restoreItem) {
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

          if (hasOwn(results.data.node, 'akashaReflectStreamList')) {
            setState({
              reflections: results.data.node.akashaReflectStreamList.edges,
              pageInfo: results.data.node.akashaReflectStreamList.pageInfo,
            });
          }
        } catch (err) {
          setErrors(prev => prev.concat(err));
        }
      } else {
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

          if (hasOwn(results.data.node, 'akashaReflectStreamList')) {
            setState({
              reflections: results.data.node.akashaReflectStreamList.edges,
              pageInfo: results.data.node.akashaReflectStreamList.pageInfo,
            });
          }
        } catch (err) {
          setErrors(prev => prev.concat(err));
        }
      }
    },
    [fetchReflections, mergedVars, state.reflections.length],
  );
  const fetchNextPage = async (lastCursor: string) => {
    if (reflectionsQuery.loading || reflectionsQuery.error || !lastCursor) return;
    try {
      const results = await reflectionsQuery.fetchMore({
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
      if (hasOwn(results.data.node, 'akashaReflectStreamList')) {
        const streamList = results.data.node.akashaReflectStreamList;

        setState(prev => ({
          reflections: [
            ...prev.reflections,
            ...streamList.edges.filter(edge => reflectionCursors.has(edge.cursor)),
          ],
          pageInfo: streamList.pageInfo,
        }));
      }
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };
  const fetchPreviousPage = async (firstCursor: string) => {
    if (reflectionsQuery.loading || reflectionsQuery.error || !firstCursor) return;
    try {
      const results = await reflectionsQuery.fetchMore({
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
      if (hasOwn(results.data.node, 'akashaReflectStreamList')) {
        const streamList = results.data.node.akashaReflectStreamList;

        setState(prev => ({
          reflections: [
            ...streamList.edges.filter(edge => !reflectionCursors.has(edge.cursor)).reverse(),
            ...prev.reflections,
          ],
          pageInfo: streamList.pageInfo,
        }));
      }
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
    called: reflectionsQuery.called,
    isLoading: reflectionsQuery.loading,
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
