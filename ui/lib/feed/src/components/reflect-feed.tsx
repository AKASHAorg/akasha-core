import * as React from 'react';
import { ILocale } from '@akashaorg/design-system-components/lib/utils/time';
import {
  EntityTypes,
  IContentClickDetails,
  ModalNavigationOptions,
  NavigateToParams,
  Profile,
  TrackEventData,
} from '@akashaorg/typings/ui';
import { i18n } from 'i18next';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import EntryList, {
  EntryListProps,
  ScrollerState,
} from '@akashaorg/design-system-components/lib/components/EntryList';
import { AkashaReflect } from '@akashaorg/typings/sdk/graphql-types-new';

export type ReflectFeedProps = Omit<EntryListProps<AkashaReflect>, 'itemCard'> & {
  itemType: EntityTypes.REFLECT;
  beamId?: string;
  locale?: ILocale;
  onEntryFlag?: (
    entryId: string,
    itemType: EntityTypes,
    reporterEthAddress?: string | null,
  ) => () => void;
  navigateTo: (args: NavigateToParams) => void;
  onEntryRemove?: (entryId: string) => void;
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
  onScrollStateChange: (scrollState: ScrollerState) => void;
  initialScrollState: ScrollerState;
  onScrollStateReset: () => void;
};

const ReflectFeed: React.FC<ReflectFeedProps> = props => {
  const {
    onNavigate,
    locale,
    requestStatus,
    isFetchingNextPage,
    pages,
    itemSpacing = 8,
    hasNextPage,
    i18n,
    initialScrollState,
    onScrollStateReset,
    onScrollStateChange,
    getItemKey,
  } = props;

  return (
    <EntryList<AkashaReflect>
      requestStatus={requestStatus}
      isFetchingNextPage={isFetchingNextPage}
      pages={pages}
      itemSpacing={itemSpacing}
      hasNextPage={hasNextPage}
      languageDirection={i18n?.dir() || 'ltr'}
      initialScrollState={initialScrollState}
      onScrollStateReset={onScrollStateReset}
      onScrollStateChange={onScrollStateChange}
      getItemKey={getItemKey}
    >
      {cardProps => {
        const { items, allEntries, measureElementRef } = cardProps;
        return items.map(item => {
          const { index, key } = item;
          const entryData = allEntries[index];
          const isLoader = index > allEntries.length - 1;
          if (isLoader || isFetchingNextPage) {
            return (
              <Stack key={key} customStyle="p-8 w-full">
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
