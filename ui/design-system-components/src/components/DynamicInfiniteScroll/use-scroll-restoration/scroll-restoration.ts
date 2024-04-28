const SCROLL_RESTORATION_OFFSET = '@scrollRestorationOffset';
const SCROLL_RESTORATION_OPTIONS = '@scrollRestorationOptions';

/*
 * Restore scroll position
 **/
export function restoreScrollPosition(scrollHeight: number) {
  const scrollRestorationOffset = +sessionStorage.getItem(SCROLL_RESTORATION_OFFSET);
  if (!scrollRestorationOffset || !Number.isInteger(scrollRestorationOffset)) return;
  //check scroll height against scroll restoration offset to ensure the possibility of scrolling to the offset
  if (scrollHeight >= +scrollRestorationOffset) {
    //scroll to an offset after an elapse of few milliseconds to ensure accurate result
    setTimeout(
      () =>
        window.scrollTo({
          top: +scrollRestorationOffset,
          behavior: 'auto',
        }),
      500,
    );
    sessionStorage.removeItem(SCROLL_RESTORATION_OFFSET);
  }
}

/*
 * Restores virtualizer's scroll options
 **/
export function restoreScrollOptions() {
  try {
    const scrollRestorationOptions = sessionStorage.getItem(SCROLL_RESTORATION_OPTIONS);
    if (scrollRestorationOptions) {
      return JSON.parse(scrollRestorationOptions);
    }
  } catch (error) {
    console.error('Unable to restore scroll position', error);
    sessionStorage.removeItem(SCROLL_RESTORATION_OFFSET);
  } finally {
    sessionStorage.removeItem(SCROLL_RESTORATION_OPTIONS);
  }
  return null;
}

/*
 * Stores the last scroll offset position and virtualizer's current options in a session storage
 **/
export function storeScrollOffsetAndOptions(scrollOffset: number, options: unknown) {
  sessionStorage.setItem(SCROLL_RESTORATION_OFFSET, JSON.stringify(scrollOffset));
  sessionStorage.setItem(SCROLL_RESTORATION_OPTIONS, JSON.stringify(options));
}
