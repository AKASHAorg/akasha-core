import * as React from 'react';
import StyledIconLink from './styled-icon-link';

interface LinkIconButtonProps {
  onClick: (ev: React.SyntheticEvent) => void;
  iconPosition?: 'start' | 'end';
  icon: React.ReactElement;
  label: string;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
}

const LinkIconButton = (props: LinkIconButtonProps) => {
  const { iconPosition = 'start', ...other } = props;
  const reversed = iconPosition && iconPosition === 'end';
  return <StyledIconLink reverse={reversed} {...other} />;
};

export default LinkIconButton;
