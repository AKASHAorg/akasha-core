import * as React from 'react';
import { VirtualList, VirtualListInterface, VirtualListProps } from './virtual-list';
import {
  createVirtualDataItem,
  HEADER_COMPONENT,
  LOADING_INDICATOR,
  VirtualDataItem,
  VirtualItemInfo,
} from './virtual-item';
import { useEdgeDetector } from './use-edge-detector';

export const enum IndicatorPosition {
  TOP,
  BOTTOM,
}

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
  overscan?: VirtualListProps<unknown>['overscan'];
  itemSpacing?: number;
  onFetchNextPage: (lastKey: string) => void;
  onFetchPrevPage?: (firstKey: string) => void;
  isFetchingNext?: boolean;
  isFetchingPrev?: boolean;
  loadingIndicator?: (position: IndicatorPosition) => React.ReactNode;
  debug?: boolean;
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
    overscan = 5,
    itemSpacing = 8,
    onFetchNextPage,
    onFetchPrevPage,
    loadingIndicator,
    debug = false,
  } = props;
  const prevRestoreKey = React.useRef(null);
  const vlistRef = React.useRef<VirtualListInterface>();
  const restoreItem = React.useRef<Record<string, RestorationItem>>({});
  const edgeDetector = useEdgeDetector({
    overscan,
    onLoadNext: onFetchNextPage,
    onLoadPrev: onFetchPrevPage,
  });
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
    console.log(items, '<< restoration items');
  };

  const handleScrollEnd = () => {
    saveScroll();
  };

  const handleEdgeDetectorUpdate = (
    itemList: VirtualItemInfo[],
    mountedItems: VirtualItemInfo[],
    alreadyRendered: boolean,
  ) => {
    edgeDetector.update(itemList, mountedItems, alreadyRendered);
  };

  if (restorationKey && !prevRestoreKey.current) {
    getSavedScroll();
    prevRestoreKey.current = restorationKey;
  }

  const itemList: VirtualDataItem<T>[] = React.useMemo(() => {
    const list = [];
    if (loadingIndicator) {
      list.push(
        createVirtualDataItem(`${LOADING_INDICATOR}_top`, {}, false, () =>
          loadingIndicator(IndicatorPosition.TOP),
        ),
      );
    }
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
    if (loadingIndicator) {
      list.push(
        createVirtualDataItem(`${LOADING_INDICATOR}_bottom`, {}, false, () =>
          loadingIndicator(IndicatorPosition.BOTTOM),
        ),
      );
    }
    return list;
  }, [header, itemIndexExtractor, itemKeyExtractor, items, loadingIndicator, renderItem]);

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
      overscan={overscan}
      itemSpacing={itemSpacing}
      onEdgeDetectorUpdate={handleEdgeDetectorUpdate}
      onScrollEnd={handleScrollEnd}
      debug={debug}
    />
  );
};
