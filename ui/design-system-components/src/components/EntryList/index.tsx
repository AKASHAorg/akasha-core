// react component used to list entries

import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import { useWindowVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { useScrollTop } from './use-scroll-top';
import { mergeWithCache } from '../../utils/virtual-list-utils';
import Button from '@akashaorg/design-system-core/lib/components/Button';

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
  languageDirection?: 'ltr' | 'rtl';
  isFetchingNextPage?: boolean;
  isFetchingPreviousPage?: boolean;
  onScrollStateChange?: (scrollerState: ScrollerOnChangeState<T>) => void;
  onScrollStateReset?: (hardReset?: boolean) => void;
  initialScrollState?: ScrollerState & { isFetched: boolean };
  getItemKey?: (index: number, entries: (T | VirtualItem)[]) => string;
  newItemsCount?: number;
  scrollerOptions?: { overscan: number };
  onFetchNextPage: (lastCursor: string) => void;
  onFetchPreviousPage: (firstCursor: string, force?: boolean) => void;
  onScrollStateSave: (scrollState: ScrollerOnChangeState<T>) => void;
  newItemsPublishedLabel: string;
};

function EntryList<T>(props: EntryListProps<T>) {
  const {
    pages = [],
    itemSpacing = 0,
    languageDirection = 'ltr',
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
    newItemsPublishedLabel,
  } = props;

  const rootElementRef = React.useRef<HTMLDivElement>();
  const isScrollRestored = React.useRef(false);
  const [, resetList] = React.useReducer(() => ({}), {});

  // @TODO: maybe pass the topbar slotId here?
  const topbarHeight = document.getElementById('topbar-slot')?.offsetParent?.clientHeight || 0;

  // keep the first scroll state as ref
  const initialScrollStateRef = React.useRef<ScrollerState & { isFetched: boolean }>();

  if (!initialScrollStateRef.current && initialScrollState?.isFetched) {
    initialScrollStateRef.current = initialScrollState;
  }

  const measurementsCache = React.useMemo(() => {
    if (initialScrollState?.isFetched) {
      return initialScrollState.measurementsCache;
    }
    return undefined;
  }, [initialScrollState]);

  // merge pages and measurementsCache
  const pageItems: (T & { index: number; key: string })[] = React.useMemo(() => {
    if (pages.length) {
      if (measurementsCache) {
        return mergeWithCache(measurementsCache, pages);
      }
      return pages;
    }
    if (measurementsCache) {
      return measurementsCache;
    }
    return [];
  }, [measurementsCache, pages]);

  const virtualizer = useWindowVirtualizer({
    count: pageItems.length,
    scrollPaddingEnd: 100,
    estimateSize: () => 150,
    scrollMargin: rootElementRef.current?.offsetTop || 0,
    initialMeasurementsCache: initialScrollStateRef.current?.measurementsCache || [],
    scrollingDelay: 250,
    overscan: scrollerOptions.overscan,
    getItemKey: index => getItemKey(index, pageItems),
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

  const prevPopulatedItem = React.useRef<T & { index: number; key: string }>();

  const [firstPopulatedItem, lastPopulatedItem] = React.useMemo(() => {
    if (pages.length) {
      const firstItem = pageItems.find(it => it.key === pages[0]['cursor']);
      const lastItem = pageItems.find(it => it.key === pages[pages.length - 1]['cursor']);
      return [firstItem, lastItem];
    }
    return [];
  }, [pageItems, pages]);

  React.useEffect(() => {
    if (!prevPopulatedItem.current && firstPopulatedItem) {
      prevPopulatedItem.current = firstPopulatedItem;
    }
  }, [firstPopulatedItem]);

  if (items[0] && items[0].index < firstPopulatedItem?.index && !isScrollRestored.current) {
    virtualizer.scrollToIndex(firstPopulatedItem.index, { align: 'start' });
    const firstDomEl = rootElementRef.current.querySelector(
      `[data-index="${firstPopulatedItem.index}"]`,
    );
    if (firstDomEl) {
      const rect = firstDomEl.getClientRects().item(0);
      if (Math.abs(rect.top - topbarHeight) < topbarHeight) {
        isScrollRestored.current = true;
      }
    }
  }

  // save scroll state hook
  const prevRange = React.useRef<{ startIndex: number; endIndex: number }>(
    virtualizer.calculateRange(),
  );

  React.useLayoutEffect(() => {
    if (virtualizer.isScrolling) {
      const { startIndex, endIndex } = virtualizer.calculateRange();
      if (!firstPopulatedItem) {
        return;
      }
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
    if (!lastItem || !lastPopulatedItem) {
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
      items[0].index < firstPopulatedItem?.index &&
      firstPopulatedItem?.index > 0
    ) {
      return onFetchPreviousPage(firstPopulatedItem.key, true);
    }
  }, [
    firstPopulatedItem,
    isFetchingNextPage,
    items,
    onFetchPreviousPage,
    paddingTop,
    pageItems,
    scrollerOptions.overscan,
    virtualizer.scrollDirection,
  ]);

  const handleScrollToTop = React.useCallback(
    (reset?: boolean) => () => {
      const [offset] = virtualizer.getOffsetForIndex(0, 'start');
      virtualizer.scrollToOffset(offset - topbarHeight - itemSpacing, { align: 'start' });
      if (onScrollStateReset) {
        onScrollStateReset(reset);
      }
      initialScrollStateRef.current = null;
      resetList();
    },
    [itemSpacing, onScrollStateReset, topbarHeight, virtualizer],
  );

  return (
    <div
      ref={rootElementRef}
      style={{
        paddingTop,
        paddingBottom,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: itemSpacing,
      }}
    >
      {newItemsCount > 0 && (
        <Button
          customStyle={`sticky top-[${
            topbarHeight + 8
          }px] bg-grey5 hover:(bg-grey4) p-4 max-w-fit z-10 self-center rounded-md`}
          variant="text"
          label={newItemsPublishedLabel}
          onClick={handleScrollToTop(true)}
        />
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
        <ScrollTopButton hide={isHidden} onClick={handleScrollToTop()} />
      </ScrollTopWrapper>
    </div>
  );
}

export default EntryList;
