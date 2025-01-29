import { RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useResizeObserver } from './useResizeObserver';

export const useSticky = (
  containerRef: RefObject<HTMLElement>,
  contentRef: RefObject<HTMLElement>,
  extraBottomOffset = 0,
) => {
  const prevScrollY = useRef(0);
  const wasScrollingDown = useRef(false);

  const [position, setPosition] = useState('sticky');
  const [stickyPosition, setStickyPosition] = useState('top-0');
  const [contentHeight, setContentHeight] = useState(0);
  const [offset, setOffset] = useState(0);

  const { observe, unobserve } = useResizeObserver();

  const update = useCallback(
    (force?: boolean) => {
      if (!containerRef.current || !contentRef.current) {
        return;
      }
      const { scrollY, innerHeight } = window;
      const scrollDiff = scrollY - prevScrollY.current;
      if (Math.abs(scrollDiff) < 0.5 && !force) {
        return;
      }
      prevScrollY.current = scrollY;
      const contentRect = contentRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerOffset = Math.max(contentRect.top - containerRect.top, 0);
      const containerTop = scrollY + containerRect.top;
      const isScrollingDown = scrollDiff > 0;
      const scrollDownOffset = innerHeight - contentRect.height - extraBottomOffset;
      const scrollUpOffset = innerHeight - contentRect.height - containerTop;
      const scrollChanged = wasScrollingDown.current !== isScrollingDown;
      if (innerHeight - contentRect.height >= containerTop) {
        setPosition('sticky');
        setStickyPosition('top-0');
        setContentHeight(contentRect.height);
        setOffset(0);
      } else {
        setPosition('sticky');
        setStickyPosition(
          isScrollingDown ? `top-[${scrollDownOffset}px]` : `bottom-[${scrollUpOffset}px]`,
        );
        setContentHeight(contentRect.height);
        setOffset(prev => (scrollChanged ? containerOffset : prev));
      }
      wasScrollingDown.current = isScrollingDown;
    },
    [containerRef, contentRef, extraBottomOffset],
  );

  const onScroll = useCallback(() => {
    window.requestAnimationFrame(() => {
      update();
    });
  }, [update]);

  const onSizeChange = useCallback(() => {
    const changed = contentRef.current.offsetHeight > contentHeight;
    update(changed);
  }, [contentRef, contentHeight, update]);

  useLayoutEffect(() => {
    const contentNode = contentRef.current;
    observe(contentNode, onSizeChange);
    return () => {
      unobserve(contentNode);
    };
  }, [contentRef, observe, onSizeChange, unobserve]);

  useEffect(() => {
    window.requestAnimationFrame(() => update(true));
  }, [update]);

  useLayoutEffect(() => {
    window.addEventListener('scroll', onScroll, false);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll, update]);

  return [position, stickyPosition, contentHeight, offset];
};
