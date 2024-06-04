import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

import { FontWeight } from '../Text';
import { getWeightClasses } from '../Text/getWeightClasses';

export type LinkProps = PropsWithChildren<
  Omit<
    React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    'href'
  > & {
    to?: string;
    weight?: FontWeight;
    customStyle?: string;
    dataTestId?: string;
  }
>;

/**
 * The Link component renders an anchor element to handle two use cases
 * - where the onClick function is specified, internal navigation within the app or other action specified by the handler
 * - where the onClick function isn't specified, navigation to external resource specified in its 'href'
 * @param to -: the url to be passed to the anchor element's href
 * @param onClick -: handles the internal navigation logic
 * @returns an anchor element, with its click handler properly defined.
 */
const Link: React.FC<LinkProps> = props => {
  const { to, weight, customStyle = '', target, dataTestId, children, onClick, ...rest } = props;

  const weightStyle = weight ? getWeightClasses(weight) : '';

  const baseStyle =
    'inline-block cursor-pointer no-underline text(secondaryLight dark:secondaryDark)';

  const className = apply`${baseStyle} ${weightStyle} ${customStyle}`;

  const handleClick = (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (typeof onClick === 'function') {
      // prevent the default behaviour of the anchor element
      ev.preventDefault();
      ev.stopPropagation();
      onClick(ev);
    }
  };

  return (
    <a
      href={to}
      className={tw(className)}
      target={target}
      rel="noreferrer noopener"
      data-testid={dataTestId}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
};

export default Link;
