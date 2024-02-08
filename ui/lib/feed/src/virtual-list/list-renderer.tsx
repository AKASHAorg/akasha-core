import * as React from 'react';
import {
  HEADER_COMPONENT,
  VirtualDataItem,
  VirtualItem,
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
  isTransition: false,
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
    const isPrevAtTop = React.useRef<boolean>(!!restorationItem);

    const {
      getItemHeights,
      getItemHeight,
      getItemHeightAverage,
      measureItemHeights,
      setItemRendererInterface,
      hasMeasuredHeights,
      onItemHeightChange,
      getItemDistanceFromTop,
    } = useItemHeights({
      measurementsCache,
      estimatedHeight,
      itemSpacing,
      overscan,
    });

    const beforeStateUpdates = React.useRef<'update' | 'RAFUpdate'>();
    const isScrollAtTop = React.useRef(!restorationItem);
    const animatingItems = React.useRef<Set<string>>(new Set());
    const isInitialPlacement = React.useRef(true);

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

    const isScrolling = React.useRef(false);
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
      if (itemsToRender.length > 0) {
        viewport.scrollBy(viewport.getOffsetCorrection(rootNodeRef.current));
        beforeStateUpdates.current = 'RAFUpdate';
        return {
          mounted: itemsToRender,
          listHeight: viewportHeight,
          isTransition: true,
        };
      }
      beforeStateUpdates.current = 'update';
      return initialState;
    };

    const [state, setState] = useStateWithCallback<{
      mounted: VirtualItem[];
      listHeight: number;
      isTransition: boolean;
    }>(getInitialState);

    const isAtTop = React.useCallback(() => {
      const viewportRect = viewport.getRelativeToRootNode(rootNodeRef.current);
      if (!viewportRect) return true;

      return viewportRect.getTop() <= rootNodeRef.current.offsetTop + getItemHeightAverage();
    }, [getItemHeightAverage, viewport]);

    const { getProjection, getNextProjection, getProjectionCorrection } = useProjection<T>({
      itemList,
      isInitialPlacement: isInitialPlacement.current,
      getItemHeights,
      isAtTop,
      getDistanceFromTop: getItemDistanceFromTop,
      overscan: overscan,
      getItemHeight,
      getItemHeightAverage,
    });

    const commonProjectionItem = useCommonProjectionItem({
      getItemHeights,
      hasPreviousPage,
      isAtTop,
      itemList,
      getProjection,
      getItemHeight,
      isInitialPlacement: isInitialPlacement.current,
      stateItems: state.mounted,
      viewportRect: viewport.getRelativeToRootNode(rootNodeRef.current),
    });

    const debouncedUpdate = useDebounce(
      (debugFrom?: string) =>
        window.requestIdleCallback
          ? window.requestIdleCallback(() => update(debugFrom))
          : window.requestAnimationFrame(() => update(debugFrom)),
      250,
    );
    const handleEdgeChange = React.useCallback(
      (
        allItems: VirtualItem[],
        mountedItems: VirtualItem[],
        vpRect: Rect,
        alreadyRendered: boolean,
      ) => {
        if (!hasMeasuredHeights(mountedItems)) {
          return;
        }
        onEdgeDetectorUpdate(
          allItems,
          mountedItems,
          vpRect,
          getItemHeightAverage,
          getItemHeights(),
          alreadyRendered,
        );
      },
      [getItemHeightAverage, getItemHeights, hasMeasuredHeights, onEdgeDetectorUpdate],
    );
    const update = React.useCallback(
      (_debugFrom?: string) => {
        const viewportRect = viewport.getRelativeToRootNode(rootNodeRef.current);
        if (!viewportRect) {
          return;
        }
        measureItemHeights();
        if (!commonProjectionItem) {
          return;
        }
        const alreadyRendered = !isInitialPlacement.current && !isScrolling.current;
        const nextProjection = getNextProjection(
          commonProjectionItem,
          viewportRect,
          alreadyRendered,
        );
        const itemsAreAnimating = animatingItems.current.size > 0;
        const shouldCorrect = hasCorrection(commonProjectionItem);
        const first = nextProjection.allItems.at(0);
        const last = nextProjection.allItems.at(-1);
        const listHeight = getHeightBetweenItems(first, last);
        const isHeightsMeasured = hasMeasuredHeights(nextProjection.nextRendered);
        if (isHeightsMeasured) {
          isInitialPlacement.current = false;
        }
        const mustMeasure =
          (!itemsAreAnimating &&
            isHeightsMeasured &&
            (!isScrolling.current || listHeight <= viewportRect.getHeight())) ||
          (isHeightsMeasured && isInitialPlacement.current);
        if (shouldCorrect && mustMeasure) {
          const projectionWithCorrection = getProjectionCorrection(
            nextProjection.nextRendered,
            getListOffset(commonProjectionItem),
          );
          setState(
            {
              mounted: projectionWithCorrection.rendered,
              listHeight,
              isTransition: !hasCorrection,
            },
            newState => {
              const scrollCorrection = -projectionWithCorrection.offset;
              let vpRect: Rect | undefined = viewportRect;
              if (scrollCorrection !== 0) {
                viewport.scrollBy(scrollCorrection);
                vpRect = viewport.getRelativeToRootNode(rootNodeRef.current);
              }
              if (vpRect) {
                // update edge sensor
                handleEdgeChange(
                  nextProjection.allItems,
                  newState.mounted,
                  vpRect,
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
              isTransition: true,
            },
            newState => {
              if (!shouldCorrect && !alreadyRendered) {
                debouncedUpdate('updatefn/debounced');
              }
              // update edge sensor
              handleEdgeChange(
                nextProjection.allItems,
                newState.mounted,
                viewportRect,
                alreadyRendered,
              );
            },
          );
        }
      },
      [
        commonProjectionItem,
        debouncedUpdate,
        getListOffset,
        getNextProjection,
        getProjectionCorrection,
        handleEdgeChange,
        hasCorrection,
        hasMeasuredHeights,
        measureItemHeights,
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
      200,
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
          update('state init');
        } else if (beforeStateUpdates.current === 'RAFUpdate') {
          window.requestAnimationFrame(() =>
            window.requestAnimationFrame(() => RAFUpdate('initial state rafUpdate')),
          );
        }

        beforeStateUpdates.current = undefined;
      }
    }, [state, RAFUpdate, update, viewport]);

    const prevItemList = React.useRef<VirtualDataItem<T>[]>();

    React.useEffect(() => {
      if (prevItemList.current === itemList) return;
      prevItemList.current = itemList;
      RAFUpdate('itemList updated');
      if (
        isPrevAtTop.current &&
        itemList.find(it => it.key === HEADER_COMPONENT) &&
        getItemHeight(HEADER_COMPONENT) > 0
      ) {
        viewport.scrollToTop();
      }
    }, [RAFUpdate, getItemHeight, itemList, viewport]);

    React.useEffect(() => {
      return () => {
        rootNodeRef.current = null;
      };
    }, []);

    const resizeObserver = useResizeObserver();

    const handleItemHeightChange = React.useCallback(
      (itemKey: string, newHeight: number) => {
        const delta = newHeight - getItemHeight(itemKey);
        if (delta === 0) return;
        if (animatingItems.current.has(itemKey)) {
          return RAFUpdate('animating item changed');
        }
        onItemHeightChange(itemKey, newHeight, state.mounted, update);
      },
      [RAFUpdate, getItemHeight, onItemHeightChange, state.mounted, update],
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

    const handleAnimationStart = React.useCallback((itemKey: string) => {
      animatingItems.current.add(itemKey);
    }, []);

    const handleAnimationEnd = React.useCallback((itemKey: string) => {
      animatingItems.current.delete(itemKey);
    }, []);

    return (
      <div
        id={restorationKey}
        ref={setRootRef}
        style={{
          position: 'relative',
          minHeight: Number.isFinite(state.listHeight)
            ? state.listHeight
            : viewport.getDocumentViewportHeight(),
        }}
      >
        {isAtTop() && hasPreviousPage && isLoading && loadingIndicator?.()}
        {getProjection(state.mounted, itemList).map(item => (
          <VirtualItemRenderer<T>
            key={item.virtualData.key}
            item={item.virtualData}
            index={item.virtualData.index}
            interfaceRef={setItemRendererInterface}
            resizeObserver={resizeObserver}
            transformStyle={`translateY(${item.start}px)`}
            estimatedHeight={estimatedHeight}
            onHeightChanged={handleItemHeightChange}
            itemSpacing={8}
            visible={getItemHeights().has(item.virtualData.key)}
            isTransition={state.isTransition}
            onAnimationStart={handleAnimationStart}
            onAnimationEnd={handleAnimationEnd}
          />
        ))}
        {!isAtTop() && hasNextPage && isLoading && loadingIndicator?.()}
      </div>
    );
  },
);
