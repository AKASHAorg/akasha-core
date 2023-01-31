import React, { PropsWithChildren } from 'react';
import { tw, apply } from '@twind/core';

export type CardProps = {
  direction?: 'row' | 'column';
};

const baseStyles = apply`
  flex
  rounded-large
  bg-white
  dark:bg-grey2
`;

export const Card: React.FC<PropsWithChildren<CardProps>> = props => {
  const { direction } = props;
  const instanceStyles = apply`
    ${baseStyles}
    flex-${direction === 'row' ? 'row' : 'col'}
  `;

  return <div className={tw(instanceStyles)}>{props.children}</div>;
};

export default Card;
