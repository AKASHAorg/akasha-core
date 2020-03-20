import React from 'react';
import { Box } from 'grommet';
import AutoSizer from 'react-virtualized-auto-sizer';
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

const VirtualList = (props: IVirtualListProps) => {
  const {
    items,
    itemCard,
    initialPaddingTop = 0,
    itemSpacing = 8,
    loadLimit = 8,
    loadInitialFeedAction,
    loadItemDataAction,
    itemsData,
    offsetItems = 4,
    loadMoreAction,
    customEntities = [],
    getItemCard,
  } = props;

  // load initial feed items
  // when resuming session, this must also pass `startId` prop!!
  loadInitialFeedAction({ limit: loadLimit }, []);

  return (
    <Box height="100%" flex={true}>
      <div style={{ height: '100%', width: '100%' }}>
        <AutoSizer>
          {({ width, height }) => (
            <ListContent
              offsetItems={offsetItems}
              initialPaddingTop={initialPaddingTop}
              items={items}
              itemCard={itemCard}
              loadItemDataAction={loadItemDataAction}
              loadLimit={loadLimit}
              itemsData={itemsData}
              height={height}
              width={width}
              itemSpacing={itemSpacing}
              onLoadMore={loadMoreAction}
              customEntities={customEntities}
              getItemCard={getItemCard}
            />
          )}
        </AutoSizer>
      </div>
    </Box>
  );
};

export default VirtualList;
