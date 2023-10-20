import * as React from 'react';
import { VirtualDataItem, VirtualItem, VirtualItemInterface } from './virtual-item';
import { useResizeObserver } from './use-resize-observer';
import { useProjection } from './use-projection';
import { useViewport } from './use-viewport';
import { Rect } from './rect';
import { useUpdateScheduler } from './update-scheduler';
import { useDebounce } from './use-debounce';
import { RestorationItem } from './index';

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
};

export const VirtualList = React.forwardRef(<T,>(props: VirtualListProps<T>, ref) => {
  React.useImperativeHandle(
    ref,
    (): VirtualListInterface => ({
      scrollToNewest,
      getRestorationItems,
      isAtNewest,
    }),
  );

  const { estimatedHeight, itemList, initialRect } = props;
  const isScrolling = React.useRef(false);
  const listNodeRef = React.useRef<HTMLDivElement>();
  const [listState, setListState] = React.useState({
    renderedItems: [],
    listHeight: 0,
  });
  // main projection update function
  // this method sets state
  const update = (from?: string) => {
    console.log('update requested from', from);
    const viewportRect = viewport.getRelativeToRootNode();
    if (!viewportRect) {
      return;
    }
  };

  const updateScheduler = useUpdateScheduler(update);

  const projection = useProjection({
    itemList,
    updateScheduler,
  });

  const viewport = useViewport({
    initialRect,
    offsetTop: 0,
    offsetBottom: 0,
    rootNode: listNodeRef,
  });

  const resizeObserver = useResizeObserver();

  const setListRef = (node: HTMLDivElement) => {
    if (node && !listNodeRef.current) {
      listNodeRef.current = node;
    } else {
      // list is unmounting
    }
  };

  const isAtNewest = () => {
    // @TODO:
    return true;
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

  const scrollToNewest = () => {
    // @TODO:
  };

  const setInterface = (itemKey: string) => (ref?: VirtualItemInterface) => {};

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
          style={{
            transform: `translateY(${rendered.start}px)`,
          }}
        />
      ))}
    </div>
  );
});
