import React from 'react';
import { IRenderItemProps } from './interfaces';
import Rect from './rect-obj';
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

  const itemRect: Rect = coordinates[itemId];
  // itemRect.addResizeListener(() => {});

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
        onSizeChange(
          itemId,
          new Rect({
            height: contentRect.height,
            top: contentRect.top,
          }),
        );
      }
    }
  });

  React.useEffect(() => {
    if (itemRef.current) {
      if (itemRect) {
        const height = itemRef.current.getBoundingClientRect().height;
        if (height !== itemRect.height) {
          const clientRect = itemRef.current.getBoundingClientRect();
          const { top, height } = clientRect;
          onSizeChange(itemId, new Rect({ height, top }));
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
