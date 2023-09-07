// react component used to list entries

import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import { useWindowVirtualizer, VirtualItem, Virtualizer } from '@tanstack/react-virtual';
import { tw } from '@twind/core';

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
  itemsCount: number;
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
  initialScrollState?: ScrollerState;
  getItemKey?: (index: number, entries: T[]) => string;
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
    onScrollStateChange,
    initialScrollState,
    onScrollStateReset,
    getItemKey,
  } = props;
  const [hideScrollTop, setHideScrollTop] = React.useState(true);
  const rootElementRef = React.useRef<HTMLDivElement>();
  const itemCount = hasNextPage ? pages.length + 1 : pages.length;

  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    estimateSize: () => 100,
    scrollMargin: rootElementRef.current?.offsetTop || 0,
    initialOffset: initialScrollState?.startItemOffset || 0,
    initialMeasurementsCache: initialScrollState?.measurementsCache || [],
    // scrollingDelay: 250,
    getItemKey: index => getItemKey(index, pages),
    onChange: vInstance => {
      const vItems = vInstance.getVirtualItems();
      if (!vItems.length || !pages.length) {
        return;
      }

      const startItemCursor = pages[vItems[0].index]['cursor'];
      const { startIndex, endIndex } = vInstance.range;
      const [offset] = vInstance.getOffsetForIndex(startIndex, 'center');
      if (onScrollStateChange) {
        onScrollStateChange({
          allEntries: pages,
          scrollDirection: vInstance.scrollDirection,
          startItemCursor,
          startItemOffset: offset,
          measurementsCache: vInstance.measurementsCache,
          itemsCount: pages.length,
          visibleCursorRange: {
            startCursor: pages[0]['cursor'],
            endCursor: pages[pages.length - 1]['cursor'],
          },
          visibleIndexRange: {
            start: startIndex,
            end: endIndex,
          },
        });
      }
    },
  });

  const items = virtualizer.getVirtualItems();

  // @TODO: maybe pass the topbar slotId here?
  const topbarHeight = document.getElementById('topbar-slot')?.offsetParent?.clientHeight || 0;
  /**
   * Handle scroll to top button visibility
   */
  React.useLayoutEffect(() => {
    const onScroll = () => {
      if (!rootElementRef.current) {
        return;
      }
      if (window.scrollY > rootElementRef.current.offsetTop + topbarHeight + itemSpacing * 2) {
        return setHideScrollTop(false);
      }
      return setHideScrollTop(true);
    };
    window.addEventListener('scroll', onScroll);
  }, [itemSpacing, topbarHeight]);

  const scrollTopButtonPlacement = React.useMemo(() => {
    if (languageDirection === 'rtl') return 0;
    return rootElementRef.current ? rootElementRef.current.clientWidth - 64 : null;
  }, [languageDirection, rootElementRef]);

  const handleScrollToTop = () => {
    const [offset] = virtualizer.getOffsetForIndex(0, 'start');
    virtualizer.scrollToOffset(offset - topbarHeight - itemSpacing, { align: 'start' });
    if (onScrollStateReset) {
      onScrollStateReset();
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Stack ref={rootElementRef}>
      <div
        className={tw('relative')}
        style={{
          height: virtualizer.getTotalSize(),
        }}
      >
        <div
          className={tw(`absolute w-full top-0 left-0`)}
          style={{
            transform: `translateY(${items[0].start - virtualizer.options.scrollMargin}px)`,
          }}
        >
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
        </div>
        <ScrollTopWrapper placement={scrollTopButtonPlacement}>
          <ScrollTopButton hide={hideScrollTop} onClick={handleScrollToTop} />
        </ScrollTopWrapper>
      </div>
    </Stack>
  );
}

export default EntryList;
