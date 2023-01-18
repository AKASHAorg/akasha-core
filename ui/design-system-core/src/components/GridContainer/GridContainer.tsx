import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';

export type Margin = 'auto' | 'none' | 'small' | 'medium' | 'large';

export type GridContainerProps = {
  columns?: boolean;
  rows?: boolean;
  noGap?: boolean;
  dense?: boolean;
  maxW?: boolean;
  centerX?: boolean;
};

// React 18 and later typings does no longer have children declared in props
// https://solverfox.dev/writing/no-implicit-children/
export const GridContainer: React.FC<PropsWithChildren<GridContainerProps>> = props => {
  const { children } = props;

  const containerClass = classNames('grid mt-2', {
    'mx-2': !props.dense && !props.centerX,
    'mx-1': props.dense,
    'mx-auto': props.centerX,
    'gap-0': props.noGap,
    'gap-6': !props.noGap,
    'max-w-7xl': props.maxW,
    //'sm:grid-cols-[8fr_4fr]': matchColumnsFromChildren(props.children, 'sm:8fr_4fr'),
    //'md:grid-cols-[3fr_6fr_3fr]': matchColumnsFromChildren(props.children, 'md:3fr_6fr_3fr'),
  });

  return <div className={containerClass}>{children}</div>;
};
