import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import BeamCard from './cards/beam-card';
import EntryList, {
  EntryListProps,
} from '@akashaorg/design-system-components/lib/components/EntryList';
import {
  AnalyticsEventData,
  EntityTypes,
  IContentClickDetails,
  ModalNavigationOptions,
  Profile,
} from '@akashaorg/typings/lib/ui';
import { i18n } from 'i18next';
import { AkashaBeamEdge } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useInfiniteBeams } from '../utils/use-infinite-beams';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import type { ScrollStateDBWrapper } from '../utils/scroll-state-db';
import type { FeedWidgetCommonProps } from './app';
import AntennaLoader from '@akashaorg/design-system-components/lib/components/Loaders/antenna-loader';

export type BeamFeedProps = Omit<
  EntryListProps<AkashaBeamEdge>,
  | 'itemCard'
  | 'isFetchingNextPage'
  | 'requestStatus'
  | 'getItemKey'
  | 'pages'
  | 'isFetchingPreviousPage'
  | 'onScrollStateChange'
  | 'onFetchPreviousPage'
  | 'onFetchNextPage'
  | 'onScrollStateSave'
> & {
  contentClickable?: boolean;
  className?: string;
  modalSlotId: string;
  accentBorderTop?: boolean;
  totalEntryCount?: number;
  loggedProfileData?: Profile;
  i18n: i18n;
  db: ScrollStateDBWrapper;
  scrollerOptions?: FeedWidgetCommonProps['scrollerOptions'];
  queryKey: string;
  newItemsPublishedLabel: string;
  onEntryFlag?: (
    entryId: string,
    itemType: EntityTypes,
    reporterEthAddress?: string | null,
  ) => () => void;
  onEntryRemove?: (entryId: string) => void;
  trackEvent?: (data: AnalyticsEventData['data']) => void;
  onLoginModalOpen: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
};

const BeamFeed: React.FC<BeamFeedProps> = props => {
  const {
    i18n,
    itemSpacing = 8,
    onNavigate,
    db,
    scrollerOptions = { overscan: 5 },
    queryKey,
    newItemsPublishedLabel,
  } = props;

  const { uiEvents } = useRootComponentProps();
  const beamsReq = useInfiniteBeams({
    db,
    scrollerOptions,
    queryKey,
  });

  return (
    <>
      {!beamsReq.initialScrollState.isFetched && (
        <Stack fullWidth={true} customStyle="p-8">
          <AntennaLoader />
        </Stack>
      )}

      <EntryList<AkashaBeamEdge>
        requestStatus={beamsReq.status}
        isFetchingNextPage={beamsReq.isFetchingNextPage}
        pages={beamsReq.pages}
        itemSpacing={itemSpacing}
        languageDirection={i18n?.dir() || 'ltr'}
        onScrollStateSave={beamsReq.onScrollStateSave}
        initialScrollState={beamsReq.initialScrollState}
        onScrollStateReset={beamsReq.onScrollStateReset}
        getItemKey={(idx, items) => {
          if (!items || !items.length) return null;
          return hasOwn(items[idx], 'key') ? items[idx]['key'] : items[idx]['cursor'];
        }}
        scrollerOptions={scrollerOptions}
        onFetchNextPage={beamsReq.tryFetchNextPage}
        onFetchPreviousPage={beamsReq.tryFetchPreviousPage}
        newItemsCount={beamsReq.newItemsCount}
        isFetchingPreviousPage={beamsReq.isFetchingPreviousPage}
        newItemsPublishedLabel={newItemsPublishedLabel}
      >
        {cardProps => {
          const { items, allEntries, measureElementRef } = cardProps;
          return items.map(item => {
            if (!item) {
              return <div key={item.key} />;
            }
            const { index, key } = item;
            const entryData = allEntries[index];
            const isNextLoader = index > allEntries.length - 1;
            if (isNextLoader) {
              return (
                <Stack fullWidth={true} key={'$next-loader'} customStyle="p-8">
                  <Spinner />
                </Stack>
              );
            }
            return (
              <div
                key={key}
                data-index={index}
                ref={measureElementRef}
                data-cursor={entryData?.cursor || entryData?.['key'] || ''}
              >
                {!entryData.node && <EntryCardLoading />}
                {entryData.node && (
                  <BeamCard
                    entryData={entryData.node}
                    contentClickable={true}
                    onReflect={() => {
                      onNavigate(
                        {
                          authorId: entryData.node?.author.id,
                          id: entryData.node?.id,
                          reflect: true,
                        },
                        EntityTypes.BEAM,
                      );
                    }}
                    onContentClick={() =>
                      onNavigate(
                        { authorId: entryData.node?.author.id, id: entryData.node?.id },
                        EntityTypes.BEAM,
                      )
                    }
                  />
                )}
              </div>
            );
          });
        }}
      </EntryList>
    </>
  );
};

export default BeamFeed;
