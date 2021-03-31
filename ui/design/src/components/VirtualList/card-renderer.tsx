import React from 'react';
import styled from 'styled-components';
import { IRenderItemProps } from './interfaces';
import EntryLoadingPlaceholder from './placeholders/entry-card-placeholder';

const CardItemWrapper = styled.div<{ yPos?: number; opacity: number }>`
  transition: opacity 0.3s ease-in-out;
  width: 100%;
  position: absolute;
  opacity: ${props => props.opacity};
  transform: translateY(${props => props.yPos}px);
  &.vlist-item-exit {
    /* transform: translateY(${props => props.yPos}px); */
    opacity: 0 !important;
  }
  &.entered {
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-out;
  }
`;

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
    averageItemHeight,
    itemIndex,
    className,
    onItemUnmount,
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
      if (onItemUnmount) {
        onItemUnmount(itemId, itemRect);
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
    <CardItemWrapper
      data-itemid={itemId}
      data-itemindex={itemIndex}
      ref={onRef}
      className={className}
      yPos={itemRect ? itemRect.rect.getTop() : itemSpacing}
      opacity={itemRect ? 1 : 0.01}
    >
      {beforeEntities.map((entityObj, idx) => {
        return entityObj.getComponent({
          key: idx,
          style: { marginBottom: itemSpacing },
        });
      })}

      {!shouldLoadData && <EntryLoadingPlaceholder height={averageItemHeight} />}
      {!itemData && <EntryLoadingPlaceholder height={averageItemHeight} />}
      {itemData && shouldLoadData && React.cloneElement(itemCard, { itemId, itemData })}

      {afterEntities.map((entityObj, idx) => {
        return entityObj.getComponent({
          key: idx,
          style: { marginTop: itemSpacing },
        });
      })}
    </CardItemWrapper>
  );
};

export default CardRenderer;
