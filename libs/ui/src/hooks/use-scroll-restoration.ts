import * as React from 'react';
import { Virtualizer, VirtualizerOptions } from '@tanstack/react-virtual';

const SCROLL_RESTORATION_CONFIG = 'scroll-restoration-config';

type ScrollRestoration = {
  /*
   * Virtualizer's instance.
   **/
  virtualizer: Virtualizer<Window, Element>;
  /*
   * The total number of items to virtualize.
   **/
  count: number;
  /*
   * The number of items to render above and below the visible area.
   **/
  overScan: number;
  /*
   * Key used to store scroll restoration configuration.
   **/
  scrollConfigStorageKey: string;
  /*
   * Last scroll restoration prevents scroll restoration unless the user navigates back to the last key they visited.
   **/
  lastScrollRestorationKey: string;
  /*
   * The offset attribute for the virtual list container.
   **/
  offsetAttribute: string;
  /*
   * Reference to a header element in a virtual list.
   **/
  headerRef?: React.RefObject<HTMLDivElement | null>;
};

type Config = {
  /*
   * The last scroll offset position.
   **/
  lastScrollOffset: number;
  /*
   * The offset of the parent container holding the virtual list.
   **/
  topOffset: number;
  /*
   * Index of the reference item used for scroll restoration.
   **/
  referenceItemIndex: number;
  /*
   * Virtualizer's options
   **/
  options: VirtualizerOptions<Window, Element>;
  /*
   * Height of a header element in a virtual list.
   **/
  headerHeight?: number;
  /*
   * Flag to check if a scroll restoration is done.
   **/
  done?: boolean;
} & { [key: string]: unknown } & Pick<ScrollRestoration, 'lastScrollRestorationKey'>;

interface IRestoreScrollPosition {
  virtualizer: Virtualizer<Window, Element>;
  overScan: number;
  offsetAttribute: string;
  scrollConfigStorageKey: string;
}

/*
 * Restore scroll position
 **/
async function restoreScrollPosition({
  virtualizer,
  overScan,
  offsetAttribute,
  scrollConfigStorageKey,
}: IRestoreScrollPosition) {
  try {
    const scrollConfig = restoreScrollConfig(scrollConfigStorageKey);
    if (!scrollConfig) return;
    const { referenceItemIndex, topOffset, lastScrollOffset, options, done } = scrollConfig;
    /*
     * Validate scroll restoration config fields
     **/
    if (
      typeof referenceItemIndex !== 'number' ||
      !options ||
      typeof options !== 'object' ||
      typeof lastScrollOffset !== 'number'
    )
      return;

    const scrollIndex = options.initialMeasurementsCache?.findIndex(
      measurementCache => measurementCache.index === referenceItemIndex,
    );

    if (scrollIndex && scrollIndex !== -1) {
      const currentTopOffset =
        virtualizer.getVirtualItems()?.[0]?.start - virtualizer.options.scrollMargin;
      /*
       * Check if the latest virtual items container offset matches with the current offset to determine
       * if the current offset can be used for scroll restoration.
       **/
      const offsetMatched =
        Number(document.querySelector(`[${offsetAttribute}]`)?.getAttribute(offsetAttribute)) ===
          currentTopOffset && typeof currentTopOffset === 'number';

      /*
       * Check if all conditions for scroll restoration are satisfied.
       **/
      if (
        requiredItemsLoaded({ virtualizer, scrollIndex, overScan, options }) &&
        offsetMatched &&
        !done
      ) {
        /*
         * Check the difference between the last offset of the virtual list container with the current one.
         * If there is a difference add or subtract from the last scroll offset to determine the normalized scroll restoration offset.
         **/
        const offsetDelta = topOffset - currentTopOffset;
        const scrollToOffset =
          typeof offsetDelta === 'number' ? lastScrollOffset - offsetDelta : lastScrollOffset;
        virtualizer.scrollToOffset(scrollToOffset, {
          align: 'start',
          behavior: 'auto',
        });
        if (scrollToOffset !== virtualizer.scrollOffset) {
          setTimeout(() => {
            virtualizer.scrollToOffset(scrollToOffset, {
              align: 'start',
              behavior: 'auto',
            });
          }, 0);
        }
        storeScrollConfig(scrollConfigStorageKey, {
          ...scrollConfig,
          done: true,
        });
        setTimeout(() => {
          removeItemFromScrollConfig(scrollConfigStorageKey);
        }, 500);
      }
    }
  } catch (error) {
    console.error(error);
    removeItemFromScrollConfig(scrollConfigStorageKey);
  }
}

/*
 * Restore scroll config
 **/
function restoreScrollConfig(scrollConfigStorageKey?: string): Config | null {
  try {
    const config = JSON.parse(sessionStorage.getItem(SCROLL_RESTORATION_CONFIG) || '');
    return scrollConfigStorageKey ? config[scrollConfigStorageKey] : config;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/*
 * Store scroll restoration configuration
 **/
function storeScrollConfig(scrollConfigStorageKey: string, config: Config) {
  const currentConfig = restoreScrollConfig();
  sessionStorage.setItem(
    SCROLL_RESTORATION_CONFIG,
    JSON.stringify({
      ...(currentConfig ? currentConfig : {}),
      [scrollConfigStorageKey]: config,
    }),
  );
}

/*
 * Remove item from scroll config by key
 **/
function removeItemFromScrollConfig(key: string) {
  const config = restoreScrollConfig();

  if (config) {
    delete config[key];
    sessionStorage.setItem(SCROLL_RESTORATION_CONFIG, JSON.stringify(config));
  }
}

interface IItemsLoaded {
  virtualizer: Virtualizer<Window, Element>;
  scrollIndex: number;
  overScan: number;
  options: VirtualizerOptions<Window, Element>;
}

/*
 * Check if all required items for scroll restoration are loaded.
 **/
function requiredItemsLoaded({ virtualizer, scrollIndex, overScan, options }: IItemsLoaded) {
  /*
   * Find the visible item used as a scroll restoration reference.
   **/
  const referenceItem = virtualizer
    .getVirtualItems()
    .find(virtualItem => virtualItem.index === scrollIndex);

  /*
   * Create array of steps to take back from the reference item to check if
   * the virtual items before it are loaded according to the appropriate size.
   **/
  const stepBackArr = Array(overScan)
    .fill(0)
    .map((_, index) => index + 1);

  /*
   * Check if the reference item is loaded according to the appropriate size.
   **/
  const referenceItemLoaded =
    referenceItem &&
    referenceItem.size >= (options.initialMeasurementsCache?.[referenceItem.index]?.size || 0);

  /*
   * Check if items before the visible reference item are loaded according to the appropriate size.
   **/
  const itemsBeforeReferenceItemLoaded = stepBackArr
    .map(stepBack => {
      const prevItem = virtualizer
        .getVirtualItems()
        .find(virtualItem => virtualItem.index === scrollIndex - stepBack);
      return prevItem
        ? prevItem.size >= (options.initialMeasurementsCache?.[prevItem.index]?.size || 0)
        : true;
    })
    .every(item => item);

  return referenceItemLoaded && itemsBeforeReferenceItemLoaded;
}

const getHeaderHeight = ({
  scrollConfigStorageKey,
  lastScrollRestorationKey,
}: {
  scrollConfigStorageKey: string;
  lastScrollRestorationKey: string;
}) => {
  const scrollConfig = restoreScrollConfig(scrollConfigStorageKey);
  if (!scrollConfig || typeof scrollConfig !== 'object') return null;
  if (
    scrollConfig.lastScrollRestorationKey &&
    lastScrollRestorationKey !== scrollConfig.lastScrollRestorationKey
  )
    return null;
  return typeof scrollConfig.headerHeight === 'number' ? scrollConfig.headerHeight : null;
};

const getInitialMeasurementsCache = ({
  scrollConfigStorageKey,
}: {
  scrollConfigStorageKey: string;
}) => {
  const scrollConfig = restoreScrollConfig(scrollConfigStorageKey);
  if (!scrollConfig || typeof scrollConfig !== 'object' || typeof scrollConfig.options !== 'object')
    return [];
  return scrollConfig.options.initialMeasurementsCache;
};

/*
 * Restores the last scroll position
 * @param virtualizer - instance of virtualizer
 **/
export function useScrollRestoration({
  virtualizer,
  count,
  overScan,
  scrollConfigStorageKey,
  lastScrollRestorationKey,
  offsetAttribute,
  headerRef,
}: ScrollRestoration) {
  const virtualizerRef = React.useRef(virtualizer);
  const overScanRef = React.useRef(overScan);
  const offsetAttributeRef = React.useRef(offsetAttribute);
  const scrollConfigStorageKeyRef = React.useRef(scrollConfigStorageKey);
  const lastScrollRestorationKeyRef = React.useRef(lastScrollRestorationKey);
  const headerHeightRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      headerHeightRef.current = headerRef?.current?.getBoundingClientRect()?.height || 0;
    });
    if (headerRef?.current) {
      observer.observe(headerRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [headerRef]);

  React.useEffect(() => {
    virtualizerRef.current = virtualizer;
  }, [virtualizer]);

  React.useEffect(() => {
    const virtualizer = virtualizerRef.current;
    const scrollConfig = restoreScrollConfig(scrollConfigStorageKeyRef.current);
    if (scrollConfig) {
      const { referenceItemIndex, options, done, lastScrollRestorationKey } = scrollConfig;

      /*
       * If the current lastScrollRestorationKey and the one before do not match then prevent initiating scroll restoration
       **/
      if (
        lastScrollRestorationKey &&
        lastScrollRestorationKey !== lastScrollRestorationKeyRef.current
      ) {
        removeItemFromScrollConfig(scrollConfigStorageKeyRef.current);
        return;
      }

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
        virtualizer.scrollToIndex(scrollIndex, {
          align: 'start',
          behavior: 'auto',
        });
      }
    }
  }, [count]);

  React.useEffect(() => {
    const overScan = overScanRef.current;
    const scrollConfigStorageKey = scrollConfigStorageKeyRef.current;
    const lastScrollRestorationKey = lastScrollRestorationKeyRef.current;

    /*
     * Store scroll restoration configs after unmounting the component where the scroll restoration is used.
     **/
    return () => {
      const lastScrollOffset = virtualizerRef.current?.scrollOffset || 0;
      /*
       * Store scroll restoration config only if a scroll occurred
       **/
      if (lastScrollOffset > 0) {
        const headerHeight = headerHeightRef.current;
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
        if (visibleItem && visibleItem.index <= overScan) {
          let visibleItemIndex = virtualItems.findIndex(
            virtualItem => virtualItem.start >= (virtualizerRef.current.scrollOffset || 0),
          );
          visibleItemIndex = visibleItemIndex === 0 ? 0 : visibleItemIndex - 1;
          if (visibleItemIndex >= 0) {
            visibleItem = virtualItems[visibleItemIndex];
          }
        }

        storeScrollConfig(scrollConfigStorageKey, {
          lastScrollOffset,
          topOffset: virtualItems?.[0]?.start - virtualizerRef.current.options.scrollMargin,
          referenceItemIndex: visibleItem?.index || 0,
          options: {
            ...virtualizerRef.current?.options,
            initialMeasurementsCache: virtualizerRef.current?.measurementsCache,
          },
          lastScrollRestorationKey,
          headerHeight: headerHeight || 0,
        });
      }
    };
  }, []);

  React.useEffect(() => {
    const scrollConfig = restoreScrollConfig(scrollConfigStorageKeyRef.current);

    /*
     * Observe changes in the dimension of body element to check scroll position restoration requirements and if all check passes commit the restoration.
     **/
    const observer = new ResizeObserver(() => {
      restoreScrollPosition({
        virtualizer: virtualizerRef.current,
        overScan: overScanRef.current,
        offsetAttribute: offsetAttributeRef.current,
        scrollConfigStorageKey: scrollConfigStorageKeyRef.current,
      });
    });
    if (scrollConfig) observer.observe(document.body);
    return () => {
      observer.disconnect();
    };
  }, []);
}

export { restoreScrollPosition, restoreScrollConfig, getHeaderHeight, getInitialMeasurementsCache };
