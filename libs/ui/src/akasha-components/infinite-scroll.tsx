import * as React from 'react';
import {
  measureElement,
  useVirtualizer,
  useWindowVirtualizer,
  Virtualizer,
} from '@tanstack/react-virtual';

import { cn } from '@/library/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  getHeaderHeight,
  getInitialMeasurementsCache,
  useScrollRestoration,
} from '@/hooks/use-scroll-restoration';

const InfiniteScrollContext = React.createContext<{
  gap?: number;
  loading?: boolean;
  hasNextPage?: boolean;
  virtualizer: Virtualizer<Window, Element> | Virtualizer<HTMLDivElement, Element>;
  count: number;
  overScan: number;
  headerRef: React.RefObject<HTMLDivElement | null>;
  loadingIndicator?: React.ReactNode;
} | null>(null);

const useInfiniteScrollContext = () => {
  const context = React.useContext(InfiniteScrollContext);
  if (!context) {
    throw new Error('`useInfiniteScrollContext` must be used within `InfiniteScroll`');
  }
  return context;
};

const InfiniteScroll = ({
  count,
  estimatedHeight,
  lanes,
  overScan = 5,
  gap,
  header,
  hasNextPage,
  loading,
  loadingIndicator,
  scrollElementType = 'window',
  className,
  children,
  onLoadMore,
  ...props
}: React.ComponentProps<'div'> & {
  count: number;
  estimatedHeight: number;
  lanes?: number;
  overScan?: number;
  gap?: number;
  header?: React.ReactNode;
  hasNextPage?: boolean;
  loading?: boolean;
  loadingIndicator?: React.ReactNode;
  scrollElementType?: 'window' | 'element';
  onLoadMore?: () => void;
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const parentOffsetRef = React.useRef(0);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  React.useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, [parentRef.current?.offsetTop]);

  const commonOptions = {
    count,
    lanes,
    overscan: overScan,
    gap,
    scrollMargin: parentOffsetRef.current,
    measureElement: isMobile
      ? (element: any, entry: ResizeObserverEntry | undefined, instance: Virtualizer<any, any>) => {
          const dataIndex = instance.indexFromElement(element);
          if (instance.scrollDirection === 'backward' && instance.measurementsCache?.[dataIndex]) {
            return instance.measurementsCache[dataIndex].size;
          }
          return measureElement(element, entry, instance);
        }
      : measureElement,
    estimateSize: () => estimatedHeight,
  };

  const windowVirtualizer = useWindowVirtualizer(commonOptions);

  const elementVirtualizer = useVirtualizer({
    ...commonOptions,
    getScrollElement: () => parentRef.current,
  });

  const virtualizer = scrollElementType === 'window' ? windowVirtualizer : elementVirtualizer;

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  const minHeight =
    virtualizer.isScrolling && loading && hasNextPage
      ? totalSize + overScan * estimatedHeight
      : totalSize;

  React.useEffect(() => {
    if (!hasNextPage || loading) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem && lastItem.index >= count - 1) {
      onLoadMore?.();
    }
  }, [hasNextPage, count, loading, virtualItems, onLoadMore]);

  return (
    <>
      {header && <div ref={headerRef}>{header}</div>}
      <div
        ref={parentRef}
        data-slot="infinite-scroll-container"
        className={cn('w-full', scrollElementType === 'element' && 'overflow-y-auto h-100')}
      >
        <div
          data-slot="infinite-scroll"
          className={cn('relative w-full', className)}
          style={{
            minHeight: `${minHeight}px`,
          }}
          {...props}
        >
          <InfiniteScrollContext.Provider
            value={{
              gap,
              loading,
              hasNextPage,
              virtualizer,
              count,
              overScan,
              loadingIndicator,
              headerRef,
            }}
          >
            {children}
          </InfiniteScrollContext.Provider>
        </div>
      </div>
    </>
  );
};

const InfiniteScrollList = ({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  children: (index: number) => React.ReactElement<any>;
}) => {
  const { gap, loading, hasNextPage, virtualizer, loadingIndicator } = useInfiniteScrollContext();

  const virtualItems = virtualizer.getVirtualItems();
  const listOffset = virtualItems?.[0]?.start
    ? virtualItems[0].start - virtualizer.options.scrollMargin
    : 0;

  return (
    <div
      data-slot="infinite-scroll-list"
      data-offset={listOffset}
      className={cn('flex flex-col absolute w-full top-0 left-0', className)}
      style={{
        transform: `translateY(${listOffset}px)`,
        gap: `${gap}px`,
      }}
      {...props}
    >
      {virtualItems.map(virtualItem => {
        return (
          <div
            key={virtualItem.key}
            ref={virtualizer.measureElement}
            data-index={virtualItem.index}
          >
            {children(virtualItem.index)}
          </div>
        );
      })}
      {loading && hasNextPage && virtualItems.length > 0 && loadingIndicator}
    </div>
  );
};

const isWindowVirtualizer = (
  virtualizer: Virtualizer<any, Element>,
): virtualizer is Virtualizer<Window, Element> => virtualizer.scrollElement instanceof Window;

const WindowScrollRestoration = ({
  scrollConfigStorageKey = 'storage-key',
  lastScrollRestorationKey = '',
  virtualizer,
  children,
}: React.PropsWithChildren<{
  scrollConfigStorageKey?: string;
  lastScrollRestorationKey?: string;
  virtualizer: Virtualizer<Window, Element>;
}>) => {
  const { count, overScan, headerRef } = useInfiniteScrollContext();

  React.useEffect(() => {
    if (isWindowVirtualizer(virtualizer)) {
      virtualizer.setOptions({
        ...virtualizer.options,
        initialMeasurementsCache: getInitialMeasurementsCache({
          scrollConfigStorageKey,
        }),
      });
    }
  }, [scrollConfigStorageKey, virtualizer]);

  React.useLayoutEffect(() => {
    const headerHeight = getHeaderHeight({
      scrollConfigStorageKey,
      lastScrollRestorationKey,
    });
    if (headerHeight)
      headerRef.current?.setAttribute(
        'className',
        `${headerRef.current.className} min-h-[${headerHeight}px]`,
      );
  }, [headerRef, lastScrollRestorationKey, scrollConfigStorageKey]);

  useScrollRestoration({
    virtualizer,
    count,
    overScan,
    scrollConfigStorageKey,
    offsetAttribute: 'data-offset',
    lastScrollRestorationKey,
    headerRef,
  });
  return <>{children}</>;
};

const ScrollRestoration = ({
  children,
  ...props
}: React.PropsWithChildren<{
  scrollConfigStorageKey?: string;
  lastScrollRestorationKey?: string;
}>) => {
  const { virtualizer } = useInfiniteScrollContext();

  if (isWindowVirtualizer(virtualizer))
    return (
      <WindowScrollRestoration virtualizer={virtualizer} {...props}>
        {children}
      </WindowScrollRestoration>
    );

  throw new Error(
    'Scroll restoration is currently only supported when the scroll element is the window.',
  );
};

export { InfiniteScroll, InfiniteScrollList, ScrollRestoration };
