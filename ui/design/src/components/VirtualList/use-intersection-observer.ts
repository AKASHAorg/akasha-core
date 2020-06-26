import * as React from 'react';

export const useIntersectionObserver = (
  rootNode: HTMLElement | null,
  elements: NodeListOf<HTMLDivElement>,
) => {
  const [intersectingId, setIntersectingId] = React.useState<string>();
  const onIntersect = (entries: IntersectionObserverEntry[]) => {
    const intersecting = entries.filter(entry => entry.isIntersecting);
    const viewedItem = intersecting[Math.floor(intersecting.length / 2)] as any;
    if (viewedItem && viewedItem.target) {
      setIntersectingId(viewedItem.target.dataset.itemId);
    }
  };

  const observer: React.MutableRefObject<IntersectionObserver | null> = React.useRef(null);

  React.useEffect(() => {
    if (rootNode) {
      observer.current = new IntersectionObserver(onIntersect, { threshold: 1, root: rootNode });
    }
  }, [rootNode]);

  React.useEffect(() => {
    if (elements.length) {
      elements.forEach(el => {
        if (observer.current) {
          observer.current.observe(el);
        }
      });
    }
    return () => {
      if (elements.length) {
        elements.forEach(el => {
          if (observer?.current) {
            observer.current.unobserve(el);
          }
        });
      }
    };
  }, [elements]);
  return [intersectingId];
};
