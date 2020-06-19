import * as React from 'react';
import SliceOperator from './slice-operator';
import {
  IListContentProps,
  IScrollState,
  ItemDimensions,
  ISliceOperation,
  IFetchOperation,
  ItemDimensionsRef,
  IInfiniteScrollState,
} from './interfaces';
import CardRenderer from './card-renderer';
import BoundryLoader from './boundry-loader';
import throttle from 'lodash.throttle';
import { getInfiniteScrollState } from './utils';
import { useIntersectionObserver } from './use-intersection-observer';

/* - Keeps track of loaded items and loadMore schedules
 * - renders cards
 */

const ListContent = (props: IListContentProps) => {
  const {
    items,
    itemsData,
    initialPaddingTop,
    loadItemData,
    height,
    width,
    itemSpacing,
    loadLimit,
    offsetItems,
    onLoadMore,
    customEntities,
    getItemCard,
    listState,
    setListState,
    hasMoreItems,
    bookmarkedItems,
    getNewItemsNotification,
    onItemRead,
  } = props;
  const [fetchOperation, setFetchOperation] = React.useState<IFetchOperation | null>(null);
  const [sliceOperation, setSliceOperation] = React.useState<ISliceOperation | null>(null);

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const itemDimensions = React.useRef<ItemDimensions>({
    dimensions: {},
    count: 0,
    avgItemHeight: 200,
    totalItemsHeight: 0,
  });

  const scrollState = React.useRef<IScrollState>({
    direction: 1,
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
  });

  const queueOperatorRef = React.createRef<{ handleContainerScroll: any }>();

  const infiniteScrollState = React.useMemo(
    () =>
      getInfiniteScrollState(
        sliceOperation,
        items,
        itemDimensions,
        itemSpacing,
        initialPaddingTop,
        scrollState,
        offsetItems,
      ),
    [JSON.stringify(sliceOperation), items.length, JSON.stringify(itemDimensions.current)],
  );

  const [intersectingId] = useIntersectionObserver(
    containerRef.current,
    document.querySelectorAll('.virtual-list-card-item'),
  );
  const newEntryNotificationShown =
    (scrollState.current.scrollTop > itemDimensions.current.avgItemHeight ||
      infiniteScrollState.paddingTop > itemDimensions.current.avgItemHeight) &&
    listState.newerEntries.length > 0;

  React.useEffect(() => {
    if (intersectingId && onItemRead) {
      onItemRead(intersectingId);
    }
  }, [intersectingId]);

  const updateScroll = (
    scrollTop: number,
    scrollHeight: number,
    operatorRef: any,
    infScrollState: IInfiniteScrollState,
    availableItems: IListContentProps['items'],
    itemMeasurements: ItemDimensionsRef,
  ) => {
    const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    let scrollDirection: 0 | 1 = 0;
    if (scrollTop > 0 && scrollState.current.scrollTop <= scrollTop) {
      scrollDirection = 1;
    }

    scrollState.current = {
      scrollHeight,
      direction: scrollDirection,
      scrollTop: scrollTop,
      clientHeight: clientHeight,
    };

    if (operatorRef) {
      operatorRef.handleContainerScroll(
        scrollState,
        infScrollState,
        availableItems,
        itemMeasurements,
      );
    }
  };

  const containerScrollThrottle = React.useRef(throttle(updateScroll, 150, { trailing: true }))
    .current;

  const onDimensionChange = (itemId: string, dimension: { height: number; top: number }) => {
    const itemDimension = itemDimensions.current.dimensions[itemId];
    if (!itemDimension) {
      // add item dimension and compute total items height and average item height
      itemDimensions.current.count += 1;
      itemDimensions.current.dimensions[itemId] = dimension;
      itemDimensions.current.totalItemsHeight += dimension.height;
      itemDimensions.current.avgItemHeight =
        itemDimensions.current.totalItemsHeight / itemDimensions.current.count;
    } else if (itemDimension.height !== dimension.height) {
      // update item dimensions and totals
      itemDimensions.current.dimensions[itemId] = dimension;
      itemDimensions.current.totalItemsHeight =
        itemDimensions.current.totalItemsHeight - itemDimension.height + dimension.height;
      itemDimensions.current.avgItemHeight =
        itemDimensions.current.totalItemsHeight / itemDimensions.current.count;
    }
  };

  // throttled scrolling
  const throttledScroll = (ev: React.SyntheticEvent<HTMLDivElement>) => {
    containerScrollThrottle(
      ev.currentTarget.scrollTop,
      ev.currentTarget.scrollHeight,
      queueOperatorRef.current,
      infiniteScrollState,
      items,
      itemDimensions,
    );
    ev.persist();
  };

  return (
    <div
      style={{ height, width, position: 'relative', overflowY: 'auto', padding: '0 1em' }}
      onScroll={throttledScroll}
      ref={containerRef}
    >
      {getNewItemsNotification &&
        getNewItemsNotification({
          styles: {
            transform: newEntryNotificationShown ? 'translate(-50%, 0)' : 'translate(-50%, -110%)',
            position: newEntryNotificationShown ? 'sticky' : 'sticky',
            willChange: 'transform',
            transition: 'transform 0.214s ease-in-out',
          },
        })}
      <BoundryLoader
        chrono="upper"
        onLoadMore={onLoadMore}
        fetchOperation={fetchOperation}
        setFetchOperation={setFetchOperation}
        height={infiniteScrollState.paddingTop}
      />
      <SliceOperator
        fetchOperation={fetchOperation}
        setFetchOperation={setFetchOperation}
        sliceOperation={sliceOperation}
        setSliceOperation={setSliceOperation}
        itemDimensions={itemDimensions}
        items={items}
        loadLimit={loadLimit}
        offsetItems={offsetItems}
        ref={queueOperatorRef}
        initialPaddingTop={initialPaddingTop}
        itemSpacing={itemSpacing}
        listState={listState}
        setListState={setListState}
        hasMoreItems={hasMoreItems}
      />
      {infiniteScrollState.items.map((viewableItemId, idx) => (
        <CardRenderer
          key={`${viewableItemId}`}
          loadItemData={loadItemData}
          onDimensionChange={onDimensionChange}
          itemSpacing={itemSpacing}
          itemId={viewableItemId}
          index={idx}
          itemData={itemsData[viewableItemId]}
          customEntities={customEntities.filter(
            ent => ent.itemId === viewableItemId || ent.itemIndex === idx,
          )}
          getItemCard={getItemCard}
          isBookmarked={bookmarkedItems ? bookmarkedItems.has(viewableItemId) : null}
        />
      ))}
      <BoundryLoader
        chrono="lower"
        onLoadMore={onLoadMore}
        fetchOperation={fetchOperation}
        setFetchOperation={setFetchOperation}
        height={infiniteScrollState.paddingBottom}
      />
    </div>
  );
};

export default ListContent;
