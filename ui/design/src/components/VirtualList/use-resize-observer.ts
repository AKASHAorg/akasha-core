import * as React from 'react';

export const useResizeObserver = (domEl: HTMLElement | null, callback: ResizeObserverCallback) => {
  const win: any = window;
  const observer = React.useRef(new win.ResizeObserver(callback));
  React.useEffect(() => {
    if (domEl) {
      observer.current.observe(domEl);
      return () => observer.current.disconnect();
    }
    return () => undefined;
  }, [domEl]);
};
