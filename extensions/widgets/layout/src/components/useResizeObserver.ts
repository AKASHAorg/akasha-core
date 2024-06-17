import * as React from 'react';

export const useResizeObserver = () => {
  const callbacks = React.useRef<
    WeakMap<ResizeObserverEntry['target'], Set<((entry: ResizeObserverEntry) => void) | undefined>>
  >(new WeakMap());
  const defaultCallback = (entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const targetCbs = callbacks.current.get(entry.target);
      if (targetCbs) {
        targetCbs.forEach(cb => cb?.(entry));
      } else {
        unobserve(entry.target);
      }
    }
  };

  const observer = React.useRef(new ResizeObserver(defaultCallback));

  const observe = (
    node: Element,
    callback?: (entries: ResizeObserverEntry) => void,
    options?: ResizeObserverOptions,
  ) => {
    if (!node) return;
    if (!callbacks.current.has(node)) {
      callbacks.current.set(node, new Set([callback]));
      observer.current.observe(node, options);
      return;
    }
    callbacks.current.get(node)?.add(callback);
  };
  const unobserve = (node: Element) => {
    callbacks.current.delete(node);
    observer.current.observe(node);
  };
  return { observe, unobserve };
};
