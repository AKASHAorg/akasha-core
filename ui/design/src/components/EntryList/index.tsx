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
}

const EntryList = (props: EntryListProps) => {
  const { pages, itemCard, itemSpacing = 0, onLoadMore } = props;
  const loadmoreRef = React.createRef<HTMLDivElement>();
  useIntersectionObserver({
    target: loadmoreRef,
    onIntersect: onLoadMore,
    threshold: 0,
  });

  return (
    <>
      {pages.map((page, index) => (
        <div key={index}>
          {page.results.map((entryId, index) => (
            <div style={{ marginBottom: itemSpacing }} key={index}>
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

export default EntryList;
