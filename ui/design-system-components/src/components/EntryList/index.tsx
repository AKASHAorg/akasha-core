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
  startItemId: string;
  startItemOffset: number;
  measurementsCache: VirtualItem[];
  scrollDirection: Virtualizer<Window, HTMLElement>['scrollDirection'];
  itemsCount: number;
  lastItemId?: string;
  firstItemId?: string;
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
  onScrollStateChange?: (scrollerState: ScrollerState) => void;
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

  const rootElementOffset = React.useRef(0);

  const allEntries = React.useMemo(() => {
    if (pages) {
      return pages.flatMap(page => page);
    }
    return [];
  }, [pages]);

  React.useLayoutEffect(() => {
    rootElementOffset.current = rootElementRef.current?.offsetTop || 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: hasNextPage ? allEntries.length + 1 : allEntries.length,
    estimateSize: () => 100,
    scrollMargin: rootElementOffset.current,
    initialOffset: initialScrollState?.startItemOffset || 0,
    initialMeasurementsCache: initialScrollState?.measurementsCache,
    scrollingDelay: 250,
    getItemKey: index => getItemKey(index, allEntries),
    onChange: vInstance => {
      // only save the state when isScrolling
      if (!vInstance.isScrolling) {
        return;
      }
      const vItems = vInstance.getVirtualItems();
      if (!vItems.length || !allEntries.length) {
        return;
      }
      const startItemId = allEntries[vItems[0].index]['id'];
      const { startIndex } = vInstance.range;
      const [offset] = vInstance.getOffsetForIndex(startIndex, 'center');
      if (onScrollStateChange) {
        onScrollStateChange({
          startItemId,
          startItemOffset: offset,
          measurementsCache: vInstance.measurementsCache,
          scrollDirection: vInstance.scrollDirection,
          itemsCount: allEntries.length,
          lastItemId: allEntries[allEntries.length - 1]['id'],
          firstItemId: allEntries[0]['id'],
        });
      }
    },
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
            allEntries,
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
