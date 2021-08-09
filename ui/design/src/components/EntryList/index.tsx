// react component used to list entries

import * as React from 'react';

export interface EntryPage {
  results: string[];
}

export interface EntryListProps {
  pages: EntryPage[];
  itemCard: React.ReactElement;
  onLoadMore: () => void;
}

const EntryList = (props: EntryListProps) => {
  const { pages, itemCard, onLoadMore } = props;
  return (
    <>
      {pages.map((page, index) => (
        <div key={index}>
          {page.results.map((entryId, index) => (
            <div key={entryId}>Entry {entryId}</div>
          ))}
        </div>
      ))}
    </>
  );
};

export default EntryList;
