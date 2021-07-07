import * as React from 'react';
import CardRenderer from './card-renderer';
import Spinner from '../Spinner';
import { IListViewportProps } from './interfaces';
import { Rect } from './rect';

const PLACEHOLDER_KEY = 'vlist-item-loading-placeholder';

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
    loadLimit,
    usePlaceholders,
  } = props;

  // const siblingCustomEntities = customEntities
  //   .filter(ent => ent.position === 'before' && !ent.itemId)
  //   .map((entity, idx) => entity.getComponent({ key: idx, style: { marginBottom: itemSpacing } }));

  const placeholders: string[] = React.useMemo(() => {
    if (!renderSlice.length && usePlaceholders) {
      return Array(loadLimit)
        .fill(null)
        .map((_v, i) => `${PLACEHOLDER_KEY}-${i}`);
    }
    return [];
  }, [renderSlice.length, loadLimit, usePlaceholders]);

  return (
    <>
      {listHeader && React.cloneElement(listHeader, { key: 'list-header' })}
      {/* {siblingCustomEntities} */}

      {renderSlice.map(itemId => {
        return (
          <CardRenderer
            key={itemId}
            itemIndex={itemRects.get(itemId)?.index}
            itemId={itemId}
            itemCard={props.itemCard}
            loadItemData={props.loadItemData}
            itemData={itemsData[itemId]}
            customEntities={customEntities}
            itemSpacing={itemSpacing}
            itemRect={itemRects.get(itemId)}
            updateRef={props.updateRef}
            averageItemHeight={averageItemHeight}
            onItemUnmount={props.onItemUnmount}
          />
        );
      })}

      {placeholders.map((placeholderId, idx) => (
        <CardRenderer
          key={placeholderId}
          itemIndex={idx}
          itemId={placeholderId}
          itemCard={props.itemCard}
          loadItemData={() => {
            /* explicitly left empty! */
          }}
          itemData={null}
          customEntities={[]}
          itemSpacing={itemSpacing}
          itemRect={{
            rect: new Rect({
              top:
                (itemRects.get(renderSlice[renderSlice.length - 1])?.rect.getBottom() || 8) +
                itemSpacing * idx +
                averageItemHeight * idx,
              height: averageItemHeight,
            }),
            canRender: true,
            index: idx,
          }}
          averageItemHeight={averageItemHeight}
        />
      ))}

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
