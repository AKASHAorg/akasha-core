import * as React from 'react';
import { useResizeObserver } from './use-resize-observer';

export const HEADER_COMPONENT = 'HEADER';
export const LOADING_INDICATOR = 'LOADING_INDICATOR';

export type VirtualItemInfo = {
  key: string;
  start: number;
  height: number;
  visible: boolean;
  maybeRef: boolean;
};

export type VirtualDataItem<T> = {
  index: number;
  key: string;
  data: T;
  maybeRef: boolean;
  render: (data: T) => React.ReactNode;
};

export const createVirtualDataItem = <T,>(
  key: string,
  data: T,
  maybeRef: boolean,
  render: VirtualDataItem<T>['render'],
  idx = -1,
): VirtualDataItem<T> => {
  return {
    index: idx,
    key,
    data,
    render,
    maybeRef,
  };
};

export type VirtualItemInterface = {
  measureHeight: () => number;
};

export type VirtualItemProps<T> = {
  interfaceRef: (key: string) => (ref: VirtualItemInterface) => void;
  resizeObserver: ReturnType<typeof useResizeObserver>;
  item: VirtualDataItem<T>;
  estimatedHeight: number;
  onHeightChanged?: (itemKey: string, newHeight: number) => void;
  itemSpacing?: number;
  itemHeight: number;
  itemOffset: number;
  isTransitioning: boolean;
  visible: boolean;
  index: number;
};
// renderer for a virtual item
export const VirtualItem = <T,>(props: VirtualItemProps<T>) => {
  const {
    item,
    index,
    interfaceRef,
    estimatedHeight,
    resizeObserver,
    onHeightChanged,
    itemSpacing,
    itemHeight,
    isTransitioning,
    visible,
    itemOffset,
  } = props;
  const rootNodeRef = React.useRef<HTMLDivElement>();
  const currentHeight = React.useRef(estimatedHeight);
  const prevOffset = React.useRef(0);
  const animateNext = React.useRef(false);

  React.useImperativeHandle(interfaceRef(item.key), () => ({
    measureHeight: measureElementHeight,
  }));

  const handleSizeChange = React.useCallback(
    (entry: ResizeObserverEntry) => {
      if (entry) {
        const realHeight = entry.contentRect.height;
        if (currentHeight.current !== realHeight + itemSpacing) {
          currentHeight.current = realHeight + itemSpacing;
          onHeightChanged?.(item.key, currentHeight.current);
          resizeObserver.unobserve(rootNodeRef.current);
          animateNext.current = true;
        }
      }
    },
    [item.key, itemSpacing, onHeightChanged, resizeObserver],
  );

  React.useLayoutEffect(() => {
    const nodeHeight = rootNodeRef.current?.getBoundingClientRect().height + itemSpacing;
    if (nodeHeight === itemHeight && animateNext.current) {
      resizeObserver.observe(rootNodeRef.current, handleSizeChange);
    }
  }, [itemSpacing, itemHeight, resizeObserver, handleSizeChange]);

  const measureElementHeight = () => {
    const realHeight = rootNodeRef.current
      ? rootNodeRef.current.getBoundingClientRect().height + itemSpacing
      : estimatedHeight + itemSpacing;
    if (currentHeight.current !== realHeight) {
      currentHeight.current = realHeight;
    }
    return currentHeight.current;
  };

  const setRootRefs = (node: HTMLDivElement) => {
    if (node) {
      if (rootNodeRef.current && !node.isEqualNode(rootNodeRef.current)) {
        resizeObserver.unobserve(node);
      }
      rootNodeRef.current = node;
      resizeObserver.observe(node, handleSizeChange);
    } else if (!node && rootNodeRef.current) {
      resizeObserver.unobserve(rootNodeRef.current);
    }
  };

  const transitionStyle = React.useMemo(() => {
    if (isTransitioning) {
      return 'opacity 0.214s ease-in';
    }
    if (itemOffset !== prevOffset.current) {
      prevOffset.current = itemOffset;
      return 'top 0.15s linear';
    }
    return undefined;
  }, [isTransitioning, itemOffset]);

  return (
    <div
      ref={setRootRefs}
      data-testidx={index}
      style={{
        top: itemOffset,
        transition: transitionStyle,
        position: 'absolute',
        width: '100%',
        opacity: visible ? undefined : 0.01,
      }}
    >
      {item.render(item.data)}
    </div>
  );
};
