// react component used to list entries

import * as React from 'react';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

export type EntryListProps = {
  pages: any[];
  itemCard: React.ReactElement;
  onLoadMore: () => void;
  itemSpacing?: number;
  requestStatus: 'success' | 'loading' | 'error' | 'idle';
  hasNextPage?: boolean;
  /* string to be prepended to the page iteration index */
  pageKeyPrefix?: string;
  viewAllEntry?: { onClick: () => void; label: string; limit: number };
  languageDirection?: 'ltr' | 'rtl';
  isFetchingNextPage?: boolean;
};

const handleScrollToTop = () => {
  const currentScrollPos = document.documentElement.scrollTop || document.body.scrollTop;
  document.documentElement.scrollTo({
    top: 0,
    behavior: currentScrollPos > 10000 ? 'auto' : 'smooth',
  });
};

const EntryList = (props: EntryListProps) => {
  const {
    pages,
    itemCard,
    itemSpacing = 0,
    onLoadMore,
    pageKeyPrefix = 'page',
    viewAllEntry,
    languageDirection = 'ltr',
    hasNextPage,
    isFetchingNextPage,
    requestStatus,
  } = props;
  const [hideScrollTop, setHideScrollTop] = React.useState(true);
  const rootElementRef = React.useRef<HTMLDivElement>();
  const rootElementOffset = React.useRef(0);
  const loadmoreRef = React.createRef<HTMLDivElement>();
  // const startScrollRef = React.createRef<HTMLDivElement>();

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
  }, [hasNextPage, items, onLoadMore]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    languageDirection,
    rootElementRef,
    //We want to calculate scroll top button placement whenever the scroll top flag changes as browser may have resized
    hideScrollTop,
  ]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div ref={rootElementRef}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${items[0].start - virtualizer.options.scrollMargin}px)`,
          }}
        >
          {items.map(vItem => {
            const { key, index, size, start } = vItem;
            const item = allEntries[index];
            const isLoaderRow = index > items.length - 1;
            return (
              <div key={key} data-index={index} ref={virtualizer.measureElement}>
                <div>
                  {isLoaderRow && <div>Loading items</div>}
                  {!isLoaderRow && (
                    <div>
                      Item with index {index} {JSON.stringify(item.content)}
                    </div>
                  )}
                </div>
                {/*{React.cloneElement(itemCard, {*/}
                {/*  itemId: item?.id,*/}
                {/*  index: index,*/}
                {/*  itemSpacing,*/}
                {/*  totalEntry: allEntries.length,*/}
                {/*  className: `entry-${item?.id}`,*/}
                {/*})}*/}
              </div>
            );
          })}
        </div>
        {/*{(viewAllEntry ? pages.slice(0, 1) : pages).map((page, pageIndex) => (*/}
        {/*  <div data-page-idx={pageIndex} key={`${pageKeyPrefix}-${pageIndex}`}>*/}
        {/*    {items(page)?.map((itemId, itemIndex, items) => (*/}
        {/*      <React.Fragment key={itemId}>*/}
        {/*        {pageIndex === 0 && itemIndex === 2 && <div ref={startScrollRef}></div>}*/}
        {/*        {React.cloneElement(itemCard, {*/}
        {/*          itemId,*/}
        {/*          index: itemIndex,*/}
        {/*          itemSpacing,*/}
        {/*          totalEntry: items.length,*/}
        {/*          className: `entry-${itemId}`,*/}
        {/*        })}*/}
        {/*      </React.Fragment>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*))}*/}
        {viewAllEntry && pages[0]?.total > viewAllEntry.limit && (
          <Anchor
            onClick={e => {
              e.preventDefault();
              viewAllEntry.onClick();
            }}
            target="_self"
            color="accentText"
            customStyle="font-bold text-lg ml-2 no-underline	"
          >
            {viewAllEntry.label}
          </Anchor>
        )}
        {!viewAllEntry && (requestStatus === 'loading' || hasNextPage) && (
          <Box customStyle="p-8" ref={loadmoreRef}>
            <Spinner />
          </Box>
        )}
        <ScrollTopWrapper placement={scrollTopButtonPlacement}>
          <ScrollTopButton hide={hideScrollTop} onClick={handleScrollToTop} />
        </ScrollTopWrapper>
      </div>
    </div>
  );
};

export default React.memo(EntryList);
