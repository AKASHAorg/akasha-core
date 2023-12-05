import * as React from 'react';
import {
  HEADER_COMPONENT,
  LOADING_INDICATOR,
  VirtualDataItem,
  VirtualItem,
  VirtualItemInfo,
  VirtualItemInterface,
} from './virtual-item';
import { useResizeObserver } from './use-resize-observer';
import { useViewport } from './use-viewport';
import { Rect } from './rect';
import { useDebounce } from './use-debounce';
import { useStateWithCallback } from './use-state-with-callback';
import { MountedItem, VirtualizerCore } from './virtualizer-core';
import { useEdgeDetector } from './use-edge-detector';
import { useScrollRestore } from './use-scroll-restore';
import { dpr, pxToDPR } from './utils';
import { useThrottle } from './use-throttle';

export type VirtualListInterface = {
  scrollToTop: () => void;
  getRestorationState: () => {
    listHeight: number;
    items: { key: string; offsetTop: number }[];
    measurementsCache: Map<string, number>;
  };
  isAtTop: () => boolean;
};

export type RestorationItem<T> = {
  start: MountedItem<T>['start'];
  height: MountedItem<T>['height'];
  visible?: MountedItem<T>['visible'];
  virtualData: Omit<MountedItem<T>['virtualData'], 'render'>;
};

export type VirtualListProps<T> = {
  estimatedHeight: number;
  itemList: VirtualDataItem<T>[];
  scrollRestorationType: ScrollRestoration;
  initialRect?: Rect;
  overscan: number;
  itemSpacing?: number;
  onEdgeDetectorUpdate: ReturnType<typeof useEdgeDetector>['update'];
  onScrollEnd?: () => void;
  debug: boolean;
  scrollRestore: ReturnType<typeof useScrollRestore>;
  onFetchInitialData: (itemKeys: string[]) => void;
  scrollTopIndicator?: (listRect: DOMRect, onScrollToTop: () => void) => React.ReactNode;
  onListReset?: () => Promise<void>;
};

export const VirtualList = React.forwardRef(<T,>(props: VirtualListProps<T>, ref) => {
  React.useImperativeHandle(
    ref,
    (): VirtualListInterface => ({
      scrollToTop,
      getRestorationState,
      isAtTop: viewport.isAtTop,
    }),
  );

  const {
    estimatedHeight,
    itemList,
    initialRect,
    scrollRestorationType,
    scrollRestore,
    overscan,
    itemSpacing = 0,
    onEdgeDetectorUpdate,
    onScrollEnd,
    onFetchInitialData,
    scrollTopIndicator,
    onListReset,
  } = props;
  const listNodeRef = React.useRef<HTMLDivElement>();
  const isScrollRestored = React.useRef(false);
  const prevItemListSize = React.useRef(0);
  const showScrollTopButton = React.useRef(false);
  const batchedHeightUpdates = React.useRef(new Set());
  const [listState, setListState] = useStateWithCallback<{
    mountedItems: VirtualItemInfo[];
    listHeight: number;
  }>({
    mountedItems: [],
    listHeight: 0,
  });

  const resizeObserver = useResizeObserver();

  const viewport = useViewport({
    initialRect,
    offsetTop: listNodeRef.current?.offsetTop || 0,
    rootNode: listNodeRef,
  });

  const virtualCore = React.useRef<VirtualizerCore<T>>();

  const debouncedUpdate = useDebounce(
    (debugFrom?: string) =>
      window.requestIdleCallback
        ? window.requestIdleCallback(() => update(debugFrom))
        : window.requestAnimationFrame(() => update(debugFrom)),
    250,
  );

  // main projection update function
  // this method sets state
  const update = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_debugFrom: string) => {
      let viewportRect = viewport.getRelativeToRootNode();
      if (!viewportRect) {
        return;
      }
      virtualCore.current.measureItemHeights();
      const projectionItem: VirtualItemInfo | undefined =
        virtualCore.current.getCommonProjectionItem(
          listState.mountedItems.filter(it => !it.key.startsWith(LOADING_INDICATOR)),
          viewport.getRelativeToRootNode(),
          itemList.filter(it => !it.key.startsWith(LOADING_INDICATOR)),
        );

      if (projectionItem) {
        const newProjection = virtualCore.current.updateProjection(
          projectionItem,
          viewportRect,
          itemList,
        );

        setListState(
          {
            mountedItems: newProjection.mountedItems,
            listHeight: newProjection.listHeight,
          },
          () => {
            if (
              newProjection.hasCorrection &&
              newProjection.mustMeasure &&
              newProjection.correction !== 0
            ) {
              viewport.scrollBy(-newProjection.correction);
              viewportRect = viewport.getRelativeToRootNode();
            } else if (
              (newProjection.hasCorrection || !newProjection.alreadyRendered) &&
              !newProjection.mustMeasure
            ) {
              debouncedUpdate('setState/update callback');
            }
            onEdgeDetectorUpdate(
              newProjection.allItems,
              newProjection.mountedItems,
              viewportRect,
              virtualCore.current.itemHeightAverage,
              newProjection.alreadyRendered,
            );
          },
        );
      }
    },
    [
      debouncedUpdate,
      itemList,
      listState.mountedItems,
      onEdgeDetectorUpdate,
      setListState,
      viewport,
    ],
  );

  const RAFUpdate = React.useCallback(
    (debugFrom?: string) => window.requestAnimationFrame(() => update(debugFrom)),
    [update],
  );

  const throttledUpdate = useThrottle(RAFUpdate, 100, {
    leading: false,
  });

  React.useEffect(() => {
    if (
      scrollRestore.isFetched &&
      virtualCore.current.initialMount &&
      !isScrollRestored.current &&
      prevItemListSize.current === 0 &&
      itemList.filter(it => !it.key.startsWith(LOADING_INDICATOR) && it.key !== HEADER_COMPONENT)
        .length
    ) {
      let restorationItem: VirtualDataItem<T>;
      const restorationItems = scrollRestore.scrollState?.items;
      const measurementsCache = scrollRestore.scrollState?.measurementsCache;
      if (measurementsCache?.size) {
        virtualCore.current.setMeasurementsCache({ heights: measurementsCache });
      }
      if (restorationItems?.length) {
        restorationItem = itemList.find(il => restorationItems.some(rit => rit.key === il.key));
      }
      const initialProjection = virtualCore.current.computeInitialProjection(
        // first index is not be fetched because of filters
        restorationItems?.find(rstItem => rstItem.key === restorationItem.key),
        itemList.filter(it => !it.key.startsWith(LOADING_INDICATOR) && it.key !== HEADER_COMPONENT),
      );

      if (initialProjection.length > 0) {
        const listHeight = viewport.getDocumentViewportHeight();
        setListState(
          {
            mountedItems: initialProjection.map(it => ({
              key: it.virtualData.key,
              start: it.start,
              height: it.height,
              maybeRef: true,
              visible: true,
            })),
            listHeight,
          },
          () => {
            viewport.scrollBy(viewport.getOffsetCorrection());
          },
        );
        scrollRestore.restore();
      }
      if (!isScrollRestored.current && !viewport.isAtTop()) {
        viewport.scrollToTop();
      }
      isScrollRestored.current = true;
    }
    if (prevItemListSize.current === itemList.length) {
      return;
    }
    RAFUpdate('list update hook');
    prevItemListSize.current = itemList.length;
  }, [itemList, scrollRestore, listState, viewport, setListState, update, RAFUpdate]);

  if (!virtualCore.current) {
    virtualCore.current = new VirtualizerCore({
      overscan,
      itemSpacing,
      estimatedHeight,
      viewport,
    });
  }

  const onFirstMount = () => {
    if (scrollRestore.isFetched && !scrollRestore.isRestored) {
      const items = scrollRestore.scrollState?.items;
      if (items?.length) {
        onFetchInitialData(scrollRestore.scrollState.items.map(it => it.key));
      } else {
        onFetchInitialData([]);
      }
    }

    if (scrollRestorationType === 'manual') {
      viewport.scrollBy(-1);
    }
  };

  const setListRef = (node: HTMLDivElement) => {
    if (node && !listNodeRef.current) {
      listNodeRef.current = node;
      onFirstMount();
      virtualCore.current.setIsInitialMount(true);
    }
  };

  const getRestorationState = (): {
    listHeight: number;
    items: { key: string; offsetTop: number }[];
    measurementsCache: Map<string, number>;
  } => {
    const listRect = listNodeRef.current?.getBoundingClientRect();
    const viewportRect = viewport.getRelativeToRootNode();
    if (listRect && viewportRect) {
      const projection = virtualCore.current.getProjection(
        listState.mountedItems,
        itemList,
      ) as MountedItem<T>[];
      return {
        listHeight: listState.listHeight,
        measurementsCache: virtualCore.current.getMeasurementsCache(),
        items: projection
          .filter(it => {
            return (
              new Rect(it.start, virtualCore.current.getItemHeight(it.virtualData.key)).overlaps(
                viewportRect,
              ) &&
              !it.virtualData.key.startsWith(LOADING_INDICATOR) &&
              it.virtualData.key !== HEADER_COMPONENT
            );
          })
          .map(it => ({
            offsetTop: pxToDPR(it.start + viewport.getOffsetCorrection(), dpr),
            key: it.virtualData.key,
          })),
      };
    }
    return {
      listHeight: 0,
      items: [],
      measurementsCache: new Map(),
    };
  };

  const scrollToTop = React.useCallback(
    (shouldUpdate?: boolean) => {
      viewport.scrollToTop();
      if (!shouldUpdate) return;
      update('scrollToNewest');
    },
    [update, viewport],
  );

  const handleScrollEnd = useDebounce((prevent?: boolean) => {
    virtualCore.current.setIsScrolling(false);
    onScrollEnd?.();
    if (viewport.getScrollY() >= viewport.getDocumentViewportHeight()) {
      showScrollTopButton.current = true;
    }
    if (prevent) {
      viewport.preventNextScroll(false);
    }
    if (!prevent) {
      RAFUpdate('onScrollEnd');
    }
  }, 250);

  const onScroll = React.useCallback(
    (prevented?: boolean) => {
      if (virtualCore.current.initialMount) {
        return;
      }
      virtualCore.current.setIsScrolling(true);
      handleScrollEnd(prevented);
      if (!prevented) {
        throttledUpdate('onScroll');
      }
    },
    [handleScrollEnd, throttledUpdate],
  );

  React.useLayoutEffect(() => {
    const scrollUnsub = viewport.addScrollListener(onScroll);
    return () => {
      scrollUnsub();
    };
  }, [viewport, onScroll]);

  const handleItemHeightChanged = React.useCallback(
    (itemKey: string, newHeight: number) => {
      if (virtualCore.current.getItemHeight(itemKey) === newHeight) {
        return;
      }
      batchedHeightUpdates.current.add(itemKey);
      // only update when items in state are resized
      if (
        listState.mountedItems.some(
          item =>
            virtualCore.current.hasMeasuredHeight(item.key) ||
            batchedHeightUpdates.current.has(item.key) ||
            batchedHeightUpdates.current.size >= overscan * 2,
        )
      ) {
        update('item height update');
        batchedHeightUpdates.current.clear();
      }
    },
    [listState.mountedItems, overscan, update],
  );

  const setInterface = (itemKey: string) => (ref?: VirtualItemInterface) => {
    virtualCore.current.setItemAPI(itemKey, ref);
  };

  const handleScrollToTop = async () => {
    prevItemListSize.current = 0;
    scrollRestore.saveScrollState({ listHeight: 0, items: [], measurementsCache: new Map() });
    viewport.preventNextScroll();
    virtualCore.current.setIsInitialMount(true);
    await onListReset?.();
    scrollToTop(true);
  };

  const projection = React.useMemo(
    () => virtualCore.current.getProjection(listState.mountedItems, itemList),
    [listState.mountedItems, itemList],
  );

  return (
    <>
      <div
        id={`virtual-list`}
        ref={setListRef}
        style={{
          position: 'relative',
          minHeight: listState.listHeight,
        }}
      >
        {projection.map(mounted => (
          <VirtualItem
            key={mounted.virtualData.key}
            index={mounted.virtualData.index}
            interfaceRef={setInterface}
            estimatedHeight={estimatedHeight}
            item={mounted.virtualData}
            resizeObserver={resizeObserver}
            onHeightChanged={handleItemHeightChanged}
            itemOffset={mounted.start}
            itemSpacing={itemSpacing}
          />
        ))}
      </div>
      {/*{scrollTopIndicator &&*/}
      {/*  (viewport.getRelativeToRootNode()?.getTop() || 0) >*/}
      {/*    virtualCore.current.itemHeightAverage * 2 &&*/}
      {/*  scrollTopIndicator(listNodeRef.current.getBoundingClientRect(), handleScrollToTop)}*/}
    </>
  );
});
