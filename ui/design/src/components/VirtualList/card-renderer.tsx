import React from 'react';
import { IRenderItemProps } from './interfaces';
import EntryLoadingPlaceholder from './placeholders/entry-card-placeholder';

const CardRenderer = (props: IRenderItemProps) => {
  const {
    itemId,
    itemData,
    loadItemData,
    itemSpacing,
    customEntities,
    itemCard,
    itemRect,
    updateRef,
  } = props;

  const beforeEntities = customEntities.filter(
    entityObj => entityObj.position === 'before' && entityObj.itemId === itemId,
  );
  const afterEntities = customEntities.filter(
    entityObj => entityObj.position === 'after' && entityObj.itemId === itemId,
  );
  React.useEffect(() => {
    if (itemId && !itemData && loadItemData) {
      loadItemData({ itemId });
    }
  }, [itemId]);

  React.useEffect(() => {
    return () => {
      if (updateRef) {
        updateRef(itemId, null, true);
      }
    };
  }, []);

  const onRef = (divElem: HTMLDivElement) => {
    if (updateRef) {
      updateRef(itemId, divElem);
    }
  };

  const shouldLoadData = itemRect && itemRect.canRender;

  return (
    <div
      data-itemid={itemId}
      ref={onRef}
      style={{
        position: 'absolute',
        transform: `translateY(${itemRect ? itemRect.rect.getTop() : itemSpacing}px)`,
        opacity: `${!itemRect ? 0.01 : 1}`,
        transition: 'opacity 0.24s ease-out',
        width: '100%',
      }}
    >
      {beforeEntities.map((entityObj, idx) => {
        return entityObj.getComponent({ key: idx, style: { marginBottom: itemSpacing } });
      })}

      {!shouldLoadData && <EntryLoadingPlaceholder />}
      {itemData && shouldLoadData && React.cloneElement(itemCard, { itemId, itemData })}

      {afterEntities.map((entityObj, idx) => {
        return entityObj.getComponent({ key: idx, style: { marginTop: itemSpacing } });
      })}
    </div>
  );
};

export default CardRenderer;
