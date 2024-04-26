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
    estimateSize: () => itemHeight,
  });
  const loadMoreRef = useRef(null);

  useScrollRestoration({ virtualizer });

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

  const virtualItems = virtualizer.getVirtualItems();
  const totalVirtualItems = virtualItems.length;
  const totalSize = virtualizer.getTotalSize();
  const loadingMore = loading && totalElements > 0;
  const itemSpacingTotal = totalVirtualItems ? totalVirtualItems * itemSpacing - itemSpacing : 0;
  return (
    <Card
      customStyle={`relative mb-2 min-h-[${totalSize + itemSpacingTotal}px] ${customStyle}`}
      type="plain"
    >
      <Stack
        customStyle={`absolute w-full gap-y-[${itemSpacing}px] translate-y-[${
          virtualItems?.[0]?.start ?? 0
        }px]`}
      >
        {virtualItems.map((virtualItem, index, items) => (
          <Card
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
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
    </Card>
  );
};

export default DynamicInfiniteScroll;
