import React, { useEffect, useRef } from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BeamContentResolver from './beam-content-resolver';
import DynamicInfiniteScroll from '@akashaorg/design-system-components/lib/components/DynamicInfiniteScroll';
import getSDK from '@akashaorg/awf-sdk';
import { AnalyticsEventData } from '@akashaorg/typings/lib/ui';
import {
  AkashaBeamEdge,
  AkashaBeamFiltersInput,
  AkashaBeamSortingInput,
  AkashaBeamStreamEdge,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { VirtualizerProps } from '../virtual-list';
import { hasOwn, useAkashaStore, useNsfwToggling } from '@akashaorg/ui-awf-hooks';
import { useGetBeamStreamLazyQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { getNsfwFiltersBeamFeed } from '../utils';

export type BeamFeedProps = {
  queryKey: string;
  newItemsPublishedLabel?: string;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
  estimatedHeight?: number;
  itemSpacing?: number;
  scrollOptions?: {
    overScan: number;
  };
  scrollTopIndicator?: VirtualizerProps<unknown>['scrollTopIndicator'];
  renderItem?: (props: AkashaBeamStreamEdge | AkashaBeamEdge) => React.ReactNode;
  trackEvent?: (data: AnalyticsEventData['data']) => void;
  loadingIndicator?: VirtualizerProps<unknown>['loadingIndicator'];
};

const BeamFeed = (props: BeamFeedProps) => {
  const {
    filters,
    sorting,
    estimatedHeight = 350,
    itemSpacing,
    scrollOptions = { overScan: 10 },
    loadingIndicator,
  } = props;
  const indexingDID = React.useRef(getSDK().services.gql.indexingDID);
  const [fetchBeam, beamQuery] = useGetBeamStreamLazyQuery();
  const beamStream = React.useMemo(() => {
    if (
      beamQuery.data &&
      hasOwn(beamQuery.data, 'node') &&
      beamQuery.data.node &&
      hasOwn(beamQuery.data.node, 'akashaBeamStreamList')
    ) {
      return beamQuery.data.node?.akashaBeamStreamList;
    }
  }, [beamQuery.data]);
  const beams = React.useMemo(() => beamStream?.edges || [], [beamStream]);
  const pageInfo = React.useMemo(() => {
    return beamStream?.pageInfo;
  }, [beamStream]);
  const loadingIndicatorRef = React.useRef(loadingIndicator);
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const { showNsfw } = useNsfwToggling();
  const isLoggedIn = !!authenticatedDID;
  const nsfwFilters = useRef(getNsfwFiltersBeamFeed({ showNsfw, isLoggedIn, filters }));

  useEffect(() => {
    fetchBeam({
      variables: {
        first: 10,
        sorting: { createdAt: SortOrder.Desc, ...sorting },
        indexer: indexingDID.current,
        filters: nsfwFilters.current,
      },
      fetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    });
  }, [fetchBeam, nsfwFilters, sorting]);

  if (!loadingIndicatorRef.current) {
    loadingIndicatorRef.current = () => (
      <Stack align="center">
        <Spinner />
      </Stack>
    );
  }

  return (
    <>
      {beamQuery.loading && loadingIndicatorRef.current()}
      {beamQuery.error && (
        <ErrorLoader
          type="script-error"
          title={'Sorry, there was an error when fetching beams'}
          details={<>{beamQuery.error.message}</>}
        />
      )}
      {beams && (
        <DynamicInfiniteScroll
          totalElements={beams.length}
          itemHeight={estimatedHeight}
          overScan={scrollOptions.overScan}
          itemSpacing={itemSpacing}
          hasNextPage={pageInfo && pageInfo.hasNextPage}
          loading={beamQuery.loading}
          onLoadMore={async () => {
            const lastCursor = beams[beams.length - 1]?.cursor;
            if (beamQuery.loading || beamQuery.error || !lastCursor) return;
            if (lastCursor) {
              await beamQuery.fetchMore({
                variables: {
                  after: lastCursor,
                  sorting: { createdAt: SortOrder.Desc },
                  indexer: indexingDID.current,
                },
              });
            }
          }}
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
