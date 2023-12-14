import * as React from 'react';
import {
  HEADER_COMPONENT,
  VirtualDataItem,
  VirtualItem,
  VirtualItemInterface,
  VirtualItemRenderer,
} from './virtual-item-renderer';
import { RestoreItem } from './use-scroll-state';
import { useViewport } from './use-viewport';
import { Rect } from './rect';
import { useResizeObserver } from './use-resize-observer';
import { findLastItem, getHeightBetweenItems } from '../utils';
import { useStateWithCallback } from './use-state-with-callback';
import { useDebounce } from './use-debounce';
import { useThrottle } from './use-throttle';
import { useProjection } from './use-projection';

export type VirtualListInterface = {
  scrollToTop: () => void;
  isAtTop: () => boolean;
};

export type VirtualListRendererProps<T> = {
  itemList: VirtualDataItem<T>[];
  restorationItem?: RestoreItem;
  initialRect?: Rect;
  measurementsCache?: Map<string, number>;
  scrollRestorationType: 'auto' | 'manual';
  estimatedHeight: number;
  itemSpacing: number;
  overscan: number;
  onEdgeDetectorUpdate: (
    itemList: VirtualItem[],
    rendered: VirtualItem[],
    viewportRect: Rect,
    averageItemHeight: number,
    measurementsCache: Map<string, number>,
    isNewUpdate: boolean,
  ) => void;
  onListReset?: () => void;
  scrollTopIndicator?: (listRect: DOMRect, onScrollToTop: () => void) => React.ReactNode;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading?: boolean;
  loadingIndicator?: () => React.ReactElement;
  restorationKey?: string;
};

const initialState = {
  mounted: [],
  listHeight: 0,
};

export const VirtualListRenderer = React.forwardRef(
  <T,>(props: VirtualListRendererProps<T>, ref) => {
    React.useImperativeHandle(ref, () => ({
      isAtTop,
      scrollToTop: viewport.scrollToTop,
    }));
    const {
      itemList,
      initialRect,
      estimatedHeight,
      measurementsCache,
      restorationItem,
      scrollRestorationType,
      itemSpacing,
      overscan,
      onEdgeDetectorUpdate,
      hasNextPage,
      isLoading,
      loadingIndicator,
      hasPreviousPage,
      restorationKey,
    } = props;
    const rootNodeRef = React.useRef<HTMLDivElement>();
    const itemHeights = React.useMemo(
      () => measurementsCache ?? new Map<string, number>(),
      [measurementsCache],
    );
    const itemRendererApis = React.useRef(new Map());
    const beforeStateUpdates = React.useRef<'update' | 'RAFUpdate'>();
    const itemHeightAverage = React.useRef(estimatedHeight);
    const batchedHeightUpdates = React.useRef(new Set());
    const isScrollAtTop = React.useRef(!restorationItem);

    const viewport = useViewport({
      initialRect,
      offsetTop: rootNodeRef.current?.offsetTop || 0,
    });

    const scrollCorrection = React.useRef(0);
    const isInitialPlacement = React.useRef(false);
    const isScrolling = React.useRef(false);
    const currentPadding = React.useRef(0);
    const showScrollTopButton = React.useRef(false);
    const shouldScrollToHeader = React.useRef(false);

    const getInitialState = () => {
      const itemsToRender: VirtualItem[] = [];
      if (!restorationItem) {
        beforeStateUpdates.current = 'update';
        return initialState;
      }
      const viewportHeight = viewport.getDocumentViewportHeight();

      let offsetTop = restorationItem?.offsetTop || 0;
      const idx = itemList.findIndex(item => item.key === restorationItem?.key);
      for (let i = idx; i > -1 && i < itemList.length && offsetTop < viewportHeight; i += 1) {
        const item = itemList[i];
        const height = itemHeights.get(item.key);
        if (typeof height !== 'number') {
          break;
        }
        itemsToRender.push({
          key: item.key,
          start: offsetTop,
          height,
          visible: true,
          maybeRef: item.maybeRef,
        });
        offsetTop += height;
      }

      offsetTop = restorationItem?.offsetTop || 0;

      for (let i = idx - 1; i > -1 && offsetTop > 0; i -= 1) {
        const item = itemList[i];
        const height = itemHeights.get(item.key);
        if (typeof height !== 'number') {
          break;
        }
        offsetTop -= height;
        itemsToRender.unshift({
          key: item.key,
          start: offsetTop,
          height: height,
          visible: true,
          maybeRef: item.maybeRef,
        });
      }
      if (scrollRestorationType === 'manual') {
        viewport.scrollBy(-1);
      }
      isInitialPlacement.current = true;
      if (itemsToRender.length > 0) {
        scrollCorrection.current = viewport.getOffsetCorrection(rootNodeRef.current);
        beforeStateUpdates.current = 'RAFUpdate';
        return {
          mounted: itemsToRender,
          listHeight: viewportHeight,
        };
      }
      beforeStateUpdates.current = 'update';
      return initialState;
    };

    const [state, setState] = useStateWithCallback<{
      mounted: VirtualItem[];
      listHeight: number;
    }>(getInitialState);

    React.useEffect(() => {
      if (scrollCorrection.current > 0) {
        viewport.scrollBy(scrollCorrection.current);
        scrollCorrection.current = 0;
      }
    }, [state, viewport]);

    const getItemHeight = React.useCallback(
      (key: string) => {
        let itemHeight = itemHeightAverage.current + itemSpacing;
        if (itemHeights.has(key)) {
          itemHeight = itemHeights.get(key);
        }
        return viewport.pxToDPR(itemHeight, viewport.dpr);
      },
      [itemHeights, itemSpacing, viewport],
    );

    const getDistanceFromTop = React.useCallback(
      (itemKey: string) => {
        const idx = itemList.findIndex(it => it.key === itemKey);
        if (idx >= 0) {
          return itemList
            .slice(0, idx)
            .reduce((distance, item) => getItemHeight(item.key) + distance, 0);
        }
        return 0;
      },
      [getItemHeight, itemList],
    );
    const getRelativeToRootNode = React.useCallback(() => {
      if (rootNodeRef.current && viewport.state.rect) {
        return viewport.state.rect.translate(
          -rootNodeRef.current.getBoundingClientRect().top + rootNodeRef.current.offsetTop,
        );
      }
    }, [viewport.state.rect]);

    const isAtTop = React.useCallback(() => {
      const viewportRect = getRelativeToRootNode();
      if (!viewportRect) return true;

      if (hasNextPage) {
        return viewportRect.getBottom() >= state.listHeight - rootNodeRef.current.offsetTop;
      }

      return viewportRect.getTop() <= rootNodeRef.current.offsetTop;
    }, [getRelativeToRootNode, hasNextPage, state.listHeight]);

    const { projection, getCommonProjectionItem, getNextProjection } = useProjection<T>({
      mountedItems: state.mounted,
      itemList: itemList,
      isInitialPlacement: isInitialPlacement.current,
      itemHeights,
      isAtTop,
      getDistanceFromTop,
      overscan: overscan,
      getItemHeight,
      itemHeightAverage: itemHeightAverage.current,
      hasNextPage,
      hasPreviousPage,
    });

    const computeAvgItemHeight = (newHeight: number, listSize: number) => {
      itemHeightAverage.current =
        (itemHeightAverage.current * (listSize - 1) + newHeight) / listSize;
    };

    const measureItemHeights = React.useCallback(() => {
      itemRendererApis.current.forEach((api, key) => {
        if (!api) return;
        const newHeight = api.measureHeight();
        if (itemHeights.get(key) !== newHeight) {
          itemHeights.set(key, newHeight);
          computeAvgItemHeight(newHeight, itemRendererApis.current.size);
        }
      });
    }, [itemHeights]);

    const getListOffset = React.useCallback(
      (projectionItem: VirtualItem) => {
        if (!projectionItem) {
          return 0;
        }
        const distance = getDistanceFromTop(projectionItem.key);
        return projectionItem.start - distance;
      },
      [getDistanceFromTop],
    );

    const hasCorrection = React.useCallback(
      (projectionItem: VirtualItem) => {
        return getListOffset(projectionItem) !== 0;
      },
      [getListOffset],
    );

    const getProjectionCorrection = React.useCallback(
      (startItem: VirtualItem, nextRendered: VirtualItem[]) => {
        const offset = getListOffset(startItem);
        return {
          offset,
          rendered: nextRendered.map(item => ({
            ...item,
            start: item.start - offset,
          })),
        };
      },
      [getListOffset],
    );

    const getListTopPadding = React.useCallback(
      (items: VirtualItem[], viewportRect: Rect) => {
        const lastItemRef = findLastItem(items, it => it.maybeRef);
        const firstItem = items[0];
        if (!firstItem) {
          currentPadding.current = 0;
          return currentPadding.current;
        }
        const padStartItem = lastItemRef ?? firstItem;
        const height =
          new Rect(padStartItem.start, padStartItem.height).getBottom() -
          new Rect(firstItem.start, firstItem.height).getTop();
        const space = viewport.getDocumentViewportHeight() - viewportRect.getHeight();
        currentPadding.current = Math.max(0, viewportRect.getHeight() - space - height);
        return currentPadding.current;
      },
      [viewport],
    );

    const getListBottomPadding = React.useCallback(
      (items: VirtualItem[], viewportRect: Rect) => {
        const lastRef = findLastItem(items, it => it.maybeRef);
        const lastItem = items.at(-1);
        if (!lastItem) {
          currentPadding.current = 0;
          return 0;
        }
        const height = getHeightBetweenItems(lastItem, lastRef ?? lastItem);
        currentPadding.current = Math.max(
          0,
          viewportRect.getHeight() - height + viewport.getBottomOffset(),
        );
        return currentPadding.current;
      },
      [viewport],
    );

    const getListPadding = React.useCallback(
      (items: VirtualItem[], viewportRect: Rect) => {
        if (hasNextPage) {
          return getListTopPadding(items, viewportRect);
        }
        return getListBottomPadding(items, viewportRect);
      },
      [getListBottomPadding, getListTopPadding, hasNextPage],
    );

    const hasMeasuredHeights = React.useCallback(
      (items: VirtualItem[]) => {
        return items.every(item => itemHeights.has(item.key));
      },
      [itemHeights],
    );

    const debouncedUpdate = useDebounce(
      (debugFrom?: string) =>
        window.requestIdleCallback
          ? window.requestIdleCallback(() => update(debugFrom))
          : window.requestAnimationFrame(() => update(debugFrom)),
      250,
    );

    const update = React.useCallback(
      (_debugFrom?: string) => {
        const viewportRect = getRelativeToRootNode();
        if (!viewportRect) return;
        const commonProjectionItem = getCommonProjectionItem(viewportRect);
        measureItemHeights();
        if (!commonProjectionItem) return;
        const alreadyRendered = !isInitialPlacement.current && !isScrolling.current;
        const nextProjection = getNextProjection(
          commonProjectionItem,
          viewportRect,
          alreadyRendered,
        );
        const shouldCorrect = hasCorrection(commonProjectionItem);
        const first = nextProjection.allItems.at(0);
        const last = nextProjection.allItems.at(-1);
        const height = getHeightBetweenItems(first, last);
        const listHeight = height + getListPadding(nextProjection.allItems, viewportRect);
        const isHeightsMeasured = hasMeasuredHeights(nextProjection.nextRendered);
        const mustMeasure =
          (isHeightsMeasured && (!isScrolling.current || listHeight <= viewportRect.getHeight())) ||
          (isHeightsMeasured && isInitialPlacement.current);
        if (isHeightsMeasured) {
          isInitialPlacement.current = false;
        }
        if (shouldCorrect && mustMeasure) {
          const projectionWithCorrection = getProjectionCorrection(
            commonProjectionItem,
            nextProjection.nextRendered,
          );

          setState(
            {
              mounted: projectionWithCorrection.rendered,
              listHeight,
            },
            newState => {
              let vpRect: Rect | undefined = viewportRect;
              if (shouldScrollToHeader.current) {
                if (newState.mounted[0].key === HEADER_COMPONENT) {
                  shouldScrollToHeader.current = false;
                  viewport.scrollToTop();
                }
              } else if (projectionWithCorrection.offset !== 0) {
                viewport.scrollBy(-projectionWithCorrection.offset);
                vpRect = getRelativeToRootNode();
              }
              if (vpRect) {
                // update edge sensor
                onEdgeDetectorUpdate(
                  nextProjection.allItems,
                  projectionWithCorrection.rendered,
                  vpRect,
                  itemHeightAverage.current,
                  itemHeights,
                  alreadyRendered,
                );
              }
            },
          );
        } else {
          setState(
            {
              mounted: nextProjection.nextRendered,
              listHeight,
            },
            newState => {
              if (shouldScrollToHeader.current) {
                if (newState.mounted[0].key === HEADER_COMPONENT) {
                  shouldScrollToHeader.current = false;
                  viewport.scrollToTop();
                }
              } else if (shouldCorrect || !alreadyRendered) {
                debouncedUpdate('updatefn/debounced');
              }
              // update edge sensor
              onEdgeDetectorUpdate(
                nextProjection.allItems,
                nextProjection.nextRendered,
                viewportRect,
                itemHeightAverage.current,
                itemHeights,
                alreadyRendered,
              );
            },
          );
        }
      },
      [
        debouncedUpdate,
        getCommonProjectionItem,
        getListPadding,
        getNextProjection,
        getProjectionCorrection,
        getRelativeToRootNode,
        hasCorrection,
        hasMeasuredHeights,
        itemHeights,
        measureItemHeights,
        onEdgeDetectorUpdate,
        setState,
        viewport,
      ],
    );

    const RAFUpdate = React.useCallback(
      (debugFrom?: string) => window.requestAnimationFrame(() => update(debugFrom)),
      [update],
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const throttledUpdate = React.useCallback(
      useThrottle(
        RAFUpdate,
        50,
        {
          leading: true,
          trailing: false,
        },
        [update],
      ),
      [RAFUpdate],
    );

    const onScrollEnd = useDebounce(
      () => {
        isScrolling.current = false;
        RAFUpdate('onScrollEnd');
      },
      250,
      [RAFUpdate],
    );

    const onScroll = React.useCallback(() => {
      isScrollAtTop.current = isAtTop();
      if (isInitialPlacement.current) {
        return;
      }
      if (viewport.getScrollY() >= viewport.getDocumentViewportHeight()) {
        showScrollTopButton.current = true;
      }
      if (isInitialPlacement.current || viewport.getScrollY() < 0) {
        return;
      }
      isScrolling.current = true;
      onScrollEnd();
      throttledUpdate('onScroll');
    }, [isAtTop, onScrollEnd, throttledUpdate, viewport]);

    React.useEffect(() => {
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
      };
    }, [onScroll]);

    React.useEffect(() => {
      if (beforeStateUpdates.current) {
        if (beforeStateUpdates.current === 'update') {
          update('before state init');
        } else if (beforeStateUpdates.current === 'RAFUpdate') {
          window.requestAnimationFrame(() =>
            window.requestAnimationFrame(() => RAFUpdate('before state rafUpdate')),
          );
        }

        beforeStateUpdates.current = undefined;
      }
    }, [state, RAFUpdate, update]);

    const prevItemList = React.useRef<VirtualDataItem<T>[]>();

    React.useEffect(() => {
      if (prevItemList.current === itemList) return;
      if (
        prevItemList.current &&
        !prevItemList.current.find(it => it.key === HEADER_COMPONENT) &&
        itemList.find(it => it.key === HEADER_COMPONENT)
      ) {
        if (state.mounted.length && state.mounted[0].start === 0 && !hasPreviousPage) {
          shouldScrollToHeader.current = true;
        }
      }
      prevItemList.current = itemList;
      RAFUpdate('itemList updated');
    }, [RAFUpdate, getRelativeToRootNode, hasPreviousPage, itemList, state.mounted, viewport]);

    React.useEffect(() => {
      return () => {
        rootNodeRef.current = null;
      };
    }, []);

    const resizeObserver = useResizeObserver();

    const setItemRendererInterface = (itemKey: string) => (ref?: VirtualItemInterface) => {
      itemRendererApis.current.set(itemKey, ref);
    };

    const handleItemHeightChange = React.useCallback(
      (itemKey: string, newHeight: number) => {
        if (itemHeights.get(itemKey) === newHeight) {
          return;
        }
        batchedHeightUpdates.current.add(itemKey);
        // only update when items in state are resized
        if (
          state.mounted.some(
            item =>
              itemHeights.has(item.key) ||
              batchedHeightUpdates.current.has(item.key) ||
              batchedHeightUpdates.current.size >= overscan * 2,
          )
        ) {
          update('item height update');
          batchedHeightUpdates.current.clear();
        }
      },
      [itemHeights, overscan, state.mounted, update],
    );

    const setRootRef = (node: HTMLDivElement) => {
      if (!rootNodeRef.current && node) {
        viewport.setTopOffset(node.offsetTop);
        if (node.parentElement) {
          viewport.setBottomOffset(
            node.parentElement.offsetHeight - node.offsetTop - node.offsetHeight,
          );
        }
      }
      if (node) {
        rootNodeRef.current = node;
      }
    };
    return (
      <div
        id={restorationKey}
        ref={setRootRef}
        style={{
          position: 'relative',
          minHeight: state.listHeight,
        }}
      >
        {isAtTop() && hasPreviousPage && isLoading && loadingIndicator?.()}
        {projection.map(item => (
          <VirtualItemRenderer<T>
            key={item.virtualData.key}
            item={item.virtualData}
            index={item.virtualData.index}
            interfaceRef={setItemRendererInterface}
            resizeObserver={resizeObserver}
            itemOffset={item.start}
            estimatedHeight={estimatedHeight}
            onHeightChanged={handleItemHeightChange}
            itemSpacing={8}
          />
        ))}
        {!isAtTop() && hasNextPage && isLoading && loadingIndicator?.()}
      </div>
    );
  },
);
