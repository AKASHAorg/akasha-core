import * as React from 'react';
import { VirtualDataItem } from './virtual-item-renderer';

export type RestoreItem = {
  key: string;
  offsetTop: number;
};

const getScrollState = (restoreKey: string) => {
  const state = window.history.state;
  if (!state || !state.virtualListPosition) return { loaded: true };
  const scrollState = state.virtualListPosition[restoreKey];
  if (!scrollState) return { loaded: true };
  const savedItems = scrollState.items;
  if (savedItems.length > 0) {
    return { ...scrollState, loaded: true };
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

  const save = (restoreItems: RestoreItem[]) => {
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState(
        Object.assign(window.history.state ?? {}, {
          virtualListPosition: {
            ...(window.history.state?.virtualListPosition || {}),
            [restoreKey]: { items: restoreItems },
          },
        }),
        '',
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
