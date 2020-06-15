import {
  ISliceOperation,
  IListContentProps,
  ItemDimensionsRef,
  IInfiniteScrollState,
  IScrollState,
  SetSliceOperationType,
  ISliceOperatorProps,
} from './interfaces';

const computeSliceEnd = (
  startIdx: number,
  items: IListContentProps['items'],
  itemDimensionsRef: ItemDimensionsRef,
  itemSpacing: number,
  scrollState: React.MutableRefObject<IScrollState>,
  offsetItems: number,
) => {
  const { clientHeight } = scrollState.current;
  const offsetItemsHeight = offsetItems * itemDimensionsRef.current.avgItemHeight;
  const requiredHeight = Math.ceil(clientHeight + offsetItemsHeight * 2);
  let accHeight = 0;
  let sliceEndIdx = items.length - 1;
  for (let i = startIdx; i < items.length; i++) {
    const itemId = items[i];
    let itemHeight = itemDimensionsRef.current.avgItemHeight;
    if (itemDimensionsRef.current.dimensions[itemId]) {
      itemHeight = itemDimensionsRef.current.dimensions[itemId].height;
    }
    if (itemHeight + itemSpacing + accHeight >= requiredHeight) {
      sliceEndIdx = i;
      break;
    }
    accHeight += itemHeight;
  }
  return sliceEndIdx;
};

export const getInfiniteScrollState = (
  sliceOperation: ISliceOperation | null,
  items: IListContentProps['items'],
  itemDimensions: ItemDimensionsRef,
  itemSpacing: number,
  initialPaddingTop: number,
  scrollState: React.MutableRefObject<IScrollState>,
  offsetItems: number,
): IInfiniteScrollState => {
  let viewableItems = items.slice();
  let paddingTop = initialPaddingTop;
  let paddingBottom = 10;
  const sliceRange = {
    start: 0,
    end: items.length,
  };

  if (sliceOperation) {
    sliceRange.start = sliceOperation.size;
    sliceRange.end = computeSliceEnd(
      sliceOperation.size,
      items,
      itemDimensions,
      itemSpacing,
      scrollState,
      offsetItems,
    );
  }

  viewableItems = viewableItems.slice(sliceRange.start, sliceRange.end + 1);
  // calculate top padding
  paddingTop = items.slice(0, sliceRange.start).reduce((total, itemId) => {
    if (itemDimensions.current.dimensions[itemId]) {
      return total + itemDimensions.current.dimensions[itemId].height + itemSpacing;
    }
    return total + itemDimensions.current.avgItemHeight + itemSpacing;
  }, initialPaddingTop);
  // calculate bottom padding
  paddingBottom = items.slice(sliceRange.end, items.length - 1).reduce((total, itemId) => {
    if (itemDimensions.current.dimensions[itemId]) {
      return total + itemDimensions.current.dimensions[itemId].height + itemSpacing;
    }
    return total + itemDimensions.current.avgItemHeight + itemSpacing;
  }, 0);

  return {
    paddingTop,
    paddingBottom,
    items: viewableItems,
  };
};

export const markCompletedFetchRequests = (
  fetchOperation: ISliceOperatorProps['fetchOperation'],
  setFetchOperation: ISliceOperatorProps['setFetchOperation'],
  items: ISliceOperatorProps['items'],
  itemDimensions: ItemDimensionsRef,
  loadLimit: number,
  listState: ISliceOperatorProps['listState'],
  setListState: ISliceOperatorProps['setListState'],
) => {
  if (!fetchOperation) {
    return;
  }
  const { startId, position } = fetchOperation;
  const startIdIdx = items.findIndex(itemId => itemId === startId);
  // expect to have new items added in front of the old list
  if (position === 'start' && items[startIdIdx - 1] && listState.hasNewerEntries) {
    // we've started the fetch at index = 0 and now the index should be
    // previousIndex + loadLimit (0 + loadLimit)
    const newerItemsReceived = startIdIdx >= loadLimit;
    if (newerItemsReceived) {
      setFetchOperation({
        ...fetchOperation,
        status: 'completed',
      });
      setListState({
        ...listState,
        startId: items[0],
        hasNewerEntries: true,
      });
    }
  }
  // expecting to have new items inserted at the bottom of the old list
  // aka list.push()
  if (position === 'end' && items[startIdIdx + 1]) {
    const firstNewItemRendered =
      itemDimensions.current.dimensions[items[startIdIdx + 1]] &&
      itemDimensions.current.dimensions[items[startIdIdx + 1]].height;
    if (firstNewItemRendered) {
      setFetchOperation({
        ...fetchOperation,
        status: 'completed',
      });
    }
  }
};

export const loadMoreItems = (
  fetchOperation: ISliceOperatorProps['fetchOperation'],
  setFetchOperation: ISliceOperatorProps['setFetchOperation'],
  items: ISliceOperatorProps['items'],
  itemDimensions: ItemDimensionsRef,
  scrollState: IScrollState,
  offsetItems: number,
  loadLimit: number,
  initialPaddingTop: number,
  infiniteScrollState: IInfiniteScrollState,
  hasMoreItems: boolean,
) => {
  const { direction, scrollTop, clientHeight, scrollHeight } = scrollState;
  const queueHasOpType =
    fetchOperation &&
    (fetchOperation.status === 'pending' || fetchOperation.status === 'requested');
  const { avgItemHeight } = itemDimensions.current;
  /**
   * Note: we are checking if the items dimensions object has the same number of keys as the items.length
   * to prevent chaotic calls to loadmore...
   * This means that the items are rendered and we are now know the dimensions of them to compute if we need more items
   */
  const loadMoreBottomTrigger =
    direction === 1 &&
    infiniteScrollState.paddingBottom < avgItemHeight &&
    items.length === itemDimensions.current.count &&
    scrollTop + clientHeight >= scrollHeight - offsetItems * avgItemHeight;

  const loadMoreTopTrigger =
    direction === 0 &&
    infiniteScrollState.paddingTop - initialPaddingTop < avgItemHeight &&
    scrollTop <= (offsetItems + 1) * avgItemHeight;

  if (loadMoreBottomTrigger && !queueHasOpType && hasMoreItems) {
    setFetchOperation({
      startId: items[items.length - 1],
      position: 'end',
      size: loadLimit,
      status: 'pending',
    });
  } else if (loadMoreTopTrigger && !queueHasOpType && hasMoreItems) {
    setFetchOperation({
      startId: items[0],
      position: 'start',
      size: loadLimit,
      status: 'pending',
    });
  }
};

/**
 * Check if we need to slice from the start of the list
 * Conditions:
 *  - should have enough space at top
 * Simple Schematics:
 *
 *      ************ ----              ---
 *      * scrolled *   | scrollTop      |
 *      *          *   |                |
 *      ************ ----               |
 *      *          *  |                 |
 *      * viewport *  | clientHeight    |
 *      *          *  |                 | scrollHeight
 *      ************ ----               |
 *      *remaining *                    |
 *      *          *                    |
 *      ************                   ___
 *
 */

export const updateTopSlice = (
  items: ISliceOperatorProps['items'],
  sliceOperation: ISliceOperatorProps['sliceOperation'],
  setSliceOperation: SetSliceOperationType,
  scrollState: IScrollState,
  _: IInfiniteScrollState,
  offsetItemsHeight: number,
  itemDimensionsRef: ItemDimensionsRef,
  itemSpacing: number,
): void => {
  const { scrollTop } = scrollState;
  const sliceHeight = scrollTop - offsetItemsHeight;
  let sliceSize = 0;
  let tempHeight = 0;
  for (let i = 0; i < items.length; i++) {
    const itemId = items[i];
    const itemDimensions =
      itemDimensionsRef.current.dimensions[itemId] || itemDimensionsRef.current.avgItemHeight;
    if (tempHeight + itemDimensions.height > sliceHeight) {
      sliceSize = i;
      break;
    }
    tempHeight += itemDimensions.height + itemSpacing;
  }
  if (sliceOperation) {
    // update operation if it's needed
    if (sliceOperation.size !== sliceSize) {
      setSliceOperation(prevSlice => ({
        ...prevSlice,
        size: sliceSize,
      }));
    }
  } else {
    // create operation
    setSliceOperation({
      position: 'start',
      size: sliceSize,
    });
  }
};

export const handleSlicingOperations = (
  sliceOperation: ISliceOperatorProps['sliceOperation'],
  setSliceOperation: ISliceOperatorProps['setSliceOperation'],
  items: ISliceOperatorProps['items'],
  scrollState: IScrollState,
  offsetItems: number,
  infiniteScrollState: IInfiniteScrollState,
  itemDimensions: ItemDimensionsRef,
  itemSpacing: number,
) => {
  const offsetItemsHeight = offsetItems * itemDimensions.current.avgItemHeight;

  updateTopSlice(
    items,
    sliceOperation,
    setSliceOperation,
    scrollState,
    infiniteScrollState,
    offsetItemsHeight,
    itemDimensions,
    itemSpacing,
  );
};
