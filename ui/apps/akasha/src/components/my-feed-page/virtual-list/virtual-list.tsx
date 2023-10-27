import * as React from 'react';
import {
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
import { RestorationItem } from './index';
import { useStateWithCallback } from './use-state-with-callback';
import { MountedItem, VirtualizerCore } from './virtualizer-core';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { useEdgeDetector } from './use-edge-detector';

export type VirtualListInterface = {
  scrollToNewest: () => void;
  getRestorationItems: () => MountedItem[];
  isAtNewest: () => boolean;
};

export type VirtualListProps<T> = {
  estimatedHeight: number;
  itemList: VirtualDataItem<T>[];
  scrollRestorationType: ScrollRestoration;
  initialRect?: Rect;
  onScrollSave: () => void;
  scrollRestoreItem: RestorationItem;
  overscan: number;
  itemSpacing: number;
  onEdgeDetectorUpdate: ReturnType<typeof useEdgeDetector>['update'];
  onScrollEnd?: () => void;
  debug: boolean;
};

export const VirtualList = React.forwardRef(<T,>(props: VirtualListProps<T>, ref) => {
  React.useImperativeHandle(
    ref,
    (): VirtualListInterface => ({
      scrollToNewest: scrollToNewest.current,
      getRestorationItems,
      isAtNewest,
    }),
  );

  const {
    estimatedHeight,
    itemList,
    initialRect,
    scrollRestorationType,
    scrollRestoreItem,
    overscan,
    itemSpacing,
    onEdgeDetectorUpdate,
    onScrollEnd,
    debug,
  } = props;
  const listNodeRef = React.useRef<HTMLDivElement>();
  const prevItemListSize = React.useRef(0);
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
    offsetTop: 0,
    offsetBottom: 0,
    rootNode: listNodeRef,
  });

  // main projection update function
  // this method sets state
  const update = (from?: string) => {
    if (debug) {
      console.log('update requested from', from);
    }
    const viewportRect = viewport.getRelativeToRootNode();
    if (!viewportRect) {
      return;
    }
    const commonProjectionItem = virtualCore.current.getCommonProjectionItem(
      listState.mountedItems,
      viewportRect,
      itemList,
    );
    virtualCore.current.measureItemHeights();
    if (commonProjectionItem) {
      const newProjection = virtualCore.current.updateProjection(
        commonProjectionItem,
        viewportRect,
        itemList,
      );

      setListState(
        {
          mountedItems: newProjection.mountedItems,
          listHeight: newProjection.listHeight,
        },
        () => {
          let vpRect = viewportRect;
          if (hasOwn(newProjection, 'repositionOffset') && newProjection.repositionOffset !== 0) {
            viewport.scrollBy(-newProjection.repositionOffset);
            vpRect = viewport.getRelativeToRootNode();
          }
          if (
            (newProjection.mustReposition || !newProjection.alreadyRendered) &&
            !hasOwn(newProjection, 'repositionOffset')
          ) {
            updateScheduler.debouncedUpdate('setState/update callback');
          }
          if (vpRect) {
            onEdgeDetectorUpdate(
              newProjection.allItems,
              newProjection.mountedItems,
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

  React.useEffect(() => {
    if (prevItemListSize.current === itemList.length) {
      return;
    }
    if (!virtualCore.current.initialMount) {
      prevItemListSize.current = itemList.length;
    }
    updateScheduler.RAFUpdate('list update hook');
    // scrollToNewest.current();
  }, [itemList, updateScheduler]);

  const virtualCore = React.useRef(
    new VirtualizerCore({
      updateScheduler,
      overscan,
      itemSpacing,
      estimatedHeight,
      viewport,
    }),
  );

  const onFirstMount = () => {
    const initialProjection = virtualCore.current.computeInitialProjection(
      scrollRestoreItem,
      itemList,
    );
    if (scrollRestorationType === 'manual') {
      viewport.scrollBy(-1);
    }
    if (initialProjection.length > 0) {
      const listHeight = viewport.getDocumentViewportHeight();
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
        },
        () => {
          if (scrollRestoreItem) {
            // scroll to item
          }
          window.requestAnimationFrame(() => {
            updateScheduler.RAFUpdate('on first mount after setState');
          });
        },
      );
    } else {
      updateScheduler.update('onFirstMount');
    }
  };

  const setListRef = (node: HTMLDivElement) => {
    if (node && !listNodeRef.current) {
      listNodeRef.current = node;
      onFirstMount();
      virtualCore.current.setIsInitialMount(true);
    } else {
      // list is unmounting
    }
  };

  const isAtNewest = () => {
    const viewportRect = viewport.getRelativeToRootNode();
    if (!viewportRect) return true;
    // if (hasNextPage) {
    //   return viewportRect.getBottom() >= listState.listHeight;
    // }
    // @TODO: calculate list's root node offset top
    return viewportRect.getTop() <= listNodeRef.current.offsetTop;
  };

  const getRestorationItems = () => {
    const listRect = listNodeRef.current?.getBoundingClientRect();
    const viewportRect = viewport.getRelativeToRootNode();
    console.log(viewportRect, 'viewport in restoration item getter');
    if (listRect && viewportRect) {
      // @TODO: get items that are in the viewportRect;
      return virtualCore.current.getProjection(listState.mountedItems, itemList).filter(it => {
        return new Rect(it.start, virtualCore.current.getItemHeight(it.virtualData.key)).overlaps(
          viewportRect,
        );
      });
    }
    return [];
  };

  const scrollToNewest = React.useRef((shouldUpdate?: boolean) => {
    // if (hasNextPage) {
    //   viewport.scrollTo(0, listState.listHeight);
    // }
    viewport.scrollToTop();
    if (!shouldUpdate) return;
    updateScheduler.update('scrollToNewest');
  });

  const handleScrollEnd = useDebounce(() => {
    virtualCore.current.setIsScrolling(false);
    onScrollEnd?.();
    updateScheduler.RAFUpdate('onScrollEnd');
  }, 150);

  const onScroll = React.useCallback(() => {
    if (virtualCore.current.initialMount) {
      return;
    }
    virtualCore.current.setIsScrolling(true);
    handleScrollEnd();
    updateScheduler.throttledUpdate('onScroll');
  }, [handleScrollEnd, updateScheduler]);

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

  const projection = React.useMemo(
    () => virtualCore.current.getProjection(listState.mountedItems, itemList),
    [listState.mountedItems, itemList],
  );

  return (
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
          style={{
            transform: `translateY(${mounted.start}px)`,
          }}
          itemSpacing={itemSpacing}
        />
      ))}
    </div>
  );
});
