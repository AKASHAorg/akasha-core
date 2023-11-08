import * as React from 'react';
import { AnalyticsEventData } from '@akashaorg/typings/lib/ui';
import { ILocale } from '@akashaorg/design-system-components/lib/utils/time';
import {
  AkashaBeamEdge,
  AkashaBeamFiltersInput,
  AkashaBeamSortingInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EdgeArea, Virtualizer, VirtualizerProps } from '../virtual-list';
import { useBeams } from '@akashaorg/ui-awf-hooks/lib/use-beams';

export type BeamFeedProps = {
  locale?: ILocale;
  className?: string;
  trackEvent?: (data: AnalyticsEventData['data']) => void;
  scrollerOptions?: { overscan: number };
  queryKey: string;
  newItemsPublishedLabel?: string;
  filters?: AkashaBeamFiltersInput;
  sorting?: AkashaBeamSortingInput;
  scrollTopIndicator: VirtualizerProps<unknown>['scrollTopIndicator'];
  renderItem: VirtualizerProps<AkashaBeamEdge>['renderItem'];
  estimatedHeight?: VirtualizerProps<unknown>['estimatedHeight'];
  itemSpacing?: VirtualizerProps<unknown>['itemSpacing'];
  header?: VirtualizerProps<unknown>['header'];
};

const BeamFeed = (props: BeamFeedProps) => {
  const {
    scrollerOptions = { overscan: 5 },
    filters,
    sorting,
    scrollTopIndicator,
    renderItem,
    queryKey,
    newItemsPublishedLabel,
    estimatedHeight = 150,
    itemSpacing,
  } = props;

  const {
    pages,
    hasPreviousPage,
    hasNextPage,
    fetchNextPage,
    fetchPreviousPage,
    fetchInitialData,
    onReset,
  } = useBeams({
    overscan: scrollerOptions.overscan,
    sorting,
    filters,
  });

  const handleFetch = (newArea: EdgeArea) => {
    switch (newArea) {
      case EdgeArea.TOP:
      case EdgeArea.NEAR_TOP:
        fetchPreviousPage();
        break;
      case EdgeArea.BOTTOM:
      case EdgeArea.NEAR_BOTTOM:
        fetchNextPage();
        break;
      default:
        break;
    }
  };

  return (
    <Virtualizer<AkashaBeamEdge>
      restorationKey={queryKey}
      itemSpacing={itemSpacing}
      estimatedHeight={estimatedHeight}
      overscan={scrollerOptions.overscan}
      items={pages}
      onFetchInitialData={fetchInitialData}
      itemKeyExtractor={item => item.cursor}
      itemIndexExtractor={itemKey => pages.findIndex(p => p.cursor === itemKey)}
      hasPreviousPage={hasPreviousPage}
      hasNextPage={hasNextPage}
      onListReset={onReset}
      onEdgeDetectorChange={handleFetch}
      scrollTopIndicator={scrollTopIndicator}
      renderItem={renderItem}
    />
  );
};

export default BeamFeed;
