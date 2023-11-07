import { VirtualDataItem, VirtualItemInfo, VirtualItemInterface } from './virtual-item';
import { useUpdateScheduler } from './update-scheduler';
import { Rect } from './rect';
import { useViewport } from './use-viewport';
import {
  dpr,
  findFirstInView,
  getHeightBetweenItems,
  getItemDataMap,
  getVisibleItemsSlice,
  memoize,
  pxToDPR,
} from './utils';
import { RestorationItem } from './virtual-list';

export type VirtualizerCoreOptions = {
  updateScheduler: ReturnType<typeof useUpdateScheduler>;
  overscan: number;
  itemSpacing: number;
  estimatedHeight: number;
  viewport: ReturnType<typeof useViewport>;
};

export type MountedItem<T> = {
  start: number;
  height: number;
  virtualData: VirtualDataItem<T>;
  visible?: boolean;
};
export const enum SliceOperation {
  None,
  WillAppend,
  WillPrepend,
}
export class VirtualizerCore<T> {
  options: VirtualizerCoreOptions;
  isScrolling = false;
  batchedHeightUpdates: Set<string>;
  itemHeights: Map<string, number>;
  initialMount: boolean;
  itemApiMap: Map<string, VirtualItemInterface>;
  itemHeightAverage: number;
  slice: { start: number; end: number };

  constructor(options: VirtualizerCoreOptions) {
    this.setOptions(options);
    this.batchedHeightUpdates = new Set();
    this.itemHeights = new Map();
    this.initialMount = false;
    this.itemApiMap = new Map();
    this.itemHeightAverage = options.estimatedHeight;
    this.slice = { start: 0, end: 0 };
  }

  public setOptions = (options: Partial<VirtualizerCoreOptions>) => {
    // @TODO: double check if we really need to filter out undefined values
    Object.entries(options).forEach(([k, v]) => {
      if (typeof v === 'undefined') delete options[k];
    });

    this.options = { ...this.options, ...options };
  };
  public setItemAPI = (key: string, api: VirtualItemInterface) => {
    this.itemApiMap.set(key, api);
  };
  public getItemHeight = (itemKey: string) => {
    let itemHeight = this.itemHeightAverage;
    if (this.itemHeights.has(itemKey)) {
      itemHeight = this.itemHeights.get(itemKey);
    }
    return pxToDPR(itemHeight, dpr);
  };
  public hasMeasuredHeight = (itemKey: string) => {
    return this.itemHeights.has(itemKey);
  };
  public computeInitialProjection = (
    restoreItem: RestorationItem<T>,
    itemList: VirtualDataItem<T>[],
    restorationItems: RestorationItem<T>[],
  ) => {
    const projectionItems: MountedItem<T>[] = [];
    if (!restoreItem) {
      return projectionItems;
    }
    const viewportHeight =
      this.options.viewport.getRect().getTop() + this.options.viewport.getDocumentViewportHeight();
    let offsetTop = restoreItem.start || 0;
    const idx = itemList.findIndex(item => item.key === restoreItem.virtualData.key);
    for (let i = idx; i < itemList.length && offsetTop < viewportHeight; i += 1) {
      const listItem = itemList[i];
      const rstItem = restorationItems.find(restItem => restItem.virtualData.key === listItem.key);
      const itemHeight = this.itemHeights.get(listItem.key) ?? rstItem?.height;
      if (typeof itemHeight !== 'number') {
        break;
      }
      projectionItems.push({
        start: offsetTop,
        height: itemHeight,
        visible: true,
        virtualData: {
          ...listItem,
        },
      });
      offsetTop = offsetTop + itemHeight + this.options.itemSpacing;
    }
    offsetTop = restoreItem.start || 0;
    for (let i = idx - 1; i > -1 && offsetTop > 0; i -= 1) {
      const listItem = itemList[i];
      const rstItem = restorationItems.find(restItem => restItem.virtualData.key === listItem.key);
      const itemHeight = this.itemHeights.get(listItem.key) ?? rstItem?.height;
      if (typeof itemHeight !== 'number') {
        break;
      }
      offsetTop = offsetTop - itemHeight + this.options.itemSpacing;
      projectionItems.unshift({
        start: offsetTop,
        height: itemHeight,
        visible: true,
        virtualData: { ...listItem },
      });
    }
    return projectionItems;
  };

  computeProjection = (
    prevRendered: VirtualItemInfo[],
    itemList: VirtualDataItem<T>[],
  ): MountedItem<T>[] => {
    const itemsMap = getItemDataMap(itemList);
    return prevRendered.reduce((acc, item) => {
      const itemVirtualData = itemsMap.get(item.key);
      const { key, ...rest } = item;
      if (itemVirtualData) {
        acc.push({
          ...rest,
          virtualData: itemVirtualData,
        });
      }
      return acc;
    }, [] as MountedItem<T>[]);
  };

  public getProjection = memoize<
    (prev: VirtualItemInfo[], itemList: VirtualDataItem<T>[]) => MountedItem<T>[]
  >(this.computeProjection);

  public updateProjection = (
    startFrom: VirtualItemInfo,
    viewportRect: Rect,
    itemList: VirtualDataItem<T>[],
  ) => {
    const alreadyRendered = !this.isScrolling && !this.initialMount;
    const nextProjection = this.computeNextProjection(
      startFrom,
      viewportRect,
      alreadyRendered,
      itemList,
    );
    const hasDelta = this.hasProjectionDelta(startFrom, itemList);
    const first = nextProjection.allItems.at(0);
    const last = nextProjection.allItems.at(nextProjection.allItems.length - 1);
    const height = getHeightBetweenItems(first, last);
    const listTopPadding = this.getTopPadding(nextProjection.allItems, viewportRect);
    const hasMeasuredHeights = this.hasMeasuredHeights(nextProjection.nextRendered);
    const mustMeasure =
      (hasMeasuredHeights &&
        (!this.isScrolling || height + listTopPadding <= viewportRect.getHeight())) ||
      (hasMeasuredHeights && this.initialMount);
    this.slice = nextProjection.slice;

    if (hasMeasuredHeights) {
      window.requestAnimationFrame(() => {
        this.initialMount = false;
      });
    }

    if (hasDelta && mustMeasure) {
      const projectionWithDelta = this.getProjectionDelta(
        startFrom,
        nextProjection.nextRendered,
        itemList,
      );
      return {
        mountedItems: projectionWithDelta.rendered,
        listHeight: height,
        allItems: nextProjection.allItems,
        projectionDelta: projectionWithDelta.offset,
        alreadyRendered,
        hasDelta,
        mustMeasure,
        sliceOperation: nextProjection.sliceOperation,
      };
    } else {
      return {
        mountedItems: nextProjection.nextRendered,
        listHeight: height,
        allItems: nextProjection.allItems,
        alreadyRendered,
        hasDelta,
        mustMeasure,
        sliceOperation: nextProjection.sliceOperation,
      };
    }
  };

  public setIsScrolling = (isScrolling: boolean) => {
    this.isScrolling = isScrolling;
  };

  public getIsScrolling = () => this.isScrolling;

  public batchHeightUpdates = (itemKey: string, mountedItems: VirtualItemInfo[]) => {
    this.batchedHeightUpdates.add(itemKey);
    // only update when items in state are resized
    if (
      mountedItems.every(
        item =>
          this.hasMeasuredHeight(item.key) ||
          this.batchedHeightUpdates.has(item.key) ||
          this.batchedHeightUpdates.size >= this.options.overscan * 2,
      )
    ) {
      this.options.updateScheduler.update('item height update');
      this.batchedHeightUpdates.clear();
    }
  };
  public setIsInitialMount = (initialMount: boolean) => (this.initialMount = initialMount);

  public getCommonProjectionItem = (
    mountedItems: VirtualItemInfo[],
    viewportRect: Rect,
    itemList: VirtualDataItem<T>[],
  ): VirtualItemInfo => {
    const atTop = !this.initialMount && this.isAtTop();
    if (atTop) {
      const item = mountedItems.at(0);
      if (item) {
        return { ...item, maybeRef: false };
      }
      return undefined;
    }
    const referenceItems = this.getReferenceItems(mountedItems, itemList);

    const firstRefInView = findFirstInView(referenceItems, (prev, current) => {
      const prevRect = new Rect(prev.start, prev.height);
      const currentRect = new Rect(current.start, current.height);
      const isVisible =
        Rect.visibleFactor(prevRect, viewportRect) - Rect.visibleFactor(currentRect, viewportRect);
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
        visible: firstRefInView.visible,
        maybeRef: false,
      };
    }
    if (referenceItems.at(0)) {
      return {
        key: referenceItems.at(0).virtualData.key,
        start: referenceItems.at(0).start,
        height: referenceItems.at(0).height,
        visible: referenceItems.at(0).visible,
        maybeRef: false,
      };
    }
    const listFirst = itemList.at(0);
    if (listFirst) {
      return {
        key: listFirst.key,
        height: this.itemHeightAverage,
        start: 0,
        visible: false,
        maybeRef: false,
      };
    }
  };
  public measureItemHeights = () => {
    this.itemApiMap.forEach((api, key) => {
      if (!api) return;
      const newHeight = api.measureHeight();
      if (this.itemHeights.get(key) !== newHeight) {
        this.itemHeights.set(key, newHeight);
        this.computeAvgItemHeight(newHeight, this.itemApiMap.size);
      }
    });
  };

  /********************************
   *                              *
   *       PRIVATE METHODS        *
   *                              *
   *******************************/
  private getAllItemInfos = (startItem: VirtualItemInfo, itemList: VirtualDataItem<T>[]) => {
    const topDistance = this.getDistanceFromTop(startItem.key, itemList);
    let offset = startItem.start - topDistance;
    const items: VirtualItemInfo[] = [];
    itemList.forEach(item => {
      const height = this.getItemHeight(item.key);
      items.push({
        key: item.key,
        start: offset,
        visible: this.itemHeights.has(item.key),
        maybeRef: item.maybeRef,
        height,
      });
      offset += height;
    });
    return items;
  };

  private computeNextProjection = (
    startItem: VirtualItemInfo,
    viewportRect: Rect,
    alreadyRendered: boolean,
    itemList: VirtualDataItem<T>[],
  ) => {
    const minViewportHeight = this.options.overscan * this.itemHeightAverage;

    const minViewportRect = new Rect(
      viewportRect.getTop() - minViewportHeight,
      viewportRect.getHeight() + 2 * minViewportHeight,
    );

    const allItems = this.getAllItemInfos(startItem, itemList);
    const visibleItems = allItems.filter(it => Rect.fromItem(it).overlaps(minViewportRect));
    const visibleSlice = getVisibleItemsSlice(visibleItems, allItems);
    const slice = this.getSlice(alreadyRendered, visibleSlice);

    let sliceOperation = SliceOperation.None;
    if (slice.end > this.slice.end) {
      sliceOperation = SliceOperation.WillAppend;
    }
    if (slice.start < this.slice.start) {
      sliceOperation = SliceOperation.WillPrepend;
    }
    const nextRendered = allItems.slice(slice.start, slice.end);

    return { allItems, nextRendered, slice, sliceOperation };
  };

  private hasProjectionDelta = (
    projectionItem: VirtualItemInfo,
    itemList: VirtualDataItem<T>[],
  ) => {
    return this.getListOffset(projectionItem, itemList) !== 0;
  };
  private getProjectionDelta = (
    startItem: VirtualItemInfo,
    mountedItems: VirtualItemInfo[],
    itemList: VirtualDataItem<T>[],
  ) => {
    const offset = this.getListOffset(startItem, itemList);
    return {
      offset,
      rendered: mountedItems.map<VirtualItemInfo>(item => ({
        ...item,
        start: item.start - offset,
      })),
    };
  };
  private computeAvgItemHeight = (newHeight: number, listSize: number) => {
    this.itemHeightAverage = (this.itemHeightAverage * (listSize - 1) + newHeight) / listSize;
  };
  private isAtTop = () => {
    const viewportRect = this.options.viewport.getRect();
    if (!viewportRect) {
      return true;
    }
    return this.options.viewport.isAtTop();
  };
  private getReferenceItems = (mountedItems: VirtualItemInfo[], itemList: VirtualDataItem<T>[]) => {
    return this.getProjection(mountedItems, itemList).filter(
      it =>
        it.virtualData.maybeRef &&
        (this.initialMount || !!this.itemHeights.get(it.virtualData.key)),
    );
  };
  private getListOffset = (startItem: VirtualItemInfo, itemList: VirtualDataItem<T>[]): number => {
    if (!startItem) {
      return 0;
    }
    const distance = this.getDistanceFromTop(startItem.key, itemList);
    return startItem.start - distance;
  };
  private getDistanceFromTop = (itemKey: string, itemList: VirtualDataItem<T>[]) => {
    const idx = itemList.findIndex(it => it.key === itemKey);
    if (idx >= 0) {
      return itemList
        .slice(0, idx)
        .reduce((distance, item) => this.getItemHeight(item.key) + distance, 0);
    }
    return 0;
  };

  private getTopPadding = (items: VirtualItemInfo[], viewportRect: Rect) => {
    const maybeRefs = items.filter(it => it.maybeRef);
    const lastRef = maybeRefs.at(maybeRefs.length - 1);
    const firstItem = items.at(0);
    if (!firstItem) {
      return 0;
    }
    const height =
      Rect.fromItem(lastRef ?? firstItem).getBottom() - Rect.fromItem(firstItem).getTop();
    const space = 0; // viewport.getDocumentViewportHeight() - viewportRect.getHeight();
    return Math.max(0, viewportRect.getHeight() - height - space);
  };

  private hasMeasuredHeights = (items: VirtualItemInfo[]) =>
    items.every(item => this.itemHeights.has(item.key));

  private getSlice = (alreadyRendered: boolean, visibleSlice: { start: number; end: number }) => {
    if (alreadyRendered) {
      return visibleSlice;
    }
    if (
      visibleSlice.start >= this.slice.start &&
      visibleSlice.end <= this.slice.end &&
      this.slice.end - this.slice.start <= this.options.overscan
    ) {
      return this.slice;
    }
    if (visibleSlice.start >= this.slice.end || visibleSlice.end <= this.slice.start) {
      return visibleSlice;
    }
    const minViewportRatio = Math.max(
      this.slice.start - visibleSlice.start,
      visibleSlice.end - this.slice.end,
      0,
    );
    return {
      start: Math.min(this.slice.start + minViewportRatio, visibleSlice.start),
      end: Math.max(this.slice.end - minViewportRatio, visibleSlice.end),
    };
  };
}
