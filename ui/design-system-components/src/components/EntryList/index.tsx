// react component used to list entries

import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import { defaultRangeExtractor, useWindowVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { useScrollTop } from './use-scroll-top';
import { mergeWithCache } from '../../utils/virtual-list-utils';

export type CardListProps<T> = {
  items: VirtualItem[];
  allEntries: T[];
  itemSpacing?: number;
  measureElementRef: (node: Element) => void;
  isFetchingNextPage?: boolean;
};

export type ScrollerState = {
  startItemCursor: string;
  measurementsCache: VirtualItem[];
  itemsCount: number;
  visibleCursorRange: {
    startCursor: string;
    endCursor: string;
  };
};

export type ScrollerOnChangeState<T> = ScrollerState & {
  allEntries: T[];
};

export type EntryListProps<T> = {
  // array of pages, each page having multiple nodes
  // important because we need to reverse the items in pages
  pages: T[];
  children?: (props: CardListProps<T>) => React.ReactElement[];
  itemSpacing?: number;
  requestStatus: 'success' | 'loading' | 'error' | 'idle';
  hasNextPage?: boolean;
  languageDirection?: 'ltr' | 'rtl';
  isFetchingNextPage?: boolean;
  isFetchingPreviousPage?: boolean;
  onScrollStateChange?: (scrollerState: ScrollerOnChangeState<T>) => void;
  onScrollStateReset?: () => void;
  initialScrollState?: ScrollerState & { isFetched: boolean };
  getItemKey?: (index: number, entries: (T | VirtualItem)[]) => string;
  newItemsCount?: number;
  scrollerOptions?: { overscan: number };
  onFetchNextPage: (lastCursor: string) => void;
  onFetchPreviousPage: (firstCursor: string, force?: boolean) => void;
  onScrollStateSave: (scrollState: ScrollerOnChangeState<T>) => void;
};

function EntryList<T>(props: EntryListProps<T>) {
  const {
    pages = [],
    itemSpacing = 0,
    languageDirection = 'ltr',
    hasNextPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    requestStatus,
    children,
    initialScrollState,
    onScrollStateReset,
    getItemKey,
    newItemsCount,
    scrollerOptions,
    onFetchPreviousPage,
    onFetchNextPage,
    onScrollStateSave,
  } = props;

  const rootElementRef = React.useRef<HTMLDivElement>();
  const isScrollRestored = React.useRef(false);
  // @TODO: maybe pass the topbar slotId here?
  const topbarHeight = document.getElementById('topbar-slot')?.offsetParent?.clientHeight || 0;

  // keep the first scroll state as ref
  const initialScrollStateRef = React.useRef<ScrollerState & { isFetched: boolean }>();
  React.useEffect(() => {
    if (!initialScrollStateRef.current && initialScrollState.isFetched) {
      initialScrollStateRef.current = initialScrollState;
    }
  }, [initialScrollState]);

  // merge pages and measurementsCache
  const pageItems: (T & { index: number; key: string })[] = React.useMemo(() => {
    if (initialScrollStateRef.current && pages.length) {
      return mergeWithCache(initialScrollStateRef.current.measurementsCache, pages);
    }
    return [];
  }, [pages]);

  const virtualizer = useWindowVirtualizer({
    count: pageItems.length,
    scrollPaddingEnd: 100,
    estimateSize: () => 240,
    scrollMargin: rootElementRef.current?.offsetTop || 0,
    initialMeasurementsCache: initialScrollStateRef.current?.measurementsCache || [],
    scrollingDelay: 250,
    overscan: scrollerOptions.overscan,
    getItemKey: index => getItemKey(index, pageItems),
    rangeExtractor: React.useCallback(
      range => {
        if (!initialScrollState.isFetched) {
          return [];
        }
        return defaultRangeExtractor(range);
      },
      [initialScrollState],
    ),
  });

  const items = virtualizer.getVirtualItems();

  const [paddingTop, paddingBottom] = React.useMemo(() => {
    if (items.length) {
      return [
        Math.max(0, items[0].start - virtualizer.options.scrollMargin),
        Math.max(0, virtualizer.getTotalSize() - items[items.length - 1].end),
      ];
    }
    return [0, 0];
  }, [items, virtualizer]);

  const [firstPopulatedItem, lastPopulatedItem] = React.useMemo(() => {
    if (pages.length) {
      const firstItem = pageItems.find(it => it.key === pages[0]['cursor']);
      const lastItem = pageItems.find(it => it.key === pages[pages.length - 1]['cursor']);
      return [firstItem, lastItem];
    }
    return [];
  }, [pageItems, pages]);

  React.useEffect(() => {
    if (items[0] && items[0].index < firstPopulatedItem.index && !isScrollRestored.current) {
      virtualizer.scrollToIndex(firstPopulatedItem.index, { align: 'start' });
      const firstDomEl = rootElementRef.current.querySelector(
        `[data-index="${firstPopulatedItem.index}"]`,
      );
      if (firstDomEl) {
        const rect = firstDomEl.getClientRects().item(0);
        if (rect.top <= topbarHeight) {
          isScrollRestored.current = true;
        }
      }
    }
  }, [firstPopulatedItem, items, topbarHeight, virtualizer]);

  // save scroll state hook
  const prevRange = React.useRef<{ startIndex: number; endIndex: number }>(
    virtualizer.calculateRange(),
  );
  React.useLayoutEffect(() => {
    if (virtualizer.isScrolling) {
      const { startIndex, endIndex } = virtualizer.calculateRange();

      if (
        startIndex < firstPopulatedItem.index &&
        prevRange.current.startIndex === startIndex &&
        prevRange.current.endIndex === endIndex
      ) {
        return;
      }

      const state: ScrollerOnChangeState<T> = {
        allEntries: pages,
        startItemCursor: pageItems[0]['key'],
        measurementsCache: virtualizer.measurementsCache,
        itemsCount: pageItems.length,
        visibleCursorRange: {
          startCursor: pages[startIndex]?.['cursor'] || firstPopulatedItem.key,
          endCursor: pages[endIndex]?.['cursor'] || lastPopulatedItem.key,
        },
      };
      onScrollStateSave(state);
      prevRange.current = { startIndex, endIndex };
    }
  }, [
    pageItems.length,
    onScrollStateSave,
    paddingBottom,
    paddingTop,
    pages,
    virtualizer,
    firstPopulatedItem,
    pageItems,
    lastPopulatedItem,
  ]);

  const { isHidden, scrollTopButtonPlacement } = useScrollTop({
    rootElementRef,
    topbarHeight,
    itemSpacing,
    languageDirection,
  });

  // next page loading logic
  React.useLayoutEffect(() => {
    const lastItem = items[items.length - 1];
    if (!lastItem) {
      return;
    }
    if (lastItem.index >= lastPopulatedItem.index) {
      onFetchNextPage(lastPopulatedItem.key as string);
    }
  }, [items, lastPopulatedItem, onFetchNextPage]);

  // prev page loading logic
  React.useLayoutEffect(() => {
    if (
      items.length &&
      !isFetchingNextPage &&
      virtualizer.scrollDirection === 'backward' &&
      isScrollRestored.current &&
      items[0].index + 1 < firstPopulatedItem.index
    ) {
      return onFetchPreviousPage(firstPopulatedItem.key, true);
    }
  }, [
    firstPopulatedItem,
    items,
    onFetchPreviousPage,
    paddingTop,
    pageItems,
    scrollerOptions.overscan,
    virtualizer.scrollDirection,
  ]);

  const handleScrollToTop = React.useCallback(() => {
    const [offset] = virtualizer.getOffsetForIndex(0, 'start');
    virtualizer.scrollToOffset(offset - topbarHeight - itemSpacing, { align: 'start' });
    if (onScrollStateReset) {
      onScrollStateReset();
    }
  }, [itemSpacing, onScrollStateReset, topbarHeight, virtualizer]);

  return (
    <div
      ref={rootElementRef}
      style={{
        paddingTop,
        paddingBottom,
        position: 'relative',
      }}
    >
      {newItemsCount > 0 && (
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          <span>{newItemsCount} New Items</span>
        </div>
      )}
      {requestStatus === 'loading' &&
        isFetchingPreviousPage &&
        firstPopulatedItem.index === items[0].index && (
          <Stack fullWidth={true} customStyle="p-8">
            <Spinner />
          </Stack>
        )}
      {children({
        items,
        allEntries: pageItems,
        measureElementRef: virtualizer.measureElement,
        isFetchingNextPage,
        itemSpacing,
      })}
      <ScrollTopWrapper placement={scrollTopButtonPlacement}>
        <ScrollTopButton hide={isHidden} onClick={handleScrollToTop} />
      </ScrollTopWrapper>
    </div>
  );
}

export default EntryList;
