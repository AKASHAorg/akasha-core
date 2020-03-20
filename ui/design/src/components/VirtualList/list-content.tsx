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

/* - Keeps track of loaded items and loadMore schedules
 * - renders cards
 */

const ListContent = (props: IListContentProps) => {
  const {
    items,
    itemsData,
    initialPaddingTop,
    loadItemDataAction,
    height,
    width,
    itemSpacing,
    loadLimit,
    offsetItems,
    onLoadMore,
    customEntities,
    getItemCard,
  } = props;
  const [fetchOperation, setFetchOperation] = React.useState<IFetchOperation | null>(null);
  const [sliceOperation, setSliceOperation] = React.useState<ISliceOperation | null>(null);

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

  const updateScroll = (
    scrollTop: number,
    scrollHeight: number,
    scrollStateRef: React.MutableRefObject<IScrollState>,
    operatorRef: any,
    infScrollState: IInfiniteScrollState,
    availableItems: IListContentProps['items'],
    itemMeasurements: ItemDimensionsRef,
  ) => {
    const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    let scrollDirection: 0 | 1 = 0;
    if (scrollTop > 0 && scrollStateRef.current.scrollTop <= scrollTop) {
      scrollDirection = 1;
    }

    scrollStateRef.current = {
      scrollHeight,
      direction: scrollDirection,
      scrollTop: scrollTop,
      clientHeight: clientHeight,
    };

    if (operatorRef) {
      operatorRef.handleContainerScroll(
        scrollStateRef,
        infScrollState,
        availableItems,
        itemMeasurements,
      );
    }
  };
  const containerScrollThrottle = React.useRef(throttle(updateScroll, 250, { trailing: true }))
    .current;

  // throttled scrolling
  const throttledScroll = (ev: React.SyntheticEvent<HTMLDivElement>) => {
    containerScrollThrottle(
      ev.currentTarget.scrollTop,
      ev.currentTarget.scrollHeight,
      scrollState,
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
    >
      <React.Suspense fallback={<>Loading newer entries</>}>
        <BoundryLoader
          chrono="upper"
          onLoadMore={onLoadMore}
          fetchOperation={fetchOperation}
          setFetchOperation={setFetchOperation}
          height={infiniteScrollState.paddingTop}
        />
      </React.Suspense>
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
        onLoadMore={onLoadMore}
        initialPaddingTop={initialPaddingTop}
        itemSpacing={itemSpacing}
      />
      {infiniteScrollState.items.map((viewableItem, idx) => (
        <CardRenderer
          key={viewableItem.entryId}
          loadItemDataAction={loadItemDataAction}
          onDimensionChange={onDimensionChange}
          itemSpacing={itemSpacing}
          item={viewableItem}
          index={idx}
          itemData={itemsData[viewableItem.entryId]}
          customEntities={customEntities.filter(
            ent => ent.itemId === viewableItem.entryId || ent.itemIndex === idx,
          )}
          getItemCard={getItemCard}
        />
      ))}
      <React.Suspense fallback={<>Loading older entries</>}>
        <BoundryLoader
          chrono="lower"
          onLoadMore={onLoadMore}
          fetchOperation={fetchOperation}
          setFetchOperation={setFetchOperation}
          height={infiniteScrollState.paddingBottom}
        />
      </React.Suspense>
    </div>
  );
};

export default ListContent;
