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
  AkashaBeamStreamFiltersInput,
  AkashaBeamStreamModerationStatus,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EdgeArea, Virtualizer, VirtualizerProps } from '../virtual-list';
import { RestoreItem } from '../virtual-list/use-scroll-state';
import { hasOwn, useGetLogin, useNsfwToggling } from '@akashaorg/ui-awf-hooks';
import { useBeams } from '@akashaorg/ui-awf-hooks/lib/use-beams';

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

  const { showNsfw } = useNsfwToggling();
  const { data: loginData, loading: authenticating } = useGetLogin();
  const isLoggedIn = !!loginData?.id;

  let nsfwFilters;

  /**
   * Set the filter for logged-out users and users who toggled off nsfw content.
   **/
  if (!did && (!showNsfw || !isLoggedIn)) {
    nsfwFilters = {
      ...filters,
      or: [
        { where: { status: { equalTo: AkashaBeamStreamModerationStatus.Ok } } },
        { where: { status: { isNull: true } } },
      ],
    } as AkashaBeamStreamFiltersInput;
  }

  /**
   * Set the filter for users who are logged in and want to see nsfw content.
   **/
  if (!did && showNsfw && isLoggedIn) {
    nsfwFilters = {
      ...filters,
      or: [
        {
          where: {
            status: {
              in: [AkashaBeamStreamModerationStatus.Ok, AkashaBeamStreamModerationStatus.Nsfw],
            },
          },
        },
        { where: { status: { isNull: true } } },
      ],
    } as AkashaBeamStreamFiltersInput;
  }

  const {
    beams,
    beamCursors,
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
    filters: nsfwFilters,
    did,
  });

  React.useEffect(() => {
    /**
     * Reset the beamCursors in case the user logs out and has the NSFW setting on
     * so as to be able to accept the updated data in the `extractData` function
     *  when the hook refetches again (Specificallly for dealing with the filter condition
     *  `!beamCursors.has(edge.cursor)` inside the extractData function inside the hook
     *  because if not resetted, no data will be extracted
     * from the function because the existing beamCursors will contain the data.cursor) and
     * therefore the feed doesn't get updated correctly sometimes with nsfw content after
     * toggling the settings on).
     * Maybe a better approach?
     **/
    if (!authenticating && showNsfw) {
      beamCursors.clear();
      fetchInitialData();
    }
  }, [authenticating, showNsfw]);

  React.useEffect(() => {
    /**
     * Everytime the NSFW setting changes, refetch.
     **/
    fetchInitialData();
  }, [showNsfw]);

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
