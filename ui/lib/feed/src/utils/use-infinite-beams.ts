import * as React from 'react';
import type { ScrollerState } from '@akashaorg/design-system-components/lib/components/EntryList';
import { useInfiniteGetBeamsQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { SortOrder } from '@akashaorg/typings/sdk/graphql-types-new';
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

const canFetchPreviousPage = (
  req: {
    isFetchingPreviousPage: boolean;
    hasPreviousPage?: boolean;
    isError: boolean;
  },
  force: boolean,
) => !req.isFetchingPreviousPage && (force ? true : req.hasPreviousPage) && !req.isError;

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

  //get the items newer that the first seed item
  const newBeamReq = useInfiniteGetBeamsQuery(
    'last',
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

  const handleRemoveScrollState = React.useCallback(() => {
    // remove scroll state
    removeScrollState.mutate();
  }, [removeScrollState]);

  const handleScrollStateSave = (scrollerOnChangeState: ScrollerOnChangeState<unknown>) => {
    const { allEntries, ...scrollState } = scrollerOnChangeState;

    if (!saveScrollState.isLoading) {
      saveScrollState.mutate({
        ...scrollState,
      });
    }
  };

  const newItemsCount = React.useMemo(() => {
    if (newBeamReq.data && hasOwn(newBeamReq.data, 'pages')) {
      return newBeamReq.data.pages.flatMap(p => p.akashaBeamIndex.edges).length;
    }
    return 0;
  }, [newBeamReq.data]);

  const onFetchError = (err: Error) => {
    // @TODO: handle this error. Through state maybe?
    console.error(err, beamsReq);
  };

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
      if (canFetchPreviousPage(beamsReq, force)) {
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

  return {
    pages: beamsReq.data?.pages || [],
    status: requestStatus,
    newItemsCount,
    onScrollStateRemove: handleRemoveScrollState,
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
