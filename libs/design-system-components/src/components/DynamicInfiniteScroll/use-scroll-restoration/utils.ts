import { Virtualizer, VirtualizerOptions } from '@tanstack/react-virtual';

const SCROLL_RESTORATION_CONFIGS = 'scroll-restoration-configs';

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
   * The key used to identify the item used as a scroll restoration reference
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
}

/*
 * Restore scroll position
 **/
export async function restoreScrollPosition({
  scrollRestorationKeys,
  virtualizer,
  overScan,
  offsetAttribute,
}: IRestoreScrollPosition) {
  try {
    const scrollConfig = restoreScrollConfig();
    if (!scrollConfig) return;
    const { scrollRestorationKey, topOffset, scrollOffset, options } = scrollConfig;

    /*
     * Validate scroll restoration config fields
     **/
    if (
      !scrollRestorationKey &&
      typeof scrollRestorationKey !== 'string' &&
      !options &&
      typeof options !== 'object' &&
      !Number.isInteger(scrollOffset)
    )
      return;

    const scrollIndex = scrollRestorationKeys.findIndex(key => key === scrollRestorationKey);
    if (scrollIndex !== -1) {
      /*
       * Make sure virtualizer's options from last scroll position are available in the current virtualizer instance
       **/
      virtualizer.setOptions({ ...virtualizer.options, ...options });

      /*
       * Find the visible item used as a scroll restoration reference
       **/
      const referenceItem = virtualizer
        .getVirtualItems()
        .find(virtualItem => virtualItem.index === scrollIndex);

      /*
       * Create array of steps to take back from the reference item to check if
       * the virtual items before it are loaded according to the appropriate size
       **/
      const stepBackArr = Array(overScan)
        .fill(0)
        .map((_, index) => index + 1);

      /*
       * Check if the reference item is loaded according to the appropriate size
       **/
      const referenceItemLoaded =
        referenceItem &&
        referenceItem.size >= options.initialMeasurementsCache?.[referenceItem.index]?.size;

      /*
       * Check if items before the visible reference item are loaded according to the appropriate size
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

      /*
       * Check if the latest virtual items container offset matches with the current offset to determine
       *  if the current offset can be used for scroll restoration
       **/
      const offsetMatched =
        Number(document.querySelector(`[${offsetAttribute}]`)?.getAttribute(offsetAttribute)) ===
        virtualizer.getVirtualItems()?.[0].start;

      /*
       * Check if all conditions for scroll restoration are satisfied
       **/
      if (referenceItemLoaded && itemsBeforeReferenceItemLoaded && offsetMatched) {
        /*
         * Check the difference between the last offset of the virtual list container with the current
         * If there is a difference add or subtract from the last scroll offset to determine the normalized scroll restoration offset
         **/
        const offsetDelta = topOffset - virtualizer.getVirtualItems()?.[0].start;
        const scrollToOffset = Number.isFinite(offsetDelta)
          ? scrollOffset - offsetDelta
          : scrollOffset;
        window.scrollTo({ top: scrollToOffset, behavior: 'instant' });
        sessionStorage.removeItem(SCROLL_RESTORATION_CONFIGS);
      }
    }
  } catch (error) {
    console.error(error);
    sessionStorage.removeItem(SCROLL_RESTORATION_CONFIGS);
  }
}

/*
 * Restore scroll config
 **/
export function restoreScrollConfig(): Config {
  try {
    const scrollRestorationOptions = sessionStorage.getItem(SCROLL_RESTORATION_CONFIGS);
    if (scrollRestorationOptions) {
      return JSON.parse(scrollRestorationOptions);
    }
  } catch (error) {
    console.error(error);
    sessionStorage.removeItem(SCROLL_RESTORATION_CONFIGS);
  }
  return null;
}

/*
 * Store scroll restoration configuration including virtualizer's options
 **/
export function storeScrollConfigs(config: Config) {
  sessionStorage.setItem(SCROLL_RESTORATION_CONFIGS, JSON.stringify(config));
}
