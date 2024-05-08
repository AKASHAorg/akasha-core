import * as React from 'react';
import { VirtualDataItem, VirtualItem } from './virtual-item-renderer';
import { Rect } from './rect';
import { getVisibleItemsSlice } from '../utils';

export type MountedItem<T> = {
  start: number;
  height: number;
  virtualData: VirtualDataItem<T>;
  visible?: boolean;
};

export type UseProjectionProps<T> = {
  itemList: VirtualDataItem<T>[];
  isInitialPlacement: boolean;
  isAtTop: () => boolean;
  getItemHeights: () => Map<string, number>;
  overscan: number;
  getDistanceFromTop: (itemKey: string, itemList: VirtualDataItem<T>[]) => number;
  getItemHeight: (itemKey: string) => number;
  getItemHeightAverage: () => number;
};

export const useProjection = <T>(props: UseProjectionProps<T>) => {
  const {
    getDistanceFromTop,
    overscan,
    getItemHeights,
    itemList,
    getItemHeight,
    getItemHeightAverage,
  } = props;

  const slice = React.useRef({ start: 0, end: 0 });

  const getProjection = React.useCallback(
    (mountedItems: VirtualItem[], itemList: VirtualDataItem<T>[]) => {
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
    },
    [],
  );

  const getAllVirtualItems = React.useCallback(
    (startItem: VirtualItem) => {
      const items: VirtualItem[] = [startItem];
      const startIdx = itemList.findIndex(it => it.key === startItem.key);
      if (startIdx > 0) {
        let topOffset = startItem.start;
        for (const item of itemList.slice(0, startIdx).reverse()) {
          const itemHeight = getItemHeight(item.key);
          items.unshift({
            key: item.key,
            start: topOffset - itemHeight,
            visible: getItemHeights().has(item.key),
            maybeRef: item.maybeRef,
            height: itemHeight,
          });
          topOffset -= itemHeight;
        }
      }
      let topOffset = startItem.start + getItemHeight(startItem.key);
      for (const item of itemList.slice(startIdx + 1)) {
        // push
        const itemHeight = getItemHeight(item.key);
        items.push({
          key: item.key,
          start: topOffset,
          visible: getItemHeights().has(item.key),
          maybeRef: item.maybeRef,
          height: itemHeight,
        });
        topOffset += itemHeight;
      }
      // //compute slice from startItem to top
      // console.log('here');
      // //compute slice from startItem to last
      //
      // itemList.forEach(item => {
      //   const height = getItemHeight(item.key);
      //   items.push({
      //     key: item.key,
      //     start: offset,
      //     visible: getItemHeights().has(item.key),
      //     maybeRef: item.maybeRef,
      //     height,
      //   });
      //   offset += height;
      // });
      return items;
    },
    [getItemHeight, getItemHeights, itemList],
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
      const minOffscreenHeight = Math.floor(viewportRect.getHeight() + getItemHeightAverage());
      const maxOffscreenHeight = Math.floor(
        viewportRect.getHeight() + overscan * getItemHeightAverage(),
      );

      const minViewportRect = new Rect(
        viewportRect.getTop() - minOffscreenHeight,
        viewportRect.getHeight() + 2 * minOffscreenHeight,
      );

      const maxViewportRect = new Rect(
        viewportRect.getTop() - maxOffscreenHeight,
        viewportRect.getHeight() + 2 * maxOffscreenHeight,
      );

      const allItems = getAllVirtualItems(startItem);
      const visibleItems = allItems.filter(it =>
        Rect.fromItem(it).overlaps(alreadyRendered ? minViewportRect : maxViewportRect),
      );

      const visibleSlice = getVisibleItemsSlice(visibleItems, allItems);
      slice.current = getSlice(alreadyRendered, visibleSlice);
      const nextRendered = allItems.slice(slice.current.start, slice.current.end);

      return { allItems, nextRendered, slice };
    },
    [getAllVirtualItems, getSlice, getItemHeightAverage, overscan],
  );

  const getProjectionCorrection = React.useCallback(
    (nextRendered: VirtualItem[], listOffset: number) => {
      return {
        offset: listOffset,
        rendered: nextRendered.map(item => ({
          ...item,
          start: item.start - listOffset,
        })),
      };
    },
    [],
  );

  return {
    getProjection,
    getNextProjection,
    getProjectionCorrection,
  };
};
