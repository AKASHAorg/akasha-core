import * as React from 'react';
import { VirtualList, VirtualListInterface, VirtualListProps } from './virtual-list';
import { createVirtualDataItem, HEADER_COMPONENT, VirtualDataItem } from './virtual-item';

export type RestorationItem = {
  key: string;
  offsetTop: number;
};

export type ScrollerState = {
  startItemCursor: string;
  items: RestorationItem[];
};

export type VirtualizerProps<T> = {
  restorationKey: string;
  header?: React.ReactNode;
  estimatedHeight: VirtualListProps<unknown>['estimatedHeight'];
  items: T[];
  itemKeyExtractor: (item: T) => string;
  itemIndexExtractor: (itemKey: string) => number;
  renderItem: (data: T) => React.ReactNode;
  initialRect?: VirtualListProps<unknown>['initialRect'];
  initialScrollState?: ScrollerState;
};

export const Virtualizer = <T,>(props: VirtualizerProps<T>) => {
  const {
    restorationKey,
    estimatedHeight,
    itemKeyExtractor,
    itemIndexExtractor,
    header,
    items,
    renderItem,
    initialScrollState,
  } = props;
  const prevRestoreKey = React.useRef(null);
  const vlistRef = React.useRef<VirtualListInterface>();
  const restoreItem = React.useRef<Record<string, RestorationItem>>({});

  const getSavedScroll = () => {
    // @TODO: load scroll positions from database
    let restorationItems = [];
    if (initialScrollState) {
      const initialItems = initialScrollState.items;
      if (initialItems.length) {
        restorationItems = initialItems;
      }
      restoreItem.current[restorationKey] = restorationItems.find(it =>
        items.some(item => itemKeyExtractor(item) === it.key),
      );
    }
  };

  const saveScroll = () => {
    // @TODO: save scroll position object to database
    const items = vlistRef.current.getRestorationItems();
  };

  if (restorationKey && !prevRestoreKey.current) {
    getSavedScroll();
    prevRestoreKey.current = restorationKey;
  }

  const itemList = React.useMemo(() => {
    const list = [];
    if (header) {
      list.push(createVirtualDataItem(HEADER_COMPONENT, {}, true, () => header));
    }
    list.push(
      ...items.map(it => {
        const itemKey = itemKeyExtractor(it);
        const idx = itemIndexExtractor(itemKey);
        return createVirtualDataItem(itemKey, it, true, renderItem, idx);
      }),
    );
    return list;
  }, [header, itemIndexExtractor, itemKeyExtractor, items, renderItem]);

  const scrollRestorationType = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      if (window.history) return window.history.scrollRestoration;
      return 'auto';
    }
    return 'auto';
  }, []);

  return (
    <VirtualList
      ref={vlistRef}
      estimatedHeight={estimatedHeight}
      itemList={itemList}
      scrollRestorationType={scrollRestorationType}
      onScrollSave={saveScroll}
      scrollRestoreItem={restoreItem.current[restorationKey]}
    />
  );
};
