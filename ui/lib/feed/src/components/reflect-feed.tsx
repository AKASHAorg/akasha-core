import React from 'react';
import { AnalyticsEventData, EntityTypes } from '@akashaorg/typings/lib/ui';
import { ILocale } from '@akashaorg/design-system-components/lib/utils/time';
import {
  AkashaReflectEdge,
  AkashaReflectFiltersInput,
  AkashaReflectSortingInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EdgeArea, Virtualizer, VirtualizerProps } from '../virtual-list';
import { useReflections } from '@akashaorg/ui-awf-hooks/lib/use-reflections';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';

export type ReflectFeedProps = {
  reflectionsOf: { entryId: string; itemType: EntityTypes };
  locale?: ILocale;
  scrollerOptions?: { overscan: number };
  trackEvent?: (data: AnalyticsEventData['data']) => void;
  itemSpacing?: number;
  newItemsPublishedLabel?: string;
  queryKey: string;
  estimatedHeight: number;
  scrollTopIndicator: VirtualizerProps<unknown>['scrollTopIndicator'];
  renderItem: VirtualizerProps<AkashaReflectEdge>['renderItem'];
  filters?: AkashaReflectFiltersInput;
  sorting?: AkashaReflectSortingInput;
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
  } = props;

  const isReflectOfReflection = reflectionsOf.itemType === EntityTypes.REFLECT;

  const { reflections, fetchInitialData, fetchPreviousPage, fetchNextPage, hasErrors, errors } =
    useReflections({
      entityId: reflectionsOf.entryId,
      entityType: reflectionsOf.itemType,
      overscan: scrollerOptions.overscan,
      filters,
      sorting,
    });
  const lastCursors = React.useRef({ next: null, prev: null });
  const isLoading = React.useRef(false);

  const handleInitialFetch = async (cursors?: string[]) => {
    if (cursors.length) {
      lastCursors.current.prev = cursors[cursors.length - 1];
    }
    isLoading.current = true;
    await fetchInitialData(cursors);
  };

  const handleFetch = async (newArea: EdgeArea) => {
    switch (newArea) {
      case EdgeArea.TOP:
      case EdgeArea.NEAR_TOP:
        if (!reflections.length) return;
        const firstCursor = reflections[0].cursor;
        if (lastCursors.current.prev !== firstCursor && !isLoading.current) {
          isLoading.current = true;
          await fetchPreviousPage(firstCursor);
          lastCursors.current.prev = firstCursor;
        }
        break;
      case EdgeArea.BOTTOM:
      case EdgeArea.NEAR_BOTTOM:
        if (!reflections.length) return;
        const lastCursor = reflections[reflections.length - 1].cursor;
        if (lastCursors.current.next !== lastCursor && !isLoading.current) {
          isLoading.current = true;
          await fetchNextPage(lastCursor);
          lastCursors.current.next = lastCursor;
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
          restorationKey={queryKey}
          itemSpacing={itemSpacing}
          estimatedHeight={estimatedHeight}
          overscan={scrollerOptions.overscan}
          items={reflections}
          onFetchInitialData={handleInitialFetch}
          itemKeyExtractor={item => item.cursor}
          itemIndexExtractor={itemKey => reflections.findIndex(p => p.cursor === itemKey)}
          onListReset={() => Promise.resolve()}
          onEdgeDetectorChange={handleFetch}
          scrollTopIndicator={scrollTopIndicator}
          renderItem={renderItem}
        />
      )}
    </>
  );
};

export default ReflectFeed;
