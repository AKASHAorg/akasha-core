import React, { ReactElement, useCallback, useEffect, useRef } from 'react';
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
  totalElements: number;
  itemHeight: number;
  overScan?: number;
  itemSpacing?: number;
  hasNextPage?: boolean;
  loading?: boolean;
  customStyle?: string;
  onLoadMore: () => Promise<unknown>;
  children: (item: DynamicInfiniteScrollItem) => ReactElement;
};

//@TODO: merge with InfiniteScroll component and move to design system core
const DynamicInfiniteScroll: React.FC<DynamicInfiniteScrollType> = props => {
  const {
    totalElements,
    itemHeight,
    overScan = 0,
    itemSpacing,
    hasNextPage,
    loading,
    customStyle = '',
    onLoadMore,
    children,
  } = props;

  const virtualizer = useWindowVirtualizer({
    count: totalElements,
    overscan: overScan,
    gap: itemSpacing,
    estimateSize: () => itemHeight,
  });
  const loadMoreRef = useRef(null);

  useScrollRestoration({ virtualizer });

  const onScroll = useCallback(async () => {
    const scrolledTo = window.scrollY + window.innerHeight;
    const threshold = 100;
    if (document.body.scrollHeight - threshold <= scrolledTo) {
      if (hasNextPage && !loading) {
        await onLoadMore();
      }
    }
  }, [onLoadMore, hasNextPage, loading]);

  useEffect(() => {
    window.onscroll = onScroll;
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const loadingMore = loading && totalElements > 0;
  const loadingPlaceholderSize = loadingMore ? 32 + itemSpacing : 0;

  return (
    <Card
      customStyle={`relative min-h-[${totalSize + loadingPlaceholderSize}px] ${customStyle}`}
      type="plain"
    >
      {virtualItems.map((virtualItem, index, items) => (
        <Card
          key={virtualItem.key}
          data-index={virtualItem.index}
          ref={virtualizer.measureElement}
          customStyle={`absolute w-full translate-y-[${virtualItem.start}px]`}
          type="plain"
        >
          {children({ index, itemIndex: virtualItem.index, itemsSize: items.length })}
        </Card>
      ))}
      {loadingMore && (
        <Stack
          align="center"
          justify="center"
          fullWidth
          ref={loadMoreRef}
          customStyle={`absolute w-full bottom-0 mt-[${itemSpacing}px]`}
        >
          <Spinner />
        </Stack>
      )}
    </Card>
  );
};

export default DynamicInfiniteScroll;
