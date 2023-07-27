import * as React from 'react';
import EntryList, {
  EntryListProps,
} from '@akashaorg/design-system-components/lib/components/EntryList';
import {
  EntityTypes,
  IContentClickDetails,
  ModalNavigationOptions,
  NavigateToParams,
  Profile,
  RootComponentProps,
  TrackEventData,
} from '@akashaorg/typings/ui';
import { i18n } from 'i18next';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import { ILocale } from '@akashaorg/design-system-components/lib/utils/time';

export type BeamFeedProps = Omit<EntryListProps, 'itemCard'> & {
  itemType: EntityTypes.BEAM;
  locale?: ILocale;
  onEntryFlag?: (
    entryId: string,
    itemType: EntityTypes,
    reporterEthAddress?: string | null,
  ) => () => void;
  navigateTo: (args: NavigateToParams) => void;
  contentClickable?: boolean;
  onEntryRemove?: (entryId: string) => void;
  uiEvents: RootComponentProps['uiEvents'];
  className?: string;
  modalSlotId: string;
  accentBorderTop?: boolean;
  trackEvent?: (event: Omit<TrackEventData, 'eventType'>) => void;
  totalEntryCount?: number;
  onLoginModalOpen: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  navigateToModal: (props: ModalNavigationOptions) => void;
  loggedProfileData?: Profile;
  i18n: i18n;
  onRebeam?: (withComment: boolean, beamId: string) => void;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
};

const BeamFeed: React.FC<BeamFeedProps> = props => {
  const {
    locale = 'en',
    onLoadMore,
    i18n,
    requestStatus,
    isFetchingNextPage,
    pages,
    itemSpacing,
    hasNextPage,
    loggedProfileData,
    navigateToModal,
    navigateTo,
    onNavigate,
  } = props;

  const handleRepost = (_withComment: boolean, entryId: string) => {
    if (!loggedProfileData?.did.id) {
      navigateToModal({ name: 'login' });
    } else {
      navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: () => `/feed?repost=${entryId}`,
      });
    }
  };

  return (
    <EntryList
      onLoadMore={onLoadMore}
      requestStatus={requestStatus}
      isFetchingNextPage={isFetchingNextPage}
      pages={pages}
      itemSpacing={itemSpacing}
      hasNextPage={hasNextPage}
      languageDirection={i18n?.dir() || 'ltr'}
    >
      {cardProps => {
        const { items, allEntries, measureElementRef } = cardProps;
        return items.map(item => {
          const { index, key } = item;
          const entryData = allEntries[index];
          const isLoader = index > allEntries.length - 1;
          if (isLoader || isFetchingNextPage) {
            return (
              <Box key={key} customStyle="p-8 w-full">
                <Spinner />
              </Box>
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
                onRepost={handleRepost}
                onContentClick={onNavigate}
              />
            </div>
          );
        });
      }}
    </EntryList>
  );
};

export default BeamFeed;
