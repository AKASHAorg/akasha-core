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
import { getHeightBetweenItems } from '../utils';
import { useStateWithCallback } from './use-state-with-callback';
import { useDebounce } from './use-debounce';
import { useThrottle } from './use-throttle';
import { useProjection } from './use-projection';
import { useItemHeights } from './use-item-heights';
import { useList } from './use-list';
import { useCommonProjectionItem } from './use-common-projection-item';

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
    getItemHeightAverage: () => number,
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
  offsetTop?: number;
  header?: React.ReactElement;
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
      offsetTop,
      header,
    } = props;
    const rootNodeRef = React.useRef<HTMLDivElement>();

    const {
      getItemHeights,
      getItemHeight,
      getItemHeightAverage,
      updateItemHeight,
      hasMeasuredHeights,
      onItemHeightChange,
      getItemDistanceFromTop,
    } = useItemHeights({
      measurementsCache,
      estimatedHeight,
      itemSpacing,
      overscan,
    });

    const itemRendererApis = React.useRef(new Map());
    const beforeStateUpdates = React.useRef<'update' | 'RAFUpdate'>();
    const isScrollAtTop = React.useRef(!restorationItem);

    const viewport = useViewport({
      initialRect,
      offsetTop: offsetTop ? offsetTop : rootNodeRef.current?.offsetTop || 0,
      offsetBottom: 0,
    });

    React.useEffect(() => {
      if (rootNodeRef.current) {
        if (rootNodeRef.current.offsetTop !== viewport.getRect().getTop()) {
          viewport.resizeRect(
            rootNodeRef.current.offsetTop,
            viewport.getRect().getHeight() - rootNodeRef.current.offsetTop,
          );
        }
      }
    }, [viewport, header]);

    const { getListPadding, getListOffset, hasCorrection } = useList({
      itemList,
      documentViewportHeight: viewport.getDocumentViewportHeight(),
      viewportHeight: viewport.getRect().getHeight(),
      viewportBottomOffset: viewport.getBottomOffset(),
      getItemDistanceFromTop: getItemDistanceFromTop,
    });

    const scrollCorrection = React.useRef(0);
    const isInitialPlacement = React.useRef(false);
    const isScrolling = React.useRef(false);
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
        const height = getItemHeights().get(item.key);
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
        const height = getItemHeights().get(item.key);
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
        viewport.scrollBy(-scrollCorrection.current);
        scrollCorrection.current = 0;
      }
    }, [state, viewport]);

    const isAtTop = React.useCallback(() => {
      const viewportRect = viewport.getRelativeToRootNode(rootNodeRef.current);
      if (!viewportRect) return true;

      if (hasNextPage) {
        return viewportRect.getBottom() >= state.listHeight - rootNodeRef.current.offsetTop;
      }

      return viewportRect.getTop() <= rootNodeRef.current.offsetTop;
    }, [hasNextPage, state.listHeight, viewport]);

    const { projection, getNextProjection, getProjectionCorrection } = useProjection<T>({
      mountedItems: state.mounted,
      itemList,
      isInitialPlacement: isInitialPlacement.current,
      getItemHeights,
      isAtTop,
      getDistanceFromTop: getItemDistanceFromTop,
      overscan: overscan,
      getItemHeight,
      getItemHeightAverage,
      hasNextPage,
      hasPreviousPage,
    });

    const getCommonProjectionItem = useCommonProjectionItem({
      getItemHeights,
      hasPreviousPage,
      isAtTop,
      itemList,
      projection,
      getItemHeight,
    });

    const measureItemHeights = React.useCallback(() => {
      itemRendererApis.current.forEach((api, key) => {
        if (!api) return;
        const newHeight = api.measureHeight();
        updateItemHeight(key, newHeight);
      });
    }, [updateItemHeight]);

    const debouncedUpdate = useDebounce(
      (debugFrom?: string) =>
        window.requestIdleCallback
          ? window.requestIdleCallback(() => update(debugFrom))
          : window.requestAnimationFrame(() => update(debugFrom)),
      250,
    );

    const update = React.useCallback(
      (_debugFrom?: string) => {
        const viewportRect = viewport.getRelativeToRootNode(rootNodeRef.current);
        if (!viewportRect) return;
        const commonProjectionItem = getCommonProjectionItem(
          viewportRect,
          isInitialPlacement.current,
        );
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
            nextProjection.nextRendered,
            getListOffset(commonProjectionItem),
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
                vpRect = viewport.getRelativeToRootNode(rootNodeRef.current);
              }
              if (vpRect) {
                // update edge sensor
                onEdgeDetectorUpdate(
                  nextProjection.allItems,
                  projectionWithCorrection.rendered,
                  vpRect,
                  getItemHeightAverage,
                  getItemHeights(),
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
                getItemHeightAverage,
                getItemHeights(),
                alreadyRendered,
              );
            },
          );
        }
      },
      [
        debouncedUpdate,
        getCommonProjectionItem,
        getItemHeights,
        getListOffset,
        getListPadding,
        getNextProjection,
        getProjectionCorrection,
        hasCorrection,
        hasMeasuredHeights,
        getItemHeightAverage,
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

    const throttledUpdate = useThrottle(RAFUpdate, 100, {
      leading: true,
      trailing: false,
    });

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
      if (isInitialPlacement.current || viewport.getScrollY() < 0) {
        return;
      }
      if (viewport.getScrollY() >= viewport.getDocumentViewportHeight()) {
        showScrollTopButton.current = true;
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

    React.useLayoutEffect(() => {
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
    }, [state, RAFUpdate, update, viewport]);

    const prevItemList = React.useRef<VirtualDataItem<T>[]>();

    React.useEffect(() => {
      if (prevItemList.current === itemList) return;
      // if (
      //   prevItemList.current &&
      //   !prevItemList.current.find(it => it.key === HEADER_COMPONENT) &&
      //   itemList.find(it => it.key === HEADER_COMPONENT)
      // ) {
      //   if (state.mounted.length && state.mounted[0].start === 0 && !hasPreviousPage) {
      //     shouldScrollToHeader.current = true;
      //   }
      // }
      prevItemList.current = itemList;
      RAFUpdate('itemList updated');
    }, [RAFUpdate, itemList]);

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
        onItemHeightChange(itemKey, newHeight, state.mounted, update);
      },
      [onItemHeightChange, state.mounted, update],
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
            visible={getItemHeights().has(item.virtualData.key)}
          />
        ))}
        {!isAtTop() && hasNextPage && isLoading && loadingIndicator?.()}
      </div>
    );
  },
);
