import * as React from 'react';
import { VirtualDataItem, VirtualItem } from './virtual-item-renderer';
import { Rect } from './rect';
import { findFirstInView, getVisibleItemsSlice } from '../utils';

export type MountedItem<T> = {
  start: number;
  height: number;
  virtualData: VirtualDataItem<T>;
  visible?: boolean;
};

export type UseProjectionProps<T> = {
  mountedItems: VirtualItem[];
  itemList: VirtualDataItem<T>[];
  isInitialPlacement: boolean;
  isAtTop: () => boolean;
  itemHeights: Map<string, number>;
  overscan: number;
  getDistanceFromTop: (itemKey: string) => number;
  getItemHeight: (itemKey: string) => number;
  itemHeightAverage: number;
  hasNextPage: boolean;
};

export const useProjection = <T>(props: UseProjectionProps<T>) => {
  const {
    getDistanceFromTop,
    isAtTop,
    overscan,
    itemHeights,
    mountedItems,
    itemList,
    isInitialPlacement,
    getItemHeight,
    itemHeightAverage,
    hasNextPage,
  } = props;

  const slice = React.useRef({ start: 0, end: 0 });

  const projection = React.useMemo(() => {
    return mountedItems.reduce((acc, mountedItem) => {
      const itemData = itemList.find(it => it.key === mountedItem.key);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { key, ...rest } = mountedItem;
      if (itemData) {
        acc.push({
          ...rest,
          virtualData: itemData,
        });
      }
      return acc;
    }, [] as MountedItem<T>[]);
  }, [mountedItems, itemList]);

  const getReferenceItems = React.useCallback(() => {
    return projection.filter(
      it =>
        it.virtualData.maybeRef && (isInitialPlacement || !!itemHeights.get(it.virtualData.key)),
    );
  }, [projection, isInitialPlacement, itemHeights]);

  const getCommonProjectionItem = React.useCallback(
    (viewportRect: Rect): VirtualItem | undefined => {
      const atTop = !isInitialPlacement && isAtTop();
      if (atTop) {
        const item = itemList.at(0);
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
      const refItems = getReferenceItems();
      const firstRefInView = findFirstInView(refItems, (prev, current) => {
        const prevRect = new Rect(prev.start, prev.height);
        const currentRect = new Rect(current.start, current.height);
        const isVisible =
          Rect.visibleFactor(prevRect, viewportRect) -
          Rect.visibleFactor(currentRect, viewportRect);
        const hasVisibleHeight =
          Rect.getVisibleHeight(currentRect, viewportRect) -
          Rect.getVisibleHeight(prevRect, viewportRect);
        return isVisible || hasVisibleHeight;
      });

      if (firstRefInView) {
        return {
          key: firstRefInView.virtualData.key,
          start: firstRefInView.start,
          height: firstRefInView.height,
          visible: false,
          maybeRef: false,
        };
      }
      const firstRef = refItems.at(0);
      if (firstRef) {
        return {
          key: firstRef.virtualData.key,
          start: firstRef.start,
          height: firstRef.height,
          visible: false,
          maybeRef: false,
        };
      }
      const listFirst = itemList.at(0);
      if (listFirst) {
        return {
          key: listFirst.key,
          height: 0,
          start: 0,
          visible: false,
          maybeRef: false,
        };
      }
    },
    [getReferenceItems, isAtTop, isInitialPlacement, itemList],
  );
  const getAllVirtualItems = React.useMemo(
    () => (startItem: VirtualItem) => {
      const topDistance = getDistanceFromTop(startItem.key);
      let offset = startItem.start - topDistance;
      const items: VirtualItem[] = [];
      itemList.forEach(item => {
        const height = getItemHeight(item.key);
        items.push({
          key: item.key,
          start: offset,
          visible: itemHeights.has(item.key),
          maybeRef: item.maybeRef,
          height,
        });
        offset += height;
      });
      return items;
    },
    [getDistanceFromTop, getItemHeight, itemHeights, itemList],
  );

  const getSlice = React.useCallback(
    (alreadyRendered: boolean, visibleSlice: { start: number; end: number }) => {
      if (alreadyRendered) {
        return visibleSlice;
      }
      if (
        visibleSlice.start >= slice.current.start &&
        visibleSlice.end <= slice.current.end &&
        slice.current.end - slice.current.start <= overscan
      ) {
        return slice.current;
      }
      if (visibleSlice.start >= slice.current.end || visibleSlice.end <= slice.current.start) {
        return visibleSlice;
      }
      const minViewportRatio = Math.max(
        slice.current.start - visibleSlice.start,
        visibleSlice.end - slice.current.end,
        0,
      );
      return {
        start: Math.min(slice.current.start + minViewportRatio, visibleSlice.start),
        end: Math.max(slice.current.end - minViewportRatio, visibleSlice.end),
      };
    },
    [overscan],
  );

  const getNextProjection = React.useCallback(
    (startItem: VirtualItem, viewportRect: Rect, alreadyRendered: boolean) => {
      const minOffscreenHeight = Math.floor(viewportRect.getHeight() + itemHeightAverage);
      const maxOffcreenHeight = Math.floor(viewportRect.getHeight() + overscan * itemHeightAverage);

      const minViewportRect = new Rect(
        viewportRect.getTop() - minOffscreenHeight,
        viewportRect.getHeight() + 2 * minOffscreenHeight,
      );
      const maxViewportRect = new Rect(
        viewportRect.getTop() - maxOffcreenHeight,
        viewportRect.getHeight() + 2 * maxOffcreenHeight,
      );

      const allItems = getAllVirtualItems(startItem);
      const visibleItems = allItems.filter(it =>
        Rect.fromItem(it).overlaps(
          alreadyRendered && !hasNextPage ? maxViewportRect : minViewportRect,
        ),
      );
      const visibleSlice = getVisibleItemsSlice(visibleItems, allItems);
      slice.current = getSlice(alreadyRendered, visibleSlice);
      const nextRendered = allItems.slice(slice.current.start, slice.current.end);

      return { allItems, nextRendered, slice };
    },
    [getAllVirtualItems, getSlice, hasNextPage, itemHeightAverage, overscan],
  );

  return {
    projection,
    getCommonProjectionItem,
    getNextProjection,
  };
};
