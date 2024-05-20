import { Virtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';
import { restoreScrollPosition, restoreScrollConfig, storeScrollConfig } from './utils';

interface IScrollRestoration {
  /*
   * Virtualizer's instance
   **/
  virtualizer: Virtualizer<Window, Element>;
  /*
   * Array of scroll restoration keys.
   * One of the keys is used to compute the latest scroll index of a visible item used for scroll restoration reference.
   **/
  scrollRestorationKeys: string[];
  /*
   * The number of items rendered above and below the visible area
   **/
  overScan: number;
  /*
   * Scroll restoration session storage key
   **/
  scrollRestorationStorageKey: string;
  /*
   * The offset attribute for the virtual list container
   **/
  offsetAttribute: string;
}

/*
 * Restores the last scroll position
 * @param virtualizer - instance of virtualizer
 **/
export function useScrollRestoration({
  virtualizer,
  scrollRestorationKeys,
  overScan,
  scrollRestorationStorageKey,
  offsetAttribute,
}: IScrollRestoration) {
  const virtualizerRef = useRef(virtualizer);
  const scrollRestorationKeysRef = useRef(scrollRestorationKeys);
  const overScanRef = useRef(overScan);
  const offsetAttributeRef = useRef(offsetAttribute);
  const scrollRestorationStorageKeyRef = useRef(scrollRestorationStorageKey);

  useEffect(() => {
    virtualizerRef.current = virtualizer;
  }, [virtualizer]);

  useEffect(() => {
    scrollRestorationKeysRef.current = scrollRestorationKeys;
  }, [scrollRestorationKeys]);

  useEffect(() => {
    const virtualizer = virtualizerRef.current;
    const scrollConfig = restoreScrollConfig(scrollRestorationStorageKeyRef.current);
    if (scrollConfig) {
      const { scrollRestorationKey, options } = scrollConfig;

      if (!scrollRestorationKey || !options || typeof options !== 'object') return;
      /*
       * Find the index of an item which will be used as a scroll restoration reference.
       **/
      const scrollIndex = scrollRestorationKeysRef.current?.findIndex(
        key => key === scrollRestorationKey,
      );
      if (scrollIndex && scrollIndex !== -1) {
        /*
         * Make sure virtualizer's options from last scroll position are available in the current virtualizer instance before making any computations.
         **/
        virtualizer.setOptions({
          ...virtualizer.options,
          ...options,
        });
        virtualizer.scrollToIndex(scrollIndex, { align: 'start', behavior: 'auto' });
      }
    }
  }, [scrollRestorationKeys]);

  useEffect(() => {
    const overScan = overScanRef.current;
    const scrollRestorationStorageKey = scrollRestorationStorageKeyRef.current;
    /*
     * Store scroll restoration configs after unmounting the component where the scroll restoration is used.
     **/
    return () => {
      const virtualItems = virtualizerRef.current.getVirtualItems();
      /*
       * Find the index of a visible item on the virtual list used for scroll restoration reference.
       * This computation accurately identifies those items whose index  is less than or equal to overScan.
       **/
      let visibleItemIndex = virtualItems.findIndex(
        virtualItem => virtualItem.start >= virtualizerRef.current.scrollOffset,
      );
      visibleItemIndex = visibleItemIndex === 0 ? 0 : visibleItemIndex - 1;
      storeScrollConfig(scrollRestorationStorageKey, {
        scrollOffset: virtualizerRef.current?.scrollOffset,
        topOffset: virtualItems?.[0]?.start,
        scrollRestorationKey:
          /*
           * Find the index of a visible item used for scroll restoration reference and in turn use it to get the scroll restoration key.
           * Use visibleItemIndex for those items whose index is less than or equal to overScan otherwise use overScan as an index on virtual items array
           * to identify the index of the correct visible item that can be used for scroll restoration reference.
           **/
          scrollRestorationKeysRef.current?.[
            virtualItems?.[overScan]?.index <= overScan && visibleItemIndex >= 0
              ? visibleItemIndex
              : virtualItems?.[overScan]?.index
          ],
        options: {
          ...virtualizerRef.current?.options,
          initialMeasurementsCache: virtualizerRef.current?.measurementsCache,
        },
      });
    };
  }, []);

  useEffect(() => {
    /*
     * Observe changes in the dimension of body element to check scroll position restoration requirements and if all check passes commit the restoration.
     **/
    const observer = new ResizeObserver(() => {
      restoreScrollPosition({
        virtualizer: virtualizerRef.current,
        scrollRestorationKeys: scrollRestorationKeysRef.current,
        overScan: overScanRef.current,
        offsetAttribute: offsetAttributeRef.current,
        scrollRestorationStorageKey: scrollRestorationStorageKeyRef.current,
      });
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
    };
  }, []);
}
