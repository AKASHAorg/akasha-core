import type { MountedItem } from '../use-projection';
import type { VirtualDataItem, VirtualItem } from '../virtual-item-renderer';
import type { Rect } from '../rect';

export const computeAvgItemHeight = (newHeight: number, listSize: number, prevAvg) => {
  return (prevAvg * (listSize - 1) + newHeight) / listSize;
};

export const createMockProjection = (itemList, mountedItems) => {
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
  }, [] as MountedItem<unknown>[]);
};

export const generateItemList = (count: number): VirtualDataItem<unknown>[] => {
  return Array.from({ length: count }, (_, num: number) => ({
    key: `item-${num}`,
    index: num,
    maybeRef: true,
    data: {},
    render: () => null,
  }));
};
export const generateMountedItems = (count: number, startOffset = 0): VirtualItem[] => {
  return Array.from({ length: count }, (_, num: number) => ({
    key: `item-${num}`,
    maybeRef: true,
    height: 250,
    start: num * 250 + startOffset,
    visible: true,
  }));
};

export const getRelativeRectToRootNode = (
  viewportRect: Rect,
  rootNode: { current: HTMLElement },
) => {
  return viewportRect.translate(-rootNode.current.getBoundingClientRect().top);
};
