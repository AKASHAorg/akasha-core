import React, { ReactElement, useEffect, useRef } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useScrollRestoration } from './use-scroll-restoration';

type DynamicInfiniteScrollItem = {
  index: number;
  itemIndex: number;
  itemsSize: number;
};

type DynamicInfiniteScrollType = {
  count: number;
  itemHeight: number;
  overScan?: number;
  itemSpacing?: number;
  hasNextPage?: boolean;
  loading?: boolean;
  scrollRestorationKeys?: string[];
  customStyle?: string;
  onLoadMore: () => Promise<unknown>;
  children: (item: DynamicInfiniteScrollItem) => ReactElement;
};

//@TODO: merge with InfiniteScroll component and move to design system core
const DynamicInfiniteScroll: React.FC<DynamicInfiniteScrollType> = props => {
  const {
    count,
    itemHeight,
    overScan = 0,
    itemSpacing,
    hasNextPage,
    loading,
    scrollRestorationKeys,
    customStyle = '',
    onLoadMore,
    children,
  } = props;

  const virtualizer = useWindowVirtualizer({
    count: count,
    overscan: overScan,
    estimateSize: () => itemHeight,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const loadingMore = loading && virtualItems.length > 0;
  const loadingPlaceholderSize = loadingMore
    ? loadMoreRef.current?.getBoundingClientRect().height
    : 0;

  useScrollRestoration({
    virtualizer,
    scrollRestorationKeys,
    overScan,
    offsetAttribute: 'data-offset',
  });

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (hasNextPage && !loading && lastItem.index >= count - 1) {
      onLoadMore();
    }
  }, [hasNextPage, count, loading, onLoadMore, virtualItems]);

  return (
    <Card
      customStyle={`relative min-h-[${totalSize + loadingPlaceholderSize}px] ${customStyle}`}
      type="plain"
    >
      <Card
        data-offset={virtualItems?.[0]?.start}
        customStyle={`flex flex-col absolute w-full top-0 left-0 translate-y-[${virtualItems?.[0]?.start ?? 0}px] gap-y-[${itemSpacing}px]`}
        type="plain"
      >
        {virtualItems.map((virtualItem, index, items) => (
          <Card
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            type="plain"
            customStyle={`${virtualizer.isScrolling ? `flex min-h-[${virtualItem.size}px]` : ''}`}
          >
            {children({ index, itemIndex: virtualItem.index, itemsSize: items.length })}
          </Card>
        ))}
        {loadingMore && (
          <Stack align="center" justify="center" fullWidth ref={loadMoreRef}>
            <Spinner />
          </Stack>
        )}
      </Card>
    </Card>
  );
};

export default DynamicInfiniteScroll;
