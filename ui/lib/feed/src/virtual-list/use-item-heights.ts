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
  const itemHeights = React.useRef(measurementsCache ?? new Map<string, number>());
  const itemHeightAverage = React.useRef(estimatedHeight);
  const batchedHeightUpdates = React.useRef(new Set());

  const getItemHeights = React.useCallback(() => itemHeights.current, [itemHeights]);

  const getItemHeight = React.useCallback((itemKey: string) => {
    let itemHeight = itemHeightAverage.current;
    if (itemHeights.current.has(itemKey)) {
      itemHeight = itemHeights.current.get(itemKey);
    }
    return pxToDPR(itemHeight, dpr);
  }, []);

  const computeAvgItemHeight = (newHeight: number, listSize: number) => {
    itemHeightAverage.current = (itemHeightAverage.current * (listSize - 1) + newHeight) / listSize;
  };

  const updateItemHeight = React.useCallback((itemKey: string, newHeight: number) => {
    if (itemHeights.current.has(itemKey)) {
      if (itemHeights.current.get(itemKey) !== newHeight) {
        itemHeights.current.set(itemKey, newHeight);
        computeAvgItemHeight(newHeight, itemHeights.current.size);
      }
    }
    if (!itemHeights.current.has(itemKey)) {
      itemHeights.current.set(itemKey, newHeight);
      computeAvgItemHeight(newHeight, itemHeights.current.size);
    }
  }, []);

  const hasMeasuredHeights = React.useCallback((items: VirtualItem[]) => {
    return items.every(item => itemHeights.current.has(item.key));
  }, []);

  const handleItemHeightChange = React.useCallback(
    (
      itemKey: string,
      newHeight: number,
      mountedItems: VirtualItem[],
      update: (debug?: string) => void,
    ) => {
      if (itemHeights.current.has(itemKey) && itemHeights.current.get(itemKey) === newHeight) {
        return;
      }
      batchedHeightUpdates.current.add(itemKey);
      // only update when items in state are resized
      if (
        mountedItems.every(
          item => itemHeights.current.has(item.key) || batchedHeightUpdates.current.has(item.key),
        ) ||
        batchedHeightUpdates.current.size >= overscanRef.current
      ) {
        update('item height update');
        batchedHeightUpdates.current.clear();
      }
    },
    [],
  );

  const getItemDistanceFromTop = React.useCallback(
    (itemKey: string, itemList: VirtualDataItem<unknown>[]) => {
      const idx = itemList.findIndex(it => it.key === itemKey);
      if (idx > 0) {
        const sliced = itemList.slice(0, idx);
        return sliced.reduce((distance, item) => {
          return getItemHeight(item.key) + distance;
        }, 0);
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
