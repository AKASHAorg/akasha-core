import React from 'react';
import { useGetBeamsLazyQuery } from './generated/apollo';
import type {
  AkashaBeamEdge,
  AkashaBeamFiltersInput,
  AkashaBeamSortingInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import type { GetBeamsQueryVariables } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type UseBeamsOptions = {
  overscan: number;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
};

const defaultSorting: AkashaBeamSortingInput = {
  createdAt: SortOrder.Desc,
};

export const useBeams = ({ overscan, filters, sorting }: UseBeamsOptions) => {
  const mergedVars: GetBeamsQueryVariables = React.useMemo(() => {
    const vars = {
      sorting: { ...defaultSorting, ...(sorting ?? {}) },
    };
    if (filters) {
      mergedVars.filters = filters;
    }
    return vars;
  }, [sorting, filters]);

  const [fetchNext, nextQuery] = useGetBeamsLazyQuery({
    variables: {
      ...mergedVars,
      first: overscan,
    },
    onError: error => {
      console.error(error.message);
    },
  });

  const [fetchPrev, prevQuery] = useGetBeamsLazyQuery({
    variables: {
      ...mergedVars,
      last: overscan,
    },
    onError: error => {
      console.error(error.message);
    },
  });

  // @TODO: remove this after making sure that we are not fetching one page multiple times
  const pages = React.useMemo(() => {
    const beams: AkashaBeamEdge[] = [];
    [
      ...(prevQuery.data?.akashaBeamIndex.edges || []),
      ...(nextQuery.data?.akashaBeamIndex.edges || []),
    ].forEach(beamEdge => {
      if (beams.some(b => b.node.id === beamEdge.node.id)) return;
      beams.push(beamEdge);
    });
    return beams;
  }, [prevQuery.data, nextQuery.data]);

  const fetchNextPage = React.useCallback(() => {
    if (nextQuery.loading || nextQuery.error) return;
    const endCursor = pages[pages.length - 1].cursor;
    if (!endCursor) {
      // initial fetch was not made yet, return
      return;
    }
    nextQuery.fetchMore({
      variables: {
        after: endCursor,
      },
    });
  }, [nextQuery, pages]);

  const fetchPreviousPage = React.useCallback(() => {
    if (prevQuery.loading || prevQuery.error) return;
    const firstCursor = pages[0].cursor;
    if (!firstCursor) {
      // no initial data yet, return
      return;
    }
    prevQuery.fetchMore({
      variables: {
        before: firstCursor,
        last: overscan,
      },
    });
  }, [overscan, pages, prevQuery]);

  const fetchInitialData = React.useCallback(
    (cursors: string[]) => {
      const resumeItemCursor = cursors[Math.floor(cursors.length / 2)];
      if (resumeItemCursor && !prevQuery.called) {
        fetchPrev({
          variables: {
            before: resumeItemCursor,
            last: overscan,
          },
        });
      } else if (!nextQuery.called) {
        fetchNext({});
      }
    },
    [fetchNext, fetchPrev, nextQuery.called, overscan, prevQuery.called],
  );

  const handleReset = async () => {
    // @TODO: reset queries
  };

  return {
    pages: pages,
    fetchInitialData,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage: nextQuery.loading,
    isFetchingPreviousPage: prevQuery.loading && !prevQuery.error,
    hasNextPage: nextQuery.data?.akashaBeamIndex.pageInfo.hasNextPage || false,
    hasPreviousPage: prevQuery.data?.akashaBeamIndex.pageInfo.hasPreviousPage || false,
    onReset: handleReset,
    error: `${nextQuery.error?.message || ''}${nextQuery.error?.message || ''}`,
  };
};
