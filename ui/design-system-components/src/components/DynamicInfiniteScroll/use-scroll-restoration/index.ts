import { Virtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';
import {
  restoreScrollPosition,
  restoreScrollOptions,
  storeScrollOffsetAndOptions,
} from './scroll-restoration';

interface IScrollRestoration {
  virtualizer: Virtualizer<Window, Element>;
}

/*
 * Restores the scroll position using the last offset stored before a component unmounts
 * @param virtualizer - instance of virtualizer
 **/
export function useScrollRestoration({ virtualizer }: IScrollRestoration) {
  const virtualizerRef = useRef(virtualizer);
  const observer = useRef(
    new ResizeObserver(() => {
      restoreScrollPosition(document.body.scrollHeight);
    }),
  );

  useEffect(() => {
    const virtualizer = virtualizerRef.current;
    const options = restoreScrollOptions();
    if (options) virtualizer.setOptions(options);
    return () => {
      storeScrollOffsetAndOptions(virtualizer.scrollOffset, virtualizer.options);
    };
  }, []);

  useEffect(() => {
    const currentObserver = observer.current;
    currentObserver.observe(document.body);
    return () => {
      currentObserver.disconnect();
    };
  }, []);
}
