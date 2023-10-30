import { VirtualDataItem, VirtualItemInfo } from './virtual-item';
import { Rect } from './rect';
import { MountedItem } from './virtualizer-core';

export const isWindow = typeof window !== 'undefined';
export const dpr = isWindow ? window.devicePixelRatio ?? 1 : 1;
export const pxToDPR = (px: number, dpr: number) => Math.ceil(px * dpr) / dpr;
export const getHeightBetweenItems = (first: VirtualItemInfo, last: VirtualItemInfo) => {
  if (first && last) {
    return (
      new Rect(last.start, last.height).getBottom() - new Rect(first.start, first.height).getTop()
    );
  }
  return 0;
};
export const findFirstInView = <T>(
  items: MountedItem<T>[],
  compareFn: (prev: MountedItem<T>, curr: MountedItem<T>) => number,
) => {
  if (!items.length) return undefined;
  return items.reduce((prev, curr) => (compareFn(prev, curr) > 0 ? curr : prev));
};

export const getVisibleItemsSlice = (
  visibleItems: VirtualItemInfo[],
  allItems: VirtualItemInfo[],
) => {
  const first = visibleItems.at(0);
  const last = visibleItems.at(visibleItems.length - 1);
  return {
    start: first ? allItems.indexOf(first) : 0,
    end: last ? allItems.indexOf(last) + 1 : 0,
  };
};

export const memoize = <T extends (...args: unknown[]) => any>(fn: T): T => {
  const cache = new WeakMap<unknown[], ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    if (cache.has(args)) {
      return cache.get(args);
    }

    const result: ReturnType<T> = fn(...args);
    cache.set(args, result);

    return result;
  }) as T;
};

export const getItemDataMap = memoize(
  <T>(arr: VirtualDataItem<T>[]): Map<string, VirtualDataItem<T>> => {
    const map = new Map();
    arr.forEach(it => map.set(it.key, it));
    return map;
  },
);
