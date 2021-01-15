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
    onItemInitialLoad,
    onUnload,
    isLoaded,
    prevRect,
  } = props;

  const beforeEntities = customEntities.filter(
    entityObj => entityObj.position === 'before' && entityObj.itemId === itemId,
  );
  const afterEntities = customEntities.filter(
    entityObj => entityObj.position === 'after' && entityObj.itemId === itemId,
  );

  const wasLoaded = React.useRef<boolean>();

  React.useEffect(() => {
    if (itemId && !itemData && loadItemData) {
      loadItemData({ itemId });
    }
  }, [itemId]);

  const savedRef = React.useRef<HTMLDivElement>();
  const prevDOMRect = React.useRef<DOMRect>();
  let prevBottom;
  if (prevRect) {
    prevBottom = prevRect.rect.getBottom() + 8;
  }
  const notifyChange = () => {
    if (savedRef.current) {
      const domRect = savedRef.current.getBoundingClientRect();
      if (!itemRect || (itemRect && itemRect.rect.getHeight() !== domRect.height)) {
        props.onItemSizeChange(itemId, domRect);
        prevDOMRect.current = domRect;
      }
    }
  };

  const measurementInterval = React.useRef<number | null>(null);

  React.useLayoutEffect(() => {
    if (!measurementInterval.current && savedRef.current && isLoaded) {
      measurementInterval.current = setInterval(notifyChange, 500);
    }
    if (!isLoaded && wasLoaded) {
      if (measurementInterval.current) {
        clearInterval(measurementInterval.current);
        measurementInterval.current = null;
      }
    }
    return () => {
      if (measurementInterval.current) {
        clearInterval(measurementInterval.current);
        measurementInterval.current = null;
      }
    };
  }, [savedRef.current, prevDOMRect.current, measurementInterval, isLoaded, wasLoaded]);

  React.useEffect(() => {
    wasLoaded.current = isLoaded;
  }, [isLoaded]);

  React.useEffect(() => {
    if (isLoaded) {
      notifyChange();
    }
  }, [itemData, isLoaded, beforeEntities.length, afterEntities.length]);

  React.useEffect(() => {
    return () => {
      if (onUnload) {
        onUnload(itemId);
      }
    };
  }, []);

  const handleRootLoad = () => {
    if (!itemData) {
      onItemInitialLoad(itemId);
    }
  };

  React.useEffect(() => {
    if (savedRef.current) {
      handleRootLoad();
    }
  }, [savedRef.current]);

  const onRef = (r: HTMLDivElement) => {
    if (updateRef) {
      updateRef(itemId, r);
    }
    savedRef.current = r;
  };
  let yPos;
  if (prevBottom) {
    yPos = prevBottom + (itemSpacing || 0);
  } else if (itemRect) {
    yPos = itemRect.rect.getTop();
  }
  return (
    <div
      key={itemId}
      // id={`${itemId}`}
      ref={onRef}
      style={{
        position: 'absolute',
        transform: `translateY(${yPos || 0}px)`,
        opacity: `${!yPos ? 0.01 : !itemData ? 0.6 : 1}`,
        transition: 'opacity 0.24s ease-out',
        width: '100%',
        minHeight: `${itemRect ? itemRect.rect.getHeight() : 200}px`,
      }}
    >
      {beforeEntities.map((entityObj, idx) => {
        return entityObj.getComponent({ key: idx, style: { marginBottom: itemSpacing } });
      })}

      {!itemData && <EntryLoadingPlaceholder />}
      {itemData && React.cloneElement(itemCard, { itemId, itemData })}

      {afterEntities.map((entityObj, idx) => {
        return entityObj.getComponent({ key: idx, style: { marginTop: itemSpacing } });
      })}
    </div>
  );
};

export default CardRenderer;
