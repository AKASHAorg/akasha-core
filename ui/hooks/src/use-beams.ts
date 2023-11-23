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
      first: overscan,
      sorting: { ...defaultSorting, ...(sorting ?? {}) },
    };
    if (filters) {
      mergedVars.filters = filters;
    }
    return vars;
  }, [overscan, sorting, filters]);

  const [, nextQuery] = useGetBeamsLazyQuery({
    variables: {
      ...mergedVars,
    },
  });

  const [, prevQuery] = useGetBeamsLazyQuery({
    variables: {
      ...mergedVars,
      last: overscan,
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
    const endCursor = pages.at(-1).cursor;
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
    const firstCursor = pages.at(0).cursor;
    if (!firstCursor) {
      // no initial data yet, return
      return;
    }
    prevQuery.fetchMore({
      variables: {
        before: firstCursor,
      },
    });
  }, [pages, prevQuery]);

  const fetchInitialData = React.useCallback(
    (cursors: string[]) => {
      const resumeItemCursor = cursors.at(-1);
      if (resumeItemCursor && !prevQuery.called) {
        prevQuery.fetchMore({
          variables: {
            before: resumeItemCursor,
          },
        });
      } else if (!nextQuery.called) {
        nextQuery.fetchMore({});
      }
    },
    [nextQuery, prevQuery],
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
