import * as React from 'react';
import StyledIconLink from './styled-icon-link';

interface LinkIconButtonProps {
  onClick: React.EventHandler<React.SyntheticEvent>;
  iconPosition?: 'start' | 'end';
  icon: React.ReactElement;
  label: string | number;
}

const LinkIconButton = (props: LinkIconButtonProps) => {
  const { iconPosition = 'start', ...other } = props;
  const reversed = iconPosition && iconPosition === 'end';
  return <StyledIconLink reverse={reversed} {...other} />;
};

export default LinkIconButton;
