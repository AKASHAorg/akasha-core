// react component used to list entries

import Spinner from '../Spinner';
import * as React from 'react';
import useIntersectionObserver from '../../utils/intersection-observer';
import { Anchor, Box } from 'grommet';

export interface EntryPage {
  results: string[];
  total: number;
}

export interface EntryListProps {
  pages: EntryPage[];
  itemCard: React.ReactElement;
  onLoadMore: () => void;
  itemSpacing?: number;
  status: 'loading' | 'success' | 'error' | 'idle';
  hasNextPage?: boolean;
  /* string to be prepended to the page iteration index */
  pageKeyPrefix?: string;
  loadMoreEntry?: { onClick: () => void; label: string; limit: number };
}

const EntryList = (props: EntryListProps) => {
  const {
    pages,
    itemCard,
    itemSpacing = 0,
    onLoadMore,
    pageKeyPrefix = 'page',
    loadMoreEntry,
  } = props;
  const loadmoreRef = React.createRef<HTMLDivElement>();

  useIntersectionObserver({
    target: loadmoreRef,
    onIntersect: onLoadMore,
    threshold: 0,
  });

  const items = (page: EntryPage) =>
    loadMoreEntry ? page?.results.slice(0, loadMoreEntry.limit) : page?.results;

  return (
    <>
      {(loadMoreEntry ? pages.slice(0, 1) : pages).map((page, index) => (
        <div data-page-idx={index} key={`${pageKeyPrefix}-${index}`}>
          {items(page)?.map((entryId, index, items) => (
            <div style={{ marginBottom: itemSpacing }} key={entryId}>
              {React.cloneElement(itemCard, {
                itemId: entryId,
                index,
                totalEntry: items.length,
                className: `entry-${entryId}`,
              })}
            </div>
          ))}
        </div>
      ))}
      {loadMoreEntry && pages[0]?.total > loadMoreEntry.limit && (
        <Anchor
          onClick={e => {
            e.preventDefault();
            loadMoreEntry.onClick();
          }}
          size="large"
          weight="bold"
          target="_self"
          color="accentText"
          margin={{ left: 'large' }}
          style={{ textDecoration: 'none' }}
        >
          {loadMoreEntry.label}
        </Anchor>
      )}
      {!loadMoreEntry && (props.status === 'loading' || props.hasNextPage) && (
        <Box pad="medium">
          <Spinner ref={loadmoreRef} />
        </Box>
      )}
    </>
  );
};
export default React.memo(EntryList);
