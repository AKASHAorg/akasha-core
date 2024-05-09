import React from 'react';
import Anchor, { AnchorProps } from '../Anchor';

export type LinkProps = Omit<AnchorProps, 'href'> & {
  to: string;
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
};

/**
 * The Link component wraps the Anchor component
 * and is useful for internal navigation
 * @param to -: the url to be passed to the anchor element's href
 * @param onClick -: handles the internal navigation logic
 * @returns an anchor element, with its click handler properly defined.
 */
const Link: React.FC<LinkProps> = props => {
  const { to, onClick, ...rest } = props;

  const handleClick = (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // prevent the default behaviour of the anchor element.
    ev.preventDefault();
    onClick(ev);
  };

  return <Anchor href={to} onClick={handleClick} {...rest} />;
};

export default Link;
