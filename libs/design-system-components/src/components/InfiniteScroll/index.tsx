import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useIntersection } from 'react-use';

type InfiniteScrollItem = {
  index: number;
  itemIndex: number;
  itemsSize: number;
};

type InfiniteScrollType = {
  totalElements: number;
  itemHeight: number;
  overScan?: number;
  onLoadMore: () => Promise<NonNullable<unknown>> | null;
  children: (item: InfiniteScrollItem) => ReactElement;
};

/**
 * Component used to render a long list of items inside a scrollable container
 * without losing performance, requires a fixed height for each item
 * @param totalElements - number of items in the list
 * @param itemHeight - height of the items to be rendered
 * @param overscan - number of items to render above and below the visible area
 * @param loadMore - function to fetch more items, triggered on reaching the bottom of the visible area
 * @param children - function that returns the react component that will render each item
 */
const InfiniteScroll: React.FC<InfiniteScrollType> = props => {
  const { totalElements, itemHeight, overScan = 0, onLoadMore, children } = props;
  const [loadMore, setLoadingMore] = useState(false);
  const rowVirtualizer = useWindowVirtualizer({
    count: totalElements,
    overscan: overScan,
    estimateSize: () => itemHeight,
  });
  const loadMoreRef = useRef(null);
  const intersection = useIntersection(loadMoreRef, {
    threshold: 0,
  });
  useEffect(() => {
    if (intersection?.isIntersecting) {
      const loadMorePromise = onLoadMore();
      if (loadMorePromise?.finally) {
        setLoadingMore(true);
        loadMorePromise.finally(() => {
          setLoadingMore(false);
        });
      }
    }
  }, [intersection, onLoadMore]);

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const additionalSize = loadMore ? 16 : 0;
  return (
    <Stack customStyle={`relative h-[${totalSize + additionalSize}px]`} fullWidth>
      {virtualItems.map((virtualItem, index, items) => (
        <Stack
          key={virtualItem.key}
          customStyle={`absolute top-0 left-0 w-full h-[${virtualItem.size}px] translate-y-[${virtualItem.start}px]`}
        >
          {children({ index, itemIndex: virtualItem.index, itemsSize: items.length })}
        </Stack>
      ))}
      <Stack
        align="center"
        justify="center"
        padding="pb-0"
        customStyle="absolute bottom-0"
        fullWidth
        ref={loadMoreRef}
      >
        {loadMore && <Spinner />}
      </Stack>
    </Stack>
  );
};

export default InfiniteScroll;
