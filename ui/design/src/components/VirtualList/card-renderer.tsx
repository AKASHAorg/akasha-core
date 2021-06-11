import React from 'react';
import styled from 'styled-components';
import { IRenderItemProps } from './interfaces';
import EntryLoadingPlaceholder from './placeholders/entry-card-placeholder';

const CardItemWrapper = styled.div<{ yPos?: number; opacity: number }>`
  transition: opacity 0.3s ease-in-out;
  width: 100%;
  position: absolute;
  opacity: ${props => props.opacity};
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
    // itemIndex,
    // className,
    onItemUnmount,
  } = props;

  const beforeEntities = customEntities.filter(
    entityObj => entityObj.position === 'before' && entityObj.itemId === itemId,
  );
  const afterEntities = customEntities.filter(
    entityObj => entityObj.position === 'after' && entityObj.itemId === itemId,
  );
  // first time render
  const ftRender = React.useRef(true);
  const isMounted = React.useRef(true);

  const cardWrapperRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (itemId && !itemData && loadItemData) {
      loadItemData({ itemId });
    }
  }, [itemId]);

  React.useEffect(() => {
    ftRender.current = false;
    return () => {
      isMounted.current = false;
      if (onItemUnmount) {
        onItemUnmount(itemId, itemRect);
      }
    };
  }, []);

  React.useLayoutEffect(() => {
    if (cardWrapperRef.current) {
      if (ftRender.current) {
        if (updateRef) {
          updateRef(itemId, cardWrapperRef.current);
        }
      } else if (itemRect) {
        if (updateRef) {
          updateRef(itemId, cardWrapperRef.current);
        }
      }
      return;
    }
    if (!cardWrapperRef.current && isMounted.current) {
      if (onItemUnmount) {
        onItemUnmount(itemId, itemRect);
      }
    }
  }, [itemRect, itemId, onItemUnmount, updateRef]);

  const shouldLoadData = itemRect && itemRect.canRender;

  return (
    <CardItemWrapper
      // data-itemid={itemId}
      // data-itemindex={itemIndex}
      ref={cardWrapperRef}
      key={itemId}
      style={{
        transform: `translateY(${itemRect ? itemRect.rect.getTop() : itemSpacing}px)`,
      }}
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
