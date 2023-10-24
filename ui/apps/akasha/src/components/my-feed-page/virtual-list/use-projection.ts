import { VirtualDataItem, VirtualItemInfo, VirtualItemInterface } from './virtual-item';
import React from 'react';
import { useUpdateScheduler } from './update-scheduler';
import { dpr, findBestRef, getVisibleItemsSlice, isWindow, pxToDPR } from './utils';
import { RestorationItem } from './index';
import { useViewport } from './use-viewport';
import { Rect } from './rect';

export type RenderedItem = {
  start: number;
  height: number;
  item: VirtualDataItem<unknown>;
  visible?: boolean;
};

export type ProjectionProps = {
  estimatedHeight?: number;
  itemList: VirtualDataItem<unknown>[];
  updateScheduler: ReturnType<typeof useUpdateScheduler>;
  viewport: ReturnType<typeof useViewport>;
  hasNextPage: boolean;
  listStateItems: RenderedItem[];
  overscan: number;
  itemSpacing: number;
};

export const useProjection = (props: ProjectionProps) => {
  const {
    itemList,
    estimatedHeight = 0,
    viewport,
    hasNextPage,
    listStateItems,
    overscan,
    itemSpacing,
    updateScheduler,
  } = props;
  const slice = React.useRef({
    start: 0,
    end: 0,
  });
  const prevItemList = React.useRef<ProjectionProps['itemList']>([]);
  const prevItemsMap = React.useRef<Map<string, VirtualDataItem<unknown>>>(new Map());
  const itemHeights = React.useRef<Map<string, number>>(new Map());
  const itemHeightAverage = React.useRef(estimatedHeight);
  const currentPadding = React.useRef(0);
  const itemInterfaces = React.useRef<Map<string, VirtualItemInterface>>(new Map());
  const pendingHeightKeys = React.useRef<Set<string>>(new Set());
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
      (Math.max(itemHeightAverage.current, estimatedHeight) * (itemList.length - 1) + newHeight) /
      itemList.length;
  };

  const getInitialProjection = (restoreItem: RestorationItem): RenderedItem[] => {
    const projectionItems: RenderedItem[] = [];
    if (!restoreItem) {
      console.log('no restore item, returning...');
      return projectionItems;
    }
    const viewportHeight = viewport.getDocumentViewportHeight();
    let offsetTop = restoreItem.offsetTop || 0;
    const idx = itemList.findIndex(item => item.key === restoreItem.key);
    for (let i = idx; i < itemList.length && offsetTop < viewportHeight; i += 1) {
      const listItem = itemList[i];
      const itemHeight = itemHeights.current.get(listItem.key);
      if (typeof itemHeight !== 'number') {
        break;
      }
      projectionItems.push({
        start: offsetTop,
        height: itemHeight,
        visible: true,
        item: {
          ...listItem,
        },
      });
      offsetTop = offsetTop + itemHeight + itemSpacing;
    }
    offsetTop = restoreItem.offsetTop || 0;
    for (let i = idx - 1; i > -1 && offsetTop > 0; i -= 1) {
      const listItem = itemList[i];
      const itemHeight = itemHeights.current.get(listItem.key);
      if (typeof itemHeight !== 'number') {
        break;
      }
      offsetTop = offsetTop - itemHeight + itemSpacing;
      projectionItems.unshift({
        start: offsetTop,
        height: itemHeight,
        visible: true,
        item: { ...listItem },
      });
    }
    return projectionItems;
  };

  const getNextProjection = (
    startItem: VirtualItemInfo,
    viewportRect: Rect,
    alreadyRendered?: boolean,
  ) => {
    const maxViewportHeight = overscan * itemHeightAverage.current;
    const minViewportHeight = overscan * estimatedHeight;
    const minViewportRect = new Rect(
      viewportRect.getTop() - minViewportHeight,
      viewportRect.getHeight() + 2 * minViewportHeight,
    );
    const maxViewportRect = new Rect(
      viewportRect.getTop() - maxViewportHeight,
      viewportRect.getHeight() + 2 * maxViewportHeight,
    );
    const allItems = getAllItemInfos(startItem);
    const visibleItems = allItems.filter(it =>
      Rect.fromItem(it).overlaps(alreadyRendered ? maxViewportRect : minViewportRect),
    );

    const visibleSlice = getVisibleItemsSlice(visibleItems, allItems);
    const slice = getSlice(alreadyRendered, visibleSlice);
    const nextRendered = allItems.slice(slice.start, slice.end);

    return {
      allItems,
      nextRendered,
      slice,
    };
  };

  const getSlice = (alreadyRendered: boolean, visibleSlice: { start: number; end: number }) => {
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
  };
  const getAllItemInfos = (startItem: VirtualItemInfo) => {
    const topDistance = getDistanceFromTop(startItem.itemKey);
    let offset = startItem.start - topDistance;
    const items: VirtualItemInfo[] = [];
    itemList.forEach(item => {
      const height = getItemHeight(item.key);
      items.push({
        itemKey: item.key,
        start: offset,
        visible: itemHeights.current.has(item.key),
        maybeRef: item.maybeRef,
        height,
      });
      offset += height;
    });
    return items;
  };

  const getDistanceFromTop = (itemKey: string) => {
    const idx = itemList.findIndex(it => it.key === itemKey);
    if (idx >= 0) {
      return itemList
        .slice(0, idx)
        .reduce((distance, item) => getItemHeight(item.key) + distance, 0);
    }
    return 0;
  };

  const getFinalProjection = React.useMemo(() => {
    return (renderedItems: RenderedItem[]) => {
      return renderedItems.reduce((acc, item) => {
        const itemVirtualData = itemsMap.get(item.item.key);
        if (itemVirtualData) {
          acc.push({
            ...item,
            item: itemVirtualData,
          });
        }
        return acc;
      }, [] as RenderedItem[]);
    };
  }, [itemsMap]);

  const getCommonProjectionItem = (
    isAtNewest: boolean,
    renderedItems: RenderedItem[],
    isInitialRender?: boolean,
  ): VirtualItemInfo => {
    const viewportRect = viewport.getRelativeToRootNode();
    if (isAtNewest) {
      if (hasNextPage) {
        const item = renderedItems.at(renderedItems.length - 1);
        if (item) {
          return {
            itemKey: item.item.key,
            visible: false,
            maybeRef: false,
            start: item.start,
            height: item.height,
          };
        }
        return undefined;
      }
      const item = renderedItems.at(0);
      if (item) {
        return {
          itemKey: item.item.key,
          visible: false,
          maybeRef: false,
          start: item.start,
          height: item.height,
        };
      }
      return undefined;
    }
    const maybeRefs = getRefCandidates(isInitialRender);

    const bestRef = findBestRef(maybeRefs, (prev, curr) => {
      const prevRect = new Rect(prev.start, prev.height);
      const currRect = new Rect(curr.start, curr.height);
      return (
        Rect.visibleFactor(prevRect, viewportRect) - Rect.visibleFactor(currRect, viewportRect) ||
        Rect.getVisibleHeight(currRect, viewportRect) -
          Rect.getVisibleHeight(prevRect, viewportRect)
      );
    });
    if (bestRef) {
      return {
        itemKey: bestRef.item.key,
        start: bestRef.start,
        height: bestRef.height,
        visible: false,
        maybeRef: false,
      };
    }
    if (maybeRefs.at(0)) {
      const item = maybeRefs.at(0);
      return {
        itemKey: item.item.key,
        start: item.start,
        height: item.height,
        visible: false,
        maybeRef: false,
      };
    }
    const firstItem = itemList.at(0);
    if (firstItem) {
      return {
        itemKey: firstItem.key,
        // @TODO: start item might have a padding top?
        start: 0,
        height: itemHeightAverage.current,
        visible: false,
        maybeRef: false,
      };
    }
  };

  const getRefCandidates = (isInitialRender?: boolean) => {
    return getFinalProjection(listStateItems).filter(it => {
      return it.item.maybeRef && (isInitialRender || !!itemHeights.current.get(it.item.key));
    });
  };
  const measureItemHeights = () => {
    itemInterfaces.current.forEach((iface, itemKey) => {
      if (!iface) return;
      const newHeight = iface.measureHeight();
      if (itemHeights.current.get(itemKey) !== newHeight) {
        itemHeights.current.set(itemKey, iface.measureHeight());
        updateAverageItemHeight(newHeight);
      }
    });
  };

  const setItemInterface = (itemKey: string, iface: VirtualItemInterface) => {
    itemInterfaces.current.set(itemKey, iface);
  };

  const getListOffset = (startItem: VirtualItemInfo) => {
    if (!startItem) {
      if (hasNextPage) {
        return viewport.getOverScroll();
      }
      return 0;
    }
    const distance = getDistanceFromTop(startItem.itemKey);
    const offset = startItem.start - distance;
    if (hasNextPage) {
      return offset - viewport.getOverScroll();
    }
    return offset;
  };
  const getInvisiblePadding = (items: VirtualItemInfo[], viewportRect: Rect) => {
    if (hasNextPage) {
      return getTopPadding(items, viewportRect);
    }
    return getBottomPadding(items, viewportRect);
  };
  const getTopPadding = (items: VirtualItemInfo[], viewportRect: Rect) => {
    const maybeRefs = items.filter(it => it.maybeRef);
    const lastRef = maybeRefs.at(maybeRefs.length - 1);
    const firstItem = items.at(0);
    if (!firstItem) {
      currentPadding.current = 0;
      return currentPadding.current;
    }
    const height =
      Rect.fromItem(lastRef ?? firstItem).getBottom() - Rect.fromItem(firstItem).getTop();
    const space = 0; // viewport.getDocumentViewportHeight() - viewportRect.getHeight();
    currentPadding.current = Math.max(0, viewportRect.getHeight() - height - space);
    return currentPadding.current;
  };
  const getBottomPadding = (items: VirtualItemInfo[], viewportRect: Rect) => {
    const maybeRefs = items.filter(it => it.maybeRef);
    const lastRef = maybeRefs.at(maybeRefs.length - 1);
    const lastItem = items.at(items.length - 1);
    if (!lastItem) {
      currentPadding.current = 0;
      return currentPadding.current;
    }
    const height =
      Rect.fromItem(lastItem).getBottom() - Rect.fromItem(lastRef ?? lastItem).getTop();
    currentPadding.current = Math.max(
      0,
      viewportRect.getHeight() - height + viewport.getOffsetBottom(),
    );
    return currentPadding.current;
  };
  return {
    getItemHeight,
    setItemHeight: (itemKey: string, height: number) => {
      itemHeights.current.set(itemKey, height);
      updateAverageItemHeight(height);
    },
    updateItemHeight: (itemKey: string) => {
      pendingHeightKeys.current.add(itemKey);
      // only update when items in state are resized
      if (
        listStateItems.some(
          item =>
            itemHeights.current.has(item.item.key) ||
            pendingHeightKeys.current.has(item.item.key) ||
            pendingHeightKeys.current.size >= overscan * 3,
        )
      ) {
        updateScheduler.update('item height update');
        pendingHeightKeys.current.clear();
      }
    },
    getItemHeightMap: () => itemHeights.current,
    getPreviousItems: () => ({
      itemList: prevItemList.current,
      itemsMap: prevItemsMap.current,
    }),
    updatePreviousItems: (itemList: VirtualDataItem<unknown>[]) => {
      prevItemList.current = itemList;
      itemList.forEach(it => prevItemsMap.current.set(it.key, it));
    },
    hasMeasuredHeights: (items: VirtualItemInfo[]) =>
      items.some(item => itemHeights.current.has(item.itemKey)),
    updateSlice: (newSlice: { start: number; end: number }) => (slice.current = newSlice),
    getFinalProjection,
    getNextProjection,
    getInitialProjection,
    getCommonProjectionItem,
    measureItemHeights,
    setItemInterface,
    getListOffset,
    getInvisiblePadding,
  };
};
