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
import { useLocalstorage } from './use-localstorage';

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
  const [scrollState, saveScrollState, removeScrollState] = useLocalstorage(
    `${pathname}_${queryKey}`,
  );

  const beamsReq = useInfiniteDummy<GetBeamsQuery, ReturnType<typeof mapEntry>>(
    queryKey,
    createDummyBeams(5),
    {
      enabled: itemType === EntityTypes.BEAM,
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
      enabled: itemType === EntityTypes.REFLECT,
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
    if (
      itemType === EntityTypes.BEAM &&
      !beamsReq.isFetchingNextPage &&
      beamsReq.hasNextPage &&
      !beamsReq.isError
    ) {
      beamsReq.fetchNextPage();
    }
    if (
      itemType === EntityTypes.REFLECT &&
      reflectReq.isFetchingNextPage &&
      reflectReq.hasNextPage &&
      !reflectReq.isError
    ) {
      reflectReq.fetchNextPage();
    }
  }, [beamsReq, itemType]);

  const handleScrollStateChange = React.useCallback(scrollState => {
    saveScrollState(scrollState);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {itemType === EntityTypes.BEAM && (
        <BeamFeed
          {...props}
          requestStatus={beamsReq.status}
          pages={beamsReq.data?.pages}
          isFetchingNextPage={beamsReq.isFetchingNextPage}
          hasNextPage={beamsReq.hasNextPage}
          onLoadMore={handleLoadMore}
          onScrollStateChange={handleScrollStateChange}
          initialScrollState={scrollState}
          onScrollStateReset={removeScrollState}
        />
      )}
      {itemType === EntityTypes.REFLECT && (
        <ReflectFeed
          {...props}
          requestStatus={reflectReq.status}
          pages={reflectReq.data?.pages}
          isFetchingNextPage={reflectReq.isFetchingNextPage}
          hasNextPage={reflectReq.hasNextPage}
          onLoadMore={handleLoadMore}
          onScrollStateChange={handleScrollStateChange}
          initialScrollState={scrollState}
          onScrollStateReset={removeScrollState}
        />
      )}
    </I18nextProvider>
  );
};

export default FeedWidgetRoot;
