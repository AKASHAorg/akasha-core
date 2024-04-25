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
  totalElements: number;
  itemHeight: number;
  overScan?: number;
  hasNextPage?: boolean;
  loading?: boolean;
  customStyle?: string;
  onLoadMore: () => Promise<unknown>;
  children: (item: DynamicInfiniteScrollItem) => ReactElement;
};

//@TODO: merge with InfiniteScroll
const DynamicInfiniteScroll: React.FC<DynamicInfiniteScrollType> = props => {
  const {
    totalElements,
    itemHeight,
    overScan = 0,
    hasNextPage,
    loading,
    customStyle = '',
    onLoadMore,
    children,
  } = props;

  const rowVirtualizer = useWindowVirtualizer({
    count: totalElements,
    overscan: overScan,
    estimateSize: () => itemHeight,
  });
  const loadMoreRef = useRef(null);

  useScrollRestoration({ rowVirtualizer });

  useEffect(() => {
    const onScroll = async () => {
      const scrolledTo = window.scrollY + window.innerHeight;
      const threshold = 100;
      if (document.body.scrollHeight - threshold <= scrolledTo) {
        if (hasNextPage && !loading) {
          await onLoadMore();
        }
      }
    };
    window.onscroll = onScroll;
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [onLoadMore, hasNextPage, loading]);

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const loadingMore = loading && totalElements > 0;
  const additionalSize = loadingMore ? 16 : 0;

  return (
    <Stack customStyle={`relative mb-2 min-h-[${totalSize + additionalSize}px] ${customStyle}`}>
      {virtualItems.map((virtualItem, index, items) => (
        <Card
          key={virtualItem.key}
          data-index={virtualItem.index}
          ref={rowVirtualizer.measureElement}
          type="plain"
        >
          {children({ index, itemIndex: virtualItem.index, itemsSize: items.length })}
        </Card>
      ))}
      {loadingMore && (
        <Stack align="center" justify="center" fullWidth ref={loadMoreRef}>
          <Spinner />
        </Stack>
      )}
    </Stack>
  );
};

export default DynamicInfiniteScroll;
