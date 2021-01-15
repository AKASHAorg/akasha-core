import * as React from 'react';
import CardRenderer from './card-renderer';
import Spinner from '../Spinner';
import { IListViewportProps } from './interfaces';

const ListViewport: React.FC<IListViewportProps> = props => {
  const {
    itemsData,
    itemSpacing,
    customEntities = [],
    isFetching,
    itemRects,
    listHeight,
    renderSlice,
    loadedIds,
    itemIds,
  } = props;

  return (
    <>
      {renderSlice.map(itemId => {
        const idx = itemIds.indexOf(itemId);
        const prev = itemIds[idx - 1];
        let prevRect = null;
        if (prev) {
          prevRect = itemRects.get(prev);
        }

        return (
          <CardRenderer
            key={itemId}
            itemId={itemId}
            itemCard={props.itemCard}
            loadItemData={props.loadItemData}
            itemData={itemsData.get(itemId)}
            customEntities={customEntities}
            itemSpacing={itemSpacing}
            itemRect={itemRects.get(itemId)}
            updateRef={props.updateRef}
            onItemSizeChange={props.onItemSizeChange}
            onItemInitialLoad={props.onItemInitialLoad}
            onUnload={props.onUnload}
            isLoaded={loadedIds.indexOf(itemId) >= 0}
            prevRect={prevRect}
          />
        );
      })}
      {isFetching && (
        <div
          style={{
            position: 'absolute',
            transform: `translateY(${listHeight + itemSpacing}px)`,
            width: '100%',
            minHeight: '5rem',
          }}
        >
          <Spinner />
        </div>
      )}
    </>
  );
};

export default ListViewport;
