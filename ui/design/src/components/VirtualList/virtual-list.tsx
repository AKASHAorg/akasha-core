import * as React from 'react';
import throttle from 'lodash.throttle';
import { AnchorData, ItemRects, IVirtualListProps } from './interfaces';
import ListViewport from './list-viewport';
import { Rect } from './rect';
import { useViewport } from './use-viewport';
import { diffArr, getAnchor, getLastRendered } from './utils';

export interface ScrollData {
  items: string[];
  loadedIds: string[];
  averageItemHeight: number;
}

const DEFAULT_LOAD_LIMIT = 5;
const DEFAULT_ITEM_SPACING = 8;
const DEFAULT_OVERSCAN_SIZE = 4;

const VirtualScroll = (props: IVirtualListProps, ref: any) => {
  const {
    items,
    itemsData,
    overscan = DEFAULT_OVERSCAN_SIZE,
    itemCard,
    loadItemData,
    loadMore,
    itemSpacing = DEFAULT_ITEM_SPACING,
    // hasMoreItems = true,
    customEntities,
    // initialState,
    showNotificationPill = false,
    getNotificationPill,
    useItemDataLoader,
    initialPaddingTop,
    averageItemHeight = 200,
    loadLimit = DEFAULT_LOAD_LIMIT,
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
  }));

  const rootContainerRef = React.createRef<HTMLDivElement>();

  const [rects, setRects] = React.useState<ItemRects>(new Map());
  const [listHeight, setListHeight] = React.useState(0);
  const [, /* viewportState */ viewportActions] = useViewport(initialPaddingTop);
  const [localItemData, setLocalItemData] = React.useState<Map<string, any>>(new Map());
  const [isLoading, setIsLoading] = React.useState(false);

  const [anchorData, setAnchorData] = React.useState<AnchorData>({
    anchor: { index: 0, offset: 0 },
    scrollTop: 0,
  });

  const [slice, setSlice] = React.useState<{ start: number; end: number }>({
    start: 0,
    end: items.length,
  });

  // static data. will not trigger a rerender;
  const scrollData = React.useRef<ScrollData>({
    items: [],
    loadedIds: [],
    averageItemHeight,
  });

  React.useLayoutEffect(() => {
    if (!scrollData.current.items.length) {
      setIsLoading(true);
      loadMore({ limit: loadLimit * 2 });
    }
  }, []);

  React.useEffect(() => {
    if (isLoading && scrollData.current.loadedIds.length === scrollData.current.items.length) {
      // everything loaded
      setIsLoading(false);
    }
  }, [scrollData.current, isLoading]);

  React.useEffect(() => {
    if (isLoading) {
      return;
    }
    const isRequired = slice.end - scrollData.current.loadedIds.length > 0;
    if (!isRequired) {
      return;
    }
    loadMore({ start: items[items.length - 1], limit: loadLimit });
    setIsLoading(true);
  }, [slice.start, slice.end]);

  // compute initial anchor
  React.useEffect(() => {
    setAnchorData(prev =>
      getAnchor({
        scrollTop: viewportActions.getScrollTop(),
        anchorData: prev,
        itemSpacing,
        items: scrollData.current.items,
        rects,
        averageItemHeight: scrollData.current.averageItemHeight,
      }),
    );
  }, []);

  const lastRenderedIdx = React.useMemo(
    () =>
      getLastRendered(
        anchorData.anchor,
        viewportActions.getRect().getBottom() + viewportActions.getScrollTop(),
        rects,
        scrollData.current.items,
      ),
    [anchorData, rects, scrollData.current.items],
  );

  React.useEffect(() => {
    const startIdx = Math.max(anchorData.anchor.index - overscan, 0);
    const endIdx = lastRenderedIdx + overscan;

    if (startIdx !== slice.start || endIdx !== slice.end) {
      setSlice(prev => {
        if (startIdx !== prev.start || lastRenderedIdx + overscan !== prev.end) {
          return Object.assign({}, prev, { start: startIdx, end: lastRenderedIdx + overscan });
        }
        return prev;
      });
    }
  }, [anchorData, lastRenderedIdx]);

  const handleScroll = () => {
    setAnchorData(prev =>
      getAnchor({
        scrollTop: viewportActions.getScrollTop(),
        anchorData: prev,
        averageItemHeight: scrollData.current.averageItemHeight,
        itemSpacing,
        rects,
        items: scrollData.current.loadedIds,
      }),
    );
  };
  const handleResize = () => {
    // setRects(new Map());
    // updateAnchor();
  };
  const onResize = throttle(handleResize, 150, { leading: true });
  /**
   * Attach scroll and resize listeners
   */
  React.useEffect(() => {
    const scrollUnlisten = viewportActions.addScrollListener(handleScroll);
    const resizeUnlisten = viewportActions.addResizeListener(onResize);
    return () => {
      scrollUnlisten();
      resizeUnlisten();
    };
  }, [rootContainerRef.current, scrollData.current, rects, items]);

  /**
   *  Populate initial rect values
   */
  React.useLayoutEffect(() => {
    if (items.length && items.length > scrollData.current.items.length) {
      const diff = diffArr(scrollData.current.items, items);
      if (diff.insertPoint === 'before') {
        scrollData.current.items.unshift(...diff.diffItems);
      } else if (diff.insertPoint === 'after') {
        scrollData.current.items.push(...diff.diffItems);
      } else {
        // in between is not supported yet;
      }

      for (let i = 0; i < diff.diffItems.length; i += 1) {
        const globalIdx = items.indexOf(diff.diffItems[i]);
        setRects(prev => {
          let initialTop =
            globalIdx * averageItemHeight + Math.max(globalIdx * itemSpacing, itemSpacing);
          if (prev.has(items[globalIdx - 1])) {
            initialTop = prev.get(items[globalIdx - 1])!.rect.getBottom() + itemSpacing;
          }
          return new Map(
            prev.set(items[globalIdx], {
              index: globalIdx,
              rect: new Rect({ height: averageItemHeight, top: initialTop }),
            }),
          );
        });
        setListHeight(prev => prev + averageItemHeight + itemSpacing);
        if (diff.insertPoint === 'before') {
          updateRectsHeight(
            items[items.indexOf(diff.diffItems[diff.diffItems.length - 1])],
            averageItemHeight + itemSpacing,
          );
        }
      }
    }
  }, [items, scrollData.current, rects]);

  const updateRectsHeight = (changedId: string, heightDelta: number) => {
    const idx = items.indexOf(changedId);
    if (idx < 0) {
      return;
    }
    const itemRect = rects.get(changedId);
    if (!itemRect) {
      return;
    }

    if (Math.abs(heightDelta) <= 0) {
      return;
    }

    setRects(
      prev =>
        new Map(
          prev.set(changedId, {
            rect: prev.get(changedId)!.rect.translateBy(heightDelta, 0),
            index: itemRect.index,
          }),
        ),
    );

    for (let i = itemRect.index; i < slice.end; i += 1) {
      const curr = rects.get(items[i]);

      if (!curr) {
        continue;
      }

      if (curr) {
        setRects(
          prev =>
            new Map(
              prev.set(items[i], {
                rect: prev.get(items[i])!.rect.translateBy(0, heightDelta),
                index: curr.index,
              }),
            ),
        );
      }
    }
  };
  const handleItemSizeChange = React.useCallback(
    (itemId: string, domRect: DOMRect) => {
      if (scrollData.current.loadedIds.indexOf(itemId) < 0) {
        return;
      }
      scrollData.current.averageItemHeight =
        (scrollData.current.averageItemHeight * (rects.size - 1) + domRect.height) / rects.size;
      const itemRect = rects.get(itemId);
      if (!itemRect) {
        return;
      }

      const delta = -1 * (itemRect.rect.getHeight() - domRect.height);

      updateRectsHeight(itemId, delta);
      setListHeight(prev => prev + delta);
    },
    [scrollData.current.loadedIds, rects],
  );

  const getRenderSlice = () => {
    return items.slice(slice.start, slice.end);
  };

  React.useLayoutEffect(() => {
    const loadedItems = scrollData.current.loadedIds;
    const dataToPush = new Map(localItemData);
    if (loadedItems.length) {
      loadedItems.forEach(item => {
        if (dataToPush.has(item)) {
          return;
        }
        dataToPush.set(item, itemsData[item]);
      });
    }

    setLocalItemData(dataToPush);
  }, [scrollData.current.loadedIds.length, itemsData]);

  const handleItemInitialLoad = (itemId: string) => {
    if (scrollData.current.loadedIds.indexOf(itemId) >= 0) {
      return;
    }
    scrollData.current.loadedIds.push(itemId);
  };

  const handleItemUnload = (_itemId: string) => {
    // if (scrollData.current.loadedIds.indexOf(itemId) >= 0) {
    //   const idx = scrollData.current.loadedIds.indexOf(itemId);
    //   scrollData.current.loadedIds.splice(idx, 1);
    // }
  };

  return (
    <div
      ref={rootContainerRef}
      style={{
        height: listHeight + (isLoading ? 100 : 0),
        contain: 'layout',
        position: 'relative',
        transition: 'height 0.24s ease 0s',
      }}
      id="virtual-scroll-container"
    >
      {showNotificationPill &&
        getNotificationPill &&
        getNotificationPill({ styles: { marginTop: 8 } })}
      <ListViewport
        itemRects={rects}
        itemsData={localItemData}
        itemCard={itemCard}
        listHeight={listHeight}
        loadItemData={loadItemData}
        itemSpacing={itemSpacing}
        customEntities={customEntities}
        isFetching={isLoading}
        useItemDataLoader={useItemDataLoader}
        onItemSizeChange={handleItemSizeChange}
        renderSlice={getRenderSlice()}
        onItemInitialLoad={handleItemInitialLoad}
        onUnload={handleItemUnload}
        itemIds={items}
        loadedIds={scrollData.current.loadedIds}
      />
    </div>
  );
};

export default React.forwardRef(VirtualScroll);
