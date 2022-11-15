// react component used to list entries

import Spinner from '../Spinner';
import * as React from 'react';
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

  useIntersectionObserver({
    target: loadmoreRef,
    onIntersect: onLoadMore,
    threshold: 0,
  });

  const items = (page: IEntryPage) =>
    viewAllEntry ? page?.results.slice(0, viewAllEntry.limit) : page?.results;

  return (
    <>
      {(viewAllEntry ? pages.slice(0, 1) : pages).map((page, index) => (
        <div data-page-idx={index} key={`${pageKeyPrefix}-${index}`}>
          {items(page)?.map((entryId, index, items) => (
            <React.Fragment key={entryId}>
              {React.cloneElement(itemCard, {
                itemId: entryId,
                index,
                itemSpacing,
                totalEntry: items.length,
                className: `entry-${entryId}`,
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
    </>
  );
};
export default React.memo(EntryList);
