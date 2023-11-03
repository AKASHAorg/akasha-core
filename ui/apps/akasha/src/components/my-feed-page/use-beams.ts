import { useGetBeamsQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import React from 'react';
import { AkashaBeamEdge, SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useQueryClient } from '@tanstack/react-query';

export type UseBeamsOptions = {
  overscan: number;
  queryKey: string;
};

const enum InitialFetchEdge {
  NONE,
  NEXT,
  PREVIOUS,
}
export const useBeams = ({ overscan, queryKey }: UseBeamsOptions) => {
  const [pageCursor, setPageCursor] = React.useState({
    next: undefined,
    prev: undefined,
  });
  const [initialFetch, setInitialFetch] = React.useState<InitialFetchEdge>(InitialFetchEdge.NONE);
  const [beams, setBeams] = React.useState<AkashaBeamEdge[]>([]);
  const queryClient = useQueryClient();
  const nextReq = useGetBeamsQuery(
    {
      first: overscan,
      after: pageCursor.next,
      sorting: {
        createdAt: SortOrder.Desc,
      },
    },
    {
      queryKey: [queryKey, 'nextQuery'],
      enabled: pageCursor.next?.length > 0 || initialFetch === InitialFetchEdge.NEXT,
      onSuccess: resp => {
        if (!resp.akashaBeamIndex.edges.length) return;
        const firstItem = resp.akashaBeamIndex.edges.at(0);
        if (beams.some(beam => beam.cursor === firstItem.cursor)) {
          // @TODO: update beams. this is a refetch
          return;
        }
        setBeams(prev => [...prev, ...resp.akashaBeamIndex.edges]);
      },
    },
  );

  const prevReq = useGetBeamsQuery(
    {
      last: overscan,
      sorting: { createdAt: SortOrder.Desc },
      before: pageCursor.prev,
    },
    {
      queryKey: [queryKey, 'previousQuery'],
      enabled: pageCursor.prev?.length > 0 || initialFetch === InitialFetchEdge.PREVIOUS,
      onSuccess: resp => {
        const newBeams = [];
        if (!resp.akashaBeamIndex.edges.length) return;
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

  const fetchNextPage = React.useCallback(
    (lastCursor: string) => {
      if (nextReq.isInitialLoading) return;
      if (pageCursor.next === lastCursor) return;
      setPageCursor(prevState => ({
        ...prevState,
        next: lastCursor,
      }));
    },
    [pageCursor.next, nextReq.isInitialLoading],
  );

  const fetchPreviousPage = React.useCallback(
    (firstCursor: string) => {
      if (prevReq.isInitialLoading) return;
      if (pageCursor.prev === firstCursor) return;
      setPageCursor(prevState => ({ ...prevState, prev: firstCursor }));
    },
    [pageCursor.prev, prevReq.isInitialLoading],
  );

  const fetchInitialData = React.useCallback(
    (cursors: string[]) => {
      const resumeItemCursor = cursors.at(cursors.length - 1);
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
    console.log('fetch from start');
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
