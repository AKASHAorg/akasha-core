import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export interface IAnchorProps {
  customStyle?: string;
  dataTestId?: string;
}

const Anchor: React.FC<
  PropsWithChildren<
    IAnchorProps &
      React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
  >
> = props => {
  const { href, customStyle = '', target = '_blank', dataTestId, children } = props;

  // if onClick is defined, use cursor pointer, unless otherwise
  const baseStyle =
    'inline-block cursor-pointer no-underline text-secondary-light dark:text-secondary-dark';

  const className = apply`${baseStyle} ${customStyle}`;

  return (
    <a
      href={href}
      className={tw(className)}
      target={target}
      rel="noreferrer noopener"
      data-testid={dataTestId}
    >
      {children}
    </a>
  );
};

export default Anchor;
