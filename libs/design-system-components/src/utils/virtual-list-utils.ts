import { VirtualItem } from '@tanstack/react-virtual';

export const mergeWithCache = <T>(cache: VirtualItem[], pages: T[]) => {
  const merged = [];
  const pageMap = new Map(pages.map(p => [p['cursor'], p]));

  const maxLen = Math.max(cache.length, pages.length);

  for (let i = 0; i < maxLen; i++) {
    const cacheItem = cache[i];
    if (cacheItem) {
      const page = pageMap.get(cacheItem.key);
      if (page) {
        merged.push({ ...cacheItem, ...page });
      } else {
        merged.push(cacheItem);
      }
    }
  }

  for (const page of pages) {
    if (!merged.find(mp => mp.key === page['cursor'])) {
      merged.push({
        index: merged.length,
        key: page['cursor'],
        ...page,
      });
    }
  }

  return merged;
};
