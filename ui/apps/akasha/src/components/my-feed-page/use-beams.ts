import { useGetBeamsQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import React from 'react';
import { AkashaBeamEdge, SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type UseBeamsOptions = {
  overscan: number;
  queryKey: string;
};
export const useBeams = ({ overscan, queryKey }: UseBeamsOptions) => {
  const [nextPageCursor, setNextPageCursor] = React.useState<string>();
  const [prevPageCursor, setPrevPageCursor] = React.useState<string>();
  const [initialFetch, setInitialFetch] = React.useState<boolean>();
  const [beams, setBeams] = React.useState<AkashaBeamEdge[]>([]);

  const nextReq = useGetBeamsQuery(
    {
      first: overscan,
      after: nextPageCursor,
      sorting: {
        createdAt: SortOrder.Desc,
      },
    },
    {
      queryKey: [queryKey, 'nextQuery', nextPageCursor],
      enabled: nextPageCursor?.length > 0,
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
      before: prevPageCursor,
    },
    {
      queryKey: [queryKey, 'previousQuery', prevPageCursor],
      enabled: prevPageCursor?.length > 0 || !!initialFetch,
      onSuccess: resp => {
        if (!resp.akashaBeamIndex.edges.length) return;
        const firstItem = resp.akashaBeamIndex.edges.at(0);
        if (beams.some(beam => beam.cursor === firstItem.cursor)) {
          // @TODO: update beams. this is a refetch
          return;
        }
        setBeams(prev => [...resp.akashaBeamIndex.edges, ...prev]);
      },
    },
  );

  const fetchNextPage = React.useCallback(
    (lastCursor: string) => {
      if (nextReq.isInitialLoading) return;
      if (nextPageCursor === lastCursor) return;
      setNextPageCursor(lastCursor);
    },
    [nextPageCursor, nextReq.isInitialLoading],
  );
  const fetchPreviousPage = React.useCallback(
    (firstCursor: string) => {
      if (prevReq.isInitialLoading) return;
      if (prevPageCursor === firstCursor) return;
      setPrevPageCursor(firstCursor);
    },
    [prevPageCursor, prevReq.isInitialLoading],
  );
  const fetchInitialData = React.useCallback((cursors: string[]) => {
    if (!cursors.length) {
      setInitialFetch(true);
      return;
    }
    const resumeItemCursor = cursors.at(cursors.length - 1);
    setPrevPageCursor(resumeItemCursor);
  }, []);

  return {
    pages: beams,
    fetchInitialData,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage: nextReq.isInitialLoading,
    isFetchingPreviousPage: prevReq.isInitialLoading,
  };
};
