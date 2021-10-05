import * as React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const getScrollTop = () => {
  let scrollTop = 0;
  if (document.documentElement) {
    scrollTop = document.documentElement.scrollTop;
  }
  return window.scrollY || scrollTop;
};

const ScrollRestorer: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const scrollMap = React.useRef(new Map());

  React.useLayoutEffect(() => {
    const onPopState = event => {
      const currentLocation = history.location;
      const prevLoc = location;
      const scrollTop = getScrollTop();
      // save the position for the page we are leaving
      scrollMap.current.set(prevLoc.pathname, scrollTop);
      // if we have the position for the page we are going to, restore it
      // else scroll to the top
      if (scrollMap.current.has(currentLocation.pathname)) {
        window.scrollTo(0, scrollMap.current.get(currentLocation.pathname));
      } else {
        window.scrollTo(0, 0);
      }

      console.group();
      console.log(event.type);
      console.log('prev location', prevLoc.pathname);
      console.log('current location', currentLocation.pathname);
      console.groupEnd();
    };
    // set scrollRestoration to 'manual' to prevent browser
    // from restoring scroll position
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }

    window.addEventListener('popstate', onPopState, true);

    return () => {
      window.removeEventListener('popstate', onPopState, true);
    };
  }, [history.location, location]);

  return null;
};

export default ScrollRestorer;
