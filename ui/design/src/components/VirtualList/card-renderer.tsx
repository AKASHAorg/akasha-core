import React from 'react';
import ListItemContainer from './list-item-container';
import { IRenderItemProps } from './interfaces';

const CardRenderer = React.memo((props: IRenderItemProps) => {
  const {
    itemId,
    itemData,
    loadItemData,
    onSizeChange,
    itemSpacing,
    customEntities,
    getItemCard,
    isBookmarked,
    prevItemId,
    coordinates,
    // index,
  } = props;

  const itemRef = React.useRef<HTMLDivElement | null>(null);

  const beforeEntities = customEntities.filter(
    entityObj => entityObj.position === 'before' && entityObj.itemId === itemId,
  );
  const afterEntities = customEntities.filter(
    entityObj => entityObj.position === 'after' && entityObj.itemId === itemId,
  );

  React.useEffect(() => {
    if (itemRef.current) {
      const item = itemRef.current.getBoundingClientRect();
      if (item) {
        onSizeChange(itemId, {
          height: item.height,
        });
      }
    }
  }, [JSON.stringify(itemData), prevItemId, JSON.stringify(coordinates), itemRef]);

  React.useEffect(() => {
    if (itemRef.current) {
      const itemRect = itemRef.current.getBoundingClientRect();
      onSizeChange(itemId, { height: itemRect.height });
    }
  }, [beforeEntities.length, afterEntities.length]);

  let yPos = 0;
  if (coordinates) {
    const itemRect = coordinates.get(itemId);
    if (itemRect) {
      yPos = itemRect.top;
    }
  } else {
    // just in case we cannot measure the entry size,
    // do not let a gap betweed other entries
    return null;
  }
  return (
    <div
      ref={itemRef}
      className={`entry-${itemId}`}
      data-item-id={itemId}
      style={{
        position: 'absolute',
        transform: `translateY(${yPos}px)`,
        transition: 'opacity 0.24s ease-out',
        width: '100%',
      }}
    >
      {beforeEntities.map(
        React.useCallback(
          (entityObj, idx) => {
            return entityObj.getComponent({ key: idx, style: { marginBottom: itemSpacing } });
          },
          [beforeEntities.length],
        ),
      )}
      <ListItemContainer
        loadItemData={loadItemData}
        itemData={itemData}
        itemId={itemId}
        itemSpacing={itemSpacing}
        getItemCard={getItemCard}
        isBookmarked={isBookmarked}
      />
      {afterEntities.map(
        React.useCallback(
          (entityObj, idx) => {
            return entityObj.getComponent({ key: idx, style: { marginTop: itemSpacing } });
          },
          [afterEntities.length],
        ),
      )}
    </div>
  );
});

export default CardRenderer;
