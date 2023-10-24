import * as React from 'react';
import {
  VirtualDataItem,
  VirtualItem,
  VirtualItemInfo,
  VirtualItemInterface,
} from './virtual-item';
import { useResizeObserver } from './use-resize-observer';
import { RenderedItem, useProjection } from './use-projection';
import { useViewport } from './use-viewport';
import { Rect } from './rect';
import { useUpdateScheduler } from './update-scheduler';
import { useDebounce } from './use-debounce';
import { RestorationItem } from './index';
import { useStateWithCallback } from './use-state-with-callback';
import { getHeightBetweenItems } from './utils';

export type VirtualListInterface = {
  scrollToNewest: () => void;
  getRestorationItems: () => unknown[];
  isAtNewest: () => boolean;
};

export type VirtualListProps<T> = {
  estimatedHeight: number;
  itemList: VirtualDataItem<T>[];
  scrollRestorationType: ScrollRestoration;
  initialRect?: Rect;
  onScrollSave: () => void;
  scrollRestoreItem: RestorationItem;
  hasNextPage?: boolean;
  overscan: number;
  itemSpacing: number;
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
    hasNextPage,
    scrollRestorationType,
    scrollRestoreItem,
    overscan,
    itemSpacing,
  } = props;
  const isScrolling = React.useRef(false);
  const isInitialRender = React.useRef<boolean>();
  const listNodeRef = React.useRef<HTMLDivElement>();
  const [listState, setListState] = useStateWithCallback<{
    renderedItems: RenderedItem[];
    listHeight: number;
  }>({
    renderedItems: [],
    listHeight: 0,
  });

  const updateRenderedItems = (startItem: VirtualItemInfo, viewportRect: Rect) => {
    const alreadyRendered = !isScrolling.current && !isInitialRender.current;
    const nextProjection = projection.getNextProjection(startItem, viewportRect, alreadyRendered);
    const mustReposition = checkReposition(startItem);
    const first = nextProjection.allItems.at(0);
    const last = nextProjection.allItems.at(nextProjection.allItems.length - 1);
    const height = getHeightBetweenItems(first, last);
    const listTotalHeight =
      height + projection.getInvisiblePadding(nextProjection.allItems, viewportRect);
    const hasMeasuredHeights = projection.hasMeasuredHeights(nextProjection.nextRendered);
    const mustMeasure =
      (hasMeasuredHeights &&
        (!isScrolling.current || listTotalHeight <= viewportRect.getHeight())) ||
      (hasMeasuredHeights && isInitialRender);
    projection.updateSlice(nextProjection.slice);
    if (hasMeasuredHeights) {
      isInitialRender.current = false;
    }
    if (mustReposition && mustMeasure) {
      const repositioned = reposition(startItem, nextProjection.nextRendered);
      setListState(
        {
          renderedItems: repositioned.rendered.map<RenderedItem>(item => ({
            start: item.start,
            height: item.height,
            item: itemList.find(vdata => vdata.key === item.itemKey),
          })),
          listHeight: listTotalHeight,
        },
        () => {
          let rect = viewportRect;
          if (repositioned.offset !== 0) {
            viewport.scrollBy(-repositioned.offset);
            rect = viewport.getRelativeToRootNode();
          }
          if (rect) {
            // @TODO: update positioning
          }
        },
      );
    } else {
      setListState(
        {
          renderedItems: nextProjection.nextRendered.map<RenderedItem>(it => ({
            start: it.start,
            height: it.height,
            item: itemList.find(vdata => vdata.key === it.itemKey),
          })),
          listHeight: listTotalHeight,
        },
        () => {
          if (mustReposition || !alreadyRendered) {
            updateScheduler.debouncedUpdate('setListState callback');
          }
          //@TODO: update positioning
        },
      );
    }
  };

  const checkReposition = (fromItem: VirtualItemInfo) => {
    if (hasNextPage) {
      return projection.getListOffset(fromItem) - viewport.getOverScroll() !== 0;
    }
    return projection.getListOffset(fromItem) !== 0;
  };

  const reposition = (startItem: VirtualItemInfo, rendered: VirtualItemInfo[]) => {
    const offset = projection.getListOffset(startItem);
    return {
      offset,
      rendered: rendered.map<VirtualItemInfo>(item => ({
        ...item,
        start: item.start - offset,
      })),
    };
  };
  // main projection update function
  // this method sets state
  const update = (from?: string) => {
    console.log('update requested from', from);
    const viewportRect = viewport.getRelativeToRootNode();
    if (!viewportRect) {
      console.log('viewport not measured yet, returning');
      return;
    }
    const commonProjectionItem = projection.getCommonProjectionItem(
      startAtNewest(),
      listState.renderedItems,
      isInitialRender.current,
    );
    projection.measureItemHeights();
    if (commonProjectionItem) {
      updateRenderedItems(commonProjectionItem, viewportRect);
    }
  };

  const updateScheduler = useUpdateScheduler(update);

  const viewport = useViewport({
    initialRect,
    offsetTop: 0,
    offsetBottom: 0,
    rootNode: listNodeRef,
  });

  const projection = useProjection({
    itemList,
    updateScheduler,
    viewport,
    hasNextPage,
    listStateItems: listState.renderedItems,
    overscan,
    itemSpacing,
    estimatedHeight,
  });

  React.useEffect(() => {
    if (projection.getPreviousItems().itemList.length === itemList.length) {
      return;
    }
    if (!isInitialRender.current) {
      projection.updatePreviousItems(itemList);
      // @todo: invalidate restoreItems
    }
    updateScheduler.RAFUpdate('list update hook');
    scrollToNewest.current();
  }, [itemList, projection, updateScheduler]);

  const resizeObserver = useResizeObserver();

  const onFirstMount = () => {
    const initialProjection = projection.getInitialProjection(scrollRestoreItem);
    if (scrollRestorationType === 'manual') {
      viewport.scrollBy(-1);
    }
    isInitialRender.current = true;
    if (initialProjection.length > 0) {
      const listHeight = viewport.getDocumentViewportHeight();
      setListState(
        {
          renderedItems: initialProjection,
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
    } else {
      // list is unmounting
    }
  };
  const startAtNewest = () => !isInitialRender.current && isAtNewest();

  const isAtNewest = () => {
    const viewportRect = viewport.getRelativeToRootNode();
    if (!viewportRect) return true;
    if (hasNextPage) {
      return viewportRect.getBottom() >= listState.listHeight;
    }
    // @TODO: calculate list's root node offset top
    return viewportRect.getTop() <= listNodeRef.current.offsetTop;
  };

  const getRestorationItems = () => {
    const listRect = listNodeRef.current?.getBoundingClientRect();
    const viewportRect = viewport.getRelativeToRootNode();
    if (listRect && viewportRect) {
      // @TODO: get items that are in the viewportRect;
      return projection.getFinalProjection(listState.renderedItems).filter(it => {
        return new Rect(it.start, projection.getItemHeight(it.item.key)).overlaps(viewportRect);
      });
    }
    return [];
  };

  const scrollToNewest = React.useRef((shouldUpdate?: boolean) => {
    // @TODO:
    if (hasNextPage) {
      viewport.scrollTo(0, listState.listHeight);
    }
    viewport.scrollToTop();
    if (!shouldUpdate) return;
    updateScheduler.update('scrollToNewest');
  });

  const setInterface = (itemKey: string) => (ref?: VirtualItemInterface) => {
    projection.setItemInterface(itemKey, ref);
  };

  const onScrollEnd = useDebounce(() => {
    isScrolling.current = false;
    updateScheduler.RAFUpdate('onScrollEnd');
  }, 150);

  const onScroll = React.useCallback(() => {
    isScrolling.current = true;
    onScrollEnd();
    updateScheduler.throttledUpdate('onScroll');
  }, [onScrollEnd, updateScheduler]);

  React.useLayoutEffect(() => {
    const scrollUnsub = viewport.addScrollListener(onScroll);
    return () => {
      scrollUnsub();
    };
  }, [viewport, onScroll]);

  const handleItemHeightChanged = (itemKey: string, newHeight: number) => {
    if (projection.getItemHeightMap().get(itemKey) === newHeight) {
      return;
    }
    projection.updateItemHeight(itemKey);
  };

  return (
    <div
      ref={setListRef}
      className={`relative min-h-[${listState.listHeight}px] transition-[min-height] will-change-[min-height]`}
    >
      {projection.getFinalProjection(listState.renderedItems).map(rendered => (
        <VirtualItem
          key={rendered.item.key}
          interfaceRef={setInterface}
          estimatedHeight={estimatedHeight}
          item={rendered.item}
          resizeObserver={resizeObserver}
          onHeightChanged={handleItemHeightChanged}
          style={{
            transform: `translateY(${rendered.start}px)`,
          }}
          itemSpacing={itemSpacing}
        />
      ))}
    </div>
  );
});
