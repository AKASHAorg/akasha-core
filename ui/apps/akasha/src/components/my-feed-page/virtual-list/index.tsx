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
import { useScrollRestore } from './use-scroll-restore';

export const enum IndicatorPosition {
  TOP,
  BOTTOM,
}

export type VirtualizerProps<T> = {
  restorationKey: string;
  header?: React.ReactNode;
  estimatedHeight: VirtualListProps<unknown>['estimatedHeight'];
  items: T[];
  itemKeyExtractor: (item: T) => string;
  itemIndexExtractor: (itemKey: string) => number;
  renderItem: (data: T) => React.ReactNode;
  initialRect?: VirtualListProps<unknown>['initialRect'];
  overscan?: VirtualListProps<unknown>['overscan'];
  itemSpacing?: number;
  onFetchNextPage: (lastKey: string) => void;
  onFetchPrevPage?: (firstKey: string) => void;
  onFetchInitialData?: (startKey: string) => void;
  isFetchingNext?: boolean;
  isFetchingPrev?: boolean;
  loadingIndicator?: (position: IndicatorPosition) => React.ReactNode;
  debug?: boolean;
  onScrollSave?: (state: VirtualListProps<T>['initialScrollState']) => void;
};

export const Virtualizer = <T,>(props: VirtualizerProps<T>) => {
  const {
    estimatedHeight,
    itemKeyExtractor,
    itemIndexExtractor,
    header,
    items,
    renderItem,
    overscan = 5,
    itemSpacing = 8,
    onFetchNextPage,
    onFetchPrevPage,
    loadingIndicator,
    debug = false,
    onFetchInitialData,
    restorationKey,
    onScrollSave,
  } = props;
  const vlistRef = React.useRef<VirtualListInterface<T>>();
  const prevRestoreKey = React.useRef<string>();
  const edgeDetector = useEdgeDetector({
    overscan,
    onLoadNext: onFetchNextPage,
    onLoadPrev: onFetchPrevPage,
  });

  const scrollRestore = useScrollRestore<T>({
    restoreKey: restorationKey,
    enabled: !!onScrollSave,
  });

  React.useEffect(() => {
    if (scrollRestore.isRestored) {
      const state = scrollRestore.scrollState;
      if (state && state.items.length) {
        const initialItem = state.items.at(0);
        console.log(
          'fetch initial data starting from:',
          initialItem.virtualData.index,
          initialItem.virtualData.key,
        );
      }
    }
  }, [scrollRestore]);

  const saveScroll = () => {
    // @TODO: save scroll position object to database
    const scrollState = vlistRef.current.getRestorationState();
    const items = scrollState.items
      .filter(
        it =>
          !it.virtualData.key.startsWith(LOADING_INDICATOR) &&
          it.virtualData.key !== HEADER_COMPONENT,
      )
      .map(it => {
        return {
          ...it,
          virtualData: {
            key: it.virtualData.key,
            data: it.virtualData.data,
            index: it.virtualData.index,
            maybeRef: it.virtualData.maybeRef,
          },
        };
      });

    const newScrollState = {
      listHeight: scrollState.listHeight,
      items,
    };

    if (onScrollSave) {
      onScrollSave(newScrollState);
    } else {
      scrollRestore.saveScrollState(newScrollState);
    }
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
    scrollRestore.fetchScrollState();
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
        createVirtualDataItem(
          `${LOADING_INDICATOR}_bottom`,
          {},
          false,
          () => loadingIndicator(IndicatorPosition.BOTTOM),
          list.length - 1,
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
      overscan={overscan}
      itemSpacing={itemSpacing}
      onEdgeDetectorUpdate={handleEdgeDetectorUpdate}
      onScrollEnd={handleScrollEnd}
      debug={debug}
    />
  );
};
