import React from 'react';
import { InfiniteScroll, Box } from 'grommet';

export interface IVirtualListProps {
  items: any[];
  loadMore: () => void;
}
export interface IListItemProps {
  item: {
    entryId: string;
  };
}

const Item = (props: IListItemProps) => {
  return <Box>{props.item.entryId}</Box>;
};

const VirtualList = (props: IVirtualListProps) => {
  return (
    <InfiniteScroll items={props.items} onMore={props.loadMore}>
      {item => <Item key={item.entryId} item={item} />}
    </InfiniteScroll>
  );
};

export default VirtualList;
