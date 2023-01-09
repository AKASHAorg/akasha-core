import * as React from 'react';
import {
  GridContainerItem,
  GridContainerItemProps,
} from '../components/GridContainer/GridContainerItem';

export const matchColumnsFromChildren = (children: React.ReactNode, columns: string) => {
  let templateColumns = '';
  const sizeModifier = columns.split(':')[0];
  React.Children.forEach(children, (child, idx) => {
    if (!React.isValidElement(child)) {
      // Ignore invalid children
      // example conditionally rendered elements
      return;
    }
    if (child.type !== GridContainerItem) {
      // Ignore non GridContainerItem children
      // maybe add a warning?
      console.warn(`ignoring element of type: ${child.type} as it is not a GridContainerItem`);
      return;
    }
    const validChild = child as React.ReactElement<GridContainerItemProps>;

    if (validChild.props.columnSizes) {
      // columnSizes = 'sm:1fr md:3fr lg:2fr'
      const targetCol = validChild.props.columnSizes
        .split(' ')
        .find(c => c.startsWith(sizeModifier));
      if (targetCol) {
        templateColumns += `${targetCol.split(':')[1]}`;
        if (idx < React.Children.count(children) - 1) {
          templateColumns += '_';
        }
      }
    }
  });
  return `${sizeModifier}:${templateColumns}` === columns;
};
