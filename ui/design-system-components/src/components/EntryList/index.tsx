// react component used to list entries

import * as React from 'react';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import { useWindowVirtualizer, VirtualItem, Virtualizer } from '@tanstack/react-virtual';

export type CardListProps<T> = {
  items: VirtualItem[];
  allEntries: T[];
  itemSpacing?: number;
  measureElementRef: (node: Element) => void;
  isFetchingNextPage?: boolean;
};

export type ScrollerState = {
  startItemCursor: string;
  startItemOffset: number;
  measurementsCache: VirtualItem[];
  scrollDirection: Virtualizer<Window, HTMLElement>['scrollDirection'];
  itemsCount: number;
  lastItemCursor?: string;
  firstItemCursor?: string;
};

export type ScrollerOnChangeState<T> = ScrollerState & {
  allEntries: T[];
  firstItemIdx: number;
  lastItemIdx: number;
};

export type EntryListProps<T> = {
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
  initialScrollState?: ScrollerState;
  getItemKey?: (index: number, entries: T[]) => string;
};

function EntryList<T>(props: EntryListProps<T>) {
  const {
    pages,
    itemSpacing = 0,
    languageDirection = 'ltr',
    hasNextPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    requestStatus,
    children,
    onScrollStateChange,
    initialScrollState,
    onScrollStateReset,
    getItemKey,
  } = props;
  const [hideScrollTop, setHideScrollTop] = React.useState(true);
  const rootElementRef = React.useRef<HTMLDivElement>();
  const allEntries = React.useMemo(() => {
    if (pages) {
      return pages.flatMap(page => page);
    }
    return [];
  }, [pages]);

  const itemCount = hasNextPage ? allEntries.length + 1 : allEntries.length;

  const virtualizerRef = React.useRef<Virtualizer<Window, Element>>(null);

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    estimateSize: () => 100,
    scrollMargin: rootElementRef.current?.offsetTop || 0,
    initialOffset: initialScrollState?.startItemOffset || 0,
    initialMeasurementsCache: initialScrollState?.measurementsCache,
    scrollingDelay: 250,
    getItemKey: index => getItemKey(index, allEntries),
    onChange: vInstance => {
      const vItems = vInstance.getVirtualItems();
      if (!vItems.length || !allEntries.length) {
        return;
      }

      const startItemCursor = allEntries[vItems[0].index]['cursor'];
      const { startIndex, endIndex } = vInstance.range;
      const [offset] = vInstance.getOffsetForIndex(startIndex, 'center');
      if (onScrollStateChange) {
        onScrollStateChange({
          allEntries,
          startItemCursor,
          startItemOffset: offset,
          measurementsCache: vInstance.measurementsCache,
          scrollDirection: vInstance.scrollDirection,
          itemsCount: allEntries.length,
          lastItemCursor: allEntries[allEntries.length - 1]['cursor'],
          firstItemCursor: allEntries[0]['cursor'],
          firstItemIdx: startIndex,
          lastItemIdx: endIndex,
        });
      }
    },
  });

  React.useLayoutEffect(() => {
    virtualizerRef.current = virtualizer;
  });

  React.useLayoutEffect(() => {
    if (!virtualizerRef.current) {
      return;
    }
    const scrollDirection = virtualizerRef.current.scrollDirection;
    const hasChanged = itemCount !== virtualizerRef.current.options.count;
    if (!hasChanged) return;
    const range = virtualizerRef.current.calculateRange();
    if (scrollDirection === 'forward') {
      virtualizerRef.current.scrollToIndex(range.endIndex, { align: 'end' });
    }
    if (scrollDirection === 'backward') {
      virtualizerRef.current.scrollToIndex(range.startIndex, { align: 'start' });
    }
  });

  const items = virtualizer.getVirtualItems();
  /**
   * Handle scroll to top button visibility
   */
  React.useLayoutEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 0) {
        return setHideScrollTop(false);
      }
      return setHideScrollTop(true);
    };
    window.addEventListener('scroll', onScroll);
  }, []);

  const scrollTopButtonPlacement = React.useMemo(() => {
    if (languageDirection === 'rtl') return 0;
    return rootElementRef.current ? rootElementRef.current.clientWidth - 64 : null;
  }, [languageDirection, rootElementRef]);

  const handleScrollToTop = () => {
    virtualizer.scrollToIndex(0, {
      align: 'start',
    });
    if (onScrollStateReset) {
      onScrollStateReset();
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Box ref={rootElementRef}>
      <Box
        customStyle="relative"
        style={{
          height: virtualizer.getTotalSize(),
        }}
      >
        <Box
          customStyle={`absolute w-full top-0 left-0`}
          style={{
            transform: `translateY(${items[0].start - virtualizer.options.scrollMargin}px)`,
          }}
        >
          {requestStatus === 'loading' && isFetchingPreviousPage && (
            <Box customStyle="p-8 w-full">
              <Spinner />
            </Box>
          )}
          {children({
            items,
            allEntries,
            measureElementRef: virtualizer.measureElement,
            isFetchingNextPage,
            itemSpacing,
          })}
          {isFetchingNextPage && (
            <Box customStyle="p-8 w-full">
              <Spinner />
            </Box>
          )}
        </Box>
        <ScrollTopWrapper placement={scrollTopButtonPlacement}>
          <ScrollTopButton hide={hideScrollTop} onClick={handleScrollToTop} />
        </ScrollTopWrapper>
      </Box>
    </Box>
  );
}

export default EntryList;
