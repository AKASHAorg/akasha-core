import * as React from 'react';
import type { ScrollerState } from '@akashaorg/design-system-components/lib/components/EntryList';
import {
  useGetBeamsQuery,
  useInfiniteGetBeamsQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated';
import { SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useGetScrollState, useRemoveScrollState, useSaveScrollState } from './use-scroll-state';
import { ScrollStateDBWrapper } from './scroll-state-db';
import { ScrollerOnChangeState } from '@akashaorg/design-system-components/lib/components/EntryList';
import { BeamFeedProps } from '../components/beam-feed';
import { hasOwn } from '@akashaorg/ui-awf-hooks';

const canFetchNextPage = (req: {
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  isError: boolean;
}) => {
  return !req.isFetchingNextPage && req.hasNextPage && !req.isError;
};

const canFetchPreviousPage = (req: {
  isFetchingPreviousPage: boolean;
  hasPreviousPage?: boolean;
  isError: boolean;
}) => !req.isFetchingPreviousPage && req.hasPreviousPage && !req.isError;

export type UseInfiniteBeamsOptions = {
  scrollerOptions: BeamFeedProps['scrollerOptions'];
  queryKey: string;
  db: ScrollStateDBWrapper;
};

export const useInfiniteBeams = (options: UseInfiniteBeamsOptions) => {
  const { pathname } = window.location;
  const scrollStateQK = `${pathname}_${options.queryKey}`;
  const getScrollState = useGetScrollState(scrollStateQK, options.db);
  const saveScrollState = useSaveScrollState(scrollStateQK, options.db);
  const removeScrollState = useRemoveScrollState(scrollStateQK, options.db);

  const [initialScrollState, setInitialScrollState] = React.useState<
    ScrollerState & { isFetched: boolean }
  >({
    isFetched: false,
    measurementsCache: [],
    startItemCursor: undefined,
    itemsCount: 0,
    visibleCursorRange: {
      startCursor: undefined,
      endCursor: undefined,
    },
  });

  React.useEffect(() => {
    if (getScrollState.isFetched && !initialScrollState.isFetched) {
      setInitialScrollState(prev => ({
        ...prev,
        ...getScrollState.data,
        isFetched: true,
      }));
    }
  }, [initialScrollState.isFetched, getScrollState]);

  //get the items newer that the first seen item
  const newBeamReq = useGetBeamsQuery(
    {
      last: 2,
      sorting: { createdAt: SortOrder.Desc },
      before: initialScrollState.startItemCursor,
    },
    {
      enabled: !!initialScrollState.startItemCursor,
    },
  );

  // forward pagination: first, after? - most recent -> least recent
  // backward pagination: last, before? - least recent -> most recent
  const beamsReq = useInfiniteGetBeamsQuery(
    'sorting',
    {
      first: options.scrollerOptions.overscan,
      after: initialScrollState.visibleCursorRange.startCursor ?? undefined,
      sorting: {
        createdAt: SortOrder.Desc,
      },
    },
    {
      enabled: initialScrollState.isFetched,
      keepPreviousData: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      select: data => {
        return {
          pages: data.pages.flatMap(page => page.akashaBeamIndex.edges),
          pageParams: data.pageParams,
        };
      },
      getNextPageParam: last => {
        if (last.akashaBeamIndex.pageInfo.hasNextPage) {
          return last.akashaBeamIndex.pageInfo.endCursor;
        }
      },
      getPreviousPageParam: firstPage => {
        return firstPage.akashaBeamIndex.pageInfo.startCursor;
      },
    },
  );

  const requestStatus = React.useMemo(() => {
    if (newBeamReq.isError || beamsReq.isError) {
      return 'error';
    }
    if (newBeamReq.isLoading) {
      return 'loading';
    }
    if (newBeamReq.isSuccess && newBeamReq.isSuccess) {
      return 'success';
    }
    return beamsReq.status;
  }, [beamsReq, newBeamReq]);

  const handleScrollStateSave = (scrollerOnChangeState: ScrollerOnChangeState<unknown>) => {
    const { allEntries, ...scrollState } = scrollerOnChangeState;

    if (!saveScrollState.isLoading) {
      saveScrollState.mutate({
        ...scrollState,
      });
    }
  };

  const newItemsCount = React.useMemo(() => {
    if (newBeamReq.data && hasOwn(newBeamReq.data, 'akashaBeamIndex')) {
      return newBeamReq.data.akashaBeamIndex.edges.length;
    }
    return 0;
  }, [newBeamReq.data]);

  const onFetchError = React.useCallback(
    (err: Error) => {
      // @TODO: handle this error. Through state maybe?
      console.error(err, beamsReq);
    },
    [beamsReq],
  );

  const tryFetchNextPage = React.useCallback(
    (lastCursor: string) => {
      if (canFetchNextPage(beamsReq)) {
        beamsReq
          .fetchNextPage({
            pageParam: {
              first: options.scrollerOptions.overscan,
              last: null,
              sorting: {
                createdAt: SortOrder.Desc,
              },
              before: null,
              after: lastCursor,
            },
          })
          .catch(onFetchError);
      }
    },
    [beamsReq, onFetchError, options.scrollerOptions.overscan],
  );

  const tryFetchPreviousPage = React.useCallback(
    (firstCursor: string, force = false) => {
      if (canFetchPreviousPage(beamsReq)) {
        beamsReq
          .fetchPreviousPage({
            pageParam: {
              first: null,
              last: options.scrollerOptions.overscan,
              sorting: {
                createdAt: SortOrder.Desc,
              },
              after: null,
              before: firstCursor,
            },
          })
          .catch(onFetchError);
      }
    },
    [beamsReq, onFetchError, options.scrollerOptions.overscan],
  );
  const handleResetScrollState = React.useCallback(
    async (remove?: boolean) => {
      if (remove) {
        try {
          await removeScrollState.mutateAsync();
          beamsReq.remove();
          await getScrollState.refetch();
          await newBeamReq.refetch();
          return await beamsReq.refetch();
        } catch (err) {
          return console.error('cannot reset and remove scroll state', err);
        }
      }
      try {
        const currentScrollState = await getScrollState.refetch();
        const updatedScrollState = await saveScrollState.mutateAsync({
          ...currentScrollState.data,
          visibleCursorRange: {
            ...currentScrollState.data.visibleCursorRange,
            startCursor: currentScrollState.data.startItemCursor,
          },
        });
        await getScrollState.refetch();
        beamsReq.remove();
        tryFetchNextPage(updatedScrollState.startItemCursor);
        setInitialScrollState(prev => ({ ...prev, isFetched: false }));
      } catch (err) {
        console.error('Cannot reset scroll state', err);
      }
    },
    [beamsReq, getScrollState, newBeamReq, removeScrollState, saveScrollState, tryFetchNextPage],
  );
  return {
    pages: beamsReq.data?.pages || [],
    status: requestStatus,
    newItemsCount,
    onScrollStateReset: handleResetScrollState,
    onScrollStateSave: handleScrollStateSave,
    isFetchingNextPage: beamsReq.isFetchingNextPage,
    isFetchingPreviousPage: beamsReq.isFetchingPreviousPage,
    hasNextPage: beamsReq.hasNextPage,
    hasPreviousPage: beamsReq.hasPreviousPage,
    initialScrollState,
    tryFetchNextPage,
    tryFetchPreviousPage,
  };
};
