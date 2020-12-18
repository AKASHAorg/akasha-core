import React from 'react';
import { IRenderItemProps } from './interfaces';
import { useResizeObserver } from './use-resize-observer';

const CardRenderer = (props: IRenderItemProps) => {
  const {
    itemId,
    itemData,
    loadItemData,
    onSizeChange,
    itemSpacing,
    customEntities,
    itemCard,
    coordinates,
  } = props;

  const itemRef = React.useRef<HTMLDivElement | null>(null);
  const itemRect: { top: number; height: number } = coordinates[itemId];

  const beforeEntities = customEntities.filter(
    entityObj => entityObj.position === 'before' && entityObj.itemId === itemId,
  );
  const afterEntities = customEntities.filter(
    entityObj => entityObj.position === 'after' && entityObj.itemId === itemId,
  );

  useResizeObserver(itemRef.current, entries => {
    const contentRect = entries[0].contentRect;
    if (itemRect && itemRef.current) {
      if (contentRect.height !== itemRect.height) {
        onSizeChange(itemId, { height: contentRect.height, top: contentRect.top });
      }
    }
  });

  React.useEffect(() => {
    if (itemRef.current) {
      if (itemRect) {
        const clientRect = itemRef.current.getBoundingClientRect();
        if (clientRect.height !== itemRect.height) {
          onSizeChange(itemId, { height: clientRect.height, top: clientRect.top });
        }
      }
    }
  });
  React.useEffect(() => {
    if (itemId && !itemData) {
      loadItemData({ itemId });
    }
  }, [itemId]);

  let yPos;
  if (itemRect) {
    yPos = itemRect.top;
  }

  return (
    <div
      key={itemId}
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

      {React.cloneElement(itemCard, { itemId, itemData })}

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
};

export default CardRenderer;
