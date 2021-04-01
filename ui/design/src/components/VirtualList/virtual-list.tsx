// import throttle from 'lodash.throttle';
import * as React from 'react';
import { AnchorData, ItemRects, IVirtualListProps } from './interfaces';
import ListViewport from './list-viewport';
import { rectFromDOMRect, Rect } from './rect';
import { useViewport } from './use-viewport';
import {
  diffArr,
  getAnchor,
  getInitialRect,
  getLastRendered,
  InsertPoint,
  updatePositions,
} from './utils';

export interface ScrollData {
  items: string[];
  loadedIds: string[];
  averageItemHeight: number;
  globalOffsetTop: number;
}

const DEFAULT_LOAD_LIMIT = 3;
const DEFAULT_ITEM_SPACING = 8;
const DEFAULT_OVERSCAN_SIZE = 6;

const VirtualScroll = (props: IVirtualListProps, ref: any) => {
  const {
    items,
    itemsData,
    overscan = DEFAULT_OVERSCAN_SIZE,
    itemCard,
    loadItemData,
    loadMore,
    itemSpacing = DEFAULT_ITEM_SPACING,
    hasMoreItems = true,
    customEntities,
    // initialState,
    showNotificationPill = false,
    getNotificationPill,
    useItemDataLoader,
    initialPaddingTop,
    averageItemHeight = 200,
    loadLimit = DEFAULT_LOAD_LIMIT,
    listHeader,
    usePlaceholders = false,
  } = props;

  React.useImperativeHandle(ref, () => ({
    scrollToId: (_itemId: string) => {
      /* @TODO: */
    },
    scrollBy: (_amount: number) => {
      /* @TODO: */
    },
    /*
      Insert an item at position.
      NOTE: item data should be already available
    */
    insertItem: (_itemId: string, _index: number) => {
      // updaterActions.scheduleInsertion(itemId, index);
    },
    removeItem: (_itemId: string) => {
      /* @TODO: */
    },
    reset: resetState,
  }));

  const rootContainerRef = React.createRef<HTMLDivElement>();

  const [itemPositions, setPositions] = React.useState<{
    rects: ItemRects;
    listHeight: number;
  }>({
    rects: new Map(),
    listHeight: 0,
  });
  const [, viewportActions] = useViewport(initialPaddingTop);
  const [isLoading, setIsLoading] = React.useState(false);
  const [unmounting, setUnmounting] = React.useState<string[]>([]);

  const [anchorData, setAnchorData] = React.useState<AnchorData>({
    anchor: { index: 0, offset: 0 },
    scrollTop: 0,
  });

  const [slice, setSlice] = React.useState<{ start: number; end: number }>({
    start: 0,
    end: items.length,
  });
  const initialScrollData: ScrollData = {
    averageItemHeight,
    items: [],
    loadedIds: [],
    globalOffsetTop: 0,
  };
  // static data. will not trigger a rerender;
  const scrollData = React.useRef<ScrollData>(initialScrollData);

  const itemRefs = React.useRef<{ [key: string]: any }>({});

  const resetState = () => {
    scrollData.current = initialScrollData;
    itemRefs.current = {};
    setAnchorData({
      anchor: { index: 0, offset: 0 },
      scrollTop: 0,
    });
    setPositions({
      rects: new Map(),
      listHeight: 0,
    });
    setSlice({
      start: 0,
      end: items.length,
    });
    window.scrollTo({ top: 0 });
  };

  React.useLayoutEffect(() => {
    if (!scrollData.current.items?.length) {
      setIsLoading(true);
      loadMore({ limit: loadLimit });
    }
  }, []);

  React.useEffect(() => {
    if (isLoading && items?.length && itemPositions.rects.get(items[items?.length - 1])) {
      // everything loaded
      setIsLoading(false);
    } else if (!items?.length && isLoading) {
      setIsLoading(false);
    }
  }, [itemPositions.rects.size, items?.length, isLoading]);

  React.useEffect(() => {
    if (isLoading || !hasMoreItems) {
      return;
    }
    const required = slice.end - scrollData.current.items?.length;
    if (required < loadLimit) {
      return;
    }
    setIsLoading(true);
    loadMore({ start: items[items.length - 1], limit: required });
  }, [slice.start, slice.end]);

  // compute initial anchor
  React.useEffect(() => {
    setAnchorData(prev =>
      getAnchor({
        itemSpacing,
        anchorData: prev,
        items: scrollData.current.items,
        rects: itemPositions.rects,
        averageItemHeight: scrollData.current.averageItemHeight,
        getScrollTop: viewportActions.getScrollTop,
      }),
    );
  }, [items.length]);

  const lastRenderedIdx = React.useMemo(
    () =>
      getLastRendered(
        anchorData.anchor,
        viewportActions.getRect().getBottom() + viewportActions.getScrollTop(),
        itemPositions.rects,
        scrollData.current.items,
      ),
    [JSON.stringify(anchorData), JSON.stringify(itemPositions), scrollData.current.items?.length],
  );
  React.useEffect(() => {
    const startIdx = Math.max(anchorData.anchor.index - overscan, 0);
    const endIdx = lastRenderedIdx + overscan;

    if (startIdx !== slice.start || endIdx !== slice.end) {
      setSlice(prev => {
        if (startIdx !== prev.start || endIdx !== prev.end) {
          return Object.assign({}, prev, { start: startIdx, end: endIdx });
        }
        return prev;
      });
    }
  }, [JSON.stringify(anchorData), lastRenderedIdx]);

  const handleScroll = () => {
    requestAnimationFrame(() => {
      setPositions(positions => {
        setAnchorData(prev => {
          const newScrollTop = viewportActions.getScrollTop();
          if (Math.abs(newScrollTop - prev.scrollTop) <= scrollData.current.averageItemHeight / 4) {
            return prev;
          }
          return getAnchor({
            itemSpacing,
            anchorData: prev,
            averageItemHeight: scrollData.current.averageItemHeight,
            rects: positions.rects,
            items: scrollData.current.loadedIds,
            getScrollTop: viewportActions.getScrollTop,
          });
        });
        return positions;
      });
    });
  };

  const handleResize = () => {
    /* @TODO: */
  };

  // const throttledScroll = throttle(handleScroll, 150, { trailing: true, leading: false });
  const onScroll = handleScroll;
  const onResize = handleResize;
  /**
   * Attach scroll and resize listeners
   */
  React.useEffect(() => {
    const scrollUnlisten = viewportActions.addScrollListener(onScroll);
    const resizeUnlisten = viewportActions.addResizeListener(onResize);
    return () => {
      scrollUnlisten();
      resizeUnlisten();
    };
  }, [rootContainerRef.current, scrollData.current, JSON.stringify(itemPositions), items]);

  /**
   *  Populate initial rect values
   */
  React.useEffect(() => {
    if (!items.length && scrollData.current.items?.length) {
      resetState();
    }
    if (items.length && items.length > scrollData.current.items?.length) {
      const diff = diffArr(scrollData.current.items, items);
      switch (diff.insertPoint) {
        case InsertPoint.LIST_HEAD:
          scrollData.current.items?.unshift(...diff.diffItems);
          break;
        case InsertPoint.LIST_TAIL:
          scrollData.current.items = scrollData.current.items?.concat(diff.diffItems);
          break;
        case InsertPoint.LIST_BETWEEN:
          /* not supported yet */
          break;
        default:
          break;
      }
    } else if (items?.length && items?.length < scrollData.current.items?.length) {
      // an item is removed from the list
      const removedItems = scrollData.current.items?.filter(id => !items.includes(id));
      if (removedItems?.length) {
        removedItems.forEach(item => {
          // an array of items [a, b, c] was removed,
          // the original array was [a,b,c,d,e]
          // d and e, should now get into positions of a,b,c
          if (scrollData.current.items.indexOf(item) === scrollData.current.items?.length - 1) {
            // is last item, no reposition needed
            scrollData.current.items.splice(scrollData.current.items?.indexOf(item), 1);
            return;
          }
          setPositions(prev => {
            const updated = updatePositions(
              item,
              new Rect({ height: -1 * itemSpacing, top: 0 }),
              prev,
            );
            updated.rects.delete(item);
            const newPos = { ...updated };
            return newPos;
          });
        });
      }
    }
  }, [items, scrollData.current]);

  /**
   * hook to keep the external state (props.items)
   * in sync with the internal state
   * when props.items.length === 0
   * the list will automatically reset it's
   * internal state.
   */
  React.useMemo(() => {
    if (!unmounting.length) {
      return;
    }
    setPositions(prev => {
      const newRects = new Map(prev.rects);
      const rem = unmounting.slice();
      unmounting.forEach(item => {
        // keep the item if it's still in the list!
        if (items.includes(item)) {
          return;
        }
        scrollData.current.loadedIds.splice(scrollData.current.loadedIds.indexOf(item), 1);
        scrollData.current.items.splice(scrollData.current.items.indexOf(item), 1);
        newRects.delete(item);
        delete itemRefs.current[item];
        rem.splice(rem.indexOf(item), 1);
      });

      if (rem.length !== unmounting.length) {
        setUnmounting(rem);
      }

      if (newRects.size === prev.rects.size) {
        return prev;
      }
      return {
        rects: newRects,
        listHeight: !items.length ? 0 : prev.listHeight,
      };
    });
  }, [unmounting.length, items.length]);

  const onRefUpdate = (itemId: string, itemRef: any) => {
    const itemRect = itemPositions.rects.get(itemId);
    if (itemRect && itemRect.canRender && !scrollData.current.loadedIds.includes(itemId)) {
      scrollData.current.loadedIds.push(itemId);
    }
    // update top offset
    // it's required because the list header size might change!
    if (
      items.indexOf(itemId) === 0 &&
      itemRef &&
      itemRef.offsetTop !== scrollData.current.globalOffsetTop
    ) {
      setPositions(prev => {
        const offsetDelta = itemRef.offsetTop - scrollData.current.globalOffsetTop;
        scrollData.current.globalOffsetTop = itemRef.offsetTop;

        return {
          ...prev,
          listHeight: prev.listHeight + offsetDelta,
        };
      });
    }

    if (itemRef && itemRect) {
      const domRect = itemRef.getBoundingClientRect();
      const rect = rectFromDOMRect(domRect);
      if (rect.getHeight() !== itemRect.rect.getHeight()) {
        setPositions(prev => updatePositions(itemId, rect, prev));
        scrollData.current.averageItemHeight =
          (scrollData.current.averageItemHeight * (itemPositions.rects?.size - 1) +
            rect.getHeight()) /
          itemPositions.rects?.size;
      }
    }
    if (!itemRefs.current[itemId] && itemRef) {
      itemRefs.current[itemId] = itemRef;
      setPositions(prev =>
        getInitialRect({
          itemId,
          items,
          itemSpacing,
          refs: itemRefs.current,
          prevPositions: prev,
          globalOffsetTop: scrollData.current.globalOffsetTop,
        }),
      );
    }
  };

  const getRenderSlice = () => {
    return items.slice(slice.start, slice.end);
  };

  const handleItemUnmount = (itemId: string) => {
    if (!unmounting.includes(itemId)) {
      setUnmounting(prev => prev.concat(itemId));
    }
  };

  return (
    <div
      ref={rootContainerRef}
      style={{
        height: itemPositions.listHeight + (isLoading ? 100 : 0),
        contain: 'layout',
        position: 'relative',
        transition: 'height 0.4s ease 0s',
      }}
      id="virtual-scroll-container"
    >
      {showNotificationPill &&
        getNotificationPill &&
        getNotificationPill({ styles: { marginTop: 8 } })}
      <ListViewport
        itemRects={itemPositions.rects}
        itemsData={itemsData}
        itemCard={itemCard}
        listHeight={itemPositions.listHeight}
        loadItemData={loadItemData}
        itemSpacing={itemSpacing}
        customEntities={customEntities}
        isFetching={isLoading}
        useItemDataLoader={useItemDataLoader}
        renderSlice={getRenderSlice()}
        itemIds={items}
        updateRef={onRefUpdate}
        averageItemHeight={scrollData.current.averageItemHeight}
        listHeader={listHeader}
        usePlaceholders={usePlaceholders}
        loadLimit={loadLimit}
        onItemUnmount={handleItemUnmount}
      />
    </div>
  );
};

export default React.forwardRef(VirtualScroll);
