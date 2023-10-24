import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import EditableReflection from './editable-reflection';
import EntryList, {
  EntryListProps,
  ScrollerState,
} from '@akashaorg/design-system-components/lib/components/EntryList';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import {
  AnalyticsEventData,
  EntityTypes,
  IContentClickDetails,
  ModalNavigationOptions,
  Profile,
} from '@akashaorg/typings/lib/ui';
import { i18n } from 'i18next';
import { AkashaReflect, SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useInfiniteGetReflectionsFromBeamQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import type { ScrollStateDBWrapper } from '../utils/scroll-state-db';
import type { FeedWidgetCommonProps } from './app';

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
  className?: string;
  modalSlotId: string;
  accentBorderTop?: boolean;
  totalEntryCount?: number;
  loggedProfileData?: Profile;
  i18n: i18n;
  initialScrollState?: ScrollerState;
  db: ScrollStateDBWrapper;
  scrollerOptions?: FeedWidgetCommonProps['scrollerOptions'];
  onEntryFlag?: (
    entryId: string,
    itemType: EntityTypes,
    reporterEthAddress?: string | null,
  ) => () => void;
  onEntryRemove?: (entryId: string) => void;
  trackEvent?: (data: AnalyticsEventData['data']) => void;
  onLoginModalOpen: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
  onScrollStateReset?: () => void;
};

const ReflectFeed: React.FC<ReflectFeedProps> = props => {
  const {
    beamId,
    itemSpacing = 8,
    i18n,
    initialScrollState,
    scrollerOptions = { overscan: 5 },
    newItemsPublishedLabel,
    onNavigate,
    onScrollStateReset,
    onScrollStateChange,
  } = props;

  //@TODO replace this hook with one handling virtual list
  const reflectionsReq = useInfiniteGetReflectionsFromBeamQuery(
    'sorting',
    {
      id: beamId,
      first: 10,
      sorting: {
        createdAt: SortOrder.Desc,
      },
    },
    {
      select: data => {
        return {
          pages: data.pages,
          pageParams: data.pageParams,
        };
      },
    },
  );
  const entryData = reflectionsReq.data?.pages?.flatMap(page =>
    hasOwn(page.node, 'reflections')
      ? page.node?.reflections.edges?.map(edge => ({
          ...edge.node,
          beam: null /*Note: the hook returns partial result for beam, if complete result is needed the result of the hook should be modified*/,
          beamID: edge.node.beam?.id,
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
              {!entryData && <EntryCardLoading />}
              {entryData && (
                <>
                  <Divider />
                  <EditableReflection
                    entryData={entryData}
                    onReflect={() => {
                      onNavigate(
                        {
                          authorId: entryData?.author.id,
                          id: entryData?.id,
                          reflect: true,
                        },
                        EntityTypes.REFLECT,
                      );
                    }}
                    onContentClick={() =>
                      onNavigate(
                        { authorId: entryData.author.id, id: entryData.id },
                        EntityTypes.REFLECT,
                      )
                    }
                  />
                </>
              )}
            </div>
          );
        });
      }}
    </EntryList>
  );
};

export default ReflectFeed;
