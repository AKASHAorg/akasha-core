import React from 'react';
import { AnalyticsEventData, EntityTypes, type ReflectEntryData } from '@akashaorg/typings/lib/ui';
import {
  AkashaReflectEdge,
  AkashaReflectFiltersInput,
  AkashaReflectSortingInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EdgeArea, Virtualizer, VirtualizerProps } from '../virtual-list';
import { useReflections } from '@akashaorg/ui-awf-hooks/lib/use-reflections';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { createReactiveVar } from '@akashaorg/ui-awf-hooks';

export type ReflectFeedProps = {
  reflectionsOf: { entryId: string; itemType: EntityTypes };
  locale?: string;
  scrollerOptions?: { overscan: number };
  trackEvent?: (data: AnalyticsEventData['data']) => void;
  itemSpacing?: number;
  newItemsPublishedLabel?: string;
  queryKey: string;
  estimatedHeight: number;
  scrollTopIndicator?: VirtualizerProps<unknown>['scrollTopIndicator'];
  renderItem: VirtualizerProps<AkashaReflectEdge>['renderItem'];
  filters?: AkashaReflectFiltersInput;
  sorting?: AkashaReflectSortingInput;
  loadingIndicator?: VirtualizerProps<unknown>['loadingIndicator'];
  header?: VirtualizerProps<unknown>['header'];
  footer?: VirtualizerProps<unknown>['footer'];
  pendingReflectionsVar?: ReturnType<typeof createReactiveVar<ReflectEntryData[]>>;
};

const ReflectFeed: React.FC<ReflectFeedProps> = props => {
  const {
    reflectionsOf,
    itemSpacing = 8,
    scrollerOptions = { overscan: 5 },
    newItemsPublishedLabel,
    queryKey,
    estimatedHeight,
    scrollTopIndicator,
    renderItem,
    filters,
    sorting,
    header,
    footer,
    pendingReflectionsVar,
  } = props;

  // const isReflectOfReflection = reflectionsOf.itemType === EntityTypes.REFLECT;

  const {
    reflections,
    hasNextPage,
    hasPreviousPage,
    fetchInitialData,
    fetchPreviousPage,
    fetchNextPage,
    hasErrors,
    errors,
    called,
    isLoading,
  } = useReflections({
    entityId: reflectionsOf.entryId,
    entityType: reflectionsOf.itemType,
    overscan: scrollerOptions.overscan,
    filters,
    sorting,
    pendingReflectionsVar,
  });
  const lastCursors = React.useRef({ next: null, prev: null });

  const handleInitialFetch = async (restoreItem?: { key: string; offsetTop: number }) => {
    await fetchInitialData(restoreItem);
  };

  const handleFetch = async (newArea: EdgeArea) => {
    switch (newArea) {
      case EdgeArea.TOP:
      case EdgeArea.NEAR_TOP:
        if (!reflections.length) return;
        const firstCursor = reflections[0].cursor;
        if (lastCursors.current.prev !== firstCursor) {
          lastCursors.current.prev = firstCursor;
          await fetchPreviousPage(firstCursor);
        }
        break;
      case EdgeArea.BOTTOM:
      case EdgeArea.NEAR_BOTTOM:
        if (!reflections.length) return;
        const lastCursor = reflections[reflections.length - 1].cursor;
        if (lastCursors.current.next !== lastCursor) {
          lastCursors.current.next = lastCursor;
          await fetchNextPage(lastCursor);
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      {hasErrors && (
        <ErrorLoader
          type="script-error"
          title={'Sorry, there was an error when fetching beams'}
          details={<>{errors}</>}
        />
      )}
      {!hasErrors && (
        <Virtualizer<AkashaReflectEdge>
          requestStatus={{ called, isLoading }}
          restorationKey={queryKey}
          itemSpacing={itemSpacing}
          estimatedHeight={estimatedHeight}
          overscan={scrollerOptions.overscan}
          items={reflections}
          onFetchInitialData={handleInitialFetch}
          itemKeyExtractor={item => item.cursor}
          itemIndexExtractor={item => reflections.findIndex(p => p.cursor === item.cursor)}
          onListReset={() => Promise.resolve()}
          onEdgeDetectorChange={handleFetch}
          scrollTopIndicator={scrollTopIndicator}
          renderItem={renderItem}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          header={header}
          footer={footer}
        />
      )}
    </>
  );
};

export default ReflectFeed;
