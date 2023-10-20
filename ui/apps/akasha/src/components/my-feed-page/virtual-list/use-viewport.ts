import { Rect } from './rect';
import { isWindow, pxToDPR } from './utils';
import React from 'react';

export type UseViewportProps = {
  initialRect: Rect;
  offsetTop: number;
  offsetBottom: number;
  rootNode: React.MutableRefObject<HTMLElement>;
};
export const useViewport = (props: UseViewportProps) => {
  const { initialRect, offsetTop, offsetBottom, rootNode } = props;
  const dpr = isWindow ? window.devicePixelRatio || 1 : 1;
  const unregisterScroll = React.useRef<() => void>();
  const unregisterResize = React.useRef<() => void>();
  const scrollListeners = React.useRef([]);
  const resizeListeners = React.useRef([]);
  const stateRef = React.useRef({
    rect: initialRect,
    offsetTop: offsetTop,
    offsetBottom: offsetBottom,
  });

  const defaultResizeListener = () => {
    resizeListeners.current.forEach(listener => {
      listener();
    });
  };

  const registerResizeListener = () => {
    if (!isWindow) return;
    window.addEventListener('resize', defaultResizeListener);
    return () => window.removeEventListener('resize', defaultResizeListener);
  };

  const defaultScrollListener = () => {
    scrollListeners.current.forEach(listener => listener());
  };

  const registerScrollListener = () => {
    if (!isWindow) return;
    window.addEventListener('scroll', defaultScrollListener);
    return () => window.removeEventListener('scroll', defaultScrollListener);
  };

  if (!resizeListeners.current.length && isWindow) {
    registerResizeListener();
  }
  if (!scrollListeners.current.length && isWindow) {
    registerScrollListener();
  }
  React.useLayoutEffect(() => {
    if (!stateRef.current.rect) {
      const clientHeight = Math.ceil(window.document.documentElement.clientHeight);
      const height = Math.max(
        0,
        clientHeight - stateRef.current.offsetTop - stateRef.current.offsetBottom,
      );
      stateRef.current.rect = new Rect(stateRef.current.offsetTop, height);
    }
  }, []);
  const getHeight = () => {
    return stateRef.current.rect.getHeight();
  };

  const addScrollListener = listener => {
    if (!scrollListeners.current.length) {
      unregisterScroll.current = registerScrollListener();
    }
    if (!scrollListeners.current.includes(listener)) {
      scrollListeners.current.push(listener);
    }
    return () => removeScrollListener(listener);
  };

  const removeScrollListener = listener => {
    const index = scrollListeners.current.indexOf(listener);
    if (index >= 0) {
      scrollListeners.current.splice(index, 1);
    }
    if (!scrollListeners.current.length) {
      unregisterScroll.current?.();
    }
  };
  const addResizeListener = listener => {
    if (!resizeListeners.current.length) {
      unregisterResize.current = registerResizeListener();
    }
    resizeListeners.current.push(listener);
    return () => removeResizeListener(listener);
  };

  const removeResizeListener = listener => {
    const idx = resizeListeners.current.indexOf(listener);
    if (idx >= 0) {
      resizeListeners.current.splice(idx, 1);
    }
    if (!resizeListeners.current.length) {
      unregisterResize.current?.();
    }
  };

  const getScrollY = () => {
    if (isWindow) {
      return -1 * window.document.documentElement.getBoundingClientRect().top;
    }
  };

  const scrollBy = (amount: number) => {
    if (isWindow) {
      window.scrollBy(0, amount);
    }
  };

  const getRelativeToRootNode = () => {
    if (rootNode.current && stateRef.current.rect) {
      return new Rect(stateRef.current.rect.getTop(), stateRef.current.rect.getHeight()).translate(
        -rootNode.current.getBoundingClientRect().top,
      );
    }
  };

  const getOffsetCorrection = () => {
    if (!rootNode.current) return 0;
    const rect = rootNode.current.getBoundingClientRect();
    const top = stateRef.current.rect.getTop();
    return pxToDPR(rect.top - top, dpr);
  };
  const getDocumentViewportHeight = (): number => {
    if (isWindow) return document.documentElement.clientHeight;
    if (initialRect) return initialRect.getHeight();
    return 0;
  };

  return {
    getRect: () => new Rect(stateRef.current.rect.getTop(), stateRef.current.rect.getHeight()),
    getOffsetTop: () => stateRef.current.offsetTop,
    getOffsetBottom: () => stateRef.current.offsetBottom,
    getDpr: () => dpr,
    getOffsetCorrection,
    getRelativeToRootNode,
    getHeight,
    getScrollY,
    addScrollListener,
    addResizeListener,
    scrollBy,
    getDocumentViewportHeight,
  };
};
