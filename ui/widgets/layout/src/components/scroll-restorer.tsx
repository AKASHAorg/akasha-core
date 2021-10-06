import * as React from 'react';
import { SingleSpaCustomEventDetail } from 'single-spa';

const getScrollTop = () => {
  let scrollTop = 0;
  if (document.documentElement) {
    scrollTop = document.documentElement.scrollTop;
  }
  return window.scrollY || scrollTop;
};

const ScrollRestorer: React.FC = () => {
  const scrollMap = React.useRef(new Map());
  const scrollTimeout = React.useRef<NodeJS.Timeout>();

  const tryScrollTo = React.useCallback((scrollY: number) => {
    clearTimeout(scrollTimeout.current);
    const body = document.body;
    const html = document.documentElement;

    const documentHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    );
    if (documentHeight >= scrollY) {
      window.scrollTo(0, scrollY);
    } else {
      scrollTimeout.current = setTimeout(() => tryScrollTo(scrollY), 50);
    }
  }, []);

  React.useLayoutEffect(() => {
    const handleBeforeRouting = (evt: CustomEvent<SingleSpaCustomEventDetail>) => {
      const oldUrl = new URL(evt.detail.oldUrl);
      const newUrl = new URL(evt.detail.newUrl);
      if (oldUrl.pathname !== newUrl.pathname) {
        const scrollY = getScrollTop();
        scrollMap.current.set(oldUrl, scrollY);
      }
    };
    const handleRouting = (evt: CustomEvent<SingleSpaCustomEventDetail>) => {
      const newUrl = new URL(evt.detail.newUrl);
      const oldUrl = new URL(evt.detail.oldUrl);
      if (oldUrl.pathname !== newUrl.pathname) {
        if (scrollMap.current.has(newUrl)) {
          const scrollY = scrollMap.current.get(newUrl);
          tryScrollTo(scrollY);
        } else {
          window.scrollTo(0, 0);
        }
      }
    };
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
    // save scroll position
    window.addEventListener('single-spa:before-routing-event', handleBeforeRouting);
    // restore scroll position
    window.addEventListener('single-spa:routing-event', handleRouting);

    return () => {
      window.removeEventListener('single-spa:before-routing-event', handleBeforeRouting);
      window.removeEventListener('single-spa:routing-event', handleRouting);
    };
  }, [tryScrollTo]);

  return null;
};

export default ScrollRestorer;
