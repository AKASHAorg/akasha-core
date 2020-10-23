import * as React from 'react';
import CardRenderer from './card-renderer';
import { GetItemCardFn, IRenderItemProps, IVirtualListProps } from './interfaces';
import Rect from './v2/rect-obj';

export interface IListViewportProps {
  items: string[];
  itemsData: IVirtualListProps['itemsData'];
  height: number;
  getItemCard: GetItemCardFn;
  onSizeChange: IRenderItemProps['onSizeChange'];
  loadItemData: IVirtualListProps['loadItemData'];
  coordinates: Map<string, Rect>;
  itemSpacing: number;
  slice: [number, number];
  customEntities?: IVirtualListProps['customEntities'];
}

const ListViewport: React.FC<IListViewportProps> = props => {
  const { itemsData, coordinates, items, itemSpacing, slice, customEntities = [] } = props;
  const itemsToRender = items.slice(...slice);
  return (
    <>
      {itemsToRender.map((itemId: string) => {
        const itemIdx = items.indexOf(itemId);
        let itemKey = itemId;
        const itemData = itemsData[itemId];
        if (itemData && itemData.version) {
          itemKey = `${itemId}-${itemData.version}`;
        }
        return (
          <CardRenderer
            key={itemKey}
            itemId={itemId}
            getItemCard={props.getItemCard}
            loadItemData={props.loadItemData}
            itemData={itemData}
            isBookmarked={false}
            onSizeChange={props.onSizeChange}
            customEntities={customEntities}
            coordinates={coordinates}
            prevItemId={items[itemIdx - 1]}
            index={itemIdx}
            itemSpacing={itemSpacing}
          />
        );
      })}
    </>
  );
};

export default ListViewport;
