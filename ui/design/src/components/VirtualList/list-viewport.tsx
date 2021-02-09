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
    averageItemHeight,
    listHeader,
  } = props;

  const siblingCustomEntities = customEntities
    .filter(ent => ent.position === 'before' && !ent.itemId)
    .map((entity, idx) => entity.getComponent({ key: idx, style: { marginBottom: itemSpacing } }));

  return (
    <>
      {listHeader && React.cloneElement(listHeader)}
      {siblingCustomEntities}
      {renderSlice.map(itemId => {
        return (
          <CardRenderer
            key={itemId}
            itemIndex={itemRects.get(itemId)?.index}
            itemId={itemId}
            itemCard={props.itemCard}
            itemCardAlt={props.itemCardAlt}
            loadItemData={props.loadItemData}
            itemData={itemsData[itemId]}
            customEntities={customEntities}
            itemSpacing={itemSpacing}
            itemRect={itemRects.get(itemId)}
            updateRef={props.updateRef}
            averageItemHeight={averageItemHeight}
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
