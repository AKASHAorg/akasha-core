import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

export type ContainerProps = {
  display?: 'block' | 'inline-block' | 'inline-flex';
  direction?: 'row' | 'column';
  position?: 'relative' | 'absolute' | 'fixed';
  stickyTop?: boolean;
  stickyBottom?: boolean;
  fixedBottom?: boolean;
  maxWXL?: boolean;
  rightMd?: boolean;
};

export const Container: React.FC<PropsWithChildren<ContainerProps>> = props => {
  const rootClassnames = classNames({
    flex: !props.display,
    'flex-col': props.direction === 'column' || !props.direction,
    'sticky top-0': props.stickyTop,
    'sticky bottom-0': props.stickyBottom,
    'fixed bottom-0': props.fixedBottom,
    'max-w-xl': props.maxWXL,
    'right-20': props.rightMd,
  });

  return <div className={rootClassnames}>{props.children}</div>;
};
