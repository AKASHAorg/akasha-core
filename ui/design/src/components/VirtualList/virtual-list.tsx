import * as React from 'react';
import { IListInitialState, IVirtualListProps } from './interfaces';
import ListViewport from './list-viewport';
import useVirtualScroll from './use-virtual-scroll';

const DEFAULT_OFFSET_ITEMS = 4;
const DEFAULT_ITEM_SPACING = 8;

const VirtualScroll: React.FC<IVirtualListProps> = props => {
  const {
    items,
    itemsData,
    offsetItems = DEFAULT_OFFSET_ITEMS,
    loadInitialFeed,
    getItemCard,
    loadItemData,
    loadMore,
    itemSpacing = DEFAULT_ITEM_SPACING,
    hasMoreItems = true,
    customEntities,
    initialState = {} as IListInitialState,
    showNotificationPill = false,
    getNotificationPill,
  } = props;

  const [listState, handlers] = useVirtualScroll({
    items,
    offsetItems,
    loadMore,
    hasMoreItems,
    avgItemHeight: 200,
    spacing: itemSpacing,
    slice: initialState.slice || [0, items.length],
    startId: initialState.startId,
  });

  const rootContainerRef = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    handlers.setHasMoreItems(hasMoreItems);
  }, [hasMoreItems]);

  React.useEffect(() => {
    if (!items.length) {
      const firstId = listState.startId;
      loadInitialFeed({
        start: firstId,
        reverse: false,
        limit: offsetItems + 3,
      });
    }
  }, []);
  const isFetching = listState.fetchOp.status && listState.fetchOp.status !== 'completed';
  return (
    <div
      ref={rootContainerRef}
      style={{ minHeight: listState.totalItemsHeight + (isFetching ? 100 : 0) }}
    >
      {showNotificationPill &&
        getNotificationPill &&
        getNotificationPill({ styles: { marginTop: 8 } })}
      <ListViewport
        items={items}
        slice={listState.slice}
        itemsData={itemsData}
        height={listState.totalItemsHeight}
        getItemCard={getItemCard}
        onSizeChange={handlers.onItemSizeUpdate}
        loadItemData={loadItemData}
        coordinates={listState.coordinates}
        itemSpacing={itemSpacing}
        customEntities={customEntities}
        isFetching={isFetching}
      />
    </div>
  );
};

export default VirtualScroll;
