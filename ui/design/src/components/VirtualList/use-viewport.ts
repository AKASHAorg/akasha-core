import * as React from 'react';
import { Rect } from './rect';

/* Viewport data */

export interface ViewportState {
  programmaticScrollListeners: ((data?: any) => void)[];
  scrollListeners: (() => void)[];
  window: Window;
  offsetTop: number;
}

export interface ViewportActions {
  getRect: () => Rect;
  getScrollTop: () => number;
  getRelative: (toRect: Rect) => Rect;
  addResizeListener: (listener: () => void) => () => void;
  addScrollListener: (listener: () => void) => () => void;
  addProgrammaticScrollListener: (listener: (data?: any) => void) => () => void;
  removeProgrammaticScrollListener: (listener: () => void) => void;
  scrollTo: (pos: number) => void;
  scrollBy: (by: number) => void;
  scrollToTop: () => void;
}

export const useViewport = (offsetTop: number = 0): [ViewportState, ViewportActions] => {
  const [viewport, setViewport] = React.useState<ViewportState>({
    window,
    offsetTop,
    scrollListeners: [],
    programmaticScrollListeners: [],
  });
  const _removeListener = (_type: string, listener: () => void) => {
    setViewport(prev => ({
      ...prev,
      scrollListeners: viewport.scrollListeners.filter(l => l !== listener),
    }));
  };
  const _addListener = (type: string, listener: () => void) => {
    const cb = () => listener();
    setViewport(prev => ({ ...prev, scrollListeners: prev.scrollListeners.concat([cb]) }));
    return () => _removeListener(type, cb);
  };

  const _addMountListeners = () => {
    const cb = () => viewport.scrollListeners.forEach(listener => listener());
    viewport.window.addEventListener('scroll', cb);
    return () => {
      viewport.window.removeEventListener('scroll', cb);
    };
  };

  React.useLayoutEffect(() => {
    const unlisten = _addMountListeners();
    return unlisten;
  }, [viewport.scrollListeners]);

  const actions: ViewportActions = {
    getRect: () => {
      const rectHeight = Math.ceil(viewport.window.document.documentElement.clientHeight);
      return new Rect({ top: viewport.offsetTop, height: rectHeight });
    },
    getScrollTop: () => {
      const scrollTop = viewport.window.document.documentElement.scrollTop;
      return scrollTop + viewport.offsetTop;
    },
    getRelative: (toRect: Rect) => {
      return actions.getRect().translateBy(0, Math.ceil(0 - toRect.getTop()));
    },
    addResizeListener: (listener: () => void) => _addListener('resize', listener),
    addScrollListener: (listener: () => void) => _addListener('scroll', listener),
    addProgrammaticScrollListener: (listener: () => void) => {
      if (viewport.programmaticScrollListeners.indexOf(listener) < 0) {
        setViewport(prev => ({
          ...prev,
          programmaticScrollListeners: prev.programmaticScrollListeners.concat([listener]),
        }));
      }
      return () => actions.removeProgrammaticScrollListener(listener);
    },
    removeProgrammaticScrollListener: (listener: () => void) => {
      setViewport(prev => ({
        ...prev,
        programmaticScrollListeners: prev.programmaticScrollListeners.filter(
          lis => lis !== listener,
        ),
      }));
    },
    scrollTo: (pos: number) => {
      viewport.window.scrollTo(0, pos);
      viewport.programmaticScrollListeners.forEach(listener => listener(pos));
    },
    scrollBy: (pos: number) => {
      viewport.window.scrollBy(0, pos);
      viewport.programmaticScrollListeners.forEach(listener => listener);
    },
    scrollToTop: () => {
      /* @TODO: */
    },
  };

  return [viewport, actions];
};
