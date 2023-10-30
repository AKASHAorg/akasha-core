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
      enabled: !!nextPageCursor || initialFetch,
      onSuccess: resp => {
        const firstItem = resp.akashaBeamIndex.edges.at(0);
        if (beams.some(beam => beam.cursor === firstItem.cursor)) {
          // @TODO: update beams. this is a refetch
          return;
        }
        setBeams(prev => [...prev, ...resp.akashaBeamIndex.edges]);
      },
      onSettled: () => {
        setInitialFetch(false);
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
      enabled: !!prevPageCursor,
      onSuccess: resp => {
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
      if (nextReq.isLoading) return;
      // do not fetch until we have a previously set cursor
      // the initial cursor is set by fetchInitialData.
      if (!nextPageCursor || nextPageCursor === lastCursor) return;
      setNextPageCursor(lastCursor);
    },
    [nextPageCursor, nextReq.isLoading],
  );
  const fetchPreviousPage = React.useCallback(
    (firstCursor: string) => {
      if (prevReq.isLoading) return;
      if (prevPageCursor === firstCursor) return;
      setPrevPageCursor(firstCursor);
    },
    [prevPageCursor, prevReq.isLoading],
  );
  const fetchInitialData = React.useCallback((startCursor?: string) => {
    if (!startCursor) {
      setInitialFetch(true);
      return;
    }
    setNextPageCursor(startCursor);
  }, []);

  return {
    pages: beams,
    fetchInitialData,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage: nextReq.isFetching || nextReq.isInitialLoading,
    isFetchingPreviousPage: prevReq.isFetching || prevReq.isInitialLoading,
  };
};
