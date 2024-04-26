import { Virtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';

const SCROLL_RESTORATION_OFFSET = '@scrollRestorationOffset';

interface IScrollRestoration {
  virtualizer: Virtualizer<Window, Element>;
}

/*
 * Restore the scroll position using the last offset stored in a local storage before a component unmounts
 * @param virtualizer - virtualizer instance
 **/
export function useScrollRestoration({ virtualizer }: IScrollRestoration) {
  const virtualizerRef = useRef(virtualizer);
  const observer = useRef(
    //observe body element to check its scroll height to ensure the possibility of scrolling to an offset
    new ResizeObserver(() => {
      const scrollRestorationOffset = +localStorage.getItem(SCROLL_RESTORATION_OFFSET);
      if (!scrollRestorationOffset || !Number.isInteger(scrollRestorationOffset)) return;
      if (document.body.scrollHeight >= +scrollRestorationOffset) {
        //restore the last scroll offset after an elapse of few milliseconds to ensure the position to scroll to is available
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
    }),
  );

  useEffect(() => {
    const currentObserver = observer.current;
    const currentVirtualizer = virtualizerRef.current;
    currentObserver.observe(document.body);
    return () => {
      //when a component unmounts store the last scroll offset position in a local storage
      localStorage.setItem(
        SCROLL_RESTORATION_OFFSET,
        JSON.stringify(currentVirtualizer.scrollOffset),
      );
      currentObserver.disconnect();
    };
  }, []);
}
