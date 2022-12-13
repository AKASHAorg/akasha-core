import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

export type Margin = 'auto' | 'none' | 'small' | 'medium' | 'large';
export type GridContainerProps = {
  grid: boolean;
  margin?: Margin;
};

// React 18 and later typings does no longer have children declared in props
// https://solverfox.dev/writing/no-implicit-children/
export const GridContainer: React.FC<PropsWithChildren<GridContainerProps>> = props => {
  const containerClass = classNames('container grid', {
    'mx-2': !props.margin,
    'mx-auto': props.margin === 'auto',
    // 'mx-2': props.margin === 'small',
  });

  return <div className={containerClass}>{props.children}</div>;
};
