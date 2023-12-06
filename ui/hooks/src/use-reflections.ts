import * as React from 'react';
import { ApolloError } from '@apollo/client';
import {
  useGetReflectionsFromBeamLazyQuery,
  useGetReflectReflectionsLazyQuery,
} from './generated/apollo';
import {
  AkashaReflectFiltersInput,
  AkashaReflectSortingInput,
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
  const [reflections, setReflections] = React.useState([]);
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
  const extractEdges = (data: GetReflectionsFromBeamQuery | GetReflectReflectionsQuery) => {
    if (entityType === EntityTypes.BEAM && hasOwn(data, 'node')) {
      const result = data as GetReflectionsFromBeamQuery;
      if (hasOwn(result.node, 'reflections')) {
        return result.node.reflections.edges;
      }
      return [];
    } else {
      const result = data as GetReflectReflectionsQuery;
      return result.akashaReflectIndex.edges;
    }
  };
  const fetchInitialData = async (cursors: string[]) => {
    const resumeItemCursor = cursors[cursors.length - 1];
    if (resumeItemCursor && !reflectionsQuery.called) {
      try {
        const results = await fetchReflections({
          variables: {
            ...mergedVars,
            after: resumeItemCursor,
          },
        });
        if (results.error) {
          setErrors(prev => [...prev, results.error]);
          return;
        }

        if (!results.data) return;

        const newReflections = [];
        const edges = extractEdges(results.data);
        edges.forEach(e => {
          if (reflections.some(b => b.cursor === e.cursor)) {
            return;
          }
          newReflections.push(e);
        });
        setReflections(newReflections.reverse());
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
        const newReflections = [];
        const edges = extractEdges(results.data);
        edges.forEach(e => {
          if (reflections.some(b => b.cursor === e.cursor)) {
            return;
          }
          newReflections.push(e);
        });
        setReflections(newReflections);
      } catch (err) {
        setErrors(prev => prev.concat(err));
      }
    }
  };
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
      const newReflections = [];
      const edges = extractEdges(results.data);
      edges.forEach(e => {
        if (reflections.some(b => b.cursor === e.cursor)) {
          return;
        }
        newReflections.push(e);
      });
      setReflections(prev => [...prev, ...newReflections]);
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
      const newReflections = [];
      const edges = extractEdges(results.data);
      edges.forEach(e => {
        if (reflections.some(b => b.cursor === e.cursor)) {
          return;
        }
        newReflections.push(e);
      });
      setReflections(prev => [...newReflections.reverse(), ...prev]);
    } catch (err) {
      setErrors(prev => prev.concat(err));
    }
  };
  const handleReset = () => {
    //@TODO:
  };
  return {
    reflections,
    fetchInitialData,
    fetchNextPage,
    fetchPreviousPage,
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
