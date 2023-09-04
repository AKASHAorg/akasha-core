import * as React from 'react';
import EntryList, {
  EntryListProps,
  ScrollerState,
} from '@akashaorg/design-system-components/lib/components/EntryList';
import {
  EntityTypes,
  IContentClickDetails,
  ModalNavigationOptions,
  Profile,
  RootComponentProps,
  TrackEventData,
} from '@akashaorg/typings/ui';
import { i18n } from 'i18next';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import { ILocale } from '@akashaorg/design-system-components/lib/utils/time';
import { AkashaBeam } from '@akashaorg/typings/sdk/graphql-types-new';

export type BeamFeedProps = Omit<EntryListProps<AkashaBeam>, 'itemCard'> & {
  itemType: EntityTypes.BEAM;
  locale?: ILocale;
  onEntryFlag?: (
    entryId: string,
    itemType: EntityTypes,
    reporterEthAddress?: string | null,
  ) => () => void;
  contentClickable?: boolean;
  onEntryRemove?: (entryId: string) => void;
  uiEvents: RootComponentProps['uiEvents'];
  className?: string;
  modalSlotId: string;
  accentBorderTop?: boolean;
  trackEvent?: (event: Omit<TrackEventData, 'eventType'>) => void;
  totalEntryCount?: number;
  onLoginModalOpen: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loggedProfileData?: Profile;
  i18n: i18n;
  onRebeam?: (withComment: boolean, beamId: string) => void;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
  onScrollStateChange: (scrollState: ScrollerState) => void;
  initialScrollState: ScrollerState;
  onScrollStateReset: () => void;
};

const BeamFeed: React.FC<BeamFeedProps> = props => {
  const {
    locale = 'en',
    i18n,
    requestStatus,
    isFetchingNextPage,
    isFetchingPreviousPage,
    pages,
    itemSpacing = 8,
    onNavigate,
    onRebeam,
    onScrollStateChange,
    initialScrollState,
    getItemKey,
  } = props;

  return (
    <EntryList<AkashaBeam>
      requestStatus={requestStatus}
      isFetchingNextPage={isFetchingNextPage}
      pages={pages}
      itemSpacing={itemSpacing}
      languageDirection={i18n?.dir() || 'ltr'}
      onScrollStateChange={onScrollStateChange}
      initialScrollState={initialScrollState}
      getItemKey={getItemKey}
    >
      {cardProps => {
        const { items, allEntries, measureElementRef } = cardProps;
        return items.map(item => {
          const { index, key } = item;
          const entryData = allEntries[index];
          const isNextLoader = index > allEntries.length - 1;
          if (isNextLoader) {
            return (
              <Stack fullWidth={true} key={key} customStyle="p-8">
                <Spinner />
              </Stack>
            );
          }
          return (
            <div
              key={key}
              data-index={index}
              ref={measureElementRef}
              style={{ paddingBottom: itemSpacing }}
            >
              <EntryCard
                showMore={true}
                entryData={entryData}
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
  );
};

export default BeamFeed;
