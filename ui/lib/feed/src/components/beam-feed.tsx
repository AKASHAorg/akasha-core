import * as React from 'react';
import { AnalyticsEventData } from '@akashaorg/typings/lib/ui';
import {
  AkashaBeamEdge,
  AkashaBeamFiltersInput,
  AkashaBeamSortingInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EdgeArea, Virtualizer, VirtualizerProps } from '../virtual-list';
import { useBeams } from '@akashaorg/ui-awf-hooks/lib/use-beams';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { RestoreItem } from '../virtual-list/use-scroll-state';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';

export type BeamFeedProps = {
  className?: string;
  trackEvent?: (data: AnalyticsEventData['data']) => void;
  scrollerOptions?: { overscan: number };
  queryKey: string;
  newItemsPublishedLabel?: string;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
  scrollTopIndicator?: VirtualizerProps<unknown>['scrollTopIndicator'];
  renderItem: VirtualizerProps<AkashaBeamEdge>['renderItem'];
  estimatedHeight?: VirtualizerProps<unknown>['estimatedHeight'];
  itemSpacing?: VirtualizerProps<unknown>['itemSpacing'];
  header?: VirtualizerProps<unknown>['header'];
  loadingIndicator?: VirtualizerProps<unknown>['loadingIndicator'];
};

const BeamFeed = (props: BeamFeedProps) => {
  const {
    scrollerOptions = { overscan: 5 },
    filters,
    sorting,
    scrollTopIndicator,
    renderItem,
    queryKey,
    estimatedHeight = 150,
    itemSpacing,
    loadingIndicator,
  } = props;

  const { beams, fetchNextPage, fetchPreviousPage, fetchInitialData, onReset, hasErrors, errors } =
    useBeams({
      overscan: scrollerOptions.overscan,
      sorting,
      filters,
    });

  const lastCursors = React.useRef({ next: null, prev: null });
  const isLoading = React.useRef(false);
  const prevBeams = React.useRef([]);

  const loadingIndicatorRef = React.useRef(loadingIndicator);

  if (!loadingIndicatorRef.current) {
    loadingIndicatorRef.current = () => <Spinner />;
  }

  React.useEffect(() => {
    if (beams !== prevBeams.current) {
      isLoading.current = false;
    }
    prevBeams.current = beams;
  }, [beams]);

  const handleInitialFetch = async (restoreItem?: RestoreItem) => {
    isLoading.current = true;
    await fetchInitialData(restoreItem);
  };

  const handleFetch = async (newArea: EdgeArea) => {
    switch (newArea) {
      case EdgeArea.TOP:
      case EdgeArea.NEAR_TOP:
        if (!beams.length) return;
        const firstCursor = beams[0].cursor;
        if (lastCursors.current.prev !== firstCursor && !isLoading.current) {
          isLoading.current = true;
          await fetchPreviousPage(firstCursor);
          lastCursors.current.prev = firstCursor;
        }
        break;
      case EdgeArea.BOTTOM:
      case EdgeArea.NEAR_BOTTOM:
        if (!beams.length) return;
        const lastCursor = beams[beams.length - 1].cursor;
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

  const handleReset = async () => {
    prevBeams.current = [];
    isLoading.current = true;
    lastCursors.current = { next: null, prev: null };
    await onReset();
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
        <Virtualizer<AkashaBeamEdge>
          restorationKey={queryKey}
          itemSpacing={itemSpacing}
          estimatedHeight={estimatedHeight}
          overscan={scrollerOptions.overscan}
          items={beams}
          onFetchInitialData={handleInitialFetch}
          itemKeyExtractor={item => item.cursor}
          itemIndexExtractor={item => beams.findIndex(p => p.cursor === item.cursor)}
          onListReset={handleReset}
          onEdgeDetectorChange={handleFetch}
          scrollTopIndicator={scrollTopIndicator}
          renderItem={renderItem}
          loadingIndicator={loadingIndicatorRef.current}
        />
      )}
    </>
  );
};

export default BeamFeed;
