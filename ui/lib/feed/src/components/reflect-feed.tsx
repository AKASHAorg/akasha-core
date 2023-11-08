import * as React from 'react';
import { ILocale } from '@akashaorg/design-system-components/lib/utils/time';
import {
  AnalyticsEventData,
  EntityTypes,
  IContentClickDetails,
  ModalNavigationOptions,
  NavigateToParams,
  Profile,
} from '@akashaorg/typings/lib/ui';
import { i18n } from 'i18next';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ReflectCard from './cards/reflect-card';
import EntryList, {
  EntryListProps,
  ScrollerState,
} from '@akashaorg/design-system-components/lib/components/EntryList';
import type { ScrollStateDBWrapper } from '../utils/scroll-state-db';
import { AkashaReflect } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useInfiniteGetReflectionsFromBeamQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { hasOwn } from '@akashaorg/ui-awf-hooks';

export type ReflectFeedProps = Omit<
  EntryListProps<AkashaReflect>,
  | 'itemCard'
  | 'isFetchingNextPage'
  | 'requestStatus'
  | 'pages'
  | 'isFetchingPreviousPage'
  | 'onFetchPreviousPage'
  | 'onFetchNextPage'
  | 'onScrollStateSave'
> & {
  beamId?: string;
  locale?: ILocale;
  onEntryFlag?: (
    entryId: string,
    itemType: EntityTypes,
    reporterEthAddress?: string | null,
  ) => () => void;
  onEntryRemove?: (entryId: string) => void;
  className?: string;
  modalSlotId: string;
  accentBorderTop?: boolean;
  trackEvent?: (data: AnalyticsEventData['data']) => void;
  totalEntryCount?: number;
  onLoginModalOpen: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loggedProfileData?: Profile;
  i18n: i18n;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
  initialScrollState?: ScrollerState;
  onScrollStateReset?: () => void;
  db: ScrollStateDBWrapper;
  scrollerOptions?: { overscan: number };
};

const ReflectFeed: React.FC<ReflectFeedProps> = props => {
  const {
    beamId,
    locale,
    itemSpacing = 8,
    i18n,
    initialScrollState,
    scrollerOptions = { overscan: 5 },
    newItemsPublishedLabel,
    onNavigate,
    onScrollStateReset,
    onScrollStateChange,
  } = props;

  //@TODO replace this hook with one handling scroll restoration
  const reflectionsReq = useInfiniteGetReflectionsFromBeamQuery('last', { id: beamId, last: 10 });
  const entryData = reflectionsReq.data?.pages?.flatMap(page =>
    hasOwn(page.node, 'reflections')
      ? page.node?.reflections.edges?.map(edge => ({
          ...edge.node,
          beam: null,
          beamID: edge.node.beam?.id,
          createdAt: new Date(), //@TODO node has missing createdAt field
        }))
      : null,
  );

  return (
    <EntryList<AkashaReflect>
      requestStatus={reflectionsReq.status}
      isFetchingNextPage={reflectionsReq.isFetchingNextPage}
      pages={entryData}
      itemSpacing={itemSpacing}
      languageDirection={i18n?.dir() || 'ltr'}
      initialScrollState={initialScrollState}
      onScrollStateReset={onScrollStateReset}
      onScrollStateChange={onScrollStateChange}
      getItemKey={(idx, items) => items[idx]['id']}
      scrollerOptions={scrollerOptions}
      onFetchNextPage={(lastCursor: string) => {
        //@TODO:
      }}
      onFetchPreviousPage={firstCursor => {
        //@TODO:
      }}
      onScrollStateSave={() => {
        //@TODO:
      }}
      newItemsPublishedLabel={newItemsPublishedLabel}
    >
      {cardProps => {
        const { items, allEntries, measureElementRef } = cardProps;
        return items.map(item => {
          const { index, key } = item;
          const entryData = allEntries[index];
          const isLoader = index > allEntries.length - 1;
          if (isLoader || reflectionsReq.isFetchingNextPage) {
            return (
              <Stack key={key} customStyle="p-8 w-full">
                <Spinner />
              </Stack>
            );
          }
          return (
            <div key={key} data-index={index} ref={measureElementRef}>
              <Divider />
              <ReflectCard
                entryData={entryData}
                locale={locale}
                //@TODO: refactor prop
                onContentClick={() =>
                  onNavigate(
                    { authorId: entryData.author.id, id: entryData.id },
                    EntityTypes.REFLECT,
                  )
                }
              />
            </div>
          );
        });
      }}
    </EntryList>
  );
};

export default ReflectFeed;
