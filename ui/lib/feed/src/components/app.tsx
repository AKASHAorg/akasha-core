import React from 'react';
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
import type { ScrollerOnChangeState } from '@akashaorg/design-system-components/lib/components/EntryList';

import {
  useInfiniteGetBeamsQuery,
  useInfiniteGetReflectionsFromBeamQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

const canFetchNextPage = (req: {
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  isError: boolean;
}) => !req.isFetchingNextPage && req.hasNextPage && !req.isError;

const canFetchPreviousPage = (req: {
  isFetchingPreviousPage: boolean;
  hasPreviousPage?: boolean;
  isError: boolean;
}) => !req.isFetchingPreviousPage && req.hasPreviousPage && !req.isError;

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

  // forward pagination: first, after? - most recent -> least recent
  // backward pagination: last, before? - least recent -> most recent
  const initialItemId = React.useMemo(() => {
    if (getScrollState.data) {
      return getScrollState.data.firstItemId;
    }
  }, [getScrollState.data]);

  const beamsReq = useInfiniteGetBeamsQuery(
    'first',
    {
      first: scrollerOptions.overscan,
      after: initialItemId,
    },
    {
      enabled: itemType === EntityTypes.BEAM && getScrollState.isFetched,
      select: data => {
        if (itemType !== EntityTypes.BEAM) return;
        return {
          pages: data.pages.flatMap(page => page.akashaBeamIndex.edges.flatMap(edge => edge.node)),
          pageParams: data.pageParams,
        };
      },
      getNextPageParam: (last, all) => {
        if (itemType !== EntityTypes.BEAM) return;
        if (last.akashaBeamIndex.pageInfo.hasNextPage) {
          return all.length;
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
    (scrollState: ScrollerOnChangeState<unknown>) => {
      const onFetchError = (err: Error) => {
        // @TODO: handle this error. Through state maybe?
        console.error(err, beamsReq, reflectReq);
      };
      const tryFetchNextPage = (lastItemId: string) => {
        if (itemType === EntityTypes.BEAM && canFetchNextPage(beamsReq)) {
          beamsReq
            .fetchNextPage({ pageParam: { first: scrollerOptions.overscan, after: lastItemId } })
            .catch(onFetchError);
        }
        if (itemType === EntityTypes.REFLECT && canFetchNextPage(reflectReq)) {
          reflectReq
            .fetchNextPage({ pageParam: { first: scrollerOptions.overscan, after: lastItemId } })
            .catch(onFetchError);
        }
      };
      const tryFetchPreviousPage = (firstItemId: string) => {
        if (itemType === EntityTypes.BEAM && canFetchPreviousPage(beamsReq)) {
          beamsReq
            .fetchPreviousPage({
              pageParam: { last: scrollerOptions.overscan, before: firstItemId },
            })
            .catch(onFetchError);
        }

        if (itemType === EntityTypes.REFLECT && canFetchPreviousPage(reflectReq)) {
          reflectReq
            .fetchPreviousPage({
              pageParam: { last: scrollerOptions.overscan, before: firstItemId },
            })
            .catch(onFetchError);
        }
      };

      const {
        measurementsCache,
        scrollDirection,
        firstItemId,
        lastItemIdx,
        firstItemIdx,
        lastItemId,
        allEntries,
        itemsCount,
        startItemOffset,
      } = scrollState;

      saveScrollState.mutate({
        scrollDirection,
        startItemId: firstItemId,
        lastItemId,
        measurementsCache,
        startItemOffset,
        itemsCount,
      });
      if (scrollDirection === 'forward') {
        if (lastItemIdx >= allEntries.length - 1) {
          tryFetchNextPage(lastItemId);
        }
      }
      if (scrollDirection === 'backward') {
        if (firstItemIdx < scrollerOptions.overscan) {
          tryFetchPreviousPage(firstItemId);
        }
        return;
      }
    },
    [beamsReq, itemType, reflectReq, saveScrollState, scrollerOptions.overscan],
  );

  return (
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
          getItemKey={(idx, items) => items[idx]['id']}
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
  );
};

export default FeedWidgetRoot;
