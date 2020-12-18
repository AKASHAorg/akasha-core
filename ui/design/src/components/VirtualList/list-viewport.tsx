import * as React from 'react';
import CardRenderer from './card-renderer';
import { IRenderItemProps, IVirtualListProps } from './interfaces';
import Spinner from '../Spinner';

export interface IListViewportProps {
  items: string[];
  itemsData: IVirtualListProps['itemsData'];
  height: number;
  itemCard: React.ReactElement;
  onSizeChange: IRenderItemProps['onSizeChange'];
  loadItemData: IVirtualListProps['loadItemData'];
  coordinates: { [key: string]: { top: number; height: number } };
  itemSpacing: number;
  slice: [number, number];
  customEntities?: IVirtualListProps['customEntities'];
  isFetching: boolean;
}

const ListViewport: React.FC<IListViewportProps> = props => {
  const {
    itemsData,
    coordinates,
    items,
    itemSpacing,
    slice,
    customEntities = [],
    isFetching,
    height,
  } = props;
  const itemsToRender = items.slice(...slice);
  return (
    <>
      {itemsToRender.map(itemId => {
        let itemKey = itemId;
        const itemData = itemsData[itemId];
        if (itemData && itemData.version) {
          itemKey = `${itemId}-${itemData.version}`;
        }
        return (
          <CardRenderer
            key={itemKey}
            itemId={itemId}
            itemCard={props.itemCard}
            loadItemData={props.loadItemData}
            itemData={itemData}
            onSizeChange={props.onSizeChange}
            customEntities={customEntities}
            coordinates={coordinates}
            itemSpacing={itemSpacing}
          />
        );
      })}
      {isFetching && (
        <div
          style={{
            position: 'absolute',
            top: height + itemSpacing,
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
