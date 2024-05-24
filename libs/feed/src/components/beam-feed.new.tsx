import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BeamContentResolver from './beam-content-resolver';
import DynamicInfiniteScroll from '@akashaorg/design-system-components/lib/components/DynamicInfiniteScroll';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import getSDK from '@akashaorg/awf-sdk';
import { AnalyticsEventData } from '@akashaorg/typings/lib/ui';
import {
  AkashaBeamFiltersInput,
  AkashaBeamSortingInput,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { VirtualizerProps } from '../virtual-list';
import { hasOwn, useAkashaStore, useNsfwToggling } from '@akashaorg/ui-awf-hooks';
import {
  useGetBeamStreamLazyQuery,
  GetBeamStreamDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { getNsfwFiltersBeamFeed } from '../utils';
import { useApolloClient } from '@apollo/client';
import { GetBeamStreamQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

export type BeamFeedProps = {
  scrollRestorationStorageKey: string;
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
    estimatedHeight = 150,
    itemSpacing,
    scrollOptions = { overScan: 10 },
    loadingIndicator,
  } = props;
  const indexingDID = React.useRef(getSDK().services.gql.indexingDID);
  const [fetchBeamStream, beamStreamQuery] = useGetBeamStreamLazyQuery();
  const beamStream = React.useMemo(() => {
    if (beamStreamQuery.data?.node && hasOwn(beamStreamQuery.data.node, 'akashaBeamStreamList')) {
      return beamStreamQuery.data.node?.akashaBeamStreamList;
    }
  }, [beamStreamQuery.data]);
  const beams = React.useMemo(() => beamStream?.edges || [], [beamStream]);
  const pageInfo = React.useMemo(() => {
    return beamStream?.pageInfo;
  }, [beamStream]);
  const {
    data: { authenticatedDID, isAuthenticating },
  } = useAkashaStore();
  const { showNsfw } = useNsfwToggling();
  const isLoggedIn = !!authenticatedDID;
  const nsfwFilters = useMemo(
    () =>
      getNsfwFiltersBeamFeed({
        showNsfw,
        isLoggedIn,
        filters,
      }),
    [filters, isLoggedIn, showNsfw],
  );
  const loadingIndicatorRef = useRef(loadingIndicator);
  const variables = useMemo(
    () => ({
      first: 10,
      sorting: { createdAt: SortOrder.Desc, ...sorting },
      indexer: indexingDID.current,
      filters: nsfwFilters,
    }),
    [nsfwFilters, sorting],
  );
  const hasLatestBeamsRef = useRef(false);
  const vListContainerRef = useRef<HTMLDivElement>(null);
  const vListContainerOffset = useRef(null);
  const apolloClientRef = useRef(useApolloClient());

  useLayoutEffect(() => {
    vListContainerOffset.current = vListContainerRef.current?.offsetTop ?? 0;
  }, []);

  useEffect(() => {
    fetchBeamStream({
      variables,
      fetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    });
  }, [fetchBeamStream, variables]);

  const onLoadNewest = useCallback(() => {
    fetchBeamStream({
      variables,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    });
  }, [fetchBeamStream, variables]);

  useEffect(() => {
    if (pageInfo?.startCursor) {
      apolloClientRef.current
        .query<GetBeamStreamQuery>({
          query: GetBeamStreamDocument,
          variables,
          fetchPolicy: 'no-cache',
        })
        .then(result => {
          if (result.data?.node && hasOwn(result.data.node, 'akashaBeamStreamList')) {
            const latestPageInfo = result.data.node.akashaBeamStreamList?.pageInfo;
            if (latestPageInfo && latestPageInfo.startCursor !== pageInfo.startCursor) {
              if (scrollY <= vListContainerOffset.current) {
                onLoadNewest();
                return;
              }
              hasLatestBeamsRef.current = true;
            }
          }
        });
    }
  }, [onLoadNewest, pageInfo?.startCursor, variables]);

  React.useEffect(() => {
    const onScroll = () => {
      if (hasLatestBeamsRef.current && scrollY <= vListContainerOffset.current) {
        onLoadNewest();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [onLoadNewest]);

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
        <Card ref={vListContainerRef} type="plain">
          <DynamicInfiniteScroll
            count={beams.length}
            scrollRestorationStorageKey={scrollRestorationStorageKey}
            enableScrollRestoration={true}
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
        </Card>
      )}
    </>
  );
};

export default BeamFeed;
