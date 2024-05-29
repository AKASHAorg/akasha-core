import { Virtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';
import { restoreScrollPosition, restoreScrollConfig, storeScrollConfig } from './utils';

interface IScrollRestoration {
  /*
   * Virtualizer's instance
   **/
  virtualizer: Virtualizer<Window, Element>;
  /*
   * The total number of items virtualized
   **/
  count: number;
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
  count,
  overScan,
  scrollRestorationStorageKey,
  offsetAttribute,
}: IScrollRestoration) {
  const virtualizerRef = useRef(virtualizer);
  const overScanRef = useRef(overScan);
  const offsetAttributeRef = useRef(offsetAttribute);
  const scrollRestorationStorageKeyRef = useRef(scrollRestorationStorageKey);

  useEffect(() => {
    virtualizerRef.current = virtualizer;
  }, [virtualizer]);

  useEffect(() => {
    const virtualizer = virtualizerRef.current;
    const scrollConfig = restoreScrollConfig(scrollRestorationStorageKeyRef.current);
    if (scrollConfig) {
      const { referenceItemIndex, options, done } = scrollConfig;

      if (
        !options ||
        typeof referenceItemIndex !== 'number' ||
        typeof options !== 'object' ||
        count < options.count ||
        done
      )
        return;
      /*
       * Find the index of an item which will be used as a scroll restoration reference.
       **/
      const scrollIndex = options.initialMeasurementsCache?.findIndex(
        measurementCache => measurementCache.index === referenceItemIndex,
      );
      if (scrollIndex && scrollIndex !== -1) {
        /*
         * Make sure virtualizer's options from last scroll position are available in the current virtualizer instance
         * before scrolling to the index of the reference item.
         **/
        virtualizer.setOptions({
          ...virtualizer.options,
          ...options,
        });
        virtualizer.scrollToIndex(scrollIndex, { align: 'start', behavior: 'auto' });
      }
    }
  }, [count]);

  useEffect(() => {
    const overScan = overScanRef.current;
    const scrollRestorationStorageKey = scrollRestorationStorageKeyRef.current;
    /*
     * Store scroll restoration configs after unmounting the component where the scroll restoration is used.
     **/
    return () => {
      const virtualItems = virtualizerRef.current.getVirtualItems();
      const stepBackArr = Array(overScan)
        .fill(0)
        .map((_, index) => index);
      /*
       * Compute a visible item which will be used for scroll restoration reference.
       **/
      let visibleItem = null;
      for (const stepBack of stepBackArr) {
        if (virtualItems?.[overScan - stepBack]) {
          visibleItem = virtualItems[overScan - stepBack];
          break;
        }
      }
      /*
       * If the index of the visible item is less than or equal to overScan recompute the visible item for accuracy
       **/
      if (visibleItem?.index <= overScan) {
        let visibleItemIndex = virtualItems.findIndex(
          virtualItem => virtualItem.start >= virtualizerRef.current.scrollOffset,
        );
        visibleItemIndex = visibleItemIndex === 0 ? 0 : visibleItemIndex - 1;
        if (visibleItemIndex >= 0) {
          visibleItem = virtualItems[visibleItemIndex];
        }
      }

      storeScrollConfig(scrollRestorationStorageKey, {
        scrollOffset: virtualizerRef.current?.scrollOffset,
        topOffset: virtualItems?.[0]?.start - virtualizerRef.current.options.scrollMargin,
        referenceItemIndex: visibleItem?.index,
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
