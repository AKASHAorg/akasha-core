import * as React from 'react';
import StyledIconButton from './styled-icon-button';
interface IIconButtonProps {
  icon: React.ReactElement;
  label: string;
  onClick?: () => void;
  primary?: boolean;
}

const IconButton = (props: IIconButtonProps) => {
  return <StyledIconButton {...props} />;
};

export default IconButton;
