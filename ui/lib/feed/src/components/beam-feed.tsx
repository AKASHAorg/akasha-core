import * as React from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BeamContentResolver from './beam-content-resolver';
import { AnalyticsEventData } from '@akashaorg/typings/lib/ui';
import {
  AkashaBeamEdge,
  AkashaBeamFiltersInput,
  AkashaBeamSortingInput,
  AkashaBeamStreamEdge,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EdgeArea, Virtualizer, VirtualizerProps } from '../virtual-list';
import { useBeams } from '@akashaorg/ui-awf-hooks/lib/use-beams';
import { RestoreItem } from '../virtual-list/use-scroll-state';
import { hasOwn } from '@akashaorg/ui-awf-hooks';

export type BeamFeedProps = {
  className?: string;
  trackEvent?: (data: AnalyticsEventData['data']) => void;
  scrollerOptions?: { overscan: number };
  queryKey: string;
  newItemsPublishedLabel?: string;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
  scrollTopIndicator?: VirtualizerProps<unknown>['scrollTopIndicator'];
  renderItem?: VirtualizerProps<AkashaBeamStreamEdge | AkashaBeamEdge>['renderItem'];
  estimatedHeight?: VirtualizerProps<unknown>['estimatedHeight'];
  itemSpacing?: VirtualizerProps<unknown>['itemSpacing'];
  header?: VirtualizerProps<unknown>['header'];
  footer?: VirtualizerProps<unknown>['footer'];
  loadingIndicator?: VirtualizerProps<unknown>['loadingIndicator'];
  did?: string;
  offsetTop?: number;
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
    header,
    footer,
    did,
    offsetTop,
  } = props;

  const {
    beams,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    fetchInitialData,
    onReset,
    called,
    isLoading,
    hasErrors,
    errors,
  } = useBeams({
    overscan: scrollerOptions.overscan,
    sorting,
    filters,
    did,
  });

  const lastCursors = React.useRef({ next: null, prev: null });
  const prevBeams = React.useRef([]);

  const loadingIndicatorRef = React.useRef(loadingIndicator);

  if (!loadingIndicatorRef.current) {
    loadingIndicatorRef.current = () => (
      <Stack align="center">
        <Spinner />
      </Stack>
    );
  }

  const handleInitialFetch = async (restoreItem?: RestoreItem) => {
    await fetchInitialData(restoreItem);
  };

  const handleFetch = React.useCallback(
    async (newArea: EdgeArea) => {
      switch (newArea) {
        case EdgeArea.TOP:
        case EdgeArea.NEAR_TOP:
          if (!beams.length) return;
          const firstCursor = beams[0].cursor;
          if (lastCursors.current.prev !== firstCursor) {
            lastCursors.current.prev = firstCursor;
            await fetchPreviousPage(firstCursor);
          }
          break;
        case EdgeArea.BOTTOM:
        case EdgeArea.NEAR_BOTTOM:
          if (!beams.length) return;
          const lastCursor = beams[beams.length - 1].cursor;
          if (lastCursors.current.next !== lastCursor) {
            lastCursors.current.next = lastCursor;
            await fetchNextPage(lastCursor);
          }
          break;
        default:
          break;
      }
    },
    [beams, fetchNextPage, fetchPreviousPage],
  );

  const handleReset = async () => {
    prevBeams.current = [];
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
        <Virtualizer<ReturnType<typeof useBeams>['beams'][0]>
          header={header}
          footer={footer}
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
          renderItem={
            renderItem ??
            (itemData => {
              if (!hasOwn(itemData.node, 'content')) {
                /* Set the showNSFWCard prop to false so as to prevent the
                 * NSFW beams from being displayed in the antenna feed when NSFW setting is off.
                 */
                return <BeamContentResolver beamId={itemData.node.beamID} showNSFWCard={false} />;
              }
            })
          }
          loadingIndicator={loadingIndicatorRef.current}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          offsetTop={offsetTop}
          requestStatus={{ called, isLoading }}
        />
      )}
    </>
  );
};

export default BeamFeed;
