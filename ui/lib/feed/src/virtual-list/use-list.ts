import type { VirtualDataItem, VirtualItem } from './virtual-item-renderer';
import { Rect } from './rect';
import { findLastItem } from '../utils';
import * as React from 'react';

type UseListProps<T> = {
  itemList: VirtualDataItem<T>[];
  getItemDistanceFromTop: (itemKey: string, itemList: VirtualDataItem<T>[]) => number;
};
export const useList = <T>(props: UseListProps<T>) => {
  const { getItemDistanceFromTop, itemList } = props;
  const currentPadding = React.useRef(0);

  const getListTopPadding = React.useCallback(
    (items: VirtualItem[], viewportRect: Rect, documentHeight: number) => {
      const lastItemRef = findLastItem(items, it => it.maybeRef);
      const firstItem = items[0];
      if (!firstItem) {
        currentPadding.current = 0;
        return currentPadding.current;
      }
      const padStartItem = lastItemRef ?? firstItem;
      const height =
        new Rect(padStartItem.start, padStartItem.height).getBottom() -
        new Rect(firstItem.start, firstItem.height).getTop();
      const space = documentHeight - viewportRect.getHeight();
      currentPadding.current = Math.max(0, viewportRect.getHeight() - space - height);
      return currentPadding.current;
    },
    [],
  );

  const getListBottomPadding = React.useCallback(
    (items: VirtualItem[], viewportRect: Rect, viewportBottomOffset: number) => {
      const lastRef = findLastItem(items, it => it.maybeRef);
      const lastItem = items[items.length - 1];

      if (!lastItem) {
        currentPadding.current = 0;
        return 0;
      }

      const lastItemRect = new Rect(lastItem.start, lastItem.height);
      const height =
        lastItemRect.getBottom() -
        (lastRef ? new Rect(lastRef.start, lastRef.height) : lastItemRect).getTop();

      currentPadding.current = Math.max(
        0,
        viewportRect.getHeight() - height + viewportBottomOffset,
      );

      return currentPadding.current;
    },
    [],
  );

  const getListPadding = React.useCallback(
    (items: VirtualItem[], viewportRect: Rect, viewportBottomOffset: number) => {
      // if (hasNextPage) {
      //   return getListTopPadding(items, viewportRect);
      // }
      return getListBottomPadding(items, viewportRect, viewportBottomOffset);
    },
    [getListBottomPadding],
  );

  const getListOffset = React.useCallback(
    (projectionItem: VirtualItem) => {
      if (!projectionItem) {
        return 0;
      }
      const distance = getItemDistanceFromTop(projectionItem.key, itemList);
      return projectionItem.start - distance;
    },
    [getItemDistanceFromTop, itemList],
  );

  const hasCorrection = React.useCallback(
    (projectionItem: VirtualItem) => {
      return getListOffset(projectionItem) !== 0;
    },
    [getListOffset],
  );

  return {
    getListTopPadding,
    getListBottomPadding,
    getListPadding,
    getListOffset,
    hasCorrection,
  };
};
