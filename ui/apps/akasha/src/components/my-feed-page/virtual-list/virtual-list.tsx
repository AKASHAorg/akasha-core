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
import { useUpdateScheduler } from './update-scheduler';
import { useDebounce } from './use-debounce';
import { useStateWithCallback } from './use-state-with-callback';
import { MountedItem, VirtualizerCore } from './virtualizer-core';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { useEdgeDetector } from './use-edge-detector';
import { ScrollState, useScrollRestore } from './use-scroll-restore';

export type VirtualListInterface<T> = {
  scrollToTop: () => void;
  getRestorationState: () => ScrollState<T>;
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
  itemSpacing: number;
  onEdgeDetectorUpdate: ReturnType<typeof useEdgeDetector>['update'];
  onScrollEnd?: () => void;
  debug: boolean;
  scrollRestore: ReturnType<typeof useScrollRestore<T>>;
  onFetchInitialData: (itemKeys: string[]) => void;
  scrollTopIndicator?: (listRect: DOMRect, onScrollToTop: () => void) => React.ReactNode;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onListReset?: () => void;
};

export const VirtualList = React.forwardRef(<T,>(props: VirtualListProps<T>, ref) => {
  React.useImperativeHandle(
    ref,
    (): VirtualListInterface<T> => ({
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
    itemSpacing,
    onEdgeDetectorUpdate,
    onScrollEnd,
    debug,
    onFetchInitialData,
    scrollTopIndicator,
    hasPreviousPage,
    onListReset,
  } = props;
  const listNodeRef = React.useRef<HTMLDivElement>();
  const isScrollRestored = React.useRef(false);
  const prevItemListSize = React.useRef(0);
  const showScrollTopButton = React.useRef(false);
  const [listState, setListState] = useStateWithCallback<{
    mountedItems: VirtualItemInfo[];
    listHeight: number;
    isTransitioning: boolean;
  }>({
    mountedItems: [],
    listHeight: 0,
    isTransitioning: false,
  });

  const resizeObserver = useResizeObserver();

  const viewport = useViewport({
    initialRect,
    offsetTop: 0,
    offsetBottom: 0,
    rootNode: listNodeRef,
  });

  const virtualCore = React.useRef<VirtualizerCore<T>>();

  const getCommonProjectionItem = React.useMemo(() => {
    if (!virtualCore.current) return () => undefined;
    const proj = virtualCore.current.getCommonProjectionItem(
      listState.mountedItems.filter(it => !it.key.startsWith(LOADING_INDICATOR)),
      viewport.getRelativeToRootNode(),
      itemList.filter(it => !it.key.startsWith(LOADING_INDICATOR)),
    );
    return () => proj;
  }, [itemList, listState.mountedItems, viewport]);

  // main projection update function
  // this method sets state
  const update = (debugFrom?: string) => {
    if (debug) {
      console.log('update requested from', debugFrom);
    }
    const viewportRect = viewport.getRelativeToRootNode();
    if (!viewportRect) {
      return;
    }

    virtualCore.current.measureItemHeights();
    const projectionItem = getCommonProjectionItem();
    if (projectionItem) {
      const newProjection = virtualCore.current.updateProjection(
        projectionItem,
        viewportRect,
        itemList,
      );
      if (
        (newProjection.mustReposition || !newProjection.alreadyRendered) &&
        !hasOwn(newProjection, 'repositionOffset')
      ) {
        updateScheduler.debouncedUpdate('setState/update callback');
      }
      setListState(
        {
          mountedItems: newProjection.mountedItems,
          listHeight: newProjection.listHeight,
          isTransitioning: newProjection.mustReposition,
        },
        () => {
          let vpRect = viewportRect;
          if (hasOwn(newProjection, 'repositionOffset') && newProjection.repositionOffset !== 0) {
            viewport.preventNextScroll();
            viewport.scrollBy(-newProjection.repositionOffset);
            vpRect = viewport.getRelativeToRootNode();
          }
          if (vpRect) {
            onEdgeDetectorUpdate(
              newProjection.allItems,
              newProjection.mountedItems,
              vpRect,
              virtualCore.current.itemHeightAverage,
              newProjection.alreadyRendered,
            );
          }
        },
      );
    }
  };

  const updateScheduler = useUpdateScheduler(update);

  React.useEffect(() => {
    virtualCore.current.setOptions({ updateScheduler });
  }, [updateScheduler]);

  React.useLayoutEffect(() => {
    if (
      scrollRestore.isFetched &&
      virtualCore.current.initialMount &&
      !isScrollRestored.current &&
      prevItemListSize.current === 0 &&
      itemList.filter(it => !it.key.startsWith(LOADING_INDICATOR) && it.key !== HEADER_COMPONENT)
        .length
    ) {
      let restorationItem: RestorationItem<T>;
      const restorationItems = scrollRestore.scrollState?.items;
      if (restorationItems?.length) {
        restorationItem = restorationItems.find(restItem =>
          itemList.some(it => it.key === restItem.virtualData.key),
        );
      }
      const initialProjection = virtualCore.current.computeInitialProjection(
        restorationItem,
        itemList.filter(it => !it.key.startsWith(LOADING_INDICATOR) && it.key !== HEADER_COMPONENT),
        restorationItems,
      );
      if (initialProjection.length > 0) {
        const listHeight =
          scrollRestore.scrollState.listHeight > 0
            ? scrollRestore.scrollState.listHeight
            : viewport.getDocumentViewportHeight();

        setListState(
          {
            mountedItems: initialProjection.map(it => ({
              key: it.virtualData.key,
              start: it.start,
              height: it.height,
              maybeRef: false,
              visible: false,
            })),
            listHeight,
            isTransitioning: true,
          },
          () => {
            if (restorationItem) {
              viewport.preventNextScroll();
              viewport.scrollBy(viewport.getOffsetCorrection());
            }
            virtualCore.current.setIsInitialMount(false);
            window.requestAnimationFrame(() =>
              window.requestAnimationFrame(() => updateScheduler.RAFUpdate('initial projection')),
            );
          },
        );
      }
      isScrollRestored.current = true;
      scrollRestore.restore();
    }
    if (
      prevItemListSize.current ===
      itemList.filter(it => !it.key.startsWith(LOADING_INDICATOR)).length
    ) {
      return;
    }
    if (!virtualCore.current.initialMount) {
      prevItemListSize.current = itemList.filter(
        it => !it.key.startsWith(LOADING_INDICATOR),
      ).length;
    }

    updateScheduler.RAFUpdate('list update hook');
  }, [itemList, scrollRestore, setListState, updateScheduler, viewport]);

  if (!virtualCore.current) {
    virtualCore.current = new VirtualizerCore({
      updateScheduler,
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
        onFetchInitialData(scrollRestore.scrollState.items.map(it => it.virtualData.key));
      } else {
        onFetchInitialData([]);
      }
    }

    if (scrollRestorationType === 'manual') {
      viewport.scrollBy(-1);
    }

    updateScheduler.update('onFirstMount');
  };

  const setListRef = (node: HTMLDivElement) => {
    if (node && !listNodeRef.current) {
      listNodeRef.current = node;
      onFirstMount();
      virtualCore.current.setIsInitialMount(true);
    }
  };

  const getRestorationState = (): ScrollState<T> => {
    const listRect = listNodeRef.current?.getBoundingClientRect();
    const viewportRect = viewport.getRelativeToRootNode();
    if (listRect && viewportRect) {
      const projection = virtualCore.current.getProjection(
        listState.mountedItems,
        itemList,
      ) as MountedItem<T>[];
      const scrollOffset = viewportRect.getTop();
      return {
        listHeight: listState.listHeight,
        scrollOffset,
        items: projection.filter(it => {
          return new Rect(it.start, virtualCore.current.getItemHeight(it.virtualData.key)).overlaps(
            viewportRect,
          );
        }),
      };
    }
    return {
      listHeight: 0,
      scrollOffset: viewport.getOffsetTop(),
      items: [],
    };
  };

  const scrollToTop = React.useCallback(
    (shouldUpdate?: boolean) => {
      viewport.scrollToTop();
      if (!shouldUpdate) return;
      updateScheduler.update('scrollToNewest');
    },
    [updateScheduler, viewport],
  );

  const handleScrollEnd = useDebounce((prevent?: boolean) => {
    if (prevent) {
      viewport.preventNextScroll(false);
    }
    virtualCore.current.setIsScrolling(false);
    onScrollEnd?.();
    if (viewport.getScrollY() >= viewport.getDocumentViewportHeight()) {
      showScrollTopButton.current = true;
    }
    updateScheduler.RAFUpdate('onScrollEnd');
  }, 150);

  const onScroll = React.useCallback(
    (prevented?: boolean) => {
      if (virtualCore.current.initialMount) {
        return;
      }
      if (prevented) {
        handleScrollEnd(prevented);
        return;
      }
      virtualCore.current.setIsScrolling(true);
      handleScrollEnd();
      updateScheduler.throttledUpdate('onScroll');
    },
    [handleScrollEnd, updateScheduler],
  );

  React.useLayoutEffect(() => {
    const scrollUnsub = viewport.addScrollListener(onScroll);
    return () => {
      scrollUnsub();
    };
  }, [viewport, onScroll]);

  const handleItemHeightChanged = (itemKey: string, newHeight: number) => {
    if (virtualCore.current.getItemHeight(itemKey) === newHeight) {
      return;
    }
    virtualCore.current.batchHeightUpdates(itemKey, listState.mountedItems);
  };

  const setInterface = (itemKey: string) => (ref?: VirtualItemInterface) => {
    virtualCore.current.setItemAPI(itemKey, ref);
  };

  const handleScrollToTop = () => {
    if (hasPreviousPage) {
      // reset the list to the newest entry
      prevItemListSize.current = 0;
      setListState({
        mountedItems: [],
        listHeight: 0,
        isTransitioning: false,
      });
      onListReset?.();
    } else {
      scrollToTop(true);
    }
  };

  const projection = React.useMemo(
    () => virtualCore.current.getProjection(listState.mountedItems, itemList),
    [listState.mountedItems, itemList],
  );

  return (
    <>
      <div
        ref={setListRef}
        className={`relative min-h-[${listState.listHeight}px] transition-[min-height] will-change-[min-height]`}
      >
        {projection.map(mounted => (
          <VirtualItem
            key={mounted.virtualData.key}
            interfaceRef={setInterface}
            estimatedHeight={estimatedHeight}
            item={mounted.virtualData}
            resizeObserver={resizeObserver}
            onHeightChanged={handleItemHeightChanged}
            itemHeight={mounted.height}
            style={{
              transform: `translateY(${mounted.start}px)`,
            }}
            itemSpacing={itemSpacing}
            isTransitioning={listState.isTransitioning}
            visible={mounted.visible}
          />
        ))}
      </div>
      {scrollTopIndicator &&
        (viewport.getRelativeToRootNode()?.getTop() || 0) >
          virtualCore.current.itemHeightAverage * 2 &&
        scrollTopIndicator(listNodeRef.current.getBoundingClientRect(), handleScrollToTop)}
    </>
  );
});
