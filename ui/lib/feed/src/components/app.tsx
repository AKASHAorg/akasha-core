import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { EntityTypes, IContentClickDetails, ModalNavigationOptions } from '@akashaorg/typings/ui';
import BeamFeed, { BeamFeedProps } from './beam-feed';
import ReflectFeed, { ReflectFeedProps } from './reflect-feed';
import { mapEntry, useInfiniteDummy } from '@akashaorg/ui-awf-hooks';
import {
  GetBeamsQuery,
  GetReflectionsFromBeamQuery,
} from '@akashaorg/typings/sdk/graphql-operation-types-new';
import { createDummyBeams, createDummyReflections } from './create-dummy-entries';
import {
  useGetScrollState,
  useRemoveScrollState,
  useSaveScrollState,
} from '../utils/use-scroll-state';
import { ScrollStateDBWrapper } from '../utils/scroll-state-db';
import type { ScrollerState } from '@akashaorg/design-system-components/lib/components/EntryList';

const canFetchNextPage = (req: {
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  isError: boolean;
}) => !req.isFetchingNextPage && req.hasNextPage && !req.isError;

export type FeedWidgetCommonProps = {
  queryKey: string;
  navigateToModal: (props: ModalNavigationOptions) => void;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
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
  const { itemType, i18n, queryKey } = props;
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

  const beamsReq = useInfiniteDummy<GetBeamsQuery, ReturnType<typeof mapEntry>>(
    queryKey,
    createDummyBeams({ first: 5, after: initialItemId }),
    {
      enabled: itemType === EntityTypes.BEAM && getScrollState.isFetched,
      select: data => {
        if (itemType !== EntityTypes.BEAM) return;
        return {
          pages: data.pages.flatMap(page =>
            page.beamIndex.edges.flatMap(edge =>
              mapEntry({ ...edge.node, type: EntityTypes.BEAM }),
            ),
          ),
          pageParams: data.pageParams,
        };
      },
      keepPreviousData: true,
      getNextPageParam: (last, all) => {
        if (itemType !== EntityTypes.BEAM) return;
        if (last.beamIndex.pageInfo.hasNextPage) {
          return all.length;
        }
      },
      getPreviousPageParam: firstPage => {
        if (itemType !== EntityTypes.BEAM) return;
        if (firstPage.beamIndex.pageInfo.hasPreviousPage) {
          return { before: firstPage.beamIndex.pageInfo.startCursor };
        }
      },
    },
  );

  const reflectReq = useInfiniteDummy<GetReflectionsFromBeamQuery, ReturnType<typeof mapEntry>>(
    queryKey,
    createDummyReflections(5),
    {
      enabled: itemType === EntityTypes.REFLECT && getScrollState.isFetched,
      select: data => {
        if (itemType !== EntityTypes.REFLECT) return;
        return {
          pages: data.pages.flatMap(page => {
            if (page.node && page.node['reflections']) {
              return page.node['reflections'].edges.flatMap(edge =>
                mapEntry({ ...edge.node, type: EntityTypes.REFLECT }),
              );
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

  const handleLoadMore = React.useCallback(() => {
    if (itemType === EntityTypes.BEAM && canFetchNextPage(beamsReq)) {
      beamsReq.fetchNextPage();
    }
    if (itemType === EntityTypes.REFLECT && canFetchNextPage(reflectReq)) {
      reflectReq.fetchNextPage();
    }
  }, [beamsReq, itemType, reflectReq]);

  const handleScrollStateChange = React.useCallback(
    (scrollState: ScrollerState) => {
      saveScrollState.mutate(scrollState);
    },
    [saveScrollState],
  );

  const handleRemoveScrollState = React.useCallback(() => {
    // remove scroll state
    removeScrollState.mutate();
  }, [removeScrollState]);

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
