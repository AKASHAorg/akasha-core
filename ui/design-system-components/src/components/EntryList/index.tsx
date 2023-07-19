// react component used to list entries

import * as React from 'react';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import { elementScroll, useWindowVirtualizer } from '@tanstack/react-virtual';
import { IEntryData } from '@akashaorg/typings/ui';

export type EntryGetterProps = {
  entryData: IEntryData;
  entryIndex: number;
  itemSpacing?: number;
  totalEntryCount: number;
};

export type EntryListProps = {
  pages: Record<string, any>[];
  children?: (props: EntryGetterProps) => React.ReactElement;
  onLoadMore: () => void;
  itemSpacing?: number;
  requestStatus: 'success' | 'loading' | 'error' | 'idle';
  hasNextPage?: boolean;
  languageDirection?: 'ltr' | 'rtl';
  isFetchingNextPage?: boolean;
};

function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

const EntryList = (props: EntryListProps) => {
  const {
    pages,
    itemSpacing = 0,
    onLoadMore,
    // viewAllEntry,
    languageDirection = 'ltr',
    hasNextPage,
    isFetchingNextPage,
    requestStatus,
  } = props;
  const [hideScrollTop, setHideScrollTop] = React.useState(true);
  const rootElementRef = React.useRef<HTMLDivElement>();
  const scrollingRef = React.useRef<number>();

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

  const scrollToFn = React.useCallback((offset, canSmooth, instance) => {
    const duration = 1000;
    const start = rootElementRef.current?.scrollTop || 0;
    const startTime = (scrollingRef.current = Date.now());

    const run = () => {
      if (scrollingRef.current !== startTime) return;
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
      const interpolated = start + (offset - start) * progress;

      if (elapsed < duration) {
        elementScroll(interpolated, canSmooth, instance);
        requestAnimationFrame(run);
      } else {
        elementScroll(interpolated, canSmooth, instance);
      }
    };

    requestAnimationFrame(run);
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: hasNextPage ? allEntries.length + 1 : allEntries.length,
    estimateSize: () => 100,
    scrollMargin: rootElementOffset.current,
    scrollToFn,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    languageDirection,
    rootElementRef,
    //We want to calculate scroll top button placement whenever the scroll top flag changes as browser may have resized
    hideScrollTop,
  ]);

  const handleScrollToTop = () => {
    virtualizer.scrollToIndex(0);
  };

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
            const { key, index } = vItem;
            const item = allEntries[index];
            const isLoader = index > allEntries.length - 1;
            const Card = props.children?.({
              entryData: item,
              entryIndex: index,
              itemSpacing,
              totalEntryCount: allEntries.length,
            });
            return (
              <div key={key} data-index={index} ref={virtualizer.measureElement}>
                <div>
                  {(isLoader || isFetchingNextPage) && (
                    <Box customStyle="p-8 w-full">
                      <Spinner />
                    </Box>
                  )}
                  {!isLoader && Card && <>{Card}</>}
                  {!Card && <>Nothing to render, children props missing in EntryList</>}
                </div>
              </div>
            );
          })}
          {requestStatus === 'loading' && !isFetchingNextPage && (
            <Box customStyle="p-8 w-full">
              <Spinner />
            </Box>
          )}
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
        {/*{viewAllEntry && pages[0]?.total > viewAllEntry.limit && (*/}
        {/*  <Anchor*/}
        {/*    onClick={e => {*/}
        {/*      e.preventDefault();*/}
        {/*      viewAllEntry.onClick();*/}
        {/*    }}*/}
        {/*    target="_self"*/}
        {/*    color="accentText"*/}
        {/*    customStyle="font-bold text-lg ml-2 no-underline	"*/}
        {/*  >*/}
        {/*    {viewAllEntry.label}*/}
        {/*  </Anchor>*/}
        {/*)}*/}
        {/*{!viewAllEntry && (requestStatus === 'loading' || hasNextPage) && (*/}
        {/*  <Box customStyle="p-8" ref={loadmoreRef}>*/}
        {/*    <Spinner />*/}
        {/*  </Box>*/}
        {/*)}*/}
        <ScrollTopWrapper placement={scrollTopButtonPlacement}>
          <ScrollTopButton hide={hideScrollTop} onClick={handleScrollToTop} />
        </ScrollTopWrapper>
      </div>
    </div>
  );
};

export default React.memo(EntryList);
