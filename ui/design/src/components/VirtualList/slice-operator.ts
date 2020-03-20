import * as React from 'react';
import { IQueueOperatorProps, IScrollState, IInfiniteScrollState } from './interfaces';
import { markCompletedFetchRequests, loadMoreItems, handleSlicingOperations } from './utils';

export interface IQueueOperatorInterface {
  handleContainerScroll: (
    scrollState: React.MutableRefObject<IScrollState>,
    infiniteScrollState: IInfiniteScrollState,
    items: IQueueOperatorProps['items'],
    itemDimensions: IQueueOperatorProps['itemDimensions'],
  ) => void;
}

/*
 * Component that creates or updates fetch operations and slice operations
 */
const SliceOperator = (props: IQueueOperatorProps, ref: React.RefObject<any>) => {
  const {
    fetchOperation,
    setFetchOperation,
    sliceOperation,
    setSliceOperation,
    loadLimit,
    offsetItems,
    initialPaddingTop,
    itemSpacing,
  } = props;

  React.useImperativeHandle(
    ref,
    (): IQueueOperatorInterface => ({
      handleContainerScroll: (scrollStateRef, infiniteScrollState, items, itemDimensions) => {
        markCompletedFetchRequests(fetchOperation, setFetchOperation, items, itemDimensions);
        loadMoreItems(
          fetchOperation,
          setFetchOperation,
          items,
          itemDimensions,
          scrollStateRef.current,
          offsetItems,
          loadLimit,
          initialPaddingTop,
          infiniteScrollState,
        );
        handleSlicingOperations(
          sliceOperation,
          setSliceOperation,
          items,
          scrollStateRef.current,
          offsetItems,
          infiniteScrollState,
          itemDimensions,
          itemSpacing,
        );
      },
    }),
  );
  return null;
};

export default React.forwardRef(SliceOperator);
