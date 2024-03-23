import * as React from 'react';
import { useResizeObserver } from './use-resize-observer';

export const HEADER_COMPONENT = 'HEADER';
export const FOOTER_COMPONENT = 'FOOTER';
export const LOADING_INDICATOR = 'LOADING_INDICATOR';

export type VirtualItem = {
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
  itemSpacing: number;
  transformStyle: string;
  index: number;
  visible: boolean;
  isTransition?: boolean;
  onAnimationStart?: (itemKey: string) => void;
  onAnimationEnd?: (itemKey: string) => void;
  style?: React.CSSProperties;
};

export const VirtualItemRenderer = <T,>(props: VirtualItemProps<T>) => {
  const {
    item,
    interfaceRef,
    estimatedHeight,
    resizeObserver,
    onHeightChanged,
    itemSpacing,
    transformStyle,
    visible,
    isTransition,
    onAnimationEnd,
    onAnimationStart,
    style,
  } = props;
  const rootNodeRef = React.useRef<HTMLDivElement>();
  const currentHeight = React.useRef(estimatedHeight + itemSpacing);
  const animationTimeout = React.useRef<ReturnType<typeof setTimeout>>();
  const itemKey = React.useRef(item.key);
  const onAnimationEndRef = React.useRef(onAnimationEnd);
  React.useImperativeHandle(interfaceRef(item.key), () => ({
    measureHeight: measureElementHeight,
  }));

  React.useEffect(() => {
    if (item.key !== itemKey.current) {
      itemKey.current = item.key;
    }
  }, [item.key]);

  React.useEffect(() => {
    let animationRefFn = onAnimationEndRef.current;
    return () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
        animationRefFn(itemKey.current);
        animationRefFn = undefined;
      }
    };
  }, []);

  const handleSizeChange = React.useCallback(
    (entry: ResizeObserverEntry) => {
      if (entry) {
        const realHeight = Math.round(entry.contentRect.height + itemSpacing);
        if (currentHeight.current !== realHeight) {
          currentHeight.current = realHeight;
          onHeightChanged?.(item.key, currentHeight.current);
        }
      }
    },
    [item.key, itemSpacing, onHeightChanged],
  );

  React.useEffect(() => {
    const nodeRef = rootNodeRef.current;
    if (nodeRef) {
      resizeObserver.observe(nodeRef, handleSizeChange);
    }
    return () => {
      resizeObserver.unobserve(nodeRef);
    };
  }, [handleSizeChange, resizeObserver]);

  const measureElementHeight = React.useCallback(() => {
    const realHeight = rootNodeRef.current
      ? Math.round(rootNodeRef.current.getBoundingClientRect().height + itemSpacing)
      : estimatedHeight + itemSpacing;
    if (currentHeight.current !== realHeight) {
      currentHeight.current = realHeight;
    }
    return currentHeight.current;
  }, [estimatedHeight, itemSpacing]);

  // const setRootRefs = (node: HTMLDivElement) => {
  //   if (node) {
  //     if (rootNodeRef.current && !node.isEqualNode(rootNodeRef.current)) {
  //       resizeObserver.unobserve(node);
  //     }
  //     rootNodeRef.current = node;
  //     resizeObserver.observe(node, handleSizeChange);
  //   } else if (!node && rootNodeRef.current) {
  //     resizeObserver.unobserve(rootNodeRef.current);
  //     rootNodeRef.current = undefined;
  //   }
  // };

  const handleAnimationEnd = React.useCallback(() => {
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
      animationTimeout.current = undefined;
    }
    if (rootNodeRef.current) {
      resizeObserver.observe(rootNodeRef.current, handleSizeChange);
    }
    onAnimationEnd?.(item.key);
  }, [handleSizeChange, item.key, onAnimationEnd, resizeObserver]);

  const handleAnimationStart = React.useCallback(() => {
    resizeObserver.unobserve(rootNodeRef.current);
    onAnimationStart?.(item.key);
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
    }
    animationTimeout.current = setTimeout(handleAnimationEnd, 1000);
  }, [handleAnimationEnd, item.key, onAnimationStart, resizeObserver]);

  const prevTransformStyle = React.useRef(transformStyle);

  const isInTransitionAnimation = React.useMemo(() => {
    let shouldTransition: boolean;
    if (prevTransformStyle.current !== transformStyle && visible) {
      // animation start
      handleAnimationStart();
      shouldTransition = true;
    } else {
      // end animation
      handleAnimationEnd();
      shouldTransition = false;
    }
    prevTransformStyle.current = transformStyle;
    return shouldTransition;
  }, [handleAnimationEnd, handleAnimationStart, transformStyle, visible]);

  const transition = React.useMemo(() => {
    if (isInTransitionAnimation) {
      return 'transform 0.15s linear';
    }
    return 'opacity 0.214s ease-in-out';
  }, [isInTransitionAnimation]);

  return (
    <div
      ref={rootNodeRef}
      style={{
        transform: transformStyle,
        position: 'absolute',
        width: '100%',
        transition: isTransition ? transition : undefined,
        opacity: visible ? 1 : 0,
        ...style,
      }}
    >
      {item.render(item.data)}
    </div>
  );
};
