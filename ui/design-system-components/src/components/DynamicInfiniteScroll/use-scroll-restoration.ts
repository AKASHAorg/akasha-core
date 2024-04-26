import { useEffect, useRef } from 'react';

const SCROLL_RESTORATION_OFFSET = '@scrollRestorationOffset';

interface IScrollRestoration {
  scrollOffset: number;
}

/*
 * Restore the scroll position using the last offset stored in a local storage before a component unmounts
 * @param scrollOffset - scroll offset to restore
 **/
export function useScrollRestoration({ scrollOffset }: IScrollRestoration) {
  const scrollOffsetRef = useRef(scrollOffset);
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
    scrollOffsetRef.current = scrollOffset;
  }, [scrollOffset]);

  useEffect(() => {
    const currentObserver = observer.current;
    currentObserver.observe(document.body);
    return () => {
      const currentScrollOffset = scrollOffsetRef.current;
      //when a component unmounts store the last scroll offset position in a local storage
      localStorage.setItem(SCROLL_RESTORATION_OFFSET, JSON.stringify(currentScrollOffset));
      currentObserver.disconnect();
    };
  }, []);
}
