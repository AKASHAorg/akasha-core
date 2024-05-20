import React, { useEffect } from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BeamContentResolver from './beam-content-resolver';
import DynamicInfiniteScroll from '@akashaorg/design-system-components/lib/components/DynamicInfiniteScroll';
import getSDK from '@akashaorg/awf-sdk';
import { AnalyticsEventData } from '@akashaorg/typings/lib/ui';
import {
  AkashaBeamFiltersInput,
  AkashaBeamSortingInput,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { VirtualizerProps } from '../virtual-list';
import { hasOwn, useAkashaStore, useNsfwToggling } from '@akashaorg/ui-awf-hooks';
import { useGetBeamStreamLazyQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { getNsfwFiltersBeamFeed } from '../utils';

export type BeamFeedProps = {
  scrollRestorationStorageKey: string;
  newItemsPublishedLabel?: string;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
  estimatedHeight?: number;
  itemSpacing?: number;
  scrollOptions?: {
    overScan: number;
  };
  scrollTopIndicator?: VirtualizerProps<unknown>['scrollTopIndicator'];

  trackEvent?: (data: AnalyticsEventData['data']) => void;
  loadingIndicator?: VirtualizerProps<unknown>['loadingIndicator'];
};

const BeamFeed = (props: BeamFeedProps) => {
  const {
    scrollRestorationStorageKey,
    filters,
    sorting,
    estimatedHeight = 350,
    itemSpacing,
    scrollOptions = { overScan: 10 },
    loadingIndicator,
  } = props;
  const indexingDID = React.useRef(getSDK().services.gql.indexingDID);
  const [fetchBeamStream, beamStreamQuery] = useGetBeamStreamLazyQuery();
  const beamStream = React.useMemo(() => {
    if (
      beamStreamQuery.data &&
      hasOwn(beamStreamQuery.data, 'node') &&
      beamStreamQuery.data.node &&
      hasOwn(beamStreamQuery.data.node, 'akashaBeamStreamList')
    ) {
      return beamStreamQuery.data.node?.akashaBeamStreamList;
    }
  }, [beamStreamQuery.data]);
  const beams = React.useMemo(() => beamStream?.edges || [], [beamStream]);
  const pageInfo = React.useMemo(() => {
    return beamStream?.pageInfo;
  }, [beamStream]);
  const loadingIndicatorRef = React.useRef(loadingIndicator);
  const {
    data: { authenticatedDID, isAuthenticating },
  } = useAkashaStore();
  const { showNsfw } = useNsfwToggling();
  const isLoggedIn = !!authenticatedDID;

  useEffect(() => {
    const nsfwFilters = getNsfwFiltersBeamFeed({
      showNsfw,
      isLoggedIn,
      filters,
    });
    fetchBeamStream({
      variables: {
        first: 10,
        sorting: { createdAt: SortOrder.Desc, ...sorting },
        indexer: indexingDID.current,
        filters: nsfwFilters,
      },
      fetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    });
  }, [fetchBeamStream, filters, isLoggedIn, showNsfw, sorting]);

  if (!loadingIndicatorRef.current) {
    loadingIndicatorRef.current = () => (
      <Stack align="center">
        <Spinner />
      </Stack>
    );
  }

  if (isAuthenticating) return <>{loadingIndicatorRef.current()}</>;

  return (
    <>
      {beamStreamQuery.loading && beams.length === 0 && loadingIndicatorRef.current()}
      {beamStreamQuery.error && (
        <ErrorLoader
          type="script-error"
          title={'Sorry, there was an error when fetching beams'}
          details={<>{beamStreamQuery.error.message}</>}
        />
      )}
      {beams && (
        <DynamicInfiniteScroll
          count={beams.length}
          scrollRestorationStorageKey={scrollRestorationStorageKey}
          scrollRestorationKeys={beams.map(beam => beam?.node?.beamID)}
          itemHeight={estimatedHeight}
          overScan={scrollOptions.overScan}
          itemSpacing={itemSpacing}
          hasNextPage={pageInfo && pageInfo.hasNextPage}
          loading={beamStreamQuery.loading}
          onLoadMore={async () => {
            const lastCursor = beams[beams.length - 1]?.cursor;
            if (beamStreamQuery.loading || beamStreamQuery.error || !lastCursor) return;
            if (lastCursor) {
              await beamStreamQuery.fetchMore({
                variables: {
                  after: lastCursor,
                  sorting: { createdAt: SortOrder.Desc },
                  indexer: indexingDID.current,
                },
              });
            }
          }}
          customStyle="mb-4"
        >
          {({ itemIndex }) => {
            const beam = beams[itemIndex];
            if (!hasOwn(beam.node, 'content')) {
              /* Set the showNSFWCard prop to false so as to prevent the
               * NSFW beams from being displayed in the antenna feed when NSFW setting is off.
               */
              return <BeamContentResolver beamId={beam.node.beamID} showNSFWCard={false} />;
            }
          }}
        </DynamicInfiniteScroll>
      )}
    </>
  );
};

export default BeamFeed;
