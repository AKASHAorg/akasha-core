import React, { ReactElement, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useScrollRestoration } from './use-scroll-restoration';
import { restoreScrollConfig } from './use-scroll-restoration/utils';

type DynamicInfiniteScrollItem = {
  index: number;
  itemIndex: number;
  itemsSize: number;
};

type DynamicInfiniteScrollType = {
  count: number;
  itemHeight: number;
  scrollRestorationStorageKey: string;
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
    scrollRestorationStorageKey,
    overScan = 0,
    itemSpacing,
    hasNextPage,
    loading,
    scrollRestorationKeys,
    customStyle = '',
    onLoadMore,
    children,
  } = props;

  const parentRef = useRef(null);
  const scrollRestorationStorageKeyRef = useRef(scrollRestorationStorageKey);
  const parentOffsetRef = React.useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const getInitialMeasurementsCache = useCallback(() => {
    const scrollConfig = restoreScrollConfig(scrollRestorationStorageKeyRef.current);
    if (!scrollConfig || !scrollConfig.options || typeof scrollConfig !== 'object') return [];
    return scrollConfig.options.initialMeasurementsCache;
  }, []);

  const getScrollMargin = useCallback(() => {
    const scrollConfig = restoreScrollConfig(scrollRestorationStorageKeyRef.current);
    if (!scrollConfig || !scrollConfig.options || typeof scrollConfig !== 'object')
      return parentOffsetRef.current;
    return scrollConfig.options.scrollMargin;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: count,
    overscan: overScan,
    initialMeasurementsCache: getInitialMeasurementsCache(),
    scrollMargin: getScrollMargin(),
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
    scrollRestorationStorageKey: scrollRestorationStorageKeyRef.current,
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
      ref={parentRef}
      customStyle={`relative min-h-[${totalSize + loadingPlaceholderSize}px] ${customStyle}`}
      type="plain"
    >
      <Card
        data-offset={virtualItems?.[0]?.start}
        customStyle={`flex flex-col ${virtualizer.options.initialMeasurementsCache.length ? '[overflow-anchor:none]' : ''} absolute w-full top-0 left-0 translate-y-[${virtualItems?.[0]?.start ? virtualItems?.[0]?.start - virtualizer.options.scrollMargin : 0}px] gap-y-[${itemSpacing}px]`}
        type="plain"
      >
        {virtualItems.map((virtualItem, index, items) => (
          <Card
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            type="plain"
            customStyle={`${virtualizer.isScrolling || virtualizer.options.initialMeasurementsCache.length ? `flex flex-col min-h-[${virtualItem.size}px]` : ''}`}
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
