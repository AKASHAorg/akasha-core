import * as React from 'react';
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
import { ILocale } from '@akashaorg/design-system-components/lib/utils/time';
import { AkashaBeamEdge } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useInfiniteBeams } from '../utils/use-infinite-beams';
import type { ScrollStateDBWrapper } from '../utils/scroll-state-db';
import type { FeedWidgetCommonProps } from './app';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

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
  locale?: ILocale;
  onEntryFlag?: (
    entryId: string,
    itemType: EntityTypes,
    reporterEthAddress?: string | null,
  ) => () => void;
  contentClickable?: boolean;
  onEntryRemove?: (entryId: string) => void;
  className?: string;
  modalSlotId: string;
  accentBorderTop?: boolean;
  trackEvent?: (data: AnalyticsEventData['data']) => void;
  totalEntryCount?: number;
  onLoginModalOpen: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loggedProfileData?: Profile;
  i18n: i18n;
  onRebeam?: (withComment: boolean, beamId: string) => void;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
  db: ScrollStateDBWrapper;
  scrollerOptions?: FeedWidgetCommonProps['scrollerOptions'];
  queryKey: string;
  newItemsPublishedLabel: string;
  did?: string;
};

const BeamFeed: React.FC<BeamFeedProps> = props => {
  const {
    locale = 'en',
    i18n,
    itemSpacing = 8,
    onNavigate,
    onRebeam,
    db,
    scrollerOptions = { overscan: 5 },
    queryKey,
    newItemsPublishedLabel,
    did,
  } = props;

  const { uiEvents } = useRootComponentProps();
  const beamsReq = useInfiniteBeams({
    db,
    scrollerOptions,
    queryKey,
    did,
  });

  return (
    <>
      {!beamsReq.initialScrollState.isFetched && (
        <Stack fullWidth={true} customStyle="p-8">
          <Spinner />
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
