import * as React from 'react';
import { Rect } from './rect';
import { dpr, isWindow, pxToDPR } from '../utils';

export type UseViewportProps = {
  initialRect?: Rect;
  offsetTop: number;
  offsetBottom: number;
};

const getScrollY = () => {
  if (isWindow()) {
    return -1 * window.document.documentElement.getBoundingClientRect().top;
  }
  return 0;
};

export const useViewport = (props: UseViewportProps) => {
  const { initialRect, offsetTop, offsetBottom } = props;
  const stateRef = React.useRef<{ rect: Rect; offsetTop: number; offsetBottom: number }>({
    rect: initialRect, // it's assigned below
    offsetTop: offsetTop,
    offsetBottom: offsetBottom,
  });

  if (!stateRef.current.rect) {
    const clientHeight = Math.ceil(window.document.documentElement.clientHeight);
    const height = Math.max(0, clientHeight - offsetTop);
    stateRef.current.rect = new Rect(stateRef.current.offsetTop, height);
  }

  const resizeRect = (top?: number, height?: number) => {
    const newTop = top ?? stateRef.current.rect.getTop();
    const newHeight = height ?? stateRef.current.rect.getHeight();
    stateRef.current.rect = new Rect(newTop, newHeight);
  };

  const getDocumentViewportHeight = (): number => {
    if (initialRect) return initialRect.getHeight();
    if (isWindow()) return document.documentElement.clientHeight;
    return 0;
  };

  const getOffsetCorrection = (rootNode: HTMLElement) => {
    if (!rootNode) return 0;
    const rect = rootNode.getBoundingClientRect();
    const top = stateRef.current.rect.getTop();
    return pxToDPR(rect.top - top, dpr);
  };

  const scrollTo = (x: number, y: number) => {
    const offset = y - getScrollY();
    if (isWindow()) {
      window.scrollTo(x, offset);
    }
  };
  const scrollToTop = () => {
    return scrollTo(0, getScrollY());
  };

  const setTopOffset = (offset: number) => {
    stateRef.current.offsetTop = offset;
  };
  const setBottomOffset = (offset: number) => {
    stateRef.current.offsetBottom = offset;
  };

  const getRelativeToRootNode = (rootNode: HTMLElement) => {
    return stateRef.current.rect.translateRelativeTo(rootNode);
  };

  return {
    state: stateRef.current,
    getRect: () => {
      const clientHeight = isWindow() ? window.document.documentElement.clientHeight : 0;

      return new Rect(
        stateRef.current.rect.getTop(),
        Math.max(0, clientHeight - stateRef.current.offsetTop - stateRef.current.offsetBottom),
      );
    },
    resizeRect,
    getDocumentViewportHeight,
    getOffsetCorrection,
    scrollBy: (amount: number) => {
      if (!isWindow()) return;
      window.scrollBy(0, amount);
    },
    setBottomOffset,
    getBottomOffset: () => stateRef.current.offsetBottom,
    setTopOffset,
    scrollTo,
    scrollToTop,
    getTopOffset: () => stateRef.current.offsetTop,
    getScrollY,
    getRelativeToRootNode,
  };
};
