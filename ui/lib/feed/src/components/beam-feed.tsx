import * as React from 'react';
import EntryList, {
  EntryListProps,
} from '@akashaorg/design-system-components/lib/components/EntryList';
import {
  AnalyticsEventData,
  EntityTypes,
  IContentClickDetails,
  ModalNavigationOptions,
  Profile,
} from '@akashaorg/typings/ui';
import { i18n } from 'i18next';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import { ILocale } from '@akashaorg/design-system-components/lib/utils/time';
import { AkashaBeamEdge } from '@akashaorg/typings/sdk/graphql-types-new';
import { useInfiniteBeams } from '../utils/use-infinite-beams';
import type { ScrollStateDBWrapper } from '../utils/scroll-state-db';
import type { FeedWidgetCommonProps } from './app';

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
  } = props;

  const beamsReq = useInfiniteBeams({
    db,
    scrollerOptions,
    queryKey,
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
        onScrollStateReset={beamsReq.onScrollStateRemove}
        getItemKey={(idx, items) => items[idx].cursor}
        scrollerOptions={scrollerOptions}
        onFetchNextPage={beamsReq.tryFetchNextPage}
        onFetchPreviousPage={beamsReq.tryFetchPreviousPage}
      >
        {cardProps => {
          const { items, allEntries, measureElementRef } = cardProps;
          return items.map((item, idx) => {
            if (!item) {
              return <div key={idx} />;
            }
            const { index, key } = item;
            const entryData = allEntries[index];
            const isNextLoader = index > allEntries.length - 1;
            if (isNextLoader) {
              return (
                <Stack fullWidth={true} key={`${index}_${key}`} customStyle="p-8">
                  <Spinner />
                </Stack>
              );
            }
            return (
              <div
                key={`${index}_${key}`}
                data-index={index}
                ref={measureElementRef}
                style={{ paddingBottom: itemSpacing }}
              >
                <EntryCard
                  showMore={true}
                  entryData={entryData.node}
                  locale={locale}
                  onRepost={onRebeam}
                  onContentClick={onNavigate}
                  repliesAnchorLink="/@akashaorg/app-akasha-integration/beam"
                  profileAnchorLink="/@akashaorg/app-profile"
                />
              </div>
            );
          });
        }}
      </EntryList>
    </>
  );
};

export default BeamFeed;
