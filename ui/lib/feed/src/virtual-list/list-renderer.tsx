import * as React from 'react';
import {
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
import { useEdgeDetector } from './use-edge-detector';

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
  onEdgeDetectorUpdate: ReturnType<typeof useEdgeDetector>['update'];
  onListReset?: () => void;
  scrollTopIndicator?: (listRect: DOMRect, onScrollToTop: () => void) => React.ReactNode;
};

const initialState = {
  mounted: [],
  listHeight: 0,
};

export const VirtualListRenderer = React.forwardRef(
  <T,>(props: VirtualListRendererProps<T>, ref) => {
    React.useImperativeHandle(ref, () => ({
      isAtTop: viewport.isAtTop,
      scrollToTop: () => {
        //@TODO:
      },
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
    } = props;
    const rootNodeRef = React.createRef<HTMLDivElement>();
    const itemHeights = React.useMemo(
      () => measurementsCache ?? new Map<string, number>(),
      [measurementsCache],
    );
    const itemRendererApis = React.useRef(new Map());
    const beforeStateUpdates = React.useRef<'update' | 'RAFUpdate'>();
    const itemHeightAverage = React.useRef(estimatedHeight);
    const batchedHeightUpdates = React.useRef(new Set());

    const viewport = useViewport({
      rootNode: rootNodeRef,
      initialRect,
      offsetTop: rootNodeRef.current?.offsetTop || 0,
    });

    const scrollCorrection = React.useRef(0);
    const isInitialPlacement = React.useRef(false);
    const isScrolling = React.useRef(false);
    const currentPadding = React.useRef(0);
    const showScrollTopButton = React.useRef(false);

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
        scrollCorrection.current = viewport.getOffsetCorrection();
        beforeStateUpdates.current = 'RAFUpdate';
        return {
          mounted: itemsToRender,
          listHeight: viewportHeight,
        };
      } else {
        beforeStateUpdates.current = 'update';
      }

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

    const { projection, getCommonProjectionItem, getNextProjection } = useProjection<T>({
      mountedItems: state.mounted,
      itemList: itemList,
      isInitialPlacement: isInitialPlacement.current,
      itemHeights,
      isAtTop: viewport.isAtTop,
      getDistanceFromTop,
      overscan: overscan,
      getItemHeight,
      itemHeightAverage: itemHeightAverage.current,
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
        return getListBottomPadding(items, viewportRect);
      },
      [getListBottomPadding],
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
        const viewportRect = viewport.getRelativeToRootNode();
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
            () => {
              let vpRect: Rect | undefined = viewportRect;
              if (projectionWithCorrection.offset !== 0) {
                viewport.scrollBy(-projectionWithCorrection.offset);
                vpRect = viewport.getRelativeToRootNode();
              }
              if (vpRect) {
                // update edge sensor
                props.onEdgeDetectorUpdate(
                  nextProjection.allItems,
                  projectionWithCorrection.rendered,
                  vpRect,
                  itemHeightAverage.current,
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
            () => {
              if (shouldCorrect || !alreadyRendered) {
                debouncedUpdate('updatefn/debounced');
              }
              // update edge sensor
              props.onEdgeDetectorUpdate(
                nextProjection.allItems,
                nextProjection.nextRendered,
                viewportRect,
                itemHeightAverage.current,
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
        hasCorrection,
        hasMeasuredHeights,
        measureItemHeights,
        props,
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
          leading: false,
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
      if (isInitialPlacement.current) {
        return;
      }
      if (viewport.getScrollY() >= viewport.getDocumentViewportHeight()) {
        showScrollTopButton.current = true;
      }
      if (!isInitialPlacement.current && viewport.getScrollY() >= 0) {
        isScrolling.current = true;
        onScrollEnd();
        throttledUpdate('onScroll');
      }
    }, [onScrollEnd, throttledUpdate, viewport]);

    React.useEffect(() => {
      const unsubScroll = viewport.addScrollListener(onScroll);
      return () => unsubScroll();
    }, [onScroll, viewport]);

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

    return (
      <div
        ref={rootNodeRef}
        style={{
          position: 'relative',
          minHeight: state.listHeight,
        }}
      >
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
      </div>
    );
  },
);
