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
   * The key used to compute the item used as a scroll restoration reference
   **/
  scrollRestorationKey: string;
  /*
   * Virtualizer's options
   **/
  options: VirtualizerOptions<Window, Element>;
};

interface IRestoreScrollPosition {
  scrollRestorationKeys: string[];
  virtualizer: Virtualizer<Window, Element>;
  overScan: number;
  offsetAttribute: string;
  scrollRestorationStorageKey: string;
}

/*
 * Restore scroll position
 **/
export async function restoreScrollPosition({
  scrollRestorationKeys,
  virtualizer,
  overScan,
  offsetAttribute,
  scrollRestorationStorageKey,
}: IRestoreScrollPosition) {
  try {
    const scrollConfig = restoreScrollConfig(scrollRestorationStorageKey);
    if (!scrollConfig) return;
    const { scrollRestorationKey, topOffset, scrollOffset, options } = scrollConfig;

    /*
     * Validate scroll restoration config fields
     **/
    if (
      !scrollRestorationKey ||
      !options ||
      typeof options !== 'object' ||
      typeof scrollOffset !== 'number'
    )
      return;

    const scrollIndex = scrollRestorationKeys.findIndex(key => key === scrollRestorationKey);
    if (scrollIndex !== -1) {
      /*
       * Check if the latest virtual items container offset matches with the current offset to determine
       *  if the current offset can be used for scroll restoration.
       **/
      const offsetMatched =
        Number(document.querySelector(`[${offsetAttribute}]`)?.getAttribute(offsetAttribute)) ===
        virtualizer.getVirtualItems()?.[0].start;

      /*
       * Check if all conditions for scroll restoration are satisfied.
       **/
      if (requiredItemsLoaded({ virtualizer, scrollIndex, overScan, options }) && offsetMatched) {
        /*
         * Check the difference between the last offset of the virtual list container with the current one.
         * If there is a difference add or subtract from the last scroll offset to determine the normalized scroll restoration offset.
         **/
        const offsetDelta = topOffset - virtualizer.getVirtualItems()?.[0].start;
        const scrollToOffset =
          typeof offsetDelta === 'number' ? Math.round(scrollOffset - offsetDelta) : scrollOffset;

        window.scrollTo({ top: scrollToOffset, behavior: 'instant' });
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
