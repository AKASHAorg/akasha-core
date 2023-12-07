import * as React from 'react';
import { Rect } from './rect';

export type UseViewportProps = {
  initialRect?: Rect;
  offsetTop: number;
  rootNode: React.RefObject<HTMLElement>;
};

export const useViewport = (props: UseViewportProps) => {
  const { initialRect, offsetTop, rootNode } = props;

  const isWindow = React.useRef(typeof window !== 'undefined');
  const dpr = React.useRef(isWindow.current ? window.devicePixelRatio ?? 1 : 1);
  const scrollListeners = React.useRef<((prevented?: boolean) => void)[]>([]);
  const unregisterScroll = React.useRef<() => void>();
  const preventNextScrollListener = React.useRef(false);
  const bottomOffset = React.useRef(0);
  const topOffset = React.useRef(0);
  const stateRef = React.useRef<{ rect: Rect; offsetTop: number }>({
    rect: initialRect, // it's assigned below
    offsetTop: offsetTop,
  });

  const pxToDPR = React.useRef((px: number, dpr: number) => Math.ceil(px * dpr) / dpr);

  if (!stateRef.current.rect) {
    const clientHeight = Math.ceil(window.document.documentElement.clientHeight);
    const height = Math.max(0, clientHeight - stateRef.current.offsetTop);
    stateRef.current.rect = new Rect(stateRef.current.offsetTop, height);
  }

  React.useEffect(() => {
    if (rootNode.current) {
      setTopOffset(rootNode.current.offsetTop);
      if (rootNode.current.parentElement) {
        setBottomOffset(
          rootNode.current.parentElement.offsetHeight -
            rootNode.current.offsetTop -
            rootNode.current.offsetHeight,
        );
      }
    }
  }, [rootNode]);

  const defaultScrollListener = () => {
    scrollListeners.current.forEach(listener => listener(preventNextScrollListener.current));
  };

  const registerScrollListener = () => {
    if (!isWindow.current) return;
    window.addEventListener('scroll', defaultScrollListener);
    return () => window.removeEventListener('scroll', defaultScrollListener);
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

  const resizeRect = (top?: number, height?: number) => {
    const newTop = top ?? stateRef.current.rect.getTop();
    const newHeight = height ?? stateRef.current.rect.getHeight();
    stateRef.current.rect = new Rect(newTop, newHeight);
  };

  const getDocumentViewportHeight = (): number => {
    if (initialRect) return initialRect.getHeight();
    if (isWindow) return document.documentElement.clientHeight;
    return 0;
  };

  const getOffsetCorrection = () => {
    if (!rootNode.current) return 0;
    const rect = rootNode.current.getBoundingClientRect();
    const top = stateRef.current.rect.getTop();
    return pxToDPR.current(rect.top - top, dpr.current);
  };

  const getRelativeToRootNode = () => {
    if (rootNode.current && stateRef.current.rect) {
      return stateRef.current.rect.translate(
        -rootNode.current.getBoundingClientRect().top + rootNode.current.offsetTop,
      );
    }
  };

  const isAtTop = () => {
    const viewportRect = getRelativeToRootNode();
    if (!viewportRect) return true;
    if (!rootNode.current) return true;
    return viewportRect.getTop() <= rootNode.current.offsetTop;
  };
  const setTopOffset = (offset: number) => {
    topOffset.current = offset;
  };
  const setBottomOffset = (offset: number) => {
    bottomOffset.current = offset;
  };

  return {
    getRect: () => new Rect(stateRef.current.rect.getTop(), stateRef.current.rect.getHeight()),
    resizeRect,
    addScrollListener,
    getDocumentViewportHeight,
    getOffsetCorrection,
    pxToDPR: pxToDPR.current,
    dpr: dpr.current,
    scrollBy: (amount: number) => {
      if (!isWindow.current) return;
      window.scrollBy(0, amount);
    },
    getRelativeToRootNode,
    isAtTop,
    setBottomOffset,
    getBottomOffset: () => bottomOffset.current,
    setTopOffset,
    getTopOffset: () => topOffset.current,
    getScrollY: () => {
      if (isWindow.current) {
        return -1 * window.document.documentElement.getBoundingClientRect().top;
      }
      return 0;
    },
  };
};
