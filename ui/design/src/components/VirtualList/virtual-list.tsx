import * as React from 'react';
import throttle from 'lodash.throttle';
import { AnchorData, ItemRects, IVirtualListProps } from './interfaces';
import ListViewport from './list-viewport';
import { useViewport } from './use-viewport';
import { diffArr, getAnchor, getInitialRect, getLastRendered, updatePositions } from './utils';

export interface ScrollData {
  items: string[];
  loadedIds: string[];
  averageItemHeight: number;
  globalOffsetTop: number;
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
    listHeader,
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

  const [itemPositions, setPositions] = React.useState<{ rects: ItemRects; listHeight: number }>({
    rects: new Map(),
    listHeight: 0,
  });
  const [, viewportActions] = useViewport(initialPaddingTop);
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
    averageItemHeight,
    items: [],
    loadedIds: [],
    globalOffsetTop: 0,
  });

  const itemRefs = React.useRef<{ [key: string]: any }>({});

  React.useLayoutEffect(() => {
    if (!scrollData.current.items.length) {
      setIsLoading(true);
      loadMore({ limit: loadLimit });
    }
  }, []);

  React.useEffect(() => {
    if (isLoading && scrollData.current.loadedIds.length === scrollData.current.items.length) {
      // everything loaded
      setIsLoading(false);
    }
  }, [scrollData.current.loadedIds.length, scrollData.current.items.length, isLoading]);

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
        itemSpacing,
        scrollTop: viewportActions.getScrollTop(),
        anchorData: prev,
        items: scrollData.current.items,
        rects: itemPositions.rects,
        averageItemHeight: scrollData.current.averageItemHeight,
      }),
    );
  }, []);

  const lastRenderedIdx = React.useMemo(
    () =>
      getLastRendered(
        anchorData.anchor,
        viewportActions.getRect().getBottom() + viewportActions.getScrollTop(),
        itemPositions.rects,
        scrollData.current.items,
      ),
    [JSON.stringify(anchorData), JSON.stringify(itemPositions), scrollData.current.items.length],
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
    setAnchorData(prev =>
      getAnchor({
        itemSpacing,
        scrollTop: viewportActions.getScrollTop(),
        anchorData: prev,
        averageItemHeight: scrollData.current.averageItemHeight,
        rects: itemPositions.rects,
        items: scrollData.current.loadedIds,
      }),
    );
  };
  const handleResize = () => {
    /* @TODO: */
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
  }, [rootContainerRef.current, scrollData.current, JSON.stringify(itemPositions), items]);

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
    }
  }, [items, scrollData.current, JSON.stringify(itemPositions)]);

  const onRefUpdate = (itemId: string, itemRef: any, isUnmounting?: boolean) => {
    const itemRect = itemPositions.rects.get(itemId);

    if (itemRect && itemRect.canRender && !scrollData.current.loadedIds.includes(itemId)) {
      scrollData.current.loadedIds.push(itemId);
    }

    if (itemRef && itemRect) {
      const domRect = itemRef.getBoundingClientRect();
      if (domRect.height !== itemRect.rect.getHeight()) {
        setPositions(prev => updatePositions(itemId, domRect, prev, itemSpacing));
        scrollData.current.averageItemHeight =
          (scrollData.current.averageItemHeight * (itemPositions.rects.size - 1) + domRect.height) /
          itemPositions.rects.size;
      }
    }

    if (!itemRefs.current[itemId] && itemRef && !isUnmounting) {
      itemRefs.current[itemId] = itemRef;
      // set the top offset
      if (items.indexOf(itemId) === 0) {
        scrollData.current.globalOffsetTop = itemRef.getBoundingClientRect().top - itemSpacing;
      }

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

    if (itemRefs.current[itemId] && isUnmounting) {
      delete itemRefs.current[itemId];
    }
  };

  const getRenderSlice = () => {
    return items.slice(slice.start, slice.end);
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
      />
    </div>
  );
};

export default React.forwardRef(VirtualScroll);
