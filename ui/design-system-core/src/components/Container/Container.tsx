import React, { PropsWithChildren } from 'react';
import { tw, apply } from '@twind/core';

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
  const { display, direction, stickyTop, stickyBottom, fixedBottom, maxWXL, rightMd } = props;

  const instanceStyles = apply`
    ${display ? '' : 'flex'}
    flex-${direction === 'row' ? 'row' : 'col'}
    ${stickyTop && 'sticky top-0'}
    ${stickyBottom && 'sticky bottom-0'}
    ${fixedBottom && 'fixed bottom-0'}
    ${maxWXL && 'max-w-xl'}
    ${rightMd && 'right-20'}
  `;

  return <div className={tw(instanceStyles)}>{props.children}</div>;
};
