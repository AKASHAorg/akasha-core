import { VirtualDataItem, VirtualItemInfo } from './virtual-item';
import React from 'react';
import { useUpdateScheduler } from './update-scheduler';
import { isWindow, pxToDPR } from './utils';

export type RenderedItem = {
  start: number;
  item: VirtualDataItem<unknown>;
  visible?: boolean;
};
export type ProjectionProps = {
  estimatedHeight?: number;
  itemList: VirtualDataItem<unknown>[];
  updateScheduler: ReturnType<typeof useUpdateScheduler>;
};

const dpr = isWindow ? window.devicePixelRatio ?? 1 : 1;

export const useProjection = (props: ProjectionProps) => {
  const { itemList, estimatedHeight = 0 } = props;
  const prevItemList = React.useRef<ProjectionProps['itemList']>();
  const prevItemsMap = React.useRef<Map<string, VirtualDataItem<unknown>>>(new Map());
  const itemHeights = React.useRef<Map<string, number>>(new Map());
  const itemHeightAverage = React.useRef(estimatedHeight);
  const itemsMap = React.useMemo(() => {
    const map = new Map<string, VirtualDataItem<unknown>>();
    itemList.forEach(item => map.set(item.key, item));
    return map;
  }, [itemList]);

  const getItemHeight = (itemKey: string) => {
    let itemHeight = itemHeightAverage.current;
    if (itemHeights.current.has(itemKey)) {
      itemHeight = itemHeights.current.get(itemKey);
    }

    return pxToDPR(itemHeight, dpr);
  };

  const updateAverageItemHeight = (newHeight: number) => {
    itemHeightAverage.current =
      (itemHeightAverage.current * (itemList.length - 1) + newHeight) / itemList.length;
  };

  const getInitialProjection = () => {};

  const getFinalProjection = React.useMemo(() => {
    return (renderedItems: VirtualItemInfo[]) => {
      return renderedItems.reduce((acc, item) => {
        const { itemKey, ...rest } = item;
        const itemVirtualData = itemsMap.get(itemKey);
        if (itemVirtualData) {
          acc.push({
            ...rest,
            item: itemVirtualData,
          });
        }
        return acc;
      }, [] as RenderedItem[]);
    };
  }, [itemsMap]);

  return {
    getItemHeight,
    setItemHeight: (itemKey, height) => {
      itemHeights.current.set(itemKey, height);
      updateAverageItemHeight(height);
    },
    getFinalProjection,
    getInitialProjection,
  };
};
