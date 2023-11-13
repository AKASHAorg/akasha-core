import React from 'react';
import { useGetBeamsQuery } from './generated';
import {
  AkashaBeamEdge,
  AkashaBeamFiltersInput,
  AkashaBeamSortingInput,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useQueryClient } from '@tanstack/react-query';

export type UseBeamsOptions = {
  overscan: number;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
};

const enum InitialFetchEdge {
  NONE,
  NEXT,
  PREVIOUS,
}

const defaultSorting: AkashaBeamSortingInput = {
  createdAt: SortOrder.Desc,
};

export const useBeams = ({ overscan, filters, sorting }: UseBeamsOptions) => {
  const [pageCursor, setPageCursor] = React.useState({
    next: undefined,
    prev: undefined,
  });
  const [initialFetch, setInitialFetch] = React.useState<InitialFetchEdge>(InitialFetchEdge.NONE);
  const [beams, setBeams] = React.useState<AkashaBeamEdge[]>([]);
  const queryClient = useQueryClient();
  const mergedVars: { sorting: AkashaBeamSortingInput; filters?: AkashaBeamFiltersInput } = {
    sorting: { ...defaultSorting, ...(sorting ?? {}) },
  };

  if (filters) {
    mergedVars.filters = filters;
  }

  const nextReq = useGetBeamsQuery(
    {
      ...mergedVars,
      first: overscan,
      after: pageCursor.next,
    },
    {
      enabled: pageCursor.next?.length > 0 || initialFetch === InitialFetchEdge.NEXT,
      onSuccess: resp => {
        if (!resp.akashaBeamIndex.edges.length) return;
        const newBeams = [];
        resp.akashaBeamIndex.edges.forEach(edgeNode => {
          if (!beams.some(beam => beam.cursor === edgeNode.cursor)) {
            newBeams.push(edgeNode);
          } else {
            // @TODO: update already fetched beam...
          }
        });
        setBeams(prev => [...prev, ...newBeams]);
      },
    },
  );

  const prevReq = useGetBeamsQuery(
    {
      ...mergedVars,
      last: overscan,
      before: pageCursor.prev,
    },
    {
      enabled: pageCursor.prev?.length > 0 || initialFetch === InitialFetchEdge.PREVIOUS,
      onSuccess: resp => {
        if (!resp.akashaBeamIndex.edges.length) return;
        const newBeams = [];
        resp.akashaBeamIndex.edges.forEach(edgeNode => {
          if (!beams.some(beam => beam.cursor === edgeNode.cursor)) {
            newBeams.push(edgeNode);
          } else {
            // @TODO: update already fetched beam...
          }
        });
        if (newBeams.length) {
          setBeams(prev => [...newBeams, ...prev]);
        }
      },
    },
  );

  const fetchNextPage = React.useCallback(() => {
    if (nextReq.isInitialLoading) return;
    if (!beams.length) return;
    const lastCursor = beams.at(-1).cursor;
    if (lastCursor === pageCursor.next) return;
    setPageCursor(prevState => ({
      ...prevState,
      next: lastCursor,
    }));
  }, [nextReq.isInitialLoading, beams, pageCursor.next]);

  const fetchPreviousPage = React.useCallback(() => {
    if (prevReq.isInitialLoading) return;
    if (!beams.length) return;
    const firstCursor = beams.at(0).cursor;
    if (firstCursor === pageCursor.prev) return;
    setPageCursor(prevState => ({
      ...prevState,
      prev: firstCursor,
    }));
  }, [beams, pageCursor.prev, prevReq.isInitialLoading]);

  const fetchInitialData = React.useCallback(
    (cursors: string[]) => {
      const resumeItemCursor = cursors.at(-1);
      if (resumeItemCursor) {
        setPageCursor({ prev: resumeItemCursor, next: undefined });
      }
      if (!resumeItemCursor && initialFetch === InitialFetchEdge.NONE) {
        setInitialFetch(InitialFetchEdge.NEXT);
      }
    },
    [initialFetch],
  );

  const handleReset = async () => {
    await queryClient.invalidateQueries(['GetBeams']);
    setPageCursor({ next: undefined, prev: undefined });
    setBeams([]);
    setInitialFetch(InitialFetchEdge.NEXT);
  };

  return {
    pages: beams,
    fetchInitialData,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage: nextReq.isInitialLoading,
    isFetchingPreviousPage: prevReq.isInitialLoading,
    hasNextPage: nextReq.data?.akashaBeamIndex.pageInfo.hasNextPage || false,
    hasPreviousPage: prevReq.data?.akashaBeamIndex.pageInfo.hasPreviousPage || false,
    onReset: handleReset,
  };
};
