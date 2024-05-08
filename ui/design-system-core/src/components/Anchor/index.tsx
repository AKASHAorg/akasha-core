import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

import { FontWeight } from '../Text';
import { getWeightClasses } from '../Text/getWeightClasses';

export type AnchorProps = PropsWithChildren<
  React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
    weight?: FontWeight;
    customStyle?: string;
    dataTestId?: string;
  }
>;

const Anchor: React.FC<AnchorProps> = props => {
  const { href, weight, customStyle = '', target, dataTestId, children, ...rest } = props;

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
