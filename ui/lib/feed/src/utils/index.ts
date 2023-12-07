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
  return items.reduce((prev, curr) => (compareFn(prev, curr) > 0 ? prev : curr));
};

export const getVisibleItemsSlice = (visibleItems: VirtualItem[], allItems: VirtualItem[]) => {
  const first = visibleItems.at(0);
  const last = visibleItems.at(visibleItems.length - 1);
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
  // return items.reduceRight((acc: T | undefined, current: T) => {
  //   if (predicate(current) && !acc) {
  //     acc = current;
  //   }
  //   return acc;
  // }, undefined);
};
