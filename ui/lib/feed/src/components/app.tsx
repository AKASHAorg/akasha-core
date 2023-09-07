import React, { StrictMode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { EntityTypes, IContentClickDetails, ModalNavigationOptions } from '@akashaorg/typings/ui';
import BeamFeed, { BeamFeedProps } from './beam-feed';
import ReflectFeed, { ReflectFeedProps } from './reflect-feed';
import {
  useGetScrollState,
  useRemoveScrollState,
  useSaveScrollState,
} from '../utils/use-scroll-state';
import { ScrollStateDBWrapper } from '../utils/scroll-state-db';
import type {
  ScrollerOnChangeState,
  ScrollerState,
} from '@akashaorg/design-system-components/lib/components/EntryList';

import {
  useInfiniteGetBeamsQuery,
  useInfiniteGetReflectionsFromBeamQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { SortOrder } from '@akashaorg/typings/sdk/graphql-types-new';

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

/**
 * Scroll restoration:
 * start from the first item that was visible in the viewport (firstItemCursor)
 *  - if first time visitor - start from most recent item
 * fetch {overscan} number of items that were published {before} the first item in the list
 *  - first item in the list (startItemCursor) is different from the (firstItemCursor)
 *  - if there are items in the response, show the "New items" pill
 *    - on click - reset the list including the new items
 */

export type FeedWidgetCommonProps = {
  queryKey: string;
  navigateToModal: (props: ModalNavigationOptions) => void;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
  scrollerOptions?: {
    overscan: number;
  };
};

type OmitProps =
  | 'requestStatus'
  | 'pages'
  | 'isFetchingNextPage'
  | 'hasNextPage'
  | 'onLoadMore'
  | 'onScrollStateChange'
  | 'initialScrollState'
  | 'onScrollStateReset';
type FeedProps = Omit<BeamFeedProps, OmitProps> | Omit<ReflectFeedProps, OmitProps>;

const FeedWidgetRoot: React.FC<
  FeedWidgetCommonProps & Extract<FeedProps, { itemType: EntityTypes }>
> = props => {
  const { itemType, i18n, queryKey, scrollerOptions = { overscan: 5 } } = props;
  const { pathname } = window.location;
  const scrollStateQK = `${pathname}_${queryKey}`;

  const db = React.useMemo(() => {
    return new ScrollStateDBWrapper('lib-feed-scroll-state');
  }, []);

  const getScrollState = useGetScrollState(scrollStateQK, db);
  const saveScrollState = useSaveScrollState(scrollStateQK, db);
  const removeScrollState = useRemoveScrollState(scrollStateQK, db);
  const [initialScrollState, setInitialScrollState] = React.useState<
    ScrollerState & { isFetched: boolean }
  >({
    isFetched: false,
    measurementsCache: [],
    startItemCursor: undefined,
    startItemOffset: 0,
    itemsCount: 0,
    visibleCursorRange: {
      startCursor: undefined,
      endCursor: undefined,
    },
  });

  React.useLayoutEffect(() => {
    if (getScrollState.isFetched && !initialScrollState.isFetched) {
      setInitialScrollState(prev => ({ ...prev, ...getScrollState.data, isFetched: true }));
    }
  }, [getScrollState.data, getScrollState.isFetched, initialScrollState.isFetched]);

  // forward pagination: first, after? - most recent -> least recent
  // backward pagination: last, before? - least recent -> most recent
  const beamsReq = useInfiniteGetBeamsQuery(
    'sorting',
    {
      first: scrollerOptions.overscan,
      after: initialScrollState.visibleCursorRange.startCursor ?? undefined,
      sorting: {
        createdAt: SortOrder.Desc,
      },
    },
    {
      enabled: itemType === EntityTypes.BEAM && initialScrollState.isFetched,
      select: data => {
        if (itemType !== EntityTypes.BEAM) return;
        return {
          pages: data.pages.flatMap(page => page.akashaBeamIndex.edges),
          pageParams: data.pageParams,
        };
      },
      getNextPageParam: last => {
        if (itemType !== EntityTypes.BEAM) return;
        if (last.akashaBeamIndex.pageInfo.hasNextPage) {
          return { after: last.akashaBeamIndex.pageInfo.endCursor };
        }
      },
      getPreviousPageParam: firstPage => {
        if (itemType !== EntityTypes.BEAM) return;
        if (firstPage.akashaBeamIndex.pageInfo.hasPreviousPage) {
          return { before: firstPage.akashaBeamIndex.pageInfo.startCursor };
        }
      },
    },
  );

  const reflectReq = useInfiniteGetReflectionsFromBeamQuery(
    'last',
    { id: '@TODO: fix', last: scrollerOptions.overscan },
    {
      enabled: itemType === EntityTypes.REFLECT && getScrollState.isFetched,
      select: data => {
        if (itemType !== EntityTypes.REFLECT) return;
        return {
          pages: data.pages.flatMap(page => {
            if (page.node && page.node['reflections']) {
              return page.node['reflections'].edges.flatMap(edge => edge.node);
            }
          }),
          pageParams: data.pageParams,
        };
      },
      getNextPageParam: (last, all) => {
        if (itemType !== EntityTypes.REFLECT) return;
        if (last.node['reflections'].edges.pageInfo.hasNextPage) {
          return all.length;
        }
      },
      getPreviousPageParam: firstPage => {
        if (itemType !== EntityTypes.REFLECT) return;
        if (firstPage.node['reflections'].edges.pageInfo.hasNextPage) {
          return firstPage.node['reflections'].edges.pageInfo.startCursor;
        }
      },
    },
  );

  const handleRemoveScrollState = React.useCallback(() => {
    // remove scroll state
    removeScrollState.mutate();
  }, [removeScrollState]);

  const handleScrollStateChange = React.useCallback(
    (scrollerOnChangeState: ScrollerOnChangeState<unknown>) => {
      const {
        measurementsCache,
        scrollDirection,
        allEntries,
        itemsCount,
        startItemOffset,
        startItemCursor,
        visibleCursorRange,
        visibleIndexRange,
      } = scrollerOnChangeState;

      const onFetchError = (err: Error) => {
        // @TODO: handle this error. Through state maybe?
        console.error(err, beamsReq, reflectReq);
      };
      const tryFetchNextPage = () => {
        if (itemType === EntityTypes.BEAM && canFetchNextPage(beamsReq)) {
          beamsReq.fetchNextPage().catch(onFetchError);
        }
        if (itemType === EntityTypes.REFLECT && canFetchNextPage(reflectReq)) {
          reflectReq.fetchNextPage().catch(onFetchError);
        }
      };
      const tryFetchPreviousPage = () => {
        if (itemType === EntityTypes.BEAM && canFetchPreviousPage(beamsReq)) {
          beamsReq.fetchPreviousPage().catch(onFetchError);
        }

        if (itemType === EntityTypes.REFLECT && canFetchPreviousPage(reflectReq)) {
          reflectReq.fetchPreviousPage().catch(onFetchError);
        }
      };

      saveScrollState.mutate({
        startItemCursor,
        startItemOffset,
        measurementsCache,
        itemsCount,
        visibleCursorRange,
      });
      if (visibleIndexRange.end >= allEntries.length - 1) {
        tryFetchNextPage();
      }
      if (visibleIndexRange.start < scrollerOptions.overscan) {
        if (scrollDirection === 'backward') {
          tryFetchPreviousPage();
        }
      }
    },
    [beamsReq, itemType, reflectReq, saveScrollState, scrollerOptions.overscan],
  );

  return (
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        {itemType === EntityTypes.BEAM && (
          <BeamFeed
            {...props}
            requestStatus={beamsReq.status}
            pages={beamsReq.data?.pages}
            isFetchingNextPage={beamsReq.isFetchingNextPage}
            isFetchingPreviousPage={beamsReq.isFetchingPreviousPage}
            hasNextPage={beamsReq.hasNextPage}
            onScrollStateChange={handleScrollStateChange}
            initialScrollState={getScrollState.data}
            onScrollStateReset={handleRemoveScrollState}
            getItemKey={(idx, items) => items[idx].node.id}
          />
        )}
        {itemType === EntityTypes.REFLECT && (
          <ReflectFeed
            {...props}
            requestStatus={reflectReq.status}
            pages={reflectReq.data?.pages}
            isFetchingNextPage={reflectReq.isFetchingNextPage}
            isFetchingPreviousPage={reflectReq.isFetchingPreviousPage}
            hasNextPage={reflectReq.hasNextPage}
            onScrollStateChange={handleScrollStateChange}
            initialScrollState={getScrollState.data}
            onScrollStateReset={handleRemoveScrollState}
            getItemKey={(idx, items) => items[idx]['id']}
          />
        )}
      </I18nextProvider>
    </StrictMode>
  );
};

export default FeedWidgetRoot;
