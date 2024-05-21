import React, { useEffect } from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import DynamicInfiniteScroll from '@akashaorg/design-system-components/lib/components/DynamicInfiniteScroll';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import getSDK from '@akashaorg/awf-sdk';
import { AnalyticsEventData, EntityTypes } from '@akashaorg/typings/lib/ui';
import {
  AkashaReflectStreamFiltersInput,
  AkashaReflectStreamSortingInput,
  AkashaReflectStreamEdge,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { VirtualizerProps } from '../virtual-list';
import { useGetReflectionStreamLazyQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { hasOwn, useAkashaStore } from '@akashaorg/ui-awf-hooks';

export type ReflectFeedProps = {
  scrollRestorationStorageKey: string;
  itemType: EntityTypes;
  newItemsPublishedLabel?: string;
  filters?: AkashaReflectStreamFiltersInput;
  sorting?: AkashaReflectStreamSortingInput;
  estimatedHeight: number;
  itemSpacing?: number;
  scrollOptions?: {
    overScan: number;
  };
  scrollTopIndicator?: VirtualizerProps<unknown>['scrollTopIndicator'];
  renderItem?: (data?: AkashaReflectStreamEdge['node']) => void;
  trackEvent?: (data: AnalyticsEventData['data']) => void;
  loadingIndicator?: VirtualizerProps<unknown>['loadingIndicator'];
};

const ReflectFeed: React.FC<ReflectFeedProps> = props => {
  const {
    scrollRestorationStorageKey,
    itemType,
    filters,
    sorting,
    estimatedHeight = 350,
    itemSpacing,
    scrollOptions = { overScan: 10 },
    loadingIndicator,
    renderItem,
  } = props;

  const indexingDID = React.useRef(getSDK().services.gql.indexingDID);
  const [fetchReflectionStream, reflectionStreamQuery] = useGetReflectionStreamLazyQuery();
  const reflectionStream = React.useMemo(() => {
    if (
      reflectionStreamQuery.data &&
      hasOwn(reflectionStreamQuery.data, 'node') &&
      reflectionStreamQuery.data.node &&
      hasOwn(reflectionStreamQuery.data.node, 'akashaReflectStreamList')
    ) {
      return reflectionStreamQuery.data.node?.akashaReflectStreamList;
    }
  }, [reflectionStreamQuery.data]);

  const reflections = React.useMemo(() => {
    if (reflectionStream) {
      if (itemType === EntityTypes.BEAM) {
        return reflectionStream?.edges?.filter(edge => edge.node.replyTo === null) || [];
      }

      if (itemType === EntityTypes.REFLECT) {
        return reflectionStream?.edges?.filter(edge => edge.node.replyTo !== null) || [];
      }
    }
    return [];
  }, [itemType, reflectionStream]);
  const pageInfo = React.useMemo(() => {
    return reflectionStream?.pageInfo;
  }, [reflectionStream]);
  const loadingIndicatorRef = React.useRef(loadingIndicator);
  const {
    data: { isAuthenticating },
  } = useAkashaStore();

  useEffect(() => {
    fetchReflectionStream({
      variables: {
        first: 10,
        sorting: { createdAt: SortOrder.Desc, ...sorting },
        indexer: indexingDID.current,
        filters,
      },
      fetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    });
  }, [fetchReflectionStream, filters, sorting]);

  if (!loadingIndicatorRef.current) {
    loadingIndicatorRef.current = () => (
      <Stack align="center">
        <Spinner />
      </Stack>
    );
  }

  if (isAuthenticating) return <>{loadingIndicatorRef.current()}</>;

  return (
    <Card type="plain">
      {reflectionStreamQuery.error && (
        <ErrorLoader
          type="script-error"
          title={'Sorry, there was an error when fetching reflections'}
          details={<>{reflectionStreamQuery.error.message}</>}
        />
      )}

      {reflections.length > 0 && (
        <DynamicInfiniteScroll
          count={reflections.length}
          scrollRestorationStorageKey={scrollRestorationStorageKey}
          scrollRestorationKeys={reflections.map(beam => beam?.node?.reflectionID)}
          itemHeight={estimatedHeight}
          overScan={scrollOptions.overScan}
          itemSpacing={itemSpacing}
          hasNextPage={pageInfo && pageInfo.hasNextPage}
          loading={reflectionStreamQuery.loading}
          onLoadMore={async () => {
            const lastCursor = reflections[reflections.length - 1]?.cursor;
            if (reflectionStreamQuery.loading || reflectionStreamQuery.error || !lastCursor) return;
            if (lastCursor) {
              await reflectionStreamQuery.fetchMore({
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
            const reflection = reflections[itemIndex];
            if (!reflection?.node) return null;
            return <>{renderItem({ ...reflection.node, id: reflection.node.reflectionID })}</>;
          }}
        </DynamicInfiniteScroll>
      )}
    </Card>
  );
};

export default ReflectFeed;
