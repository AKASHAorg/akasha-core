import * as React from 'react';
import isEqual from 'react-fast-compare';
import { IListItemContainerProps } from './interfaces';

const ListItemContainer = (props: IListItemContainerProps) => {
  const {
    itemData,
    itemId,
    visitorEthAddress,
    loadItemData,
    getItemCard,
    isBookmarked = false,
  } = props;
  React.useEffect(() => {
    if (itemId && !itemData) {
      loadItemData({ itemId });
    }
  }, [itemId]);

  return getItemCard({ itemId, itemData, visitorEthAddress, isBookmarked });
};

export default React.memo(ListItemContainer, (prevProps, props) => {
  // we only need to update if the itemData prop changes
  if (
    isEqual(prevProps.itemData, props.itemData) &&
    isEqual(prevProps.isBookmarked, props.isBookmarked) &&
    isEqual(prevProps.visitorEthAddress, props.visitorEthAddress)
  ) {
    return true;
  }
  return false;
});
