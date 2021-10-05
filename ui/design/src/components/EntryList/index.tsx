// react component used to list entries

import Spinner from '../Spinner';
import * as React from 'react';
import useIntersectionObserver from '../../utils/intersection-observer';
import { Box } from 'grommet';

export interface EntryPage {
  results: string[];
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
}

const EntryList = (props: EntryListProps) => {
  const { pages, itemCard, itemSpacing = 0, onLoadMore, pageKeyPrefix = 'page' } = props;
  const loadmoreRef = React.createRef<HTMLDivElement>();

  useIntersectionObserver({
    target: loadmoreRef,
    onIntersect: onLoadMore,
    threshold: 0,
  });

  return (
    <>
      {pages.map((page, index) => (
        <div data-page-idx={index} key={`${pageKeyPrefix}-${index}`}>
          {page.results.map((entryId, index) => (
            <div style={{ marginBottom: itemSpacing }} key={entryId}>
              {React.cloneElement(itemCard, {
                itemId: entryId,
                index,
                className: `entry-${entryId}`,
              })}
            </div>
          ))}
        </div>
      ))}
      {(props.status === 'loading' || props.hasNextPage) && (
        <Box pad="medium">
          <Spinner ref={loadmoreRef} />
        </Box>
      )}
    </>
  );
};
EntryList.whyDidYouRender = true;
export default React.memo(EntryList);
