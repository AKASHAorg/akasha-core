import React from 'react';
import { useViewport } from './use-viewport';
import {
  type VirtualDataItem,
  type VirtualItem,
  VirtualItemRenderer,
} from './virtual-item-renderer';
import type { RestoreItem } from './use-scroll-state';
import type { Rect } from './rect';
import { useDebounce } from './use-debounce';
import { useResizeObserver } from './use-resize-observer';
import { useItemHeights } from './use-item-heights';
import { useProjection } from './use-projection';
import useThrottle from './use-throttle';
import { flushSync } from 'react-dom';
import { useCommonProjectionItem } from './use-common-projection-item';
import { useList } from './use-list';
import { getHeightBetweenItems } from '../utils';
import { useRAFUpdate } from './use-raf-update';

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

const getInitialRenderedItems = <T,>(
  itemList: VirtualDataItem<T>[],
  restorationItem: RestoreItem,
  documentHeight: number,
  getItemHeight: (itemKey: string) => number,
) => {
  const items: VirtualItem[] = [];
  if (!restorationItem) return items;
  let itemOffset = restorationItem.offsetTop;
  const itemIdx = itemList.findIndex(it => it.key === restorationItem.key);
  for (let i = itemIdx; i > -1 && i < itemList.length && itemOffset < documentHeight; i += 1) {
    const item = itemList[i];
    const height = getItemHeight(item.key);
    if (!Number.isFinite(height)) {
      break;
    }
    items.push({
      key: item.key,
      maybeRef: item.maybeRef,
      start: itemOffset,
      height,
      visible: true,
    });
    itemOffset += height;
  }
  itemOffset = restorationItem.offsetTop;
  for (let i = itemIdx - 1; i > -1 && itemOffset > 0; i -= 1) {
    const item = itemList[i];
    const height = getItemHeight(item.key);
    if (!Number.isFinite(height)) {
      break;
    }
    items.unshift({
      key: item.key,
      maybeRef: item.maybeRef,
      start: itemOffset,
      height,
      visible: true,
    });
    itemOffset -= height;
  }
};

export const VirtualListRenderer = React.forwardRef(
  <T,>(props: VirtualListRendererProps<T>, ref) => {
    React.useImperativeHandle(ref, () => ({
      isAtTop,
      scrollToTop,
    }));

    const {
      initialRect,
      offsetTop,
      restorationKey,
      measurementsCache,
      estimatedHeight,
      itemSpacing,
      itemList,
      overscan,
      restorationItem,
      hasPreviousPage,
      onEdgeDetectorUpdate,
    } = props;

    // <DEBUG>
    const debugVals = React.useRef({
      cpi: null,
      vpH: 0,
      vpTop: 0,
      docH: 0,
      listHeight: 0,
      updateStep: '',
      slice: { start: 0, end: 0 },
      vpScrollY: 0,
      mustMeasure: false,
      shouldCorrect: false,
    });
    // </DEBUG>

    const rootNodeRef = React.useRef<HTMLDivElement>();
    const isInitialPlacement = React.useRef(true);
    const isScrolling = React.useRef(false);
    const transitioningItems = React.useRef<Set<string>>(new Set());
    const wasAtTop = React.useRef(!restorationItem);
    const showScrollTopButton = React.useRef(false);
    const resizeObserver = useResizeObserver();

    const [state, setState] = React.useState<{
      mounted: VirtualItem[];
      listHeight: number;
      isTransition: boolean;
    }>({
      mounted: [],
      isTransition: false,
      listHeight: 0,
    });

    const {
      getItemHeights,
      getItemHeight,
      getItemHeightAverage,
      measureItemHeights,
      setItemRendererInterface,
      hasMeasuredHeights,
      getItemDistanceFromTop,
    } = useItemHeights({
      measurementsCache,
      estimatedHeight,
      itemSpacing,
    });

    const {
      createRect,
      getDocumentViewportHeight,
      getRelativeToRootNode,
      state: viewportState,
      scrollBy: viewportScrollBy,
      scrollToTop,
      getScrollY: getViewportScrollY,
    } = useViewport({
      initialRect,
      offsetTop: offsetTop ? offsetTop : rootNodeRef.current?.offsetTop || 0,
      offsetBottom: 0,
    });

    const { getListOffset, hasCorrection } = useList({
      itemList,
      getItemDistanceFromTop: getItemDistanceFromTop,
    });

    React.useEffect(() => {
      if (!viewportState.rect) {
        createRect(rootNodeRef.current.offsetTop);
      }
    }, [createRect, viewportState]);

    const isAtTop = React.useCallback(() => {
      const viewportRect = getRelativeToRootNode(rootNodeRef.current);
      if (!viewportRect) return true;
      if (!rootNodeRef.current) return true;

      return viewportRect.getTop() <= rootNodeRef.current.offsetTop;
    }, [getRelativeToRootNode]);

    const { getItemsWithData, getNextProjection, getProjectionCorrection } = useProjection<T>({
      isInitialPlacement: isInitialPlacement.current,
      getItemHeights,
      isAtTop,
      getDistanceFromTop: getItemDistanceFromTop,
      overscan: overscan,
      getItemHeight,
      getItemHeightAverage,
    });

    const { getCommonProjectionItem } = useCommonProjectionItem({
      getItemHeights,
      hasPreviousPage,
      isAtTop,
      itemList,
      getProjection: getItemsWithData,
      getItemHeight,
      isInitialPlacement: isInitialPlacement.current,
      stateItems: state.mounted,
    });

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

    const updateProjection = (from?: string) => {
      debugVals.current.updateStep = from;
      const viewportRect = getRelativeToRootNode(rootNodeRef.current);
      if (!viewportRect) {
        return;
      }
      debugVals.current.vpH = viewportRect.getHeight();
      debugVals.current.vpTop = viewportRect.getTop();
      debugVals.current.docH = getDocumentViewportHeight();
      const commonProjectionItem = getCommonProjectionItem(viewportRect);
      // measure heights after we have found the common projection item
      debugVals.current.cpi = commonProjectionItem;

      measureItemHeights();

      if (!commonProjectionItem) return;

      const alreadyRendered = !isInitialPlacement.current && !isScrolling.current;
      const nextProjection = getNextProjection(
        commonProjectionItem,
        itemList,
        viewportRect,
        alreadyRendered,
      );
      const itemsAreTransitioning = transitioningItems.current.size > 0;
      const shouldCorrect = hasCorrection(commonProjectionItem);
      const first = nextProjection.allItems.at(0);
      const last = nextProjection.allItems.at(-1);
      const listHeight = getHeightBetweenItems(first, last);
      debugVals.current.listHeight = listHeight;
      debugVals.current.slice = nextProjection.slice.current;
      const isHeightsMeasured = hasMeasuredHeights(nextProjection.nextRendered);
      if (isHeightsMeasured) {
        isInitialPlacement.current = false;
      }
      const mustMeasure =
        (!itemsAreTransitioning &&
          isHeightsMeasured &&
          (!isScrolling.current || listHeight <= viewportRect.getHeight())) ||
        (isHeightsMeasured && isInitialPlacement.current);
      debugVals.current.mustMeasure = mustMeasure;
      debugVals.current.shouldCorrect = shouldCorrect;
      if (shouldCorrect && mustMeasure) {
        const projectionWithCorrection = getProjectionCorrection(
          nextProjection.nextRendered,
          getListOffset(commonProjectionItem),
        );
        flushSync(() => {
          setState({
            mounted: projectionWithCorrection.rendered,
            listHeight,
            isTransition: !hasCorrection,
          });
          const scrollCorrection = -projectionWithCorrection.offset;
          let vpRect: Rect | undefined = viewportRect;
          if (scrollCorrection !== 0) {
            viewportScrollBy(scrollCorrection);
            vpRect = getRelativeToRootNode(rootNodeRef.current);
          }
          if (vpRect) {
            // update edge sensor
            handleEdgeChange(nextProjection.allItems, state.mounted, vpRect, alreadyRendered);
          }
        });
        return;
      }
      setState({
        mounted: nextProjection.nextRendered,
        listHeight,
        isTransition: true,
      });
      if (shouldCorrect || !alreadyRendered) {
        RAFUpdate('updatefn/debounced');
      }
      // update edge sensor
      handleEdgeChange(nextProjection.allItems, state.mounted, viewportRect, alreadyRendered);
    };

    // const debouncedUpdate = useDebounce(updateProjection, 250);
    const RAFUpdate = useRAFUpdate(updateProjection);

    const throttleUpdate = useThrottle(updateProjection, 100, { leading: false });

    const getInitialItems = React.useMemo(
      () => () =>
        getInitialRenderedItems(
          itemList,
          restorationItem,
          getDocumentViewportHeight(),
          getItemHeight,
        ),
      [getDocumentViewportHeight, getItemHeight, itemList, restorationItem],
    );
    /**
     * handle itemlist change
     */
    const prevItemCount = React.useRef(0);
    React.useEffect(() => {
      if (itemList.length === prevItemCount.current) {
        return;
      }
      prevItemCount.current = itemList.length;
      if (isInitialPlacement) {
        // initial render
        const initialItems = getInitialItems();
        if (initialItems.length) {
          flushSync(() => {
            setState({
              mounted: initialItems,
              listHeight: getDocumentViewportHeight(),
              isTransition: true,
            });
          });
        } else {
          updateProjection('initial state');
        }
      } else {
        // it's an update
        RAFUpdate('raf-update initial state');
      }
    });

    const onScrollEnd = React.useCallback(() => {
      isScrolling.current = false;
      RAFUpdate('onScrollEnd');
    }, [RAFUpdate]);

    const debouncedScrollEnd = useDebounce(onScrollEnd, 250, [onScrollEnd]);

    const onScroll = React.useCallback(() => {
      wasAtTop.current = isAtTop();
      isScrolling.current = true;
      const viewportScrollY = getViewportScrollY();
      if (isInitialPlacement.current || viewportScrollY < 0) {
        return;
      }
      if (viewportScrollY >= getDocumentViewportHeight()) {
        showScrollTopButton.current = true;
      }
      debugVals.current.vpScrollY = viewportScrollY;
      debouncedScrollEnd();
      throttleUpdate('scroll event');
    }, [
      debouncedScrollEnd,
      getDocumentViewportHeight,
      getViewportScrollY,
      isAtTop,
      throttleUpdate,
    ]);

    React.useEffect(() => {
      window.addEventListener('scroll', onScroll);
      return () => {
        window.removeEventListener('scroll', onScroll);
      };
    }, [onScroll]);

    const batchedHeightUpdates = React.useRef<Set<string>>(new Set());

    const handleItemHeightChange = React.useCallback(
      (itemKey: string, newHeight: number) => {
        const delta = newHeight - getItemHeight(itemKey);
        if (delta === 0) return;
        if (transitioningItems.current.has(itemKey)) {
          RAFUpdate('animating item changed');
        } else {
          batchedHeightUpdates.current.add(itemKey);
          // only update when items in state are resized
          if (
            state.mounted.some(
              item =>
                getItemHeights().has(item.key) ||
                batchedHeightUpdates.current.has(item.key) ||
                batchedHeightUpdates.current.size >= overscan,
            )
          ) {
            flushSync(() => {
              RAFUpdate('item height update');
            });
            batchedHeightUpdates.current.clear();
          }
        }
      },
      [RAFUpdate, getItemHeight, getItemHeights, overscan, state.mounted],
    );
    const handleAnimationStart = (itemKey: string) => {
      transitioningItems.current.add(itemKey);
    };
    const handleAnimationEnd = (itemKey: string) => {
      transitioningItems.current.delete(itemKey);
    };
    return (
      <>
        <div
          style={{
            position: 'fixed',
            bottom: '10%',
            right: 48,
            minHeight: 200,
            background: '#000',
            color: '#FFF',
            whiteSpace: 'pre-wrap',
            width: 330,
            zIndex: 99,
          }}
        >
          <div>Update Helper</div>
          <hr />
          <div>step: {debugVals.current.updateStep}</div>
          <div>vpH: {debugVals.current.vpH}</div>
          <div>vpTop: {debugVals.current.vpTop}</div>
          <div>docH: {debugVals.current.docH}</div>
          <div>listH: {debugVals.current.listHeight}</div>
          <div>vpScrollY: {debugVals.current.vpScrollY}</div>
          <div>vpBot: {debugVals.current.vpScrollY + debugVals.current.docH}</div>
          <div>
            isAtEnd:{' '}
            {debugVals.current.vpScrollY + debugVals.current.docH < debugVals.current.listHeight ? (
              <span>false</span>
            ) : (
              <span style={{ backgroundColor: 'red', color: 'white' }}>true</span>
            )}
          </div>
          <div>slice: {JSON.stringify(debugVals.current.slice)}</div>
          <div
            style={{
              position: 'fixed',
              top: viewportState.rect?.getTop(),
              height: viewportState.rect?.getHeight(),
              left: rootNodeRef.current?.getBoundingClientRect().left,
              width: rootNodeRef.current?.getBoundingClientRect().width,
              border: '2px solid green',
              zIndex: 99,
            }}
          />
        </div>
        <div
          id={restorationKey}
          ref={rootNodeRef}
          style={{
            position: 'relative',
            minHeight: state.listHeight,
          }}
        >
          {getItemsWithData(state.mounted, itemList).map(item => (
            <VirtualItemRenderer<T>
              key={item.virtualData.key}
              style={{
                border:
                  debugVals.current?.cpi.key === item.virtualData.key ? '2px solid yellow' : '',
              }}
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
        </div>
      </>
    );
  },
);
