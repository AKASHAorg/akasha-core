// react component used to list entries

import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import {
  defaultRangeExtractor,
  useWindowVirtualizer,
  VirtualItem,
  Virtualizer,
} from '@tanstack/react-virtual';
import { useScrollTop } from './use-scroll-top';

/**
 * Notes (remove after implementation)
 * list is settled when:
 */

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
  rangeStartOffset?: number;
  totalHeight?: number;
  totalWidth?: number;
  paddingTop: number;
  paddingBottom: number;
  visibleCursorRange: {
    startCursor: string;
    endCursor: string;
  };
};

export type ScrollerOnChangeState<T> = ScrollerState & {
  allEntries: T[];
  scrollDirection: Virtualizer<Window, Element>['scrollDirection'];
  visibleIndexRange: {
    start: number;
    end: number;
  };
};

const usePrevState = (val: unknown) => {
  const ref = React.useRef<unknown>();
  React.useEffect(() => {
    ref.current = val;
  }, [val]);
  return ref.current;
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
  getItemKey?: (index: number, entries: T[]) => string;
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
  // @TODO: maybe pass the topbar slotId here?
  const topbarHeight = document.getElementById('topbar-slot')?.offsetParent?.clientHeight || 0;

  const itemCount = React.useMemo(() => {
    if (hasNextPage) {
      return pages.length + 1;
    }
    return pages.length;
  }, [hasNextPage, pages.length]);

  const prevItemCount = usePrevState(itemCount);

  const initialScrollStateRef = React.useRef<ScrollerState & { isFetched: boolean }>();

  React.useLayoutEffect(() => {
    if (initialScrollState.isFetched && !initialScrollStateRef.current) {
      initialScrollStateRef.current = initialScrollState;
    }
  }, [initialScrollState]);
  const virtualizerRef = React.useRef<Virtualizer<Window, Element>>();

  const handleVlistChange = React.useCallback(
    (vInstance: Virtualizer<Window, Element>) => {
      console.log(vInstance.options.count, pages.length, itemCount, prevItemCount, '<<<counts');
    },
    [itemCount, pages.length],
  );

  const visibleRange = React.useRef();

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    paddingStart: initialScrollStateRef.current?.paddingTop || 0,
    paddingEnd: initialScrollStateRef.current?.paddingBottom || 0,
    scrollPaddingEnd: 100,
    estimateSize: () => 240,
    scrollMargin: rootElementRef.current?.offsetTop || 0,
    initialMeasurementsCache: initialScrollStateRef.current?.measurementsCache || [],
    scrollingDelay: 250,
    overscan: scrollerOptions.overscan,
    getItemKey: index => getItemKey(index, pages),
    onChange: handleVlistChange,
    // rangeExtractor: React.useCallback(
    //   range => {
    //     if (initialScrollState.isFetched) {
    //       const cache = initialScrollState.measurementsCache.map(mc => mc.index);
    //       const current = defaultRangeExtractor(range);
    //       const nextRange = new Set([...cache, ...current]);
    //       return [...nextRange].sort((a, b) => a - b);
    //     }
    //     return defaultRangeExtractor(range);
    //   },
    //   [initialScrollState],
    // ),
  });

  const isInitialized = React.useMemo(() => {
    if (initialScrollState.isFetched) {
      initialScrollStateRef.current = initialScrollState;
      return true;
    }
    return false;
  }, [initialScrollState]);

  const items = virtualizer.getVirtualItems();

  const [paddingTop, paddingBottom] = React.useMemo(() => {
    const range = virtualizer.calculateRange();
    if (isInitialized && range.startIndex === 0) {
      if (initialScrollStateRef.current.measurementsCache.length > 0) {
        return [
          initialScrollStateRef.current.paddingTop,
          Math.max(0, virtualizer.getTotalSize() - items[items.length - 1]?.end),
        ];
      }
    }
    if (items.length) {
      return [
        Math.max(0, items[0].start - virtualizer.options.scrollMargin),
        Math.max(0, virtualizer.getTotalSize() - items[items.length - 1].end),
      ];
    }
    return [0, 0];
  }, [isInitialized, items, virtualizer]);

  // save scroll state hook
  React.useLayoutEffect(() => {
    if (isInitialized && virtualizer.isScrolling) {
      const { startIndex, endIndex } = virtualizer.calculateRange();

      const state: ScrollerOnChangeState<T> = {
        allEntries: pages,
        startItemCursor: pages[0]['cursor'],
        measurementsCache: virtualizer.measurementsCache,
        itemsCount: itemCount,
        scrollDirection: virtualizer.scrollDirection,
        paddingTop,
        paddingBottom,
        visibleCursorRange: {
          startCursor: pages[startIndex]['cursor'],
          endCursor: pages[endIndex]['cursor'],
        },
        visibleIndexRange: {
          start: startIndex,
          end: endIndex,
        },
      };
      onScrollStateSave(state);
    }
  }, [isInitialized, onScrollStateSave, paddingBottom, paddingTop, pages, virtualizer]);

  React.useEffect(() => {
    if (isInitialized && pages.length && initialScrollStateRef.current?.measurementsCache.length) {
      const firstItem = rootElementRef.current.querySelector('[data-index="0"]');
      const range = virtualizer.calculateRange();
      if (firstItem && range.startIndex === 0 && initialScrollStateRef.current.paddingTop) {
        const rect = firstItem.getClientRects().item(0);
        if (rect.top > topbarHeight) {
          virtualizer.scrollBy(rect.top - topbarHeight);
        }
      }
    }
  }, [isInitialized, pages.length, topbarHeight, virtualizer]);

  const { isHidden, scrollTopButtonPlacement } = useScrollTop({
    rootElementRef,
    topbarHeight,
    itemSpacing,
    languageDirection,
  });

  React.useEffect(() => {
    const range = virtualizer.calculateRange();
    if (pages.length && range.endIndex >= pages.length - 3) {
      onFetchNextPage(pages.reverse()[0]['cursor']);
    }
    if (
      isInitialized &&
      range.startIndex === 0 &&
      paddingTop > 0 &&
      pages.length &&
      virtualizer.scrollDirection === 'backward'
    ) {
      onFetchPreviousPage(pages[0]['cursor'], true);
    }
  }, [
    isInitialized,
    onFetchNextPage,
    onFetchPreviousPage,
    paddingTop,
    pages,
    virtualizer,
    virtualizer.isScrolling,
  ]);

  if (virtualizerRef.current && virtualizerRef.current.options.count !== pages.length) {
    const itemDelta = pages.length - virtualizerRef.current.options.count;
    console.log('items added to the list', itemDelta);
    if (!virtualizer.scrollDirection || virtualizer.scrollDirection === 'forward') {
      console.log('items were appended!');
      console.log('==========');
    } else {
      console.log('items were prepended!');
      console.log('==========');
    }
  }

  React.useEffect(() => {
    console.log(pages, '>>> pages');
    console.log(items, '>>> items');
  }, [pages, items]);

  React.useLayoutEffect(() => {
    virtualizerRef.current = virtualizer;
  }, [virtualizer]);

  const handleScrollToTop = () => {
    const [offset] = virtualizer.getOffsetForIndex(0, 'start');
    virtualizer.scrollToOffset(offset - topbarHeight - itemSpacing, { align: 'start' });
    if (onScrollStateReset) {
      onScrollStateReset();
    }
  };

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
      {requestStatus === 'loading' && isFetchingPreviousPage && (
        <Stack fullWidth={true} customStyle="p-8">
          <Spinner />
        </Stack>
      )}
      {children({
        items,
        allEntries: pages,
        measureElementRef: virtualizer.measureElement,
        isFetchingNextPage,
        itemSpacing,
      })}
      {isFetchingNextPage && (
        <Stack fullWidth={true} customStyle="p-8">
          <Spinner />
        </Stack>
      )}
      <ScrollTopWrapper placement={scrollTopButtonPlacement}>
        <ScrollTopButton hide={isHidden} onClick={handleScrollToTop} />
      </ScrollTopWrapper>
    </div>
  );
}

export default EntryList;
