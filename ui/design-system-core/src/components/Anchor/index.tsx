import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export type AnchorProps = {
  customStyle?: string;
  dataTestId?: string;
};

const Anchor: React.FC<
  PropsWithChildren<
    AnchorProps &
      React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
  >
> = props => {
  const { href, customStyle = '', target = '_blank', dataTestId, children, ...rest } = props;

  // if onClick is defined, use cursor pointer, unless otherwise
  const baseStyle =
    'inline-block cursor-pointer no-underline text-secondaryLight dark:text-secondaryDark';

  const className = apply`${baseStyle} ${customStyle}`;

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
