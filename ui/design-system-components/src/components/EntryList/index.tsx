// react component used to list entries

import * as React from 'react';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import { useWindowVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { IEntryData } from '@akashaorg/typings/ui';

export type CardListProps = {
  items: VirtualItem[];
  allEntries: IEntryData[];
  itemSpacing?: number;
  measureElementRef: (node: Element) => void;
  isFetchingNextPage?: boolean;
};

export type EntryListProps = {
  pages: Record<string, any>[];
  children?: (props: CardListProps) => React.ReactElement[];
  onLoadMore: () => void;
  itemSpacing?: number;
  requestStatus: 'success' | 'loading' | 'error' | 'idle';
  hasNextPage?: boolean;
  languageDirection?: 'ltr' | 'rtl';
  isFetchingNextPage?: boolean;
};

const EntryList: React.FC<EntryListProps> = props => {
  const {
    pages,
    itemSpacing = 0,
    onLoadMore,
    languageDirection = 'ltr',
    hasNextPage,
    isFetchingNextPage,
    requestStatus,
    children,
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
  });
  const items = virtualizer.getVirtualItems();
  /**
   * Handle load more
   */
  React.useEffect(() => {
    const [lastItem] = [...items].reverse();
    if (!lastItem) {
      return;
    }
    if (lastItem.index >= allEntries.length - 1 && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [hasNextPage, items, onLoadMore, isFetchingNextPage, allEntries.length]);
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
    virtualizer.scrollToIndex(0);
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
          {children({
            items,
            allEntries,
            measureElementRef: virtualizer.measureElement,
            isFetchingNextPage,
            itemSpacing,
          })}
          {requestStatus === 'loading' && !isFetchingNextPage && (
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
};

export default React.memo(EntryList);
