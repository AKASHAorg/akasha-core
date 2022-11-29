import * as React from 'react';
import { GridContainerProps } from './GridContainer.types';

export const GridContainer: React.FC<GridContainerProps> = props => {
  return <div>{props.children}</div>;
};
