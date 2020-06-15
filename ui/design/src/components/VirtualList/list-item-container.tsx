import * as React from 'react';
import isEqual from 'react-fast-compare';
import EntryLoadingPlaceholder from './placeholders/entry-card-placeholder';
import { IListItemContainerProps } from './interfaces';

const ListItemContainer = (props: IListItemContainerProps) => {
  const { itemData, itemId, loadItemData, getItemCard, isBookmarked } = props;
  React.useEffect(() => {
    if (itemId) {
      loadItemData({ itemId });
    }
  }, [itemId]);
  if (!itemData) {
    return <EntryLoadingPlaceholder />;
  }

  return getItemCard({ itemId, itemData, isBookmarked });
};

export default React.memo(ListItemContainer, (prevProps, props) => {
  // we only need to update if the itemData prop changes
  if (
    isEqual(prevProps.itemData, props.itemData) &&
    isEqual(prevProps.isBookmarked, props.isBookmarked)
  ) {
    return true;
  }
  return false;
});
