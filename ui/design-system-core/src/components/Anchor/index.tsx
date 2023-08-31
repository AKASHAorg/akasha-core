import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

import { FontWeight } from '../Text';
import { getWeightClasses } from '../Text/getWeightClasses';

export type AnchorProps = {
  weight?: FontWeight;
  customStyle?: string;
  dataTestId?: string;
};

const Anchor: React.FC<
  PropsWithChildren<
    AnchorProps &
      React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
  >
> = props => {
  const {
    href,
    weight,
    customStyle = '',
    target = '_blank',
    dataTestId,
    children,
    ...rest
  } = props;

  const weightStyle = weight ? getWeightClasses(weight) : '';

  const baseStyle =
    'inline-block cursor-pointer no-underline text(secondaryLight dark:secondaryDark)';

  const className = apply`${baseStyle} ${weightStyle} ${customStyle}`;

  return (
    <a
      href={href}
      className={tw(className)}
      target={target}
      rel="noreferrer noopener"
      data-testid={dataTestId}
      {...rest}
    >
      {children}
    </a>
  );
};

export default Anchor;
