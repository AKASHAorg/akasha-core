// react component used to list entries

import Spinner from '../Spinner';
import * as React from 'react';
import styled from 'styled-components';
import ScrollTopButton from '../ScrollTopButton';
import useIntersectionObserver from '../../utils/intersection-observer';
import { Anchor, Box } from 'grommet';
import { IEntryPage } from '@akashaorg/typings/ui';

export interface EntryListProps {
  pages: IEntryPage[];
  itemCard: React.ReactElement;
  onLoadMore: () => void;
  itemSpacing?: number;
  status: 'loading' | 'success' | 'error' | 'idle';
  hasNextPage?: boolean;
  /* string to be prepended to the page iteration index */
  pageKeyPrefix?: string;
  viewAllEntry?: { onClick: () => void; label: string; limit: number };
}

const EntryList = (props: EntryListProps) => {
  const {
    pages,
    itemCard,
    itemSpacing = 0,
    onLoadMore,
    pageKeyPrefix = 'page',
    viewAllEntry,
  } = props;
  const loadmoreRef = React.createRef<HTMLDivElement>();
  const scrollTopRef = React.createRef<HTMLDivElement>();
  const scrollTopWrapperRef = React.createRef<HTMLDivElement>();
  const rootElementRef = React.createRef<HTMLDivElement>();
  const startScrollRef = React.createRef<HTMLDivElement>();

  useIntersectionObserver({
    target: loadmoreRef,
    onIntersect: onLoadMore,
    threshold: 0,
  });

  const items = (page: IEntryPage) =>
    viewAllEntry ? page?.results.slice(0, viewAllEntry.limit) : page?.results;

  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        scrollTopWrapperRef.current.style.marginLeft = `${
          rootElementRef.current.clientWidth - 64
        }px`;
        scrollTopRef.current.classList.remove('hideScrollTop');
      }
    });

    if (startScrollRef?.current) {
      observer.observe(startScrollRef?.current);
    }

    return () => observer.disconnect();
  }, [scrollTopRef, startScrollRef, scrollTopWrapperRef, rootElementRef]);

  React.useEffect(() => {
    const scrollStopElement = document.getElementById('scrollTopStop');
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        scrollTopRef.current.classList.add('hideScrollTop');
      }
    });

    if (scrollStopElement) observer.observe(scrollStopElement);

    return () => observer.disconnect();
  }, [scrollTopRef, rootElementRef]);

  return (
    <Root ref={rootElementRef}>
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
          size="large"
          weight="bold"
          target="_self"
          color="accentText"
          margin={{ left: 'large' }}
          style={{ textDecoration: 'none' }}
        >
          {viewAllEntry.label}
        </Anchor>
      )}
      {!viewAllEntry && (props.status === 'loading' || props.hasNextPage) && (
        <Box pad="medium">
          <Spinner ref={loadmoreRef} />
        </Box>
      )}
      <ScrollTopWrapper ref={scrollTopWrapperRef}>
        <ScrollTopButton
          ref={scrollTopRef}
          onClick={() => {
            const currentScrollPos = document.documentElement.scrollTop || document.body.scrollTop;
            document.documentElement.scrollTo({
              top: 0,
              behavior: currentScrollPos > 10000 ? 'auto' : 'smooth',
            });
          }}
          className="hideScrollTop"
        />
      </ScrollTopWrapper>
    </Root>
  );
};

const Root = styled.div`
  position: relative;
  .hideScrollTop {
    display: none;
  }
`;

const ScrollTopWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  z-index: 9;
`;

export default React.memo(EntryList);
