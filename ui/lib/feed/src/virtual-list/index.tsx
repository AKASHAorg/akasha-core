import * as React from 'react';
import { VirtualList, VirtualListInterface, VirtualListProps } from './virtual-list';
import {
  createVirtualDataItem,
  HEADER_COMPONENT,
  LOADING_INDICATOR,
  VirtualDataItem,
  VirtualItemInfo,
} from './virtual-item';
import { useEdgeDetector, UseEdgeDetectorProps } from './use-edge-detector';
import { useScrollRestore } from './use-scroll-restore';
import { Rect } from './rect';

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
  onFetchInitialData?: VirtualListProps<T>['onFetchInitialData'];
  loadingIndicator?: (position: IndicatorPosition) => React.ReactNode;
  debug?: boolean;
  onScrollSave?: (state: {
    listHeight: number;
    items: { key: string; offsetTop: number }[];
  }) => void;
  scrollTopIndicator?: VirtualListProps<T>['scrollTopIndicator'];
  onListReset?: VirtualListProps<T>['onListReset'];
  onEdgeDetectorChange: UseEdgeDetectorProps['onEdgeDetectorChange'];
};

const Virtualizer = <T,>(props: VirtualizerProps<T>) => {
  const {
    estimatedHeight,
    itemKeyExtractor,
    itemIndexExtractor,
    header,
    items,
    renderItem,
    overscan = 20,
    itemSpacing = 8,
    loadingIndicator,
    debug = false,
    onFetchInitialData,
    restorationKey,
    onScrollSave,
    scrollTopIndicator,
    onListReset,
    onEdgeDetectorChange,
  } = props;

  const vlistRef = React.useRef<VirtualListInterface>();
  const prevRestoreKey = React.useRef<string>();

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

  const edgeDetector = useEdgeDetector({
    overscan,
    onEdgeDetectorChange,
  });

  const scrollRestore = useScrollRestore({
    restoreKey: restorationKey,
    enabled: typeof onScrollSave !== 'function',
  });

  const saveScroll = () => {
    const scrollState = vlistRef.current.getRestorationState();

    if (onScrollSave && typeof onScrollSave === 'function') {
      onScrollSave(scrollState);
    } else {
      scrollRestore.saveScrollState(scrollState);
    }
  };

  const handleScrollEnd = () => {
    saveScroll();
  };

  const handleEdgeDetectorUpdate = (
    itemList: VirtualItemInfo[],
    mountedItems: VirtualItemInfo[],
    viewportRect: Rect,
    averageItemHeight: number,
    isNewUpdate: boolean,
  ) => {
    edgeDetector.update(itemList, mountedItems, viewportRect, averageItemHeight, isNewUpdate);
  };

  if (restorationKey && !prevRestoreKey.current) {
    scrollRestore.fetchScrollState();
    prevRestoreKey.current = restorationKey;
  }

  const scrollRestorationType = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      if (window.history) return window.history.scrollRestoration;
      return 'auto';
    }
    return 'auto';
  }, []);

  if (!scrollRestore.isFetched) {
    scrollRestore.fetchScrollState();
    return null;
  }

  return (
    <VirtualList
      ref={vlistRef}
      scrollRestore={scrollRestore}
      estimatedHeight={estimatedHeight}
      itemList={itemList}
      scrollRestorationType={scrollRestorationType}
      overscan={overscan}
      itemSpacing={itemSpacing}
      onEdgeDetectorUpdate={handleEdgeDetectorUpdate}
      onScrollEnd={handleScrollEnd}
      debug={debug}
      onFetchInitialData={onFetchInitialData}
      scrollTopIndicator={scrollTopIndicator}
      onListReset={onListReset}
    />
  );
};

export { Virtualizer };
export { EdgeArea } from './use-edge-detector';
