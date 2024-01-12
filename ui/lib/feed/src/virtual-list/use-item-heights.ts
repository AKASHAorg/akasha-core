import * as React from 'react';
import { dpr, pxToDPR } from '../utils';
import type { VirtualDataItem, VirtualItem, VirtualItemInterface } from './virtual-item-renderer';

export type UseItemHeightsProps = {
  measurementsCache: Map<string, number>;
  estimatedHeight: number;
  itemSpacing: number;
  overscan: number;
};

export const useItemHeights = (props: UseItemHeightsProps) => {
  const { measurementsCache, estimatedHeight, overscan } = props;
  const itemRendererApis = React.useRef(new Map());
  const overscanRef = React.useRef(overscan);
  const itemHeights = React.useMemo(
    () => measurementsCache ?? new Map<string, number>(),
    [measurementsCache],
  );
  const itemHeightAverage = React.useRef(estimatedHeight);
  const batchedHeightUpdates = React.useRef(new Set());

  const getItemHeights = React.useCallback(() => itemHeights, [itemHeights]);

  const getItemHeight = React.useCallback(
    (itemKey: string) => {
      let itemHeight = itemHeightAverage.current;
      if (itemHeights.has(itemKey)) {
        itemHeight = itemHeights.get(itemKey);
      }
      return pxToDPR(itemHeight, dpr);
    },
    [itemHeights],
  );
  const computeAvgItemHeight = (newHeight: number, listSize: number) => {
    itemHeightAverage.current = (itemHeightAverage.current * (listSize - 1) + newHeight) / listSize;
  };

  const updateItemHeight = React.useCallback(
    (itemKey: string, newHeight: number) => {
      if (itemHeights.has(itemKey)) {
        if (itemHeights.get(itemKey) !== newHeight) {
          console.log('updating existing item height', newHeight, itemHeights.get(itemKey));
          itemHeights.set(itemKey, newHeight);
          computeAvgItemHeight(newHeight, itemHeights.size);
        }
      }
      if (!itemHeights.has(itemKey)) {
        itemHeights.set(itemKey, newHeight);
        computeAvgItemHeight(newHeight, itemHeights.size);
      }
    },
    [itemHeights],
  );
  const hasMeasuredHeights = React.useCallback(
    (items: VirtualItem[]) => {
      return items.some(item => itemHeights.has(item.key));
    },
    [itemHeights],
  );

  const handleItemHeightChange = React.useCallback(
    (
      itemKey: string,
      newHeight: number,
      mountedItems: VirtualItem[],
      update: (debug?: string) => void,
    ) => {
      if (itemHeights.has(itemKey) && itemHeights.get(itemKey) === newHeight) {
        return;
      }
      batchedHeightUpdates.current.add(itemKey);
      // only update when items in state are resized
      if (
        mountedItems.some(
          item => itemHeights.has(item.key) || batchedHeightUpdates.current.has(item.key),
        ) ||
        batchedHeightUpdates.current.size >= overscanRef.current
      ) {
        update('item height update');
        batchedHeightUpdates.current.clear();
      }
    },
    [itemHeights],
  );

  const getItemDistanceFromTop = React.useCallback(
    (itemKey: string, itemList: VirtualDataItem<unknown>[]) => {
      const idx = itemList.findIndex(it => it.key === itemKey);
      if (idx > 0) {
        const sliced = itemList.slice(0, idx);
        const distance = sliced.reduce((distance, item) => {
          return getItemHeight(item.key) + distance;
        }, 0);
        console.log(distance, '<< distance', idx, '<< idx', sliced);
        return distance;
      }
      return 0;
    },
    [getItemHeight],
  );

  const measureItemHeights = React.useCallback(() => {
    itemRendererApis.current.forEach((api, key) => {
      if (!api) return;
      const newHeight = api.measureHeight();
      updateItemHeight(key, newHeight);
    });
  }, [updateItemHeight]);

  const setItemRendererInterface = (itemKey: string) => (ref?: VirtualItemInterface) => {
    itemRendererApis.current.set(itemKey, ref);
  };

  const getItemHeightAverage = React.useCallback(() => itemHeightAverage.current, []);
  return {
    getItemHeights,
    getItemHeight,
    updateItemHeight,
    hasMeasuredHeights,
    getItemDistanceFromTop,
    getItemHeightAverage,
    onItemHeightChange: handleItemHeightChange,
    setItemRendererInterface,
    measureItemHeights,
  };
};
