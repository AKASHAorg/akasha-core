import React, { PropsWithChildren } from 'react';
import { matchColumnsFromChildren } from '../../utils/match-columns-from-children';
import { tw, apply } from '@twind/core';

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
  let { children, dense, noGap, columns, rows, maxW, centerX } = props;

  const containerClass = apply`
    grid mt-2
    ${!dense && !centerX && 'mx-2'}
    ${!dense && 'mx-1'}
    ${centerX && 'mx-auto'}
    ${noGap && 'gap-0'}
    ${!noGap && 'gap-6'}
    ${maxW && 'max-w-7xl'}
    'sm:grid-cols-[8fr_4fr]': ${matchColumnsFromChildren(children, 'sm:8fr_4fr')}
    'md:grid-cols-[3fr_6fr_3fr]': ${matchColumnsFromChildren(children, 'md:3fr_6fr_3fr')}
  }`;

  return <div className={tw(containerClass)}>{children}</div>;
};
