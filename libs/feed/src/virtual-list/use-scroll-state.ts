import * as React from 'react';
import { VirtualDataItem } from './virtual-item-renderer';

const SESSION_STORAGE_KEY = 'vlist-scroll-restoration';

export type RestoreItem = {
  key: string;
  offsetTop: number;
};

const getScrollState = (restoreKey: string) => {
  const sessionState = sessionStorage.getItem(SESSION_STORAGE_KEY);
  let state = null;

  if (sessionState) {
    state = JSON.parse(sessionState);
  }

  if (!state || !state[restoreKey]) return { loaded: true };

  const scrollState = state[restoreKey];

  if (!scrollState) return { loaded: true };

  const savedItems = scrollState.items;

  if (savedItems.length > 0) {
    return {
      ...scrollState,
      measurementsCache: new Map(scrollState.measurementsCache.entries),
      loaded: true,
    };
  }
  return { loaded: true };
};

export const useScrollState = (restoreKey: string) => {
  const [scrollState, setScrollState] = React.useState<{
    listHeight?: number;
    items?: RestoreItem[];
    measurementsCache?: Map<string, number>;
    loaded: boolean;
  }>(() => getScrollState(restoreKey));
  const restoreKeyRef = React.useRef(restoreKey);

  React.useEffect(() => {
    if (restoreKey !== restoreKeyRef.current) {
      setScrollState(getScrollState(restoreKey));
      restoreKeyRef.current = restoreKey;
    }
  }, [restoreKey]);

  const save = (restoreItems: RestoreItem[], measurementsCache: Map<string, number>) => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const currentStorage = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)) || {};
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          ...currentStorage,
          [restoreKey]: {
            items: restoreItems,
            measurementsCache: Object.fromEntries(measurementsCache),
          },
        }),
      );
    }
  };

  return {
    scrollState,
    save,
    getLastItem: () => {
      if (scrollState.loaded && scrollState.items) {
        const { items } = scrollState;
        return items.length ? items.at(items.length - 1) : undefined;
      }
      return undefined;
    },
    getFirstItem: () => {
      if (scrollState.loaded && scrollState.items) {
        const { items } = scrollState;
        return items.length ? items.at(0) : undefined;
      }
      return undefined;
    },
    getRestoreItem: (itemList: VirtualDataItem<unknown>[]) => {
      return scrollState.items.find(item => itemList.some(listItem => listItem.key === item.key));
    },
  };
};
