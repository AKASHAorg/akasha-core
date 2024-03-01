import * as React from 'react';
import {
  VirtualListRenderer,
  VirtualListInterface,
  VirtualListRendererProps,
} from './list-renderer';
import {
  createVirtualDataItem,
  HEADER_COMPONENT,
  FOOTER_COMPONENT,
  VirtualDataItem,
  VirtualItem,
} from './virtual-item-renderer';
import { useEdgeDetector, UseEdgeDetectorProps } from './use-edge-detector';
import { RestoreItem, useScrollState } from './use-scroll-state';
import { Rect } from './rect';

export type VirtualizerProps<T> = {
  restorationKey: string;
  header?: React.ReactElement;
  footer?: React.ReactElement;
  emptyListIndicator?: React.ReactElement;
  estimatedHeight: VirtualListRendererProps<unknown>['estimatedHeight'];
  items: T[];
  itemKeyExtractor: (item: T) => string;
  itemIndexExtractor: (item: T) => number;
  renderItem: (data: T) => React.ReactNode;
  overscan?: VirtualListRendererProps<unknown>['overscan'];
  itemSpacing?: number;
  onFetchInitialData?: (restoreItem?: RestoreItem) => void;
  loadingIndicator?: () => React.ReactElement;
  scrollTopIndicator?: VirtualListRendererProps<T>['scrollTopIndicator'];
  onListReset?: VirtualListRendererProps<T>['onListReset'];
  onEdgeDetectorChange: UseEdgeDetectorProps['onEdgeDetectorChange'];
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  offsetTop?: number;
  requestStatus: {
    called: boolean;
    isLoading: boolean;
  };
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
    onFetchInitialData,
    restorationKey,
    scrollTopIndicator,
    onEdgeDetectorChange,
    footer,
    hasNextPage,
    hasPreviousPage,
    offsetTop,
    requestStatus,
    emptyListIndicator,
  } = props;

  const vlistRef = React.useRef<VirtualListInterface>();
  const [isMounted, setIsMounted] = React.useState(false);

  const keyExtractorRef = React.useRef(itemKeyExtractor);
  const itemRendererRef = React.useRef(renderItem);
  const scrollRestore = useScrollState(restorationKey);
  const prevRestorationKey = React.useRef(null);

  const itemList: VirtualDataItem<T>[] = React.useMemo(() => {
    const itemList: VirtualDataItem<T>[] = [];
    if (header) {
      itemList.push(
        createVirtualDataItem(HEADER_COMPONENT, HEADER_COMPONENT as T, true, () => header),
      );
    }

    itemList.push(
      ...items.map(item =>
        createVirtualDataItem(
          keyExtractorRef.current(item),
          item,
          true,
          itemRendererRef.current,
          itemIndexExtractor(item),
        ),
      ),
    );

    if (footer) {
      itemList.push(
        createVirtualDataItem(FOOTER_COMPONENT, FOOTER_COMPONENT as T, false, () => footer),
      );
    }
    return itemList;
  }, [footer, header, itemIndexExtractor, items]);

  const edgeDetector = useEdgeDetector({
    overscan,
    onEdgeDetectorChange,
  });

  const handleDetectorUpdate = React.useCallback(
    (
      itemList: VirtualItem[],
      mountedItems: VirtualItem[],
      viewportRect: Rect,
      getItemHeightAverage: () => number,
      measurementsCache: Map<string, number>,
      isNewUpdate: boolean,
    ) => {
      edgeDetector.update(itemList, mountedItems, viewportRect, getItemHeightAverage, isNewUpdate);
      if (!isMounted) return;
      if (vlistRef.current.isAtTop()) {
        return scrollRestore.save([], new Map());
      }
      const restoreItems = mountedItems.filter(it =>
        viewportRect.overlaps(new Rect(it.start, it.height)),
      );
      scrollRestore.save(
        restoreItems.map(it => ({ offsetTop: it.start, key: it.key })),
        measurementsCache,
      );
    },
    [edgeDetector, isMounted, scrollRestore],
  );

  const restoreStartItem = React.useRef<RestoreItem>();

  const fetchInitialData = React.useCallback(() => {
    if (scrollRestore.scrollState.loaded) {
      if (!requestStatus.called && !requestStatus.isLoading) {
        const restoreItem = scrollRestore.getLastItem();
        const listItems = itemList.filter(it => it.maybeRef && it.key !== HEADER_COMPONENT);
        if (restoreItem && listItems.length === 0) {
          onFetchInitialData(restoreItem);
        } else if (listItems.length === 0) {
          onFetchInitialData();
        }
      }
    }
  }, [itemList, onFetchInitialData, requestStatus.called, requestStatus.isLoading, scrollRestore]);

  React.useEffect(() => {
    if (!isMounted) {
      if (itemList.length > 0 && scrollRestore.scrollState.loaded) {
        setIsMounted(true);
        return;
      }
      fetchInitialData();
      if (
        itemList.length > 0 &&
        scrollRestore.scrollState.loaded &&
        scrollRestore.scrollState.items?.length
      ) {
        restoreStartItem.current = scrollRestore.getRestoreItem(itemList);
        if (typeof window !== 'undefined' && window.history.scrollRestoration) {
          window.history.scrollRestoration = 'manual';
        }
      }
    }

    if (isMounted && prevRestorationKey.current !== restorationKey) {
      prevRestorationKey.current = restorationKey;
      fetchInitialData();
    }
  }, [fetchInitialData, isMounted, itemList, onFetchInitialData, restorationKey, scrollRestore]);

  const scrollRestorationType = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      if (window.history) return window.history.scrollRestoration;
      return 'auto';
    }
    return 'auto';
  }, []);

  if (!items.length && requestStatus.called && !requestStatus.isLoading && emptyListIndicator) {
    return emptyListIndicator;
  }

  return (
    <React.StrictMode>
      {!isMounted && loadingIndicator && loadingIndicator()}
      {isMounted && (
        <VirtualListRenderer
          restorationKey={restorationKey}
          ref={vlistRef}
          itemList={itemList}
          estimatedHeight={estimatedHeight}
          overscan={overscan}
          restorationItem={restoreStartItem.current}
          scrollRestorationType={scrollRestorationType}
          measurementsCache={scrollRestore.scrollState.measurementsCache}
          itemSpacing={itemSpacing}
          onEdgeDetectorUpdate={handleDetectorUpdate}
          scrollTopIndicator={scrollTopIndicator}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          isLoading={requestStatus.isLoading}
          loadingIndicator={loadingIndicator}
          offsetTop={offsetTop}
        />
      )}
    </React.StrictMode>
  );
};

export { Virtualizer };
export { EdgeArea } from './use-edge-detector';
