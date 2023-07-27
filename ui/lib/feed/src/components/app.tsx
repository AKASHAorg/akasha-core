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

export type FeedWidgetCommonProps = {
  navigateToModal: (props: ModalNavigationOptions) => void;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
};

type OmitProps = 'requestStatus' | 'pages' | 'isFetchingNextPage' | 'hasNextPage' | 'onLoadMore';
type FeedProps = Omit<BeamFeedProps, OmitProps> | Omit<ReflectFeedProps, OmitProps>;

const FeedWidgetRoot: React.FC<
  FeedWidgetCommonProps & Extract<FeedProps, { itemType: EntityTypes }>
> = props => {
  const { itemType, i18n } = props;
  const beamsReq = useInfiniteDummy<GetBeamsQuery, ReturnType<typeof mapEntry>>(
    'feed_page_get_beams',
    createDummyBeams(5),
    {
      enabled: itemType === EntityTypes.BEAM,
      select: data => ({
        pages: data.pages.flatMap(page =>
          page.beamIndex.edges.flatMap(edge => mapEntry({ ...edge.node, type: EntityTypes.BEAM })),
        ),
        pageParams: data.pageParams,
      }),
    },
  );

  const reflectReq = useInfiniteDummy<GetReflectionsFromBeamQuery, ReturnType<typeof mapEntry>>(
    'feed_page_get_reflections',
    createDummyReflections(5),
    {
      enabled: itemType === EntityTypes.REPLY,
      select: data => ({
        pages: data.pages.flatMap(page => {
          if ('reflections' in page.node) {
            return page.node.reflections.edges.flatMap(edge =>
              mapEntry({ ...edge.node, type: EntityTypes.REPLY }),
            );
          }
        }),
        pageParams: data.pageParams,
      }),
    },
  );

  const handleLoadMore = React.useCallback(() => {
    if (itemType === EntityTypes.BEAM && !beamsReq.isLoading && beamsReq.hasNextPage) {
      beamsReq.fetchNextPage();
    }
    if (itemType === EntityTypes.REPLY && reflectReq.isLoading && reflectReq.hasNextPage) {
      reflectReq.fetchNextPage();
    }
  }, [beamsReq, itemType]);

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
        />
      )}
      {itemType === EntityTypes.REPLY && (
        <ReflectFeed
          {...props}
          requestStatus={reflectReq.status}
          pages={reflectReq.data?.pages}
          isFetchingNextPage={reflectReq.isFetchingNextPage}
          hasNextPage={reflectReq.hasNextPage}
          onLoadMore={handleLoadMore}
        />
      )}
    </I18nextProvider>
  );
};

export default FeedWidgetRoot;