import { Rect } from '../virtual-list/rect';
import { MountedItem } from '../virtual-list/use-projection';
import { VirtualItem } from '../virtual-list/virtual-item-renderer';

export const getHeightBetweenItems = (first?: VirtualItem, last?: VirtualItem) => {
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
  return items.reduce((prev, curr) => (compareFn(curr, prev) > 0 ? curr : prev));
};

export const getVisibleItemsSlice = (visibleItems: VirtualItem[], allItems: VirtualItem[]) => {
  const first = visibleItems[0];
  const last = visibleItems[visibleItems.length - 1];
  return {
    start: first ? allItems.indexOf(first) : 0,
    end: last ? allItems.indexOf(last) + 1 : 0,
  };
};

export const findLastItem = <T>(items: T[], predicate: (item: T) => boolean): T | undefined => {
  let found: T | undefined = undefined;
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (predicate(items[i])) {
      found = items[i];
      break;
    }
  }
  return found;
};
export const isWindow = () => typeof window !== 'undefined';
export const dpr = isWindow() ? window.devicePixelRatio ?? 1 : 1;
export const pxToDPR = (px: number, dpr: number) => Math.ceil(px * dpr) / dpr;
