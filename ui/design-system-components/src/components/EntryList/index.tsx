// react component used to list entries

import * as React from 'react';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import useIntersectionObserver from '@akashaorg/design-system-core/lib/utils/intersection-observer';
import { useVirtualizer } from '@tanstack/react-virtual';

export type EntryListProps = {
  pages: any[];
  itemCard: React.ReactElement;
  onLoadMore: () => void;
  itemSpacing?: number;
  status: 'loading' | 'success' | 'error' | 'idle';
  hasNextPage?: boolean;
  /* string to be prepended to the page iteration index */
  pageKeyPrefix?: string;
  viewAllEntry?: { onClick: () => void; label: string; limit: number };
  languageDirection?: 'ltr' | 'rtl';
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
  } = props;
  const [hideScrollTop, setHideScrollTop] = React.useState(true);
  const rootElementRef = React.useRef<HTMLDivElement>();
  const loadmoreRef = React.createRef<HTMLDivElement>();
  const startScrollRef = React.createRef<HTMLDivElement>();

  const virtualizer = useVirtualizer({});

  React.useLayoutEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 0) {
        return setHideScrollTop(false);
      }
      return setHideScrollTop(true);
    };
    window.addEventListener('scroll', onScroll);
  }, []);

  const items = page => (viewAllEntry ? page?.results.slice(0, viewAllEntry.limit) : page?.results);

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

  return (
    <div ref={rootElementRef}>
      {(viewAllEntry ? pages.slice(0, 1) : pages).map((page, pageIndex) => (
        <div data-page-idx={pageIndex} key={`${pageKeyPrefix}-${pageIndex}`}>
          {items(page)?.map((itemId, itemIndex, items) => (
            <React.Fragment key={itemId}>
              {pageIndex === 0 && itemIndex === 2 && <div ref={startScrollRef}></div>}
              {React.cloneElement(itemCard, {
                itemId,
                index: itemIndex,
                itemSpacing,
                totalEntry: items.length,
                className: `entry-${itemId}`,
              })}
            </React.Fragment>
          ))}
        </div>
      ))}
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
      {!viewAllEntry && (props.status === 'loading' || hasNextPage) && (
        <Box customStyle="p-8" ref={loadmoreRef}>
          <Spinner />
        </Box>
      )}
      <ScrollTopWrapper placement={scrollTopButtonPlacement}>
        <ScrollTopButton hide={hideScrollTop} onClick={handleScrollToTop} />
      </ScrollTopWrapper>
    </div>
  );
};

export default React.memo(EntryList);
