import * as React from 'react';
import EntryLoadingPlaceholder from './placeholders/entry-card-placeholder';
import { IListItemContainerProps } from './interfaces';

const ListItemContainer = (props: IListItemContainerProps) => {
  const { itemData, itemId, dataLoadAction, getItemCard } = props;

  dataLoadAction({ entryId: itemId }, [!itemData]);

  if (!itemData) {
    return <EntryLoadingPlaceholder />;
  }

  return getItemCard({ itemId, itemData });
};

export default React.memo(ListItemContainer, (prevProps, props) => {
  // we only need to update if the itemData prop changes
  if (prevProps.itemData === props.itemData) {
    return true;
  }
  return false;
});
