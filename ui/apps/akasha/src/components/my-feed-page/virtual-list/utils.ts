import { VirtualItemInfo } from './virtual-item';
import { Rect } from './rect';
import { RenderedItem } from './use-projection';

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
export const findBestRef = (
  items: RenderedItem[],
  compareFn: (prev: RenderedItem, curr: RenderedItem) => number,
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
