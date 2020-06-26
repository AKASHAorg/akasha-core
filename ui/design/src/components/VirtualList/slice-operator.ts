import * as React from 'react';
import { ISliceOperatorProps, IScrollState, IInfiniteScrollState } from './interfaces';
import { markCompletedFetchRequests, loadMoreItems, handleSlicingOperations } from './utils';

export interface ISliceOperatorInterface {
  handleContainerScroll: (
    scrollState: React.MutableRefObject<IScrollState>,
    infiniteScrollState: IInfiniteScrollState,
    items: ISliceOperatorProps['items'],
    itemDimensions: ISliceOperatorProps['itemDimensions'],
  ) => void;
}

/*
 * Component that creates or updates fetch operations and slice operations
 */
const SliceOperator = (props: ISliceOperatorProps, ref: React.RefObject<any>) => {
  const {
    fetchOperation,
    setFetchOperation,
    sliceOperation,
    setSliceOperation,
    loadLimit,
    offsetItems,
    // initialPaddingTop,
    itemSpacing,
    listState,
    setListState,
    hasMoreItems,
  } = props;
  React.useImperativeHandle(
    ref,
    (): ISliceOperatorInterface => ({
      handleContainerScroll: (scrollStateRef, infiniteScrollState, items, itemDimensions) => {
        markCompletedFetchRequests(
          fetchOperation,
          setFetchOperation,
          items,
          itemDimensions,
          loadLimit,
          listState,
          setListState,
        );
        loadMoreItems(
          fetchOperation,
          setFetchOperation,
          items,
          itemDimensions,
          scrollStateRef.current,
          offsetItems,
          loadLimit,
          // initialPaddingTop,
          infiniteScrollState,
          hasMoreItems,
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
