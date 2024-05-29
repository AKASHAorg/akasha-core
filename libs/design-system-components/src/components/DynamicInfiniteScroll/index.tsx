import React, {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { Virtualizer, measureElement, useWindowVirtualizer } from '@tanstack/react-virtual';
import { useScrollRestoration } from './use-scroll-restoration';
import { getMinHeight, restoreScrollConfig } from './use-scroll-restoration/utils';
import { useMedia } from 'react-use';

type DynamicInfiniteScrollItem = {
  index: number;
  itemIndex: number;
  itemsSize: number;
};

type DynamicInfiniteScrollType = {
  count: number;
  itemHeight: number;
  enableScrollRestoration?: boolean;
  scrollRestorationStorageKey?: string;
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
    count,
    itemHeight,
    enableScrollRestoration,
    scrollRestorationStorageKey = 'storage-key',
    overScan = 5,
    itemSpacing,
    hasNextPage,
    loading,
    customStyle = '',
    onLoadMore,
    children,
  } = props;

  const parentRef = useRef(null);
  const scrollRestorationStorageKeyRef = useRef(scrollRestorationStorageKey);
  const parentOffsetRef = React.useRef(0);
  const isMobileScreen = useMedia('(max-width: 640px)');

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const getInitialMeasurementsCache = useCallback(() => {
    const scrollConfig = restoreScrollConfig(scrollRestorationStorageKeyRef.current);
    if (!scrollConfig || !scrollConfig.options || typeof scrollConfig !== 'object') return [];
    return scrollConfig.options.initialMeasurementsCache;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: count,
    overscan: overScan,
    gap: itemSpacing,
    initialMeasurementsCache: getInitialMeasurementsCache(),
    scrollMargin: parentOffsetRef.current,
    measureElement: isMobileScreen
      ? (element, entry, instance) => {
          const dataIndex = instance.indexFromElement(element);
          if (instance.scrollDirection === 'backward' && instance.measurementsCache?.[dataIndex]) {
            return instance.measurementsCache[dataIndex].size;
          }
          return measureElement(element, entry, instance);
        }
      : measureElement,
    estimateSize: () => itemHeight,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const loadingMore = loading && hasNextPage && virtualItems.length > 0;
  const loadingPlaceholderSize = loadingMore
    ? loadMoreRef.current?.getBoundingClientRect().height
    : 0;

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) {
      return;
    }

    if (hasNextPage && !loading && lastItem.index >= count - 1) {
      onLoadMore();
    }
  }, [hasNextPage, count, loading, onLoadMore, virtualItems]);

  const vListOffset = virtualItems?.[0]?.start
    ? virtualItems?.[0]?.start - virtualizer.options.scrollMargin
    : 0;

  const virtualListUi = (
    <Card
      ref={parentRef}
      customStyle={`relative [overflow-anchor: none] min-h-[${totalSize + loadingPlaceholderSize}px] ${customStyle}`}
      type="plain"
    >
      <Card
        data-offset={vListOffset}
        customStyle={`flex flex-col absolute w-full top-0 left-0 translate-y-[${vListOffset}px] gap-y-[${itemSpacing}px]`}
        type="plain"
      >
        {virtualItems.map((virtualItem, index, items) => (
          <Card
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            type="plain"
            customStyle={
              loading
                ? `min-h-[${itemHeight}px]`
                : getMinHeight({
                    virtualizer,
                    virtualItemIndex: virtualItem.index,
                    virtualItemSize: virtualItem.size,
                  })
            }
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

  return enableScrollRestoration ? (
    <WithScrollRestoration
      virtualizer={virtualizer}
      scrollRestorationStorageKey={scrollRestorationStorageKey}
      count={count}
      overScan={overScan}
      offsetAttribute="data-offset"
    >
      {virtualListUi}
    </WithScrollRestoration>
  ) : (
    <>{virtualListUi}</>
  );
};

type WithScrollRestorationProps = {
  virtualizer: Virtualizer<Window, Element>;
  scrollRestorationStorageKey: string;
  count: number;
  overScan: number;
  offsetAttribute: string;
};

const WithScrollRestoration: React.FC<PropsWithChildren<WithScrollRestorationProps>> = props => {
  const { virtualizer, scrollRestorationStorageKey, count, overScan, offsetAttribute, children } =
    props;
  const scrollRestorationStorageKeyRef = useRef(scrollRestorationStorageKey);
  useScrollRestoration({
    virtualizer,
    count,
    overScan,
    scrollRestorationStorageKey: scrollRestorationStorageKeyRef.current,
    offsetAttribute,
  });
  return <>{children}</>;
};

export default DynamicInfiniteScroll;
