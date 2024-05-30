import { Virtualizer, VirtualizerOptions } from '@tanstack/react-virtual';

const SCROLL_RESTORATION_CONFIG = 'scroll-restoration-config';

type Config = {
  /*
   * The last scroll offset position
   **/
  scrollOffset: number;
  /*
   * The offset of the parent container holding the virtual list
   **/
  topOffset: number;
  /*
   * Index of the reference item used for scroll restoration
   **/
  referenceItemIndex: number;
  /*
   * Virtualizer's options
   **/
  options: VirtualizerOptions<Window, Element>;
  /*
   * Flag to check if a scroll restoration is done
   **/
  done?: boolean;
};

interface IRestoreScrollPosition {
  virtualizer: Virtualizer<Window, Element>;
  overScan: number;
  offsetAttribute: string;
  scrollRestorationStorageKey: string;
}

/*
 * Restore scroll position
 **/
export async function restoreScrollPosition({
  virtualizer,
  overScan,
  offsetAttribute,
  scrollRestorationStorageKey,
}: IRestoreScrollPosition) {
  try {
    const scrollConfig = restoreScrollConfig(scrollRestorationStorageKey);
    if (!scrollConfig) return;
    const { referenceItemIndex, topOffset, scrollOffset, options, done } = scrollConfig;
    /*
     * Validate scroll restoration config fields
     **/
    if (
      !referenceItemIndex ||
      !options ||
      typeof options !== 'object' ||
      typeof scrollOffset !== 'number'
    )
      return;

    const scrollIndex = options.initialMeasurementsCache.findIndex(
      measurementCache => measurementCache.index === referenceItemIndex,
    );

    if (scrollIndex !== -1) {
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
          typeof offsetDelta === 'number' ? scrollOffset - offsetDelta : scrollOffset;
        virtualizer.scrollToOffset(scrollToOffset, { align: 'start', behavior: 'auto' });
        if (scrollToOffset !== virtualizer.scrollOffset) {
          setTimeout(() => {
            virtualizer.scrollToOffset(scrollToOffset, { align: 'start', behavior: 'auto' });
          }, 0);
        }
        storeScrollConfig(scrollRestorationStorageKey, { ...scrollConfig, done: true });
        setTimeout(() => {
          removeItemFromScrollConfig(scrollRestorationStorageKey);
        }, 500);
      }
    }
  } catch (error) {
    console.error(error);
    removeItemFromScrollConfig(scrollRestorationStorageKey);
  }
}

/*
 * Restore scroll config
 **/
export function restoreScrollConfig(scrollRestorationStorageKey?: string): Config {
  try {
    const config = JSON.parse(sessionStorage.getItem(SCROLL_RESTORATION_CONFIG));
    return scrollRestorationStorageKey ? config[scrollRestorationStorageKey] : config;
  } catch (e) {
    return null;
  }
}

/*
 * Store scroll restoration configuration
 **/
export function storeScrollConfig(scrollRestorationStorageKey: string, config: Config) {
  const currentConfig = restoreScrollConfig();
  sessionStorage.setItem(
    SCROLL_RESTORATION_CONFIG,
    JSON.stringify({
      ...(currentConfig ? currentConfig : {}),
      [scrollRestorationStorageKey]: config,
    }),
  );
}

/*
 * Remove item from scroll config by key
 **/
function removeItemFromScrollConfig(key: string) {
  const config = restoreScrollConfig();
  if (config[key]) {
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
    referenceItem.size >= options.initialMeasurementsCache?.[referenceItem.index]?.size;

  /*
   * Check if items before the visible reference item are loaded according to the appropriate size.
   **/
  const itemsBeforeReferenceItemLoaded = stepBackArr
    .map(stepBack => {
      const prevItem = virtualizer
        .getVirtualItems()
        .find(virtualItem => virtualItem.index === scrollIndex - stepBack);
      return prevItem
        ? prevItem.size >= options.initialMeasurementsCache?.[prevItem.index]?.size
        : true;
    })
    .every(item => item);

  return referenceItemLoaded && itemsBeforeReferenceItemLoaded;
}

interface IGetMinHeight {
  virtualizer: Virtualizer<Window, Element>;
  virtualItemSize: number;
  virtualItemIndex: number;
}

/*
 * Get min height of virtual item
 **/
export function getMinHeight({ virtualizer, virtualItemSize, virtualItemIndex }: IGetMinHeight) {
  if (virtualizer.options.initialMeasurementsCache?.[virtualItemIndex]) {
    return `min-h-[${virtualizer.options.initialMeasurementsCache[virtualItemIndex].size}px]`;
  }
  /*
   * While scrolling set the min height to the size of the virtual item to avoid flicker
   **/
  if (virtualizer.isScrolling) return `min-h-[${virtualItemSize}px]`;
  return '';
}
