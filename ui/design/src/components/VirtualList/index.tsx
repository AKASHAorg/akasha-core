import React from 'react';
import { Box } from 'grommet';
import ListContent from './list-content';
import { IVirtualListProps } from './interfaces';

/* ************************
 *
 *  Virtual Scroll List Component
 *  How it works:
 *    - initial request to load items if the `initialState` prop is not provided
 *    - subsequent requests to resolve items is made by each item
 *    - a ref is passed to the nth item from top (configurable via `offsetItems: number`)
 *    - an additional ref is passed to the nth item from bottom (configurable via `offsetItems: number`)
 *    - an intersection observer is used to track these
 *        2 refs (signalling when the top ref is out of viewport / bottom ref entered viewport)
 *
 *    When User is Scrolling down:
 *      - when top ref signal (leaving the viewport) is received
 *        - QueueOperator component will calculate the total list height without `offsetItems`
 *        - QueueOperator will mark those items for deletion
 *        - ListOperator will apply the changes in queue when the first insert is received (more to explain later)
 *      - top ref will move to the next nth item
 *      - when bottom ref signal (entering the viewport) is received
 *        - QueueOperator will calculate the items height below the ref's index
 *        - QueueOperator will add an entry to `requestMore` queue if there are no more entries in the `items` prop
 *        - BoundryLoader Component will trigger the request and some component upper
 *          in hierarchy will empty the requestMore queue when the items are received
 *        - bottom ref will move the the next nth item
 *     When User is Scrolling up:
 *        - wip (basically is the inverse of the scrolling down scenario)
 *
 *     When a adnotation is received:
 *     When a new session begins (refresh)
 *     When user navigates to other pages and returns (back-button):
 *     When a new item is available (published):
 *
 * ************************/

const VirtualList = (props: IVirtualListProps, ref?: React.Ref<any>) => {
  const {
    items,
    itemCard,
    initialPaddingTop = 0,
    itemSpacing = 8,
    loadLimit = 8,
    loadInitialFeed,
    loadItemData,
    itemsData,
    offsetItems = 4,
    loadMore,
    customEntities = [],
    getItemCard,
    initialState = {
      startId: undefined,
      newerEntries: [],
    },
    hasMoreItems,
    bookmarkedItems,
    getNewItemsNotification,
    onItemRead,
  } = props;
  const [listState, setListState] = React.useState(initialState);
  React.useEffect(() => {
    if (
      initialState.newerEntries &&
      initialState.newerEntries.length > listState.newerEntries.length
    ) {
      setListState(initialState);
    }
  }, [initialState.newerEntries]);
  // load initial feed items
  // when resuming session, this must also pass `startId` prop!!
  React.useEffect(() => {
    const payload: {
      limit: number;
      startId: string | null;
    } = {
      limit: loadLimit,
      startId: null,
    };
    if (listState && listState.startId) {
      payload.startId = listState.startId;
    }
    loadInitialFeed(payload);
  }, []);

  return (
    <Box flex={{ grow: 1 }} align="stretch" direction="column">
      <ListContent
        ref={ref}
        offsetItems={offsetItems}
        initialPaddingTop={initialPaddingTop}
        items={items}
        itemCard={itemCard}
        loadItemData={loadItemData}
        loadLimit={loadLimit}
        itemsData={itemsData}
        itemSpacing={itemSpacing}
        onLoadMore={loadMore}
        customEntities={customEntities}
        getItemCard={getItemCard}
        listState={listState}
        setListState={setListState}
        hasMoreItems={hasMoreItems}
        bookmarkedItems={bookmarkedItems}
        getNewItemsNotification={getNewItemsNotification}
        onItemRead={onItemRead}
      />
    </Box>
  );
};

export default React.forwardRef(VirtualList);
