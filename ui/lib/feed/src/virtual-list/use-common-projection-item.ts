import * as React from 'react';
import { Rect } from './rect';
import type { VirtualDataItem, VirtualItem } from './virtual-item-renderer';
import type { MountedItem } from './use-projection';
import { findFirstInView } from '../utils';

type UseCommonProjectionProps<T> = {
  isAtTop: () => boolean;
  hasPreviousPage: boolean;
  getProjection: (stateMounted: VirtualItem[], itemList: VirtualDataItem<T>[]) => MountedItem<T>[];
  getItemHeights: () => Map<string, number>;
  itemList: VirtualDataItem<T>[];
  getItemHeight: (itemKey: string) => number;
  isInitialPlacement: boolean;
  stateItems: VirtualItem[];
  viewportRect: Rect;
};

export const useCommonProjectionItem = <T>(props: UseCommonProjectionProps<T>) => {
  const {
    isInitialPlacement,
    stateItems,
    viewportRect,
    isAtTop,
    hasPreviousPage,
    getProjection,
    getItemHeights,
    itemList,
  } = props;

  const getReferenceItems = React.useCallback(
    (isInitialPlacement: boolean, stateItems: VirtualItem[]) => {
      return getProjection(stateItems, itemList).filter(
        it =>
          it.virtualData.maybeRef &&
          (isInitialPlacement || !!getItemHeights().get(it.virtualData.key)),
      );
    },
    [getItemHeights, getProjection, itemList],
  );

  return React.useMemo(() // viewportRect: Rect,
  // isInitialPlacement: boolean,
  // stateItems: VirtualItem[],
  : VirtualItem | undefined => {
    const atTop = !isInitialPlacement && isAtTop() && !hasPreviousPage;
    if (atTop) {
      const item = itemList[0];
      return item
        ? {
            key: item.key,
            start: 0,
            height: 0,
            visible: false,
            maybeRef: false,
          }
        : undefined;
    }

    const refItems = getReferenceItems(isInitialPlacement, stateItems);
    const firstRefInView = findFirstInView(refItems, (current, prev) => {
      const currentRect = new Rect(current.start, getItemHeights().get(current.virtualData.key));
      const prevRect = new Rect(prev.start, getItemHeights().get(prev.virtualData.key));
      const isVisible =
        Rect.visibleFactor(currentRect, viewportRect) - Rect.visibleFactor(prevRect, viewportRect);
      const hasVisibleHeight =
        Rect.getVisibleHeight(prevRect, viewportRect) -
        Rect.getVisibleHeight(currentRect, viewportRect);
      return isVisible || hasVisibleHeight;
    });
    if (firstRefInView) {
      return {
        key: firstRefInView.virtualData.key,
        start: firstRefInView.start,
        height: 0,
        visible: false,
        maybeRef: firstRefInView.virtualData.maybeRef,
      };
    }
    const firstRef = refItems[0];
    if (firstRef) {
      return {
        key: firstRef.virtualData.key,
        start: firstRef.start,
        height: firstRef.height,
        visible: false,
        maybeRef: firstRef.virtualData.maybeRef,
      };
    }
    const listFirst = itemList[0];
    if (listFirst) {
      return {
        key: listFirst.key,
        height: 0,
        start: 0,
        visible: false,
        maybeRef: listFirst.maybeRef,
      };
    }
  }, [
    getItemHeights,
    getReferenceItems,
    hasPreviousPage,
    isAtTop,
    isInitialPlacement,
    itemList,
    stateItems,
    viewportRect,
  ]);
};
