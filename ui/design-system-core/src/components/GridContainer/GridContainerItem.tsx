import React, { PropsWithChildren } from 'react';

export type TailwindSizeModifier = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type GridContainerItemProps = {
  columnSizes?: string;
  rowSizes?: string;
};

export const GridContainerItem: React.FC<PropsWithChildren<GridContainerItemProps>> = props => {
  return <div>{props.children}</div>;
};
