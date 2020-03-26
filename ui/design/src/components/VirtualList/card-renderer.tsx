import React from 'react';
import ListItemContainer from './list-item-container';
import { IRenderItemProps } from './interfaces';
import EntryLoadingPlaceholder from './placeholders/entry-card-placeholder';

const CardRenderer = React.memo((props: IRenderItemProps) => {
  const {
    item,
    itemData,
    loadItemDataAction,
    onDimensionChange,
    itemSpacing,
    customEntities,
    getItemCard,
  } = props;

  const itemRef = React.useRef<HTMLDivElement | null>(null);

  const setRefs = React.useCallback(
    node => {
      itemRef.current = node;
    },
    [itemRef],
  );
  React.useEffect(() => {
    if (itemRef.current && itemData) {
      const itemRect = itemRef.current.getBoundingClientRect();
      if (itemRect.height && itemData) {
        onDimensionChange(item.entryId, {
          height: itemRect.height,
          top: itemRect.top,
        });
      }
    }
  }, [JSON.stringify(itemData)]);
  return (
    <div ref={setRefs} style={{ marginBottom: itemSpacing }}>
      {customEntities
        .filter(entityObj => entityObj.position === 'before')
        .map((entityObj, idx) => {
          return entityObj.getComponent({ key: idx, style: { marginBottom: itemSpacing } });
        })}
      <React.Suspense fallback={<EntryLoadingPlaceholder />}>
        <ListItemContainer
          dataLoadAction={loadItemDataAction}
          itemData={itemData}
          itemId={item.entryId}
          onDimensionChange={onDimensionChange}
          itemSpacing={itemSpacing}
          getItemCard={getItemCard}
        />
      </React.Suspense>
      {customEntities
        .filter(entityObj => entityObj.position === 'after')
        .map((entityObj, idx) => {
          return entityObj.getComponent({ key: idx, style: { marginTop: itemSpacing } });
        })}
    </div>
  );
});

export default CardRenderer;
