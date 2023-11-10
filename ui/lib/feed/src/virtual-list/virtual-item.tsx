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
  itemOffset: number;
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
    itemOffset,
  } = props;
  const rootNodeRef = React.useRef<HTMLDivElement>();
  const currentHeight = React.useRef(estimatedHeight);

  React.useImperativeHandle(interfaceRef(item.key), () => ({
    measureHeight: measureElementHeight,
  }));

  const handleSizeChange = React.useCallback(
    (entry: ResizeObserverEntry) => {
      if (entry) {
        const realHeight = entry.contentRect.height;
        if (currentHeight.current !== Math.floor(realHeight + itemSpacing)) {
          currentHeight.current = Math.floor(realHeight + itemSpacing);
          onHeightChanged?.(item.key, currentHeight.current);
        }
      }
    },
    [item.key, itemSpacing, onHeightChanged],
  );

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

  return (
    <div
      ref={setRootRefs}
      data-testidx={index}
      data-mayberef={item.maybeRef}
      style={{
        top: itemOffset,
        position: 'absolute',
        width: '100%',
        // transition: 'top 0.215s ease-in',
      }}
    >
      {item.render(item.data)}
    </div>
  );
};
