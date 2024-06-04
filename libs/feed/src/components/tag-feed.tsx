import React, { ReactElement, useEffect, useRef } from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import DynamicInfiniteScroll from '@akashaorg/design-system-components/lib/components/DynamicInfiniteScroll';
import getSDK from '@akashaorg/awf-sdk';
import { useTranslation } from 'react-i18next';
import { AnalyticsEventData } from '@akashaorg/typings/lib/ui';
import {
  SortOrder,
  AkashaIndexedStreamFiltersInput,
  AkashaIndexedStreamStreamType,
  AkashaIndexedStreamEdge,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { hasOwn, useAkashaStore, useNsfwToggling } from '@akashaorg/ui-awf-hooks';
import { getNsfwFiltersTagFeed } from '../utils';
import { useGetIndexedStreamLazyQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

export type TagFeedProps = {
  queryKey: string;
  estimatedHeight: number;
  itemSpacing?: number;
  scrollOptions?: {
    overScan: number;
  };
  tags: string[];
  scrollTopIndicator?: (listRect: DOMRect, onScrollToTop: () => void) => React.ReactNode;
  loadingIndicator?: () => React.ReactElement;
  renderItem: (data?: Omit<AkashaIndexedStreamEdge['node'], 'id'>) => ReactElement;
  trackEvent?: (data: AnalyticsEventData['data']) => void;
};

const TagFeed = (props: TagFeedProps) => {
  const {
    queryKey,
    estimatedHeight = 150,
    itemSpacing,
    scrollOptions = { overScan: 10 },
    tags,
    loadingIndicator,
    renderItem,
  } = props;

  const { t } = useTranslation('ui-lib-feed');
  const sdkRef = useRef(getSDK());
  const indexingDID = React.useRef(sdkRef.current.services.gql.indexingDID);
  const { showNsfw } = useNsfwToggling();
  const {
    data: { authenticatedDID, isAuthenticating },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const [fetchIndexedStream, indexedStreamQuery] = useGetIndexedStreamLazyQuery();
  const indexedBeamStream = React.useMemo(() => {
    if (
      indexedStreamQuery.data?.node &&
      hasOwn(indexedStreamQuery.data.node, 'akashaIndexedStreamList')
    ) {
      return indexedStreamQuery.data.node?.akashaIndexedStreamList;
    }
  }, [indexedStreamQuery.data]);
  const beams = React.useMemo(() => indexedBeamStream?.edges || [], [indexedBeamStream]);
  const pageInfo = React.useMemo(() => {
    return indexedBeamStream?.pageInfo;
  }, [indexedBeamStream]);
  const mergedFilters: AkashaIndexedStreamFiltersInput[] = React.useMemo(() => {
    const nsfwFilters = getNsfwFiltersTagFeed({ queryKey, showNsfw, isLoggedIn });

    const tagsFilters = {
      or: tags?.map(_tag => ({ where: { indexValue: { equalTo: _tag } } })) || [],
    };
    const defaultFilters: AkashaIndexedStreamFiltersInput[] = [
      { where: { streamType: { equalTo: AkashaIndexedStreamStreamType.Beam } } },
      { where: { indexType: { equalTo: sdkRef.current.services.gql.labelTypes.TAG } } },
      { where: { active: { equalTo: true } } },
      tagsFilters,
    ];
    if (nsfwFilters) {
      defaultFilters.push(nsfwFilters);
    }
    return defaultFilters;
  }, [isLoggedIn, queryKey, showNsfw, tags]);

  useEffect(() => {
    fetchIndexedStream({
      variables: {
        indexer: indexingDID.current,
        first: 10,
        sorting: { createdAt: SortOrder.Desc },
        filters: {
          and: mergedFilters,
        },
      },
    });
  }, [fetchIndexedStream, mergedFilters]);

  const loadingIndicatorRef = React.useRef(loadingIndicator);

  if (!loadingIndicatorRef.current) {
    loadingIndicatorRef.current = () => (
      <Stack align="center">
        <Spinner />
      </Stack>
    );
  }

  const emptyListCard = (
    <Stack customStyle="mt-8">
      <InfoCard
        titleLabel={
          <>
            {t('There is no content found for the ')}
            {t('{{topic}}', { topic: tags.length > 1 ? 'topics' : 'topic' })}{' '}
            {tags.map(tag => (
              <span key={tag}>#{tag} </span>
            ))}
          </>
        }
        bodyLabel={
          <>
            {t('Be the first one to create a beam for this topic')}
            {'! 🚀'}
          </>
        }
        bodyVariant="body1"
        assetName="longbeam-notfound"
      />
    </Stack>
  );

  if (isAuthenticating) return <>{loadingIndicatorRef.current()}</>;

  if (!indexedStreamQuery.error && !indexedStreamQuery.loading && !beams.length)
    return <>{emptyListCard}</>;

  return (
    <>
      {indexedStreamQuery.loading && beams.length === 0 && loadingIndicatorRef.current()}
      {indexedStreamQuery.error && (
        <ErrorLoader
          type="script-error"
          title={'Sorry, there was an error when fetching beams'}
          details={<>{indexedStreamQuery.error.message}</>}
        />
      )}
      {beams.length > 0 && (
        <DynamicInfiniteScroll
          count={beams.length}
          estimatedHeight={estimatedHeight}
          overScan={scrollOptions.overScan}
          itemSpacing={itemSpacing}
          hasNextPage={pageInfo && pageInfo.hasNextPage}
          loading={indexedStreamQuery.loading}
          onLoadMore={async () => {
            const lastCursor = beams[beams.length - 1]?.cursor;
            if (indexedStreamQuery.loading || indexedStreamQuery.error || !lastCursor) return;
            if (lastCursor) {
              await indexedStreamQuery.fetchMore({
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
            return renderItem(beam.node);
          }}
        </DynamicInfiniteScroll>
      )}
    </>
  );
};

export default TagFeed;
