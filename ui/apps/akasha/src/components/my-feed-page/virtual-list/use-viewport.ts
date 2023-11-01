import { Rect } from './rect';
import { dpr, isWindow, pxToDPR } from './utils';
import React from 'react';

export type UseViewportProps = {
  initialRect: Rect;
  offsetTop: number;
  offsetBottom: number;
  rootNode: React.MutableRefObject<HTMLElement>;
};
export const useViewport = (props: UseViewportProps) => {
  const { initialRect, offsetTop, offsetBottom, rootNode } = props;
  const unregisterScroll = React.useRef<() => void>();
  const unregisterResize = React.useRef<() => void>();
  const scrollListeners = React.useRef([]);
  const resizeListeners = React.useRef([]);
  const overScroll = React.useRef(0);
  const stateRef = React.useRef({
    rect: initialRect,
    offsetTop: offsetTop,
    offsetBottom: offsetBottom,
  });

  React.useEffect(() => {
    if (!stateRef.current.rect) {
      const clientHeight = Math.ceil(window.document.documentElement.clientHeight);
      const height = Math.max(
        0,
        clientHeight - stateRef.current.offsetTop - stateRef.current.offsetBottom,
      );
      stateRef.current.rect = new Rect(stateRef.current.offsetTop, height);
    }
  }, []);

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

  const getHeight = () => {
    return stateRef.current.rect.getHeight();
  };

  const addScrollListener = (listener: () => void) => {
    if (!scrollListeners.current.length) {
      unregisterScroll.current = registerScrollListener();
    }
    if (!scrollListeners.current.includes(listener)) {
      scrollListeners.current.push(listener);
    }
    return () => removeScrollListener(listener);
  };

  const removeScrollListener = (listener: () => void) => {
    const index = scrollListeners.current.indexOf(listener);
    if (index >= 0) {
      scrollListeners.current.splice(index, 1);
    }
    if (!scrollListeners.current.length) {
      unregisterScroll.current?.();
    }
  };
  const addResizeListener = (listener: () => void) => {
    if (!resizeListeners.current.length) {
      unregisterResize.current = registerResizeListener();
    }
    resizeListeners.current.push(listener);
    return () => removeResizeListener(listener);
  };

  const removeResizeListener = (listener: () => void) => {
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

  const scrollTo = (x: number, y: number) => {
    if (isWindow) {
      window.scrollTo(x, y);
    }
  };

  const scrollToTop = () => {
    scrollTo(0, 0);
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
    if (initialRect) return initialRect.getHeight();
    if (isWindow) return document.documentElement.clientHeight;
    return 0;
  };
  const isAtTop = () => {
    const viewportRect = getRelativeToRootNode();
    if (!viewportRect) return true;
    return viewportRect.getTop() <= rootNode.current.offsetTop;
  };

  const resizeRect = (top?: number, height?: number) => {
    const newTop = top ?? stateRef.current.rect.getTop();
    const newHeight = height ?? stateRef.current.rect.getHeight();
    stateRef.current.rect = new Rect(newTop, newHeight);
  };

  return {
    getRect: () => new Rect(stateRef.current.rect.getTop(), stateRef.current.rect.getHeight()),
    resizeRect,
    getOffsetTop: () => stateRef.current.offsetTop,
    getOffsetBottom: () => stateRef.current.offsetBottom,
    getOverScroll: () => overScroll.current,
    setOffsetTop: (offset: number) => (stateRef.current.offsetTop = offset),
    updateOverScroll: (overscroll: number) => (overScroll.current = overscroll),
    isAtTop,
    getOffsetCorrection,
    getRelativeToRootNode,
    getHeight,
    getScrollY,
    addScrollListener,
    addResizeListener,
    scrollBy,
    scrollTo,
    scrollToTop,
    getDocumentViewportHeight,
  };
};
