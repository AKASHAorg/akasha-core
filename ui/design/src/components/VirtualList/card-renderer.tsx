import React from 'react';
import ListItemContainer from './list-item-container';
import { IRenderItemProps } from './interfaces';

const CardRenderer = React.memo((props: IRenderItemProps) => {
  const {
    itemId,
    itemData,
    loadItemData,
    onDimensionChange,
    itemSpacing,
    customEntities,
    getItemCard,
    isBookmarked,
  } = props;

  const itemRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = React.useCallback(
    node => {
      itemRef.current = node;
    },
    [itemRef],
  );
  const beforeEntities = customEntities.filter(
    entityObj => entityObj.position === 'before' && entityObj.itemId === itemId,
  );
  const afterEntities = customEntities.filter(
    entityObj => entityObj.position === 'after' && entityObj.itemId === itemId,
  );
  React.useEffect(() => {
    if (itemRef.current && itemData) {
      const itemRect = itemRef.current.getBoundingClientRect();
      if (itemRect.height && itemData) {
        onDimensionChange(itemId, {
          height: itemRect.height,
          top: itemRect.top,
        });
      }
    }
  }, [JSON.stringify(itemData)]);

  return (
    <div
      ref={setRefs}
      style={{ marginBottom: itemSpacing }}
      className="virtual-list-card-item"
      data-item-id={itemId}
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
        onDimensionChange={onDimensionChange}
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
