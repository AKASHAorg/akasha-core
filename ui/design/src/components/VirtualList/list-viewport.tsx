import * as React from 'react';
import CardRenderer from './card-renderer';
import { GetItemCardFn, IRenderItemProps, IVirtualListProps } from './interfaces';
import Rect from './v2/rect-obj';
import Spinner from '../Spinner';

export interface IListViewportProps {
  items: string[];
  itemsData: IVirtualListProps['itemsData'];
  visitorEthAddress?: IVirtualListProps['visitorEthAddress'];
  height: number;
  getItemCard: GetItemCardFn;
  onSizeChange: IRenderItemProps['onSizeChange'];
  loadItemData: IVirtualListProps['loadItemData'];
  coordinates: Map<string, Rect>;
  itemSpacing: number;
  slice: [number, number];
  customEntities?: IVirtualListProps['customEntities'];
  isFetching: boolean;
}

const ListViewport: React.FC<IListViewportProps> = props => {
  const {
    itemsData,
    visitorEthAddress,
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
            visitorEthAddress={visitorEthAddress}
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
