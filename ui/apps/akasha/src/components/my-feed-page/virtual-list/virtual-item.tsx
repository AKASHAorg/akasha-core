import * as React from 'react';
import { useResizeObserver } from './use-resize-observer';

export const HEADER_COMPONENT = 'HEADER';

export type VirtualItemInfo = {
  itemKey: string;
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
  style?: React.CSSProperties;
};
// renderer for a virtual item
export const VirtualItem = <T,>(props: VirtualItemProps<T>) => {
  const { item, interfaceRef, estimatedHeight, resizeObserver, onHeightChanged, style } = props;
  const rootNodeRef = React.useRef<HTMLDivElement>();
  const currentHeight = React.useRef(estimatedHeight);

  React.useImperativeHandle(interfaceRef(item.key), () => ({
    measureHeight: measureElementHeight,
  }));

  const measureElementHeight = () => {
    if (!currentHeight.current) {
      currentHeight.current = rootNodeRef.current
        ? rootNodeRef.current.getBoundingClientRect().height
        : estimatedHeight;
    }
    return currentHeight.current;
  };
  const handleSizeChange = (entry: ResizeObserverEntry) => {
    if (entry && currentHeight.current !== Math.floor(entry.contentRect.height)) {
      currentHeight.current = Math.floor(entry.contentRect.height);
      onHeightChanged?.(item.key, entry.contentRect.height);
    }
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
      style={{
        ...style,
        position: 'absolute',
        width: '100%',
      }}
    >
      {item.render(item.data)}
    </div>
  );
};
