import * as React from 'react';
import { Rect } from './rect';

export type UseViewportProps = {
  initialRect?: Rect;
  offsetTop: number;
};

export const useViewport = (props: UseViewportProps) => {
  const { initialRect, offsetTop } = props;

  const isWindow = React.useRef(typeof window !== 'undefined');
  const dpr = React.useRef(isWindow.current ? window.devicePixelRatio ?? 1 : 1);
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

  const getOffsetCorrection = (rootNode: HTMLElement) => {
    if (!rootNode) return 0;
    const rect = rootNode.getBoundingClientRect();
    const top = stateRef.current.rect.getTop();
    return pxToDPR.current(rect.top - top, dpr.current);
  };

  const getScrollY = () => {
    if (isWindow.current) {
      return -1 * window.document.documentElement.getBoundingClientRect().top;
    }
    return 0;
  };
  const scrollTo = (x: number, y: number) => {
    const offset = y - getScrollY();
    if (isWindow.current) {
      window.scrollTo(x, offset);
    }
  };
  const scrollToTop = () => {
    return scrollTo(0, 0);
  };

  const setTopOffset = (offset: number) => {
    topOffset.current = offset;
  };
  const setBottomOffset = (offset: number) => {
    bottomOffset.current = offset;
  };

  return {
    state: stateRef.current,
    getRect: () => new Rect(stateRef.current.rect.getTop(), stateRef.current.rect.getHeight()),
    resizeRect,
    getDocumentViewportHeight,
    getOffsetCorrection,
    pxToDPR: pxToDPR.current,
    dpr: dpr.current,
    scrollBy: (amount: number) => {
      if (!isWindow.current) return;
      window.scrollBy(0, amount);
    },
    setBottomOffset,
    getBottomOffset: () => bottomOffset.current,
    setTopOffset,
    scrollTo,
    scrollToTop,
    getTopOffset: () => topOffset.current,
    getScrollY,
  };
};
