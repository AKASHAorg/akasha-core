import * as React from 'react';
import { ILocale } from '@akashaorg/design-system-components/lib/utils/time';
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
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import EntryList, {
  EntryListProps,
} from '@akashaorg/design-system-components/lib/components/EntryList';

export type ReflectFeedProps = Omit<EntryListProps, 'itemCard'> & {
  itemType: EntityTypes.REPLY;
  pages: Record<string, any>[];
  locale?: ILocale;
  onEntryFlag?: (
    entryId: string,
    itemType: EntityTypes,
    reporterEthAddress?: string | null,
  ) => () => void;
  navigateTo: (args: NavigateToParams) => void;
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
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
};

const ReflectFeed: React.FC<ReflectFeedProps> = props => {
  const {
    onNavigate,
    locale,
    onLoadMore,
    requestStatus,
    isFetchingNextPage,
    pages,
    itemSpacing,
    hasNextPage,
    i18n,
  } = props;

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
                onContentClick={onNavigate}
              />
            </div>
          );
        });
      }}
    </EntryList>
  );
};
export default ReflectFeed;
