import { Virtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';

const SCROLL_RESTORATION_OFFSET = '@scrollRestorationOffset';
const SCROLL_RESTORATION_OPTIONS = '@scrollRestorationOptions';

interface IScrollRestoration {
  virtualizer: Virtualizer<Window, Element>;
}

/*
 * Restores the scroll position using the last offset stored in a local storage before a component unmounts
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

/*
 * Restore scroll position
 **/
function restoreScrollPosition(scrollHeight: number) {
  const scrollRestorationOffset = +localStorage.getItem(SCROLL_RESTORATION_OFFSET);
  if (!scrollRestorationOffset || !Number.isInteger(scrollRestorationOffset)) return;
  //check scroll height against scroll restoration offset to ensure the possibility of scrolling to the offset
  if (scrollHeight >= +scrollRestorationOffset) {
    //scroll to an offset after an elapse of few milliseconds to ensure accurate result
    setTimeout(
      () =>
        window.scrollTo({
          top: +scrollRestorationOffset,
          behavior: 'auto',
        }),
      500,
    );
    localStorage.removeItem(SCROLL_RESTORATION_OFFSET);
  }
}

/*
 * Restores virtualizer's scroll options
 **/
function restoreScrollOptions() {
  try {
    const scrollRestorationOptions = localStorage.getItem(SCROLL_RESTORATION_OPTIONS);
    if (scrollRestorationOptions) {
      return JSON.parse(scrollRestorationOptions);
    }
  } catch (error) {
    console.error('Unable to restore scroll position', error);
    localStorage.removeItem(SCROLL_RESTORATION_OFFSET);
  } finally {
    localStorage.removeItem(SCROLL_RESTORATION_OPTIONS);
  }
  return null;
}

/*
 * Stores the last scroll offset position and virtualizer's current options in a local storage
 **/
function storeScrollOffsetAndOptions(scrollOffset: number, options: unknown) {
  localStorage.setItem(SCROLL_RESTORATION_OFFSET, JSON.stringify(scrollOffset));
  localStorage.setItem(SCROLL_RESTORATION_OPTIONS, JSON.stringify(options));
}
